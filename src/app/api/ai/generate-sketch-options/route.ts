import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  CONCEPT_GENERATION_PROMPT,
  buildConceptUserPrompt,
  buildPhotoToSketchPrompt,
} from '@/lib/prompts/sketch-generation';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const HF_TOKEN = process.env.HUGGING_FACE_ACCESS_TOKEN;

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

// Step 2: HuggingFace image-to-image — photo + prompt → line drawing sketch
async function generateSketchWithHF(
  prompt: string,
  photoBase64: string,
  photoMimeType: string,
  model: string,
  provider: string
): Promise<string> {
  if (!HF_TOKEN) throw new Error('HUGGING_FACE_ACCESS_TOKEN not configured');

  // Convert base64 to binary buffer for the multipart request
  const imageBuffer = Buffer.from(photoBase64, 'base64');

  const response = await fetch(
    `https://router.huggingface.co/${provider}/models/${model}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `data:${photoMimeType};base64,${photoBase64}`,
        parameters: {
          prompt,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HF ${model} error: ${response.status} - ${errorText}`);
  }

  const contentType = response.headers.get('content-type') || 'image/png';

  // If response is JSON (some providers return base64 in JSON)
  if (contentType.includes('application/json')) {
    const data = await response.json();
    if (data.image) return `data:image/png;base64,${data.image}`;
    if (data[0]?.image) return `data:image/png;base64,${data[0].image}`;
    throw new Error(`Unexpected JSON response from ${model}`);
  }

  // Response is raw image bytes
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return `data:${contentType};base64,${base64}`;
}

// Try multiple providers: FLUX Kontext → Qwen Image Edit → HunyuanImage
async function generateSketch(
  prompt: string,
  photoBase64: string,
  photoMimeType: string
): Promise<string> {
  const providers = [
    { model: 'black-forest-labs/FLUX.1-Kontext-dev', provider: 'fal-ai' },
    { model: 'Qwen/Qwen-Image-Edit-2511', provider: 'fal-ai' },
    { model: 'tencent/HunyuanImage-3.0-Instruct', provider: 'fal-ai' },
  ];

  for (const { model, provider } of providers) {
    try {
      console.log(`Trying ${model}...`);
      const result = await generateSketchWithHF(prompt, photoBase64, photoMimeType, model, provider);
      console.log(`${model} successful`);
      return result;
    } catch (err) {
      console.error(`${model} failed:`, err);
    }
  }

  throw new Error('All image generation providers failed');
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

    const primaryPhoto = body.images[0];

    // Step 1: Claude analyzes photos → detailed descriptions + 4 concepts
    console.log('Step 1: Claude analyzing photos...');
    const { concepts } = await generateConcepts(body);
    console.log(`Generated ${concepts.length} concepts`);

    // Step 2: HuggingFace image-to-image for each concept
    console.log('Step 2: Generating sketches with HuggingFace image-to-image...');
    const sketchOptions = await Promise.all(
      concepts.map(async (concept) => {
        const frontPrompt = buildPhotoToSketchPrompt('front', body.garmentType, concept.description);
        const backPrompt = buildPhotoToSketchPrompt('back', body.garmentType, concept.description);

        const [frontImage, backImage] = await Promise.all([
          generateSketch(frontPrompt, primaryPhoto.base64, primaryPhoto.mimeType),
          generateSketch(backPrompt, primaryPhoto.base64, primaryPhoto.mimeType),
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
