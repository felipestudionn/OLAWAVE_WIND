import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  CONCEPT_GENERATION_PROMPT,
  buildConceptUserPrompt,
  buildPhotoToSketchPrompt,
} from '@/lib/prompts/sketch-generation';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const FAL_KEY = process.env.FAL_KEY;

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

// Helper: fetch image from URL and convert to data URI
async function fetchImageAsDataUri(url: string): Promise<string> {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const contentType = res.headers.get('content-type') || 'image/png';
  return `data:${contentType};base64,${base64}`;
}

// Step 2a: fal.ai lineart preprocessor — photo → clean line drawing (BEST quality)
async function extractLineartWithFal(
  photoBase64: string,
  photoMimeType: string
): Promise<string> {
  if (!FAL_KEY) throw new Error('FAL_KEY not configured');

  const response = await fetch('https://fal.run/fal-ai/image-preprocessors/lineart', {
    method: 'POST',
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: `data:${photoMimeType};base64,${photoBase64}`,
      coarse: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`fal.ai lineart error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (data.image?.url) {
    return fetchImageAsDataUri(data.image.url);
  }
  throw new Error('No image in fal.ai lineart response');
}

// Step 2b: FLUX Kontext via fal.ai direct — photo + prompt → sketch
async function generateSketchWithFluxKontext(
  prompt: string,
  photoBase64: string,
  photoMimeType: string
): Promise<string> {
  if (!FAL_KEY) throw new Error('FAL_KEY not configured');

  const response = await fetch('https://fal.run/fal-ai/flux-kontext/dev', {
    method: 'POST',
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_url: `data:${photoMimeType};base64,${photoBase64}`,
      guidance_scale: 8,
      num_inference_steps: 35,
      output_format: 'png',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FLUX Kontext error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (data.images?.[0]?.url) {
    return fetchImageAsDataUri(data.images[0].url);
  }
  throw new Error('No image in FLUX Kontext response');
}

// Main sketch generation: lineart extraction (front) → FLUX Kontext (back/variants)
async function generateSketch(
  prompt: string,
  photoBase64: string,
  photoMimeType: string,
  view: 'front' | 'back'
): Promise<string> {
  if (!FAL_KEY) throw new Error('FAL_KEY not configured');

  // For front view: try fal.ai lineart extraction first (best quality)
  if (view === 'front') {
    try {
      console.log('Trying fal.ai lineart extraction (front view)...');
      const result = await extractLineartWithFal(photoBase64, photoMimeType);
      console.log('fal.ai lineart extraction successful');
      return result;
    } catch (err) {
      console.error('fal.ai lineart extraction failed:', err);
    }
  }

  // FLUX Kontext generation (back views + fallback for front)
  console.log(`Trying FLUX Kontext (${view} view)...`);
  const result = await generateSketchWithFluxKontext(prompt, photoBase64, photoMimeType);
  console.log(`FLUX Kontext (${view} view) successful`);
  return result;
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
          generateSketch(frontPrompt, primaryPhoto.base64, primaryPhoto.mimeType, 'front'),
          generateSketch(backPrompt, primaryPhoto.base64, primaryPhoto.mimeType, 'back'),
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
