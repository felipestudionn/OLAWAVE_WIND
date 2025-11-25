import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'models/gemini-2.5-flash-lite';

/**
 * Generate AI market demand prediction based on commercial plan
 * Returns a predicted sales curve based on market trends and seasonality
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
    const { 
      collectionPlanId,
      drops, 
      commercialActions, 
      skus,
      totalSalesTarget,
      season,
      productCategory,
      location
    } = body;

    // Calculate the date range from drops
    const allDates = drops.map((d: any) => new Date(d.launch_date));
    const startDate = new Date(Math.min(...allDates.map((d: Date) => d.getTime())));
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6); // 6 month projection

    // Generate week labels
    const weeks: string[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const weekNum = getWeekNumber(currentDate);
      weeks.push(`${year}-W${weekNum.toString().padStart(2, '0')}`);
      currentDate.setDate(currentDate.getDate() + 7);
    }

    const SYSTEM_PROMPT = `You are a retail market analyst expert. Analyze this commercial plan and predict weekly sales based on market demand patterns.

COMMERCIAL PLAN:
- Season: ${season || 'AW'}
- Category: ${productCategory || 'Fashion'}
- Location: ${location || 'Europe'}
- Total Sales Target: €${totalSalesTarget}

DROPS SCHEDULE:
${drops.map((d: any) => `- ${d.name}: ${d.launch_date} (${d.weeks_active || 8} weeks active)`).join('\n')}

COMMERCIAL ACTIONS:
${commercialActions.map((a: any) => `- ${a.name} (${a.action_type}): ${a.start_date}${a.end_date ? ' to ' + a.end_date : ''} - Category: ${a.category || 'General'}`).join('\n')}

SKUs BY DROP:
${drops.map((d: any) => {
  const dropSkus = skus.filter((s: any) => s.drop_id === d.id || s.drop_number === d.drop_number);
  const dropSales = dropSkus.reduce((sum: number, s: any) => sum + (s.expected_sales || 0), 0);
  return `- ${d.name}: ${dropSkus.length} SKUs, €${Math.round(dropSales)} expected sales`;
}).join('\n')}

WEEKS TO PREDICT: ${weeks.join(', ')}

Based on:
1. Retail seasonality patterns (Black Friday, Christmas, January Sales, etc.)
2. Fashion industry demand cycles
3. The commercial actions planned
4. Drop timing and product mix

Generate a realistic weekly sales prediction curve. The curve should reflect:
- Higher demand during key retail moments (Black Friday, Christmas)
- Lower demand in typically slow periods
- Impact of commercial actions on sales
- Natural product lifecycle decay

Return ONLY a valid JSON object:
{
  "weeklyPredictions": [
    { "week": "2024-W35", "predictedSales": 25000, "demandIndex": 0.7, "notes": "Season start, moderate demand" }
  ],
  "insights": "Overall analysis of the commercial plan",
  "gaps": ["List of potential issues or gaps detected"],
  "recommendations": ["List of recommendations to optimize the plan"]
}

IMPORTANT:
- demandIndex is 0-1 scale (1 = peak demand)
- predictedSales should be realistic weekly figures that roughly sum to the total target over the period
- Identify gaps where planned sales don't align with market demand
- Be specific in recommendations`;

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

    let prediction;
    try {
      const firstBrace = textResponse.indexOf('{');
      const lastBrace = textResponse.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        prediction = JSON.parse(textResponse.slice(firstBrace, lastBrace + 1));
      } else {
        prediction = JSON.parse(textResponse);
      }
    } catch (e) {
      console.error('Failed to parse prediction', textResponse);
      return NextResponse.json(
        { error: 'Failed to parse AI prediction', raw: textResponse },
        { status: 500 }
      );
    }

    // Save prediction to database
    if (collectionPlanId) {
      await supabaseAdmin
        .from('market_predictions')
        .insert({
          collection_plan_id: collectionPlanId,
          weekly_predictions: prediction.weeklyPredictions || [],
          insights: prediction.insights,
          gaps_detected: prediction.gaps || [],
          recommendations: prediction.recommendations || [],
        });
    }

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Market prediction error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get ISO week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
