import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Initialize Apify client
const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

// City configurations with Instagram location IDs
const CITY_LOCATIONS = [
  { city: 'London', neighborhood: 'Shoreditch', locationQuery: 'Shoreditch, London' },
  { city: 'Paris', neighborhood: 'Le Marais', locationQuery: 'Le Marais, Paris' },
  { city: 'New York', neighborhood: 'Williamsburg', locationQuery: 'Williamsburg, Brooklyn' },
  { city: 'Tokyo', neighborhood: 'Harajuku', locationQuery: 'Harajuku, Tokyo' },
  { city: 'Berlin', neighborhood: 'Kreuzberg', locationQuery: 'Kreuzberg, Berlin' },
  { city: 'Seoul', neighborhood: 'Hongdae', locationQuery: 'Hongdae, Seoul' },
];

// TikTok hashtags to track - MICROTRENDS & EMERGING (not obvious mainstream)
const TIKTOK_HASHTAGS = [
  // Emerging aesthetics 2025-2026
  'ecleticgrandpa',
  'corporatecore',
  'balletcore',
  'tenniscore',
  'blokecore',
  'coastalgrandmother',
  'mobwife',
  'cherryred2025',
  'burgundytrend',
  'barrellegjeans',
  // Specific items trending
  'meshjacket',
  'shaggyjacket',
  'kiттенheels',
  'platformmary janes',
  'clogscomeback',
  // Niche microtrends
  'deconstructedfashion',
  'avantbasic',
  'normcore2025',
  'minimalismfashion',
  'capsulewardrobe2025',
];

// Posts per location/hashtag (optimized for budget)
const POSTS_PER_LOCATION = 100; // Reduced for separate cron execution
const POSTS_PER_HASHTAG = 50;   // Reduced for more hashtags

// Auth check for Vercel Cron
function verifyCronAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  return !process.env.CRON_SECRET || (!!authHeader && authHeader === expected);
}

// Extract hashtags from caption
function extractHashtags(caption: string): string[] {
  if (!caption) return [];
  const matches = caption.match(/#[\w\u00C0-\u024F]+/g);
  return matches ? matches.map(h => h.toLowerCase().replace('#', '')) : [];
}

// Scrape Instagram locations
async function scrapeInstagram(): Promise<{ city: string; neighborhood: string; posts: number }[]> {
  const results: { city: string; neighborhood: string; posts: number }[] = [];
  
  for (const location of CITY_LOCATIONS) {
    try {
      console.log(`Scraping Instagram: ${location.city} - ${location.neighborhood}...`);
      
      // Run Instagram Scraper Actor
      const run = await apifyClient.actor('apify/instagram-scraper').call({
        search: location.locationQuery,
        searchType: 'place',
        resultsLimit: POSTS_PER_LOCATION,
        searchLimit: 1,
      });
      
      // Get results from dataset
      const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
      
      let insertedCount = 0;
      
      for (const item of items as Array<Record<string, unknown>>) {
        // Skip if not a post
        if (!item.id) continue;
        
        const caption = (item.caption as string) || '';
        const hashtags = extractHashtags(caption);
        
        const { error } = await supabaseAdmin
          .from('city_trends_raw')
          .upsert({
            platform: 'instagram',
            city: location.city,
            neighborhood: location.neighborhood,
            post_id: String(item.id),
            caption,
            hashtags,
            likes: (item.likesCount as number) || 0,
            comments: (item.commentsCount as number) || 0,
            image_url: (item.displayUrl as string) || (item.url as string) || '',
            author: (item.ownerUsername as string) || '',
          }, {
            onConflict: 'platform,post_id',
          });
        
        if (!error) insertedCount++;
      }
      
      results.push({
        city: location.city,
        neighborhood: location.neighborhood,
        posts: insertedCount,
      });
      
      console.log(`✓ ${location.city}: ${insertedCount} posts saved`);
      
    } catch (error) {
      console.error(`Error scraping ${location.city}:`, error);
      results.push({ city: location.city, neighborhood: location.neighborhood, posts: 0 });
    }
  }
  
  return results;
}

// Scrape TikTok hashtags
async function scrapeTikTok(): Promise<{ hashtag: string; posts: number }[]> {
  const results: { hashtag: string; posts: number }[] = [];
  
  for (const hashtag of TIKTOK_HASHTAGS) {
    try {
      console.log(`Scraping TikTok: #${hashtag}...`);
      
      // Run TikTok Scraper Actor
      const run = await apifyClient.actor('clockworks/tiktok-scraper').call({
        hashtags: [hashtag],
        resultsPerPage: POSTS_PER_HASHTAG,
      });
      
      // Get results from dataset
      const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
      
      let insertedCount = 0;
      let totalPlays = 0;
      let totalLikes = 0;
      let totalShares = 0;
      
      for (const item of items as Array<Record<string, unknown>>) {
        if (!item.id) continue;
        
        const playCount = (item.playCount as number) || 0;
        const diggCount = (item.diggCount as number) || 0;
        const shareCount = (item.shareCount as number) || 0;
        const commentCount = (item.commentCount as number) || 0;
        const hashtagsArr = item.hashtags as Array<{ name?: string }> | undefined;
        const authorMeta = item.authorMeta as { name?: string } | undefined;
        
        totalPlays += playCount;
        totalLikes += diggCount;
        totalShares += shareCount;
        
        const { error } = await supabaseAdmin
          .from('city_trends_raw')
          .upsert({
            platform: 'tiktok',
            city: 'Global',
            neighborhood: null,
            post_id: String(item.id),
            caption: (item.text as string) || '',
            hashtags: hashtagsArr?.map((h) => h.name?.toLowerCase()) || [hashtag],
            likes: diggCount,
            comments: commentCount,
            plays: playCount,
            shares: shareCount,
            author: authorMeta?.name || '',
          }, {
            onConflict: 'platform,post_id',
          });
        
        if (!error) insertedCount++;
      }
      
      // Save hashtag aggregate stats
      const currentWeek = getWeekString(new Date());
      await supabaseAdmin
        .from('tiktok_hashtag_trends')
        .upsert({
          hashtag,
          period: currentWeek,
          total_plays: totalPlays,
          total_likes: totalLikes,
          total_shares: totalShares,
          post_count: insertedCount,
          avg_engagement: insertedCount > 0 ? Math.round((totalLikes + totalShares) / insertedCount) : 0,
        }, {
          onConflict: 'hashtag,period',
        });
      
      results.push({ hashtag, posts: insertedCount });
      console.log(`✓ #${hashtag}: ${insertedCount} posts saved`);
      
    } catch (error) {
      console.error(`Error scraping #${hashtag}:`, error);
      results.push({ hashtag, posts: 0 });
    }
  }
  
  return results;
}

// Get week string in format '2024-W49'
function getWeekString(date: Date): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

export async function GET(req: NextRequest) {
  // Auth check
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting city trends collection...');
    console.log('Timestamp:', new Date().toISOString());
    
    // Scrape both platforms
    const [instagramResults, tiktokResults] = await Promise.all([
      scrapeInstagram(),
      scrapeTikTok(),
    ]);
    
    const totalInstagram = instagramResults.reduce((sum, r) => sum + r.posts, 0);
    const totalTikTok = tiktokResults.reduce((sum, r) => sum + r.posts, 0);
    
    console.log(`\nCollection complete!`);
    console.log(`Instagram: ${totalInstagram} posts from ${instagramResults.length} locations`);
    console.log(`TikTok: ${totalTikTok} posts from ${tiktokResults.length} hashtags`);
    
    return NextResponse.json({
      success: true,
      message: 'City trends collection completed',
      instagram: {
        total: totalInstagram,
        locations: instagramResults,
      },
      tiktok: {
        total: totalTikTok,
        hashtags: tiktokResults,
      },
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('City trends collection failed:', error);
    return NextResponse.json(
      { error: 'Collection failed', details: String(error) },
      { status: 500 }
    );
  }
}
