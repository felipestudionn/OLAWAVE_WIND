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

const EXPLORE_PROMPT = (query: string) => `You are a fashion market analyst. The user wants to explore: "${query}"

TODAY'S DATE: November 2025

THE MOST RECENT FASHION WEEK SEASONS ARE:
- **Spring/Summer 2026 (SS26)** - Shown September-October 2025
- **Pre-Fall 2026 (PF26)** - Currently showing November 2025
- **Resort 2026** - Shown earlier in 2025

Research this trend based on:
- How it appeared on SS26 and PF26 runways
- Which designers featured it in their recent collections
- How celebrities are wearing it NOW
- Social media momentum (TikTok, Instagram)

Provide:

1. **KEY COLORS** (4-6 colors)
   - Colors associated with this trend on SS26/PF26 runways
   - Use professional Pantone TCX fashion names
   - Reference specific designers if relevant

2. **KEY TRENDS** (3-5 related trends)
   - Related aesthetics from recent runway shows
   - Which designers are championing this?
   - How is it being interpreted on social media?

3. **KEY ITEMS** (5-7 items)
   - Specific pieces seen on SS26/PF26 runways
   - What items are celebrities already wearing?
   - Be very specific with descriptions

4. **DESCRIPTION**
   - 2-3 sentences on how this trend appeared on recent runways
   - Which designers showed it? Who's wearing it?
   - Why is it relevant for the next 6 months?

Return ONLY valid JSON:
{
  "query": "${query}",
  "keyColors": ["Color 1", "Color 2", "Color 3", "Color 4"],
  "keyTrends": ["Trend 1", "Trend 2", "Trend 3"],
  "keyItems": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
  "description": "Description of the trend from recent runways..."
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
