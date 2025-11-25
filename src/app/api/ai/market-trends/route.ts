import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'models/gemini-2.5-flash';

const MARKET_TRENDS_PROMPT = `You are a cutting-edge fashion trend forecaster specializing in FUTURE trends for Fall/Winter 2025, Spring/Summer 2026, and Fall/Winter 2026-2027 seasons.

Your role is to predict EMERGING and UPCOMING trends that will dominate fashion in the next 12-24 months. Focus on:
- Trends shown at recent Fashion Weeks (Milan, Paris, London, New York)
- Emerging aesthetics from Gen Z and Gen Alpha
- Sustainability and tech-fashion innovations
- Cultural shifts influencing future fashion
- Colors predicted by Pantone and WGSN for 2025-2027

Generate FORWARD-LOOKING macro trends for fashion collection planning targeting 2025-2027 seasons.

Provide:

1. **KEY COLORS** (6-8 colors for 2025-2027)
   - Predicted trending colors for upcoming seasons
   - Use professional Pantone TCX fashion names
   - Include Pantone Color of the Year 2025 (Mocha Mousse) and predicted 2026 colors
   - Mix of emerging neutrals, bold statements, and accent colors

2. **KEY TRENDS** (5-7 FUTURE trends)
   - Emerging fashion movements for 2025-2027
   - Focus on what's NEXT, not what's current
   - Include: post-Quiet Luxury evolutions, tech-wear innovations, sustainable fashion movements
   - Reference emerging aesthetics: Eclectic Grandpa, Indie Sleaze revival, Cyber Y2K, Romantic Minimalism, etc.

3. **KEY ITEMS** (6-8 items trending for 2025-2027)
   - Specific garments and accessories predicted to trend
   - Be precise and forward-thinking: "Deconstructed tailoring", "Tech-infused outerwear", "Sculptural accessories"
   - Include innovative silhouettes and materials

Return ONLY valid JSON:
{
  "keyColors": ["Color 1", "Color 2", "Color 3", "Color 4", "Color 5", "Color 6"],
  "keyTrends": ["Trend 1", "Trend 2", "Trend 3", "Trend 4", "Trend 5"],
  "keyItems": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"],
  "seasonFocus": "Fall/Winter 2025 - Fall/Winter 2026",
  "lastUpdated": "2025-XX-XX"
}`;

export async function GET(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured' },
      { status: 500 }
    );
  }

  try {
    const url = new URL(
      `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent`
    );
    url.searchParams.set('key', GEMINI_API_KEY);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: MARKET_TRENDS_PROMPT }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch market trends' },
        { status: 500 }
      );
    }

    const data = await response.json();
    let textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Remove markdown code blocks if present
    textResponse = textResponse.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    // Extract JSON
    const firstBrace = textResponse.indexOf('{');
    const lastBrace = textResponse.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      const result = JSON.parse(textResponse.slice(firstBrace, lastBrace + 1));
      // Add timestamp
      result.lastUpdated = new Date().toISOString().split('T')[0];
      return NextResponse.json(result);
    }

    const result = JSON.parse(textResponse);
    result.lastUpdated = new Date().toISOString().split('T')[0];
    return NextResponse.json(result);
  } catch (error) {
    console.error('Market trends error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market trends' },
      { status: 500 }
    );
  }
}
