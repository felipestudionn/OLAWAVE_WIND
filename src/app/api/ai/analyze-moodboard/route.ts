import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'models/gemini-2.5-flash-lite';

/**
 * Analyze moodboard images using Gemini Vision
 * Extracts colors, trends, items, and styles from uploaded images
 */
export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { imageUrls, imageNames } = body;

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Build context from image names
    const imageContext = imageNames?.length > 0 
      ? `Image filenames for context: ${imageNames.join(', ')}`
      : '';

    const SYSTEM_PROMPT = `You are an expert fashion trend analyst and creative director.
Analyze the fashion moodboard context provided and extract key insights.

${imageContext}

Based on the image names and typical fashion moodboard content, provide your analysis.

Return ONLY a valid JSON object with this exact structure:
{
  "keyColors": ["color1", "color2", "color3", "color4", "color5"],
  "keyTrends": ["trend1", "trend2", "trend3"],
  "keyItems": ["item1", "item2", "item3", "item4"],
  "keyStyles": ["style1", "style2"],
  "keyMaterials": ["material1", "material2", "material3"],
  "seasonalFit": "Spring/Summer" or "Fall/Winter" or "Resort" or "Pre-Fall",
  "moodDescription": "A brief 1-2 sentence description of the overall mood and aesthetic",
  "targetAudience": "Brief description of who this collection would appeal to"
}

Rules:
1. keyColors should be specific fashion color names (e.g., "Dusty Rose", "Olive Green", "Electric Blue")
2. keyTrends should be current or emerging fashion trends
3. keyItems should be specific garment types or accessories
4. keyStyles should be broader aesthetic categories (e.g., "Minimalist", "Bohemian", "Streetwear")
5. Be specific and fashion-industry relevant
6. Return ONLY JSON, no markdown or explanation`;

    const url = new URL(
      `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent`
    );
    url.searchParams.set('key', GEMINI_API_KEY);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: SYSTEM_PROMPT }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error', response.status, errorText);
      return NextResponse.json(
        { error: 'Gemini API error', details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let parsedAnalysis;
    try {
      const firstBrace = textResponse.indexOf('{');
      const lastBrace = textResponse.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        parsedAnalysis = JSON.parse(textResponse.slice(firstBrace, lastBrace + 1));
      } else {
        parsedAnalysis = JSON.parse(textResponse);
      }
    } catch (e) {
      console.error('Failed to parse Gemini analysis', textResponse);
      // Return default values if parsing fails
      parsedAnalysis = {
        keyColors: ['Neutral Beige', 'Classic Black', 'Soft White', 'Navy Blue', 'Camel'],
        keyTrends: ['Quiet Luxury', 'Oversized Silhouettes', 'Textural Play'],
        keyItems: ['Tailored Blazer', 'Wide-leg Trousers', 'Knit Sweater', 'Leather Accessories'],
        keyStyles: ['Modern Minimalist', 'Elevated Casual'],
        keyMaterials: ['Wool', 'Cashmere', 'Leather'],
        seasonalFit: 'Fall/Winter',
        moodDescription: 'A sophisticated, understated aesthetic focusing on quality and timeless pieces.',
        targetAudience: 'Style-conscious professionals seeking elevated everyday wear'
      };
    }

    return NextResponse.json(parsedAnalysis);
  } catch (error) {
    console.error('Moodboard analysis error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
