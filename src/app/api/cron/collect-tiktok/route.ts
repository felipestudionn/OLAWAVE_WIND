import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { supabaseAdmin } from '@/lib/supabase-admin';

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

// KEYWORD SEARCHES - Like how users search on TikTok
// Format: { query: "search term", city: "associated city" }
const TIKTOK_SEARCHES = [
  // LONDON / SHOREDITCH - Emerging trends
  { query: 'shoreditch fashion trends', city: 'London' },
  { query: 'east london street style', city: 'London' },
  { query: 'london fashion 2025', city: 'London' },
  // PARIS / LE MARAIS - Emerging trends
  { query: 'paris fashion trends 2025', city: 'Paris' },
  { query: 'le marais style', city: 'Paris' },
  { query: 'french girl fashion', city: 'Paris' },
  // NEW YORK / BROOKLYN - Emerging trends
  { query: 'brooklyn fashion trends', city: 'New York' },
  { query: 'williamsburg style', city: 'New York' },
  { query: 'nyc street fashion 2025', city: 'New York' },
  // TOKYO / HARAJUKU - Emerging trends
  { query: 'harajuku fashion trends', city: 'Tokyo' },
  { query: 'tokyo street style 2025', city: 'Tokyo' },
  { query: 'japanese fashion trends', city: 'Tokyo' },
  // EMERGING / MICROTRENDS (global but valuable)
  { query: 'emerging fashion trends 2025', city: 'Global' },
  { query: 'underrated fashion trends', city: 'Global' },
  { query: 'fashion microtrends', city: 'Global' },
];

const RESULTS_PER_SEARCH = 30;

function verifyCronAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  return !process.env.CRON_SECRET || (!!authHeader && authHeader === expected);
}

function getWeekString(date: Date): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

export async function GET(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting TikTok keyword search scraping...');
    const results: { query: string; city: string; posts: number }[] = [];
    const currentWeek = getWeekString(new Date());
    
    for (const search of TIKTOK_SEARCHES) {
      try {
        console.log(`Searching TikTok: "${search.query}" (${search.city})...`);
        
        // Use TikTok Keyword Search Scraper
        const run = await apifyClient.actor('sociavault/tiktok-keyword-search-scraper').call({
          query: search.query,
          max_results: RESULTS_PER_SEARCH,
          sort_by: 'relevance',
          date_posted: 'this-month', // Recent content only
        });
        
        const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
        
        let insertedCount = 0;
        let totalPlays = 0;
        let totalLikes = 0;
        let totalShares = 0;
        
        for (const item of items as Array<Record<string, unknown>>) {
          const videoId = (item.id as string) || (item.video_id as string);
          if (!videoId) continue;
          
          const playCount = (item.play_count as number) || (item.playCount as number) || 0;
          const likeCount = (item.digg_count as number) || (item.diggCount as number) || (item.like_count as number) || 0;
          const shareCount = (item.share_count as number) || (item.shareCount as number) || 0;
          const commentCount = (item.comment_count as number) || (item.commentCount as number) || 0;
          const description = (item.desc as string) || (item.description as string) || (item.text as string) || '';
          const author = (item.author as { nickname?: string })?.nickname || (item.authorMeta as { name?: string })?.name || '';
          
          // Extract hashtags from description
          const hashtagMatches = description.match(/#[\w\u00C0-\u024F]+/g);
          const hashtags = hashtagMatches ? hashtagMatches.map(h => h.toLowerCase().replace('#', '')) : [];
          
          totalPlays += playCount;
          totalLikes += likeCount;
          totalShares += shareCount;
          
          const { error } = await supabaseAdmin
            .from('city_trends_raw')
            .upsert({
              platform: 'tiktok',
              city: search.city,
              neighborhood: search.query, // Store the search query as context
              post_id: String(videoId),
              caption: description,
              hashtags,
              likes: likeCount,
              comments: commentCount,
              plays: playCount,
              shares: shareCount,
              author,
            }, {
              onConflict: 'platform,post_id',
            });
          
          if (!error) insertedCount++;
        }
        
        // Save search query aggregate stats
        if (insertedCount > 0) {
          await supabaseAdmin
            .from('tiktok_hashtag_trends')
            .upsert({
              hashtag: search.query, // Store the search query
              period: currentWeek,
              total_plays: totalPlays,
              total_likes: totalLikes,
              total_shares: totalShares,
              post_count: insertedCount,
              avg_engagement: insertedCount > 0 ? Math.round((totalLikes + totalShares) / insertedCount) : 0,
            }, {
              onConflict: 'hashtag,period',
            });
        }
        
        results.push({ query: search.query, city: search.city, posts: insertedCount });
        console.log(`✓ "${search.query}": ${insertedCount} posts, ${(totalPlays/1000000).toFixed(1)}M plays`);
        
      } catch (error) {
        console.error(`Error searching "${search.query}":`, error);
        results.push({ query: search.query, city: search.city, posts: 0 });
      }
    }
    
    const totalPosts = results.reduce((sum, r) => sum + r.posts, 0);
    
    return NextResponse.json({
      success: true,
      message: 'TikTok keyword search scraping completed',
      total: totalPosts,
      searches: results,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('TikTok scraping failed:', error);
    return NextResponse.json({ error: 'Scraping failed', details: String(error) }, { status: 500 });
  }
}
