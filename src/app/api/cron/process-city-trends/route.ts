import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Get week string
function getWeekString(date: Date): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

// Auth check
function verifyCronAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  return !process.env.CRON_SECRET || (!!authHeader && authHeader === expected);
}

interface TrendExtraction {
  items: Array<{ name: string; mentions: number }>;
  styles: Array<{ name: string; mentions: number }>;
  colors: Array<{ name: string; mentions: number }>;
  brands: Array<{ name: string; mentions: number }>;
}

// Use Gemini to extract trends from captions
async function extractTrendsWithAI(captions: string[], city: string): Promise<TrendExtraction> {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
  
  const prompt = `Analyze these Instagram captions from ${city} street style posts and extract fashion trends.

CAPTIONS:
${captions.slice(0, 100).join('\n---\n')}

Extract and count mentions of:
1. ITEMS: Specific clothing items (e.g., "barrel jeans", "oversized blazer", "balaclava")
2. STYLES: Fashion aesthetics (e.g., "gorpcore", "quiet luxury", "y2k")
3. COLORS: Color trends mentioned (e.g., "burgundy", "olive green", "cream")
4. BRANDS: Fashion brands mentioned (e.g., "Arc'teryx", "Salomon", "Carhartt")

Return ONLY valid JSON in this exact format:
{
  "items": [{"name": "item name", "mentions": 5}],
  "styles": [{"name": "style name", "mentions": 3}],
  "colors": [{"name": "color name", "mentions": 2}],
  "brands": [{"name": "brand name", "mentions": 4}]
}

Sort each array by mentions descending. Include only items with 2+ mentions. Be specific with item names.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error(`Error extracting trends for ${city}:`, error);
  }
  
  return { items: [], styles: [], colors: [], brands: [] };
}

export async function GET(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Processing city trends...');
    const currentWeek = getWeekString(new Date());
    const previousWeek = getWeekString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    // Get raw data from the last 7 days grouped by city
    const { data: rawData, error } = await supabaseAdmin
      .from('city_trends_raw')
      .select('city, neighborhood, caption, hashtags, likes, comments')
      .eq('platform', 'instagram')
      .neq('city', 'Global')
      .gte('collected_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    if (error || !rawData) {
      console.error('Error fetching raw data:', error);
      return NextResponse.json({ error: 'Failed to fetch raw data' }, { status: 500 });
    }
    
    // Group by city
    const citiesData: Record<string, { neighborhood: string; captions: string[]; totalEngagement: number }> = {};
    
    for (const post of rawData) {
      if (!citiesData[post.city]) {
        citiesData[post.city] = {
          neighborhood: post.neighborhood || '',
          captions: [],
          totalEngagement: 0,
        };
      }
      if (post.caption) {
        citiesData[post.city].captions.push(post.caption);
      }
      citiesData[post.city].totalEngagement += (post.likes || 0) + (post.comments || 0);
    }
    
    // Get previous week's data for comparison
    const { data: prevData } = await supabaseAdmin
      .from('city_trends_processed')
      .select('city, trend_type, trend_name, mentions')
      .eq('period', previousWeek);
    
    const prevTrends: Record<string, number> = {};
    if (prevData) {
      for (const t of prevData) {
        prevTrends[`${t.city}:${t.trend_type}:${t.trend_name}`] = t.mentions;
      }
    }
    
    // Process each city with AI
    const results: Record<string, number> = {};
    
    for (const [city, data] of Object.entries(citiesData)) {
      if (data.captions.length < 10) {
        console.log(`Skipping ${city}: not enough data (${data.captions.length} posts)`);
        continue;
      }
      
      console.log(`Processing ${city} (${data.captions.length} posts)...`);
      
      const trends = await extractTrendsWithAI(data.captions, city);
      const avgEngagement = data.captions.length > 0 ? data.totalEngagement / data.captions.length : 0;
      
      let insertedCount = 0;
      
      // Insert items
      for (let i = 0; i < trends.items.length && i < 10; i++) {
        const item = trends.items[i];
        const prevKey = `${city}:item:${item.name}`;
        const prevMentions = prevTrends[prevKey];
        const changePercent = prevMentions ? ((item.mentions - prevMentions) / prevMentions) * 100 : null;
        
        await supabaseAdmin.from('city_trends_processed').upsert({
          city,
          neighborhood: data.neighborhood,
          period: currentWeek,
          trend_type: 'item',
          trend_name: item.name,
          mentions: item.mentions,
          avg_engagement: avgEngagement,
          change_percent: changePercent,
          is_new: !prevMentions,
          rank: i + 1,
          source_platform: 'instagram',
        }, { onConflict: 'city,period,trend_type,trend_name' });
        insertedCount++;
      }
      
      // Insert styles
      for (let i = 0; i < trends.styles.length && i < 5; i++) {
        const style = trends.styles[i];
        const prevKey = `${city}:style:${style.name}`;
        const prevMentions = prevTrends[prevKey];
        const changePercent = prevMentions ? ((style.mentions - prevMentions) / prevMentions) * 100 : null;
        
        await supabaseAdmin.from('city_trends_processed').upsert({
          city,
          neighborhood: data.neighborhood,
          period: currentWeek,
          trend_type: 'style',
          trend_name: style.name,
          mentions: style.mentions,
          avg_engagement: avgEngagement,
          change_percent: changePercent,
          is_new: !prevMentions,
          rank: i + 1,
          source_platform: 'instagram',
        }, { onConflict: 'city,period,trend_type,trend_name' });
        insertedCount++;
      }
      
      // Insert colors
      for (let i = 0; i < trends.colors.length && i < 5; i++) {
        const color = trends.colors[i];
        
        await supabaseAdmin.from('city_trends_processed').upsert({
          city,
          neighborhood: data.neighborhood,
          period: currentWeek,
          trend_type: 'color',
          trend_name: color.name,
          mentions: color.mentions,
          avg_engagement: avgEngagement,
          change_percent: null,
          is_new: false,
          rank: i + 1,
          source_platform: 'instagram',
        }, { onConflict: 'city,period,trend_type,trend_name' });
        insertedCount++;
      }
      
      results[city] = insertedCount;
      console.log(`✓ ${city}: ${insertedCount} trends processed`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'City trends processed',
      period: currentWeek,
      results,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error processing city trends:', error);
    return NextResponse.json({ error: 'Processing failed', details: String(error) }, { status: 500 });
  }
}
