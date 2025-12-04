import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Get current week string
function getWeekString(date: Date): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

export async function GET() {
  try {
    const currentWeek = getWeekString(new Date());
    
    // Get processed trends by city
    const { data: processedTrends, error: processedError } = await supabaseAdmin
      .from('city_trends_processed')
      .select('*')
      .eq('period', currentWeek)
      .order('city')
      .order('trend_type')
      .order('rank');
    
    // Get raw data stats by city (for when processed data isn't available yet)
    const { data: rawStats, error: rawError } = await supabaseAdmin
      .from('city_trends_raw')
      .select('city, neighborhood, platform, hashtags, likes, comments')
      .gte('collected_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    // Get TikTok hashtag trends
    const { data: tiktokTrends, error: tiktokError } = await supabaseAdmin
      .from('tiktok_hashtag_trends')
      .select('*')
      .eq('period', currentWeek)
      .order('total_plays', { ascending: false });
    
    if (processedError || rawError || tiktokError) {
      console.error('Error fetching city trends:', { processedError, rawError, tiktokError });
    }
    
    // If we have processed data, use it
    if (processedTrends && processedTrends.length > 0) {
      // Group by city
      const citiesMap: Record<string, {
        city: string;
        neighborhood: string;
        items: Array<{ name: string; mentions: number; avgEngagement: number; change: string; rank: number }>;
        styles: Array<{ name: string; mentions: number; change: string }>;
        colors: Array<{ name: string; mentions: number }>;
      }> = {};
      
      for (const trend of processedTrends) {
        if (!citiesMap[trend.city]) {
          citiesMap[trend.city] = {
            city: trend.city,
            neighborhood: trend.neighborhood || '',
            items: [],
            styles: [],
            colors: [],
          };
        }
        
        const changeStr = trend.is_new ? 'NEW' : 
          trend.change_percent > 0 ? `+${Math.round(trend.change_percent)}%` :
          trend.change_percent < 0 ? `${Math.round(trend.change_percent)}%` : '0%';
        
        if (trend.trend_type === 'item') {
          citiesMap[trend.city].items.push({
            name: trend.trend_name,
            mentions: trend.mentions,
            avgEngagement: Math.round(trend.avg_engagement),
            change: changeStr,
            rank: trend.rank,
          });
        } else if (trend.trend_type === 'style') {
          citiesMap[trend.city].styles.push({
            name: trend.trend_name,
            mentions: trend.mentions,
            change: changeStr,
          });
        } else if (trend.trend_type === 'color') {
          citiesMap[trend.city].colors.push({
            name: trend.trend_name,
            mentions: trend.mentions,
          });
        }
      }
      
      return NextResponse.json({
        cities: Object.values(citiesMap),
        tiktokTrends: tiktokTrends || [],
        period: currentWeek,
        hasProcessedData: true,
      });
    }
    
    // Fallback: aggregate raw data if no processed data
    if (rawStats && rawStats.length > 0) {
      const cityStats: Record<string, {
        city: string;
        neighborhood: string;
        postCount: number;
        totalEngagement: number;
        topHashtags: Record<string, number>;
      }> = {};
      
      for (const post of rawStats) {
        if (post.city === 'Global') continue; // Skip TikTok global posts
        
        if (!cityStats[post.city]) {
          cityStats[post.city] = {
            city: post.city,
            neighborhood: post.neighborhood || '',
            postCount: 0,
            totalEngagement: 0,
            topHashtags: {},
          };
        }
        
        cityStats[post.city].postCount++;
        cityStats[post.city].totalEngagement += (post.likes || 0) + (post.comments || 0);
        
        // Count hashtags
        if (post.hashtags) {
          for (const tag of post.hashtags) {
            cityStats[post.city].topHashtags[tag] = (cityStats[post.city].topHashtags[tag] || 0) + 1;
          }
        }
      }
      
      // Convert to response format
      const cities = Object.values(cityStats).map(city => ({
        city: city.city,
        neighborhood: city.neighborhood,
        postCount: city.postCount,
        avgEngagement: city.postCount > 0 ? Math.round(city.totalEngagement / city.postCount) : 0,
        topHashtags: Object.entries(city.topHashtags)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([tag, count]) => ({ tag, count })),
      }));
      
      return NextResponse.json({
        cities,
        tiktokTrends: tiktokTrends || [],
        period: currentWeek,
        hasProcessedData: false,
        message: 'Raw data aggregated. Run process-city-trends for full analysis.',
      });
    }
    
    // No data at all
    return NextResponse.json({
      cities: [],
      tiktokTrends: [],
      period: currentWeek,
      hasProcessedData: false,
      message: 'No data available. Run collect-city-trends first.',
    });
    
  } catch (error) {
    console.error('Error in city trends API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
