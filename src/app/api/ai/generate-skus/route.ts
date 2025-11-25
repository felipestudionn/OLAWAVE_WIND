import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'models/gemini-2.5-flash-lite';

/**
 * Generate suggested SKUs based on the collection framework from AI Advisor
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
    const { setupData, count = 10 } = body;

    if (!setupData) {
      return NextResponse.json(
        { error: 'setupData is required' },
        { status: 400 }
      );
    }

    const SYSTEM_PROMPT = `You are an expert Fashion Merchandiser creating a SKU list for a fashion collection.

Collection Framework:
- Expected SKUs: ${setupData.expectedSkus}
- Product Families: ${JSON.stringify(setupData.productFamilies)}
- Price Range: €${setupData.minPrice} - €${setupData.maxPrice}
- Average Price Target: €${setupData.avgPriceTarget}
- Target Margin: ${setupData.targetMargin}%
- Product Type Mix: ${JSON.stringify(setupData.productTypeSegments)}
- Price Segments: ${JSON.stringify(setupData.priceSegments)}
- Drops: ${setupData.dropsCount}

Generate ${count} SKU suggestions that follow this framework. Each SKU should respect:
1. The product family distribution percentages
2. The price segment distribution
3. The product type mix (REVENUE, IMAGEN, ENTRY)
4. Realistic cost/price ratios for the target margin

Return ONLY a valid JSON array with this exact structure for each SKU:
[
  {
    "name": "Product Name",
    "family": "Family from productFamilies",
    "type": "REVENUE" | "IMAGEN" | "ENTRY",
    "pvp": number (retail price),
    "cost": number (cost price),
    "suggestedUnits": number (suggested buy units),
    "drop": number (1 to ${setupData.dropsCount})
  }
]

Rules:
1. Names should be specific fashion product names (e.g., "Oversized Wool Blazer", "High-Rise Wide Leg Jeans")
2. Distribute SKUs across families according to their percentages
3. Ensure margin = (pvp - cost) / pvp is close to ${setupData.targetMargin}%
4. REVENUE items should have moderate prices and higher units
5. IMAGEN items should have higher prices and lower units
6. ENTRY items should have lower prices and moderate units
7. Return ONLY JSON array, no markdown or explanation`;

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

    let parsedSkus;
    try {
      const firstBracket = textResponse.indexOf('[');
      const lastBracket = textResponse.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
        parsedSkus = JSON.parse(textResponse.slice(firstBracket, lastBracket + 1));
      } else {
        parsedSkus = JSON.parse(textResponse);
      }
    } catch (e) {
      console.error('Failed to parse Gemini SKUs', textResponse);
      return NextResponse.json(
        { error: 'Failed to parse generated SKUs', raw: textResponse },
        { status: 500 }
      );
    }

    return NextResponse.json({ skus: parsedSkus });
  } catch (error) {
    console.error('SKU generation error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
