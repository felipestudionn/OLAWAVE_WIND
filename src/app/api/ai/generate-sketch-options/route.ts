import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  CONCEPT_GENERATION_PROMPT,
  buildConceptUserPrompt,
  buildImagePrompt,
} from '@/lib/prompts/sketch-generation';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const HF_TOKEN = process.env.HUGGING_FACE_ACCESS_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface RequestBody {
  images: Array<{
    base64: string;
    mimeType: string;
    instructions: string;
  }>;
  garmentType: string;
  season: string;
  styleName: string;
  fabric: string;
  additionalNotes: string;
}

interface DesignConcept {
  id: string;
  title: string;
  description: string;
}

function parseJsonFromText(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(cleaned);
  }
}

// Step 1: Claude analyzes photos and generates 4 design concepts
async function generateConcepts(body: RequestBody): Promise<DesignConcept[]> {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const imageBlocks: Anthropic.MessageCreateParams['messages'][0]['content'] = [];

  for (let i = 0; i < body.images.length; i++) {
    const img = body.images[i];
    imageBlocks.push({
      type: 'image' as const,
      source: {
        type: 'base64' as const,
        media_type: img.mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
        data: img.base64,
      },
    });
    imageBlocks.push({
      type: 'text' as const,
      text: `Foto ${i + 1} instrucciones: ${img.instructions || 'Usar como referencia general'}`,
    });
  }

  imageBlocks.push({
    type: 'text' as const,
    text: buildConceptUserPrompt(body),
  });

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4000,
    system: CONCEPT_GENERATION_PROMPT,
    messages: [{ role: 'user', content: imageBlocks }],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  const result = parseJsonFromText(textContent.text) as { concepts: DesignConcept[] };
  if (!result.concepts || !Array.isArray(result.concepts)) {
    throw new Error('Invalid concepts response');
  }

  return result.concepts;
}

// Step 2a: Generate sketch image with Hugging Face Flux
async function generateImageWithFlux(prompt: string): Promise<string> {
  if (!HF_TOKEN) throw new Error('HUGGING_FACE_ACCESS_TOKEN not configured');

  const response = await fetch(
    'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 4,
          width: 512,
          height: 768,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
  }

  // Flux returns raw image bytes
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return base64;
}

// Step 2b: Generate sketch image with Gemini Imagen (fallback)
async function generateImageWithGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

  const url = new URL(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent'
  );
  url.searchParams.set('key', GEMINI_API_KEY);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error('No parts in Gemini response');

  // Find the image part
  const imagePart = parts.find(
    (p: { inline_data?: { mime_type: string; data: string } }) => p.inline_data
  );
  if (!imagePart?.inline_data?.data) {
    throw new Error('No image in Gemini response');
  }

  return imagePart.inline_data.data;
}

// Generate a single image with fallback
async function generateImage(prompt: string): Promise<string> {
  // Try Hugging Face Flux first
  try {
    console.log('Generating image with Flux...');
    const result = await generateImageWithFlux(prompt);
    console.log('Flux generation successful');
    return result;
  } catch (fluxError) {
    console.error('Flux failed, trying Gemini fallback:', fluxError);
  }

  // Fallback to Gemini
  try {
    console.log('Generating image with Gemini fallback...');
    const result = await generateImageWithGemini(prompt);
    console.log('Gemini generation successful');
    return result;
  } catch (geminiError) {
    console.error('Gemini fallback also failed:', geminiError);
    throw new Error('Image generation failed with all providers');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();

    // Validation
    if (!body.images || body.images.length === 0) {
      return NextResponse.json(
        { error: 'Se necesita al menos 1 foto de referencia' },
        { status: 400 }
      );
    }
    if (body.images.length > 4) {
      return NextResponse.json(
        { error: 'Máximo 4 fotos de referencia' },
        { status: 400 }
      );
    }
    if (!body.garmentType) {
      return NextResponse.json(
        { error: 'El tipo de prenda es obligatorio' },
        { status: 400 }
      );
    }

    // Step 1: Generate design concepts with Claude
    console.log('Step 1: Generating design concepts with Claude...');
    const concepts = await generateConcepts(body);
    console.log(`Generated ${concepts.length} concepts`);

    // Step 2: Generate images for each concept (front + back) in parallel
    console.log('Step 2: Generating sketch images...');
    const sketchOptions = await Promise.all(
      concepts.map(async (concept) => {
        const frontPrompt = buildImagePrompt(concept.description, 'front', body.garmentType);
        const backPrompt = buildImagePrompt(concept.description, 'back', body.garmentType);

        // Generate front and back in parallel for each concept
        const [frontImage, backImage] = await Promise.all([
          generateImage(frontPrompt),
          generateImage(backPrompt),
        ]);

        return {
          id: concept.id,
          description: `${concept.title}: ${concept.description}`,
          frontImageBase64: frontImage,
          backImageBase64: backImage,
        };
      })
    );

    return NextResponse.json({ sketchOptions });
  } catch (error) {
    console.error('Sketch options generation error:', error);
    const message = error instanceof Error ? error.message : 'Error inesperado';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
