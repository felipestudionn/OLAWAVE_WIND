import { supabaseAdmin } from '@/lib/supabase-admin';
import type { Signal } from '@/types';
import { CreativeSpaceClient } from './creative-space-client';

async function getSignals(): Promise<Signal[]> {
  const { data, error } = await supabaseAdmin
    .from('signals')
    .select('*')
    .eq('location', 'Shoreditch')
    .order('composite_score', { ascending: false })
    .limit(10);

  if (error || !data) {
    return [];
  }

  return data as Signal[];
}

export default async function CreativeSpacePage() {
  const signals = await getSignals();

  const totalSignals = signals.length;
  const totalRedditMentions = signals.reduce(
    (sum, s) => sum + (s.reddit_mentions || 0),
    0,
  );
  const totalPinterestPins = signals.reduce(
    (sum, s) => sum + (s.pinterest_pin_count || 0),
    0,
  );
  const totalYoutubeViews = signals.reduce(
    (sum, s) => sum + (s.youtube_total_views || 0),
    0,
  );
  const avgAcceleration =
    signals.length > 0
      ?
          signals.reduce(
            (sum, s) => sum + (s.acceleration_factor || 1),
            0,
          ) / signals.length
      : 1;
  const growthPercent = Math.round((avgAcceleration - 1) * 100);

  return (
    <div className="flex flex-col gap-10 px-4 md:px-6 py-6 md:py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Creative Space</h1>
        <p className="text-muted-foreground max-w-3xl">
          Build a visual moodboard and combine it with live trend insights to define the
          creative direction of your collection. This space can be used independently or
          as the starting point for your quantitative planning.
        </p>
      </div>

      {/* Bloque 1: Estrategia Creativa – Moodboard (client component) */}
      <CreativeSpaceClient />

      {/* Bloque 1: Estrategia Creativa – Fashion Trend Dashboard (input externo de IA) */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">AI Trend Insights</h2>
          <p className="text-muted-foreground">
            Live signals from Shoreditch aggregated across Reddit, YouTube and Pinterest.
          </p>
        </div>

        {/* Key Outputs: Colors, Trends, Items */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Key Colors</h3>
            <div className="flex gap-2 mb-3">
              <div className="w-12 h-12 rounded-full bg-[#E8DCC4]" title="Warm Beige"></div>
              <div className="w-12 h-12 rounded-full bg-[#6B7F5E]" title="Olive Green"></div>
              <div className="w-12 h-12 rounded-full bg-[#2E5EAA]" title="Electric Blue"></div>
              <div className="w-12 h-12 rounded-full bg-[#D4A574]" title="Camel"></div>
            </div>
            <p className="text-xs text-muted-foreground">
              Neutral earth tones with high-saturation accent colors dominating Shoreditch streetwear.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Key Trends</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Oversized Tailoring:</strong> Wide-leg pants, baggy fits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Gorpcore:</strong> Utility-focused outdoor aesthetics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Y2K Revival:</strong> Early 2000s references</span>
              </li>
            </ul>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Key Items</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Utility vests & cargo pants</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Oversized bomber jackets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Platform sandals & chunky sneakers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Crochet bags & statement accessories</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
            <div className="p-5 md:p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
                <h3 className="font-semibold">Signals</h3>
              </div>
              <div className="text-2xl font-bold mt-1">{totalSignals}</div>
              <p className="text-xs text-muted-foreground">Active emerging signals in Shoreditch (last 30 days)</p>
              <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-primary/20 transition-all duration-300 group-hover:scale-150"></div>
            </div>
          </div>
          
          <div className="glass-card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
            <div className="p-5 md:p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <h3 className="font-semibold">Pinterest</h3>
              </div>
              <div className="text-2xl font-bold mt-1">{totalPinterestPins}</div>
              <p className="text-xs text-muted-foreground">Pins linked to emerging Shoreditch fashion signals</p>
              <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-secondary/20 transition-all duration-300 group-hover:scale-150"></div>
            </div>
          </div>
          
          <div className="glass-card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
            <div className="p-5 md:p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                <h3 className="font-semibold">YouTube</h3>
              </div>
              <div className="text-2xl font-bold mt-1">{totalYoutubeViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total views across YouTube content tied to signals</p>
              <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-accent/20 transition-all duration-300 group-hover:scale-150"></div>
            </div>
          </div>
          
          <div className="glass-card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
            <div className="p-5 md:p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="m16 8-4 4-4-4"/><path d="m16 16-4-4-4 4"/></svg>
                <h3 className="font-semibold">Momentum</h3>
              </div>
              <div className="text-2xl font-bold mt-1">{growthPercent > 0 ? `+${growthPercent}%` : 'Stable'}</div>
              <p className="text-xs text-muted-foreground">Average trend acceleration vs. prior period proxy</p>
              <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-primary/20 transition-all duration-300 group-hover:scale-150"></div>
            </div>
          </div>
        </div>

        {/* Trending Categories */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight">Trending Categories</h3>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            {signals.slice(0, 4).map((signal) => {
              const accel =
                typeof signal.acceleration_factor === 'number'
                  ? Math.round((signal.acceleration_factor - 1) * 100)
                  : null;
              const platformsLabel =
                signal.platforms_present === 3
                  ? 'Reddit, YouTube, Pinterest'
                  : signal.platforms_present === 2
                  ? 'Multi-platform'
                  : 'Single platform';

              return (
                <div
                  key={signal.id}
                  className="rounded-lg border bg-card text-card-foreground shadow-sm p-5 md:p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="absolute top-0 right-0 w-full h-1 olawave-gradient"></div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{signal.signal_name}</h3>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary">
                        {accel !== null ? `+${accel}%` : 'Signal'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {signal.signal_type
                        ? `${signal.signal_type} signal with composite score ${Math.round(
                            signal.composite_score || 0,
                          )}`
                        : `Composite score ${Math.round(
                            signal.composite_score || 0,
                          )} across platforms.`}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Top platforms:</span>
                      <span className="text-muted-foreground">{platformsLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emerging Trends Table */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight">Emerging Trends</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] caption-bottom text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Trend</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Growth</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Platforms</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {signals.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-muted-foreground"
                    >
                      No signals available yet. Once data is ingested into Supabase,
                      emerging trends will appear here.
                    </td>
                  </tr>
                )}

                {signals.map((signal) => {
                  const growthPercent =
                    typeof signal.acceleration_factor === 'number'
                      ? Math.round((signal.acceleration_factor - 1) * 100)
                      : null;

                  const growthLabel =
                    growthPercent !== null ? `+${growthPercent}%` : 'N/A';

                  const sentimentLabel =
                    typeof signal.composite_score === 'number'
                      ? `${Math.round(signal.composite_score)} Score`
                      : 'N/A';

                  const platformsLabel =
                    signal.platforms_present === 3
                      ? 'Reddit, YouTube, Pinterest'
                      : signal.platforms_present === 2
                      ? 'Multi-platform'
                      : 'Single platform';

                  return (
                    <tr
                      key={signal.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 font-medium">{signal.signal_name}</td>
                      <td className="p-4 text-primary">{growthLabel}</td>
                      <td className="p-4">{platformsLabel}</td>
                      <td className="p-4 text-right">{sentimentLabel}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
