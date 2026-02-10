import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  CONCEPT_GENERATION_PROMPT,
  buildConceptUserPrompt,
  buildDetailedSketchPrompt,
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
async function generateConcepts(body: RequestBody): Promise<{ baseDescription: string; concepts: DesignConcept[] }> {
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
    const label = i === 0 ? 'FOTO PRINCIPAL' : `Foto secundaria ${i + 1}`;
    imageBlocks.push({
      type: 'text' as const,
      text: `${label} instrucciones: ${img.instructions || (i === 0 ? 'Copiar fielmente esta prenda' : 'Usar como referencia de detalles')}`,
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

  const result = parseJsonFromText(textContent.text) as { baseDescription?: string; concepts: DesignConcept[] };
  if (!result.concepts || !Array.isArray(result.concepts)) {
    throw new Error('Invalid concepts response');
  }

  return {
    baseDescription: result.baseDescription || result.concepts[0]?.description || '',
    concepts: result.concepts,
  };
}

// Gemini text-only: Claude's detailed description → Gemini generates flat sketch image
async function generateImageWithGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

  const url = new URL(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent'
  );
  url.searchParams.set('key', GEMINI_API_KEY);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }],
      }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini text-to-image error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error('No parts in Gemini response');

  const imagePart = parts.find(
    (p: { inline_data?: { mime_type: string; data: string } }) => p.inline_data
  );
  if (!imagePart?.inline_data?.data) {
    throw new Error('No image in Gemini response');
  }

  const mimeType = imagePart.inline_data.mime_type || 'image/png';
  return `data:${mimeType};base64,${imagePart.inline_data.data}`;
}

// Flux text-only fallback
async function generateImageWithFlux(prompt: string): Promise<string> {
  if (!HF_TOKEN) throw new Error('HUGGING_FACE_ACCESS_TOKEN not configured');

  const response = await fetch(
    'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
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

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return `data:${contentType};base64,${base64}`;
}

// Generate a single sketch image — Gemini text-only first, Flux fallback
async function generateSketchImage(prompt: string): Promise<string> {
  // Primary: Gemini text-only (Claude's description → flat sketch)
  try {
    console.log('Generating sketch with Gemini text-only...');
    const result = await generateImageWithGemini(prompt);
    console.log('Gemini text-only successful');
    return result;
  } catch (err) {
    console.error('Gemini text-only failed:', err);
  }

  // Fallback: Flux text-only
  try {
    console.log('Fallback: Flux text-only...');
    const result = await generateImageWithFlux(prompt);
    console.log('Flux text-only successful');
    return result;
  } catch (err) {
    console.error('Flux text-only also failed:', err);
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

    // Step 1: Claude analyzes photos and generates detailed descriptions + 4 concepts
    console.log('Step 1: Generating design concepts with Claude (photo analysis)...');
    const { baseDescription, concepts } = await generateConcepts(body);
    console.log(`Generated ${concepts.length} concepts. Base description length: ${baseDescription.length}`);

    // Step 2: Generate all sketches using text-only prompts (Claude's description → Gemini)
    // Claude already analyzed the photo perfectly — we use its description, not the photo itself
    console.log('Step 2: Generating all sketches from Claude descriptions (text-only)...');
    const sketchOptions = await Promise.all(
      concepts.map(async (concept) => {
        const frontPrompt = buildDetailedSketchPrompt(baseDescription, concept.description, 'front', body.garmentType);
        const backPrompt = buildDetailedSketchPrompt(baseDescription, concept.description, 'back', body.garmentType);

        const [frontImage, backImage] = await Promise.all([
          generateSketchImage(frontPrompt),
          generateSketchImage(backPrompt),
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
