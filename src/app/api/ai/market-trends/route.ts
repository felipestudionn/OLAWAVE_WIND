import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'models/gemini-2.5-flash';

const MARKET_TRENDS_PROMPT = `You are a fashion trend analyst with access to current market data from social media, fashion weeks, and retail trends.

Generate current market trends for fashion collection planning (2024-2025 season).

Provide:

1. **KEY COLORS** (6-8 trending colors)
   - Colors currently trending in fashion
   - Use professional fashion/Pantone-style names
   - Mix of neutrals and accent colors

2. **KEY TRENDS** (5-7 current trends)
   - Major fashion movements right now
   - Include both mainstream and emerging trends
   - Reference specific aesthetics: Quiet Luxury, Mob Wife, Coquette, Gorpcore, etc.

3. **KEY ITEMS** (6-8 trending items)
   - Specific garments and accessories trending now
   - Be precise: "Barrel leg jeans", "Ballet flats", "Oversized blazers"

Return ONLY valid JSON:
{
  "keyColors": ["Color 1", "Color 2", "Color 3", "Color 4", "Color 5", "Color 6"],
  "keyTrends": ["Trend 1", "Trend 2", "Trend 3", "Trend 4", "Trend 5"],
  "keyItems": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"],
  "lastUpdated": "2024-XX-XX"
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
