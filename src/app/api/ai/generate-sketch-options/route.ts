import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  CONCEPT_GENERATION_PROMPT,
  buildConceptUserPrompt,
  buildImagePrompt,
  buildSketchFromPhotoPrompt,
  buildVariantFromBasePrompt,
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

// Gemini image-to-image: sends the reference photo + prompt → gets a technical sketch back
async function generateImageWithGeminiFromPhoto(
  prompt: string,
  photoBase64: string,
  photoMimeType: string
): Promise<string> {
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
        parts: [
          { inlineData: { mimeType: photoMimeType, data: photoBase64 } },
          { text: prompt },
        ],
      }],
      generationConfig: {
        responseModalities: ['IMAGE'],
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini image-to-image error: ${response.status} - ${errorText}`);
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

// Flux text-only fallback (no reference photo input)
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

// Generate a single sketch image — Gemini image-to-image first, Flux text-only fallback
async function generateImage(
  photoPrompt: string,
  textPrompt: string,
  referencePhoto: { base64: string; mimeType: string }
): Promise<string> {
  // Primary: Gemini image-to-image (sends reference photo → gets sketch)
  try {
    console.log('Generating sketch with Gemini image-to-image...');
    const result = await generateImageWithGeminiFromPhoto(
      photoPrompt,
      referencePhoto.base64,
      referencePhoto.mimeType
    );
    console.log('Gemini image-to-image successful');
    return result;
  } catch (err) {
    console.error('Gemini image-to-image failed:', err);
  }

  // Fallback: Flux text-only
  try {
    console.log('Fallback: Flux text-only...');
    const result = await generateImageWithFlux(textPrompt);
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

    // The first image is always the PRIMARY reference
    const primaryPhoto = body.images[0];

    // Step 1: Generate design concepts with Claude
    console.log('Step 1: Generating design concepts with Claude...');
    const { concepts } = await generateConcepts(body);
    console.log(`Generated ${concepts.length} concepts`);

    // Step 2: Generate BASE sketch first (concept 1 = "Fiel al original") from the original photo
    const baseConcept = concepts[0];
    console.log('Step 2: Generating BASE sketch from reference photo...');
    const baseFrontPrompt = buildSketchFromPhotoPrompt('front', body.garmentType, baseConcept.description);
    const baseBackPrompt = buildSketchFromPhotoPrompt('back', body.garmentType, baseConcept.description);
    const baseFrontTextPrompt = buildImagePrompt(baseConcept.description, 'front', body.garmentType);
    const baseBackTextPrompt = buildImagePrompt(baseConcept.description, 'back', body.garmentType);

    const [baseFrontImage, baseBackImage] = await Promise.all([
      generateImage(baseFrontPrompt, baseFrontTextPrompt, {
        base64: primaryPhoto.base64,
        mimeType: primaryPhoto.mimeType,
      }),
      generateImage(baseBackPrompt, baseBackTextPrompt, {
        base64: primaryPhoto.base64,
        mimeType: primaryPhoto.mimeType,
      }),
    ]);

    // Extract base64 data from data URI for use as reference in variants
    const baseFrontB64 = baseFrontImage.split(',')[1];
    const baseBackB64 = baseBackImage.split(',')[1];
    const baseMime = baseFrontImage.split(';')[0].split(':')[1] || 'image/png';

    // Step 3: Generate variant sketches using the BASE SKETCH as reference (not the original photo)
    const variantConcepts = concepts.slice(1);
    console.log(`Step 3: Generating ${variantConcepts.length} variants from base sketch...`);
    const variantOptions = await Promise.all(
      variantConcepts.map(async (concept) => {
        const variantFrontPrompt = buildVariantFromBasePrompt('front', body.garmentType, concept.description);
        const variantBackPrompt = buildVariantFromBasePrompt('back', body.garmentType, concept.description);
        const textFrontFallback = buildImagePrompt(concept.description, 'front', body.garmentType);
        const textBackFallback = buildImagePrompt(concept.description, 'back', body.garmentType);

        const [frontImage, backImage] = await Promise.all([
          generateImage(variantFrontPrompt, textFrontFallback, {
            base64: baseFrontB64,
            mimeType: baseMime,
          }),
          generateImage(variantBackPrompt, textBackFallback, {
            base64: baseBackB64,
            mimeType: baseMime,
          }),
        ]);

        return {
          id: concept.id,
          description: `${concept.title}: ${concept.description}`,
          frontImageBase64: frontImage,
          backImageBase64: backImage,
        };
      })
    );

    const sketchOptions = [
      {
        id: baseConcept.id,
        description: `${baseConcept.title}: ${baseConcept.description}`,
        frontImageBase64: baseFrontImage,
        backImageBase64: baseBackImage,
      },
      ...variantOptions,
    ];

    return NextResponse.json({ sketchOptions });
  } catch (error) {
    console.error('Sketch options generation error:', error);
    const message = error instanceof Error ? error.message : 'Error inesperado';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
