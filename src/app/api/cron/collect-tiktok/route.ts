import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { supabaseAdmin } from '@/lib/supabase-admin';

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

// MICROTRENDS & EMERGING hashtags - NOT obvious mainstream
const TIKTOK_HASHTAGS = [
  // Emerging aesthetics 2025-2026
  'eclecticgrandpa',
  'corporatecore',
  'balletcore',
  'tenniscore',
  'blokecore',
  'coastalgrandmother',
  'mobwife',
  'cherryred',
  'burgundyaesthetic',
  'barrellegjeans',
  // Specific items trending
  'meshjacket',
  'shaggyjacket',
  'kittenheels',
  'maryjanes',
  'clogsoutfit',
  // Niche microtrends
  'deconstructedfashion',
  'avantbasic',
  'normcore',
  'capsulewardrobe',
  'minimaloutfit',
];

const POSTS_PER_HASHTAG = 40;

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
    console.log('Starting TikTok microtrends scraping...');
    const results: { hashtag: string; posts: number }[] = [];
    const currentWeek = getWeekString(new Date());
    
    for (const hashtag of TIKTOK_HASHTAGS) {
      try {
        console.log(`Scraping TikTok: #${hashtag}...`);
        
        const run = await apifyClient.actor('clockworks/tiktok-scraper').call({
          hashtags: [hashtag],
          resultsPerPage: POSTS_PER_HASHTAG,
        });
        
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
        if (insertedCount > 0) {
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
        }
        
        results.push({ hashtag, posts: insertedCount });
        console.log(`✓ #${hashtag}: ${insertedCount} posts, ${(totalPlays/1000000).toFixed(1)}M plays`);
        
      } catch (error) {
        console.error(`Error scraping #${hashtag}:`, error);
        results.push({ hashtag, posts: 0 });
      }
    }
    
    const totalPosts = results.reduce((sum, r) => sum + r.posts, 0);
    
    return NextResponse.json({
      success: true,
      message: 'TikTok microtrends scraping completed',
      total: totalPosts,
      hashtags: results,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('TikTok scraping failed:', error);
    return NextResponse.json({ error: 'Scraping failed', details: String(error) }, { status: 500 });
  }
}
