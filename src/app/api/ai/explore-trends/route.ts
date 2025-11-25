import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'models/gemini-2.5-flash';

interface TrendExplorationResult {
  query: string;
  keyColors: string[];
  keyTrends: string[];
  keyItems: string[];
  description: string;
}

const EXPLORE_PROMPT = (query: string) => `You are a fashion trend analyst. The user wants to explore the trend: "${query}"

Research this trend and provide:

1. **KEY COLORS** (4-6 colors)
   - Colors associated with this trend
   - Use professional fashion/Pantone-style names

2. **KEY TRENDS** (3-5 related trends)
   - Related fashion movements and aesthetics
   - Current 2024-2025 interpretations

3. **KEY ITEMS** (5-7 items)
   - Specific garments and accessories typical of this trend
   - Be precise with descriptions

4. **DESCRIPTION**
   - 2-3 sentences explaining this trend, its origins, and current relevance

Return ONLY valid JSON:
{
  "query": "${query}",
  "keyColors": ["Color 1", "Color 2", "Color 3", "Color 4"],
  "keyTrends": ["Trend 1", "Trend 2", "Trend 3"],
  "keyItems": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
  "description": "Description of the trend..."
}`;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured' },
      { status: 500 }
    );
  }

  try {
    const { query } = await req.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const url = new URL(
      `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent`
    );
    url.searchParams.set('key', GEMINI_API_KEY);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: EXPLORE_PROMPT(query) }] }],
        generationConfig: {
          temperature: 0.7,
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
        { error: 'Failed to explore trend' },
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
      return NextResponse.json(result);
    }

    return NextResponse.json(JSON.parse(textResponse));
  } catch (error) {
    console.error('Explore trends error:', error);
    return NextResponse.json(
      { error: 'Failed to explore trend' },
      { status: 500 }
    );
  }
}
