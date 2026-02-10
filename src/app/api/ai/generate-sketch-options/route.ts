import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import sharp from 'sharp';
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

// ─── Step 1: Claude analyzes photos → garment description ────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Fetch image from URL and convert to data URI
async function fetchImageAsDataUri(url: string): Promise<string> {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const contentType = res.headers.get('content-type') || 'image/png';
  return `data:${contentType};base64,${base64}`;
}

// Extract raw base64 + mimeType from a data URI
function parseDataUri(dataUri: string): { base64: string; mimeType: string } {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid data URI');
  return { mimeType: match[1], base64: match[2] };
}

// ─── Step 2a: BiRefNet — remove background ───────────────────────────────────

async function removeBackground(photoBase64: string, photoMimeType: string): Promise<string> {
  if (!FAL_KEY) throw new Error('FAL_KEY not configured');

  console.log('Step 2a: Removing background with BiRefNet...');
  const response = await fetch('https://fal.run/fal-ai/birefnet/v2', {
    method: 'POST',
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: `data:${photoMimeType};base64,${photoBase64}`,
      model: 'General Use (Heavy)',
      operating_resolution: '2048x2048',
      output_format: 'png',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`BiRefNet error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (data.image?.url) {
    console.log('Background removal successful');
    return fetchImageAsDataUri(data.image.url);
  }
  throw new Error('No image in BiRefNet response');
}

// ─── Step 2b: Lineart extraction ─────────────────────────────────────────────

async function extractLineart(imageDataUri: string): Promise<string> {
  if (!FAL_KEY) throw new Error('FAL_KEY not configured');

  const { base64, mimeType } = parseDataUri(imageDataUri);

  console.log('Step 2b: Extracting lineart...');
  const response = await fetch('https://fal.run/fal-ai/image-preprocessors/lineart', {
    method: 'POST',
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: `data:${mimeType};base64,${base64}`,
      coarse: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lineart error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (data.image?.url) {
    console.log('Lineart extraction successful');
    return fetchImageAsDataUri(data.image.url);
  }
  throw new Error('No image in lineart response');
}

// ─── Step 2c: Invert image colors with sharp ────────────────────────────────

async function invertImage(imageDataUri: string): Promise<string> {
  const { base64 } = parseDataUri(imageDataUri);
  const inputBuffer = Buffer.from(base64, 'base64');

  console.log('Step 2c: Inverting lineart colors...');
  const outputBuffer = await sharp(inputBuffer)
    .negate()
    .grayscale()
    .png()
    .toBuffer();

  const outputBase64 = outputBuffer.toString('base64');
  return `data:image/png;base64,${outputBase64}`;
}

// ─── Step 2d: FLUX ControlNet — lineart-guided fashion flat generation ───────

async function generateFlatWithControlNet(
  lineartDataUri: string,
  garmentType: string,
  claudeDescription: string
): Promise<string> {
  if (!FAL_KEY) throw new Error('FAL_KEY not configured');

  console.log('Step 2d: Generating fashion flat with FLUX ControlNet...');
  const response = await fetch('https://fal.run/fal-ai/flux-general', {
    method: 'POST',
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Professional fashion flat technical drawing of a ${garmentType}. Clean black line art on pure white background. Flat lay front view, perfectly symmetrical. No body, no mannequin, no shading, no color, no gray tones. Sharp precise vector-like lines like Adobe Illustrator. ${claudeDescription}`,
      controlnets: [{
        path: 'promeai/FLUX.1-controlnet-lineart-promeai',
        control_image_url: lineartDataUri,
        conditioning_scale: 0.8,
      }],
      num_inference_steps: 28,
      guidance_scale: 3.5,
      output_format: 'png',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FLUX ControlNet error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (data.images?.[0]?.url) {
    console.log('FLUX ControlNet generation successful');
    return fetchImageAsDataUri(data.images[0].url);
  }
  throw new Error('No image in FLUX ControlNet response');
}

// ─── Fallback: FLUX Kontext directly from photo ─────────────────────────────

async function generateSketchDirectWithFlux(
  prompt: string,
  photoBase64: string,
  photoMimeType: string
): Promise<string> {
  if (!FAL_KEY) throw new Error('FAL_KEY not configured');

  console.log('Fallback: Direct FLUX Kontext from photo...');
  const response = await fetch('https://fal.run/fal-ai/flux-kontext/dev', {
    method: 'POST',
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_url: `data:${photoMimeType};base64,${photoBase64}`,
      guidance_scale: 7,
      num_inference_steps: 50,
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

// ─── Main pipeline: bg removal → lineart → invert → ControlNet ─────────────

async function generateSketch(
  fallbackPrompt: string,
  photoBase64: string,
  photoMimeType: string,
  garmentType: string,
  claudeDescription: string
): Promise<string> {
  if (!FAL_KEY) throw new Error('FAL_KEY not configured');

  try {
    // Step 1: Remove background
    const cleanPhoto = await removeBackground(photoBase64, photoMimeType);

    // Step 2: Extract lineart from clean photo
    const lineart = await extractLineart(cleanPhoto);

    // Step 3: Invert colors (white-on-dark → black-on-white)
    const invertedLineart = await invertImage(lineart);

    // Step 4: Generate fashion flat guided by lineart structure
    return await generateFlatWithControlNet(invertedLineart, garmentType, claudeDescription);
  } catch (err) {
    console.error('Pipeline failed, falling back to direct FLUX Kontext:', err);
    return await generateSketchDirectWithFlux(fallbackPrompt, photoBase64, photoMimeType);
  }
}

// ─── API Route ───────────────────────────────────────────────────────────────

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

    // Step 1: Claude analyzes photos → garment description
    console.log('Step 1: Claude analyzing photos...');
    const { concepts } = await generateConcepts(body);
    console.log(`Generated ${concepts.length} concepts`);

    // Step 2: Pipeline — bg removal → lineart → invert → ControlNet flat
    console.log('Step 2: Generating sketches (BiRefNet → Lineart → Invert → ControlNet)...');
    const sketchOptions = await Promise.all(
      concepts.map(async (concept) => {
        const fallbackPrompt = buildPhotoToSketchPrompt(body.garmentType, concept.description);
        const frontImage = await generateSketch(
          fallbackPrompt,
          primaryPhoto.base64,
          primaryPhoto.mimeType,
          body.garmentType,
          concept.description
        );

        return {
          id: concept.id,
          description: `${concept.title}: ${concept.description}`,
          frontImageBase64: frontImage,
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
