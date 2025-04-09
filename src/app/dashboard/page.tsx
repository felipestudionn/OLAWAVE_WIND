import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-4 py-4">
        <h1 className="text-3xl font-bold tracking-tight mb-3 text-foreground">Fashion Trend Dashboard</h1>
        <p className="text-muted-foreground max-w-3xl">
          Intelligence in motion. Decoding patterns, revealing context, and transforming uncertainty into strategic insight.
        </p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card relative overflow-hidden group">
          <div className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
              <h3 className="font-semibold">Instagram</h3>
            </div>
            <div className="text-2xl font-bold">+28.4%</div>
            <p className="text-xs text-muted-foreground">Growth in sustainable fashion trends</p>
            <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-primary/20 transition-all duration-300 group-hover:scale-150"></div>
          </div>
        </div>
        
        <div className="glass-card relative overflow-hidden group">
          <div className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <h3 className="font-semibold">Pinterest</h3>
            </div>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">Pins related to minimalist fashion</p>
            <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-secondary/20 transition-all duration-300 group-hover:scale-150"></div>
          </div>
        </div>
        
        <div className="glass-card relative overflow-hidden group">
          <div className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              <h3 className="font-semibold">TikTok</h3>
            </div>
            <div className="text-2xl font-bold">42.7M</div>
            <p className="text-xs text-muted-foreground">Views on #fashiontrends hashtag</p>
            <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-accent/20 transition-all duration-300 group-hover:scale-150"></div>
          </div>
        </div>
        
        <div className="glass-card relative overflow-hidden group">
          <div className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="m16 8-4 4-4-4"/><path d="m16 16-4-4-4 4"/></svg>
              <h3 className="font-semibold">Google</h3>
            </div>
            <div className="text-2xl font-bold">+64%</div>
            <p className="text-xs text-muted-foreground">Increase in searches for "ethical fashion"</p>
            <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-primary/20 transition-all duration-300 group-hover:scale-150"></div>
          </div>
        </div>
      </div>
      
      {/* Trending Categories */}
      <div className="space-y-6">
        <div className="col-span-full">
          <h2 className="text-2xl font-bold tracking-tight">Trending Categories</h2>
          <p className="text-muted-foreground">Top fashion categories gaining momentum across platforms</p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 olawave-gradient"></div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Sustainable Fashion</h3>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary">+42%</span>
            </div>
            <p className="text-sm text-muted-foreground">Eco-friendly materials, ethical production, and circular fashion concepts gaining significant traction.</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Top platforms:</span>
              <span className="text-muted-foreground">Instagram, Pinterest</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 olawave-gradient"></div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Y2K Revival</h3>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/20 text-secondary">+38%</span>
            </div>
            <p className="text-sm text-muted-foreground">Early 2000s fashion making a strong comeback with low-rise jeans, baby tees, and butterfly motifs.</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Top platforms:</span>
              <span className="text-muted-foreground">TikTok, Instagram</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 olawave-gradient"></div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Genderless Fashion</h3>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/20 text-accent">+27%</span>
            </div>
            <p className="text-sm text-muted-foreground">Gender-neutral clothing and accessories breaking traditional fashion boundaries.</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Top platforms:</span>
              <span className="text-muted-foreground">Pinterest, Google</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Insights */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recent Insights</h2>
          <p className="text-muted-foreground">Latest fashion trend analysis and predictions</p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 800 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M200,200 C280,120 400,280 600,200"
                      stroke="currentColor"
                      strokeWidth="35"
                      strokeLinecap="round"
                      className="text-primary"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Micro-Trends Analysis</h3>
                  <p className="text-sm text-muted-foreground">April 8, 2025</p>
                </div>
              </div>
              <p className="text-sm">Our AI has detected several emerging micro-trends that are showing potential for mainstream adoption in the next 3-6 months. These include crochet accessories, oversized blazers with graphic tees, and platform loafers.</p>
              <div className="flex items-center gap-2">
                <Link href="/trends" className="text-sm font-medium text-primary hover:underline">View full analysis</Link>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 800 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M200,200 C280,120 400,280 600,200"
                      stroke="currentColor"
                      strokeWidth="35"
                      strokeLinecap="round"
                      className="text-secondary"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Seasonal Forecast</h3>
                  <p className="text-sm text-muted-foreground">April 5, 2025</p>
                </div>
              </div>
              <p className="text-sm">Summer 2025 is predicted to see a surge in bright, dopamine-inducing colors, lightweight natural fabrics, and statement accessories. Sustainability remains a key factor in consumer purchasing decisions.</p>
              <div className="flex items-center gap-2">
                <Link href="/analytics" className="text-sm font-medium text-primary hover:underline">View forecast data</Link>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
