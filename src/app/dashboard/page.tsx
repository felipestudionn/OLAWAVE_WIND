import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 px-4 md:px-6 py-6 md:py-10 max-w-7xl mx-auto">
      <div className="space-y-3">
        <h1 className="olawave-heading text-3xl md:text-4xl font-bold tracking-tight mb-2 text-foreground">Fashion Trend Dashboard</h1>
        <p className="text-muted-foreground max-w-3xl text-base md:text-lg">
          Intelligence in motion. Decoding patterns, revealing context, and transforming uncertainty into strategic insight.
        </p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
          <div className="p-5 md:p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
              <h3 className="font-semibold">Instagram</h3>
            </div>
            <div className="text-2xl font-bold mt-1">+28.4%</div>
            <p className="text-xs text-muted-foreground">Growth in sustainable fashion trends</p>
            <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-primary/20 transition-all duration-300 group-hover:scale-150"></div>
          </div>
        </div>
        
        <div className="glass-card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
          <div className="p-5 md:p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <h3 className="font-semibold">Pinterest</h3>
            </div>
            <div className="text-2xl font-bold mt-1">1.2M</div>
            <p className="text-xs text-muted-foreground">Pins related to minimalist fashion</p>
            <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-secondary/20 transition-all duration-300 group-hover:scale-150"></div>
          </div>
        </div>
        
        <div className="glass-card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
          <div className="p-5 md:p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              <h3 className="font-semibold">TikTok</h3>
            </div>
            <div className="text-2xl font-bold mt-1">42.7M</div>
            <p className="text-xs text-muted-foreground">Views on #fashiontrends hashtag</p>
            <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-accent/20 transition-all duration-300 group-hover:scale-150"></div>
          </div>
        </div>
        
        <div className="glass-card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
          <div className="p-5 md:p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="m16 8-4 4-4-4"/><path d="m16 16-4-4-4 4"/></svg>
              <h3 className="font-semibold">Google</h3>
            </div>
            <div className="text-2xl font-bold mt-1">+64%</div>
            <p className="text-xs text-muted-foreground">Increase in searches for "ethical fashion"</p>
            <div className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full bg-primary/20 transition-all duration-300 group-hover:scale-150"></div>
          </div>
        </div>
      </div>
      
      {/* Trending Categories */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Trending Categories</h2>
            <p className="text-muted-foreground text-sm md:text-base">Top fashion categories gaining momentum across platforms</p>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center gap-2">
            <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span className="sr-only">Export</span>
            </button>
          </div>
        </div>
        
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-5 md:p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
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
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-5 md:p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
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
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-5 md:p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="absolute top-0 right-0 w-full h-1 olawave-gradient"></div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Oversized Silhouettes</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/20 text-accent">+27%</span>
              </div>
              <p className="text-sm text-muted-foreground">Loose-fitting garments and exaggerated proportions continue to dominate casual and formal wear.</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Top platforms:</span>
                <span className="text-muted-foreground">Pinterest, TikTok</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-5 md:p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="absolute top-0 right-0 w-full h-1 olawave-gradient"></div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Dopamine Dressing</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary">+24%</span>
              </div>
              <p className="text-sm text-muted-foreground">Vibrant colors and mood-enhancing clothing choices that prioritize joy and self-expression.</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Top platforms:</span>
                <span className="text-muted-foreground">Instagram, Pinterest</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Emerging Trends */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Emerging Trends</h2>
            <p className="text-muted-foreground text-sm md:text-base">New fashion movements gaining traction in the last 30 days</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] caption-bottom text-sm">
            <thead>
              <tr className="border-b">
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Trend</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Growth</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Platforms</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Demographics</th>
                <th className="h-10 px-4 text-right font-medium text-muted-foreground">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 font-medium">Genderless Fashion</td>
                <td className="p-4 text-primary">+19.2%</td>
                <td className="p-4">TikTok, Instagram</td>
                <td className="p-4">18-34, Urban</td>
                <td className="p-4 text-right">92% Positive</td>
              </tr>
              <tr className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 font-medium">Craftcore</td>
                <td className="p-4 text-primary">+17.8%</td>
                <td className="p-4">Pinterest, Instagram</td>
                <td className="p-4">25-45, Suburban</td>
                <td className="p-4 text-right">88% Positive</td>
              </tr>
              <tr className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 font-medium">Digital Fashion</td>
                <td className="p-4 text-primary">+15.3%</td>
                <td className="p-4">TikTok, Twitter</td>
                <td className="p-4">18-29, Tech-savvy</td>
                <td className="p-4 text-right">76% Positive</td>
              </tr>
              <tr className="transition-colors hover:bg-muted/50">
                <td className="p-4 font-medium">Regencycore</td>
                <td className="p-4 text-primary">+12.7%</td>
                <td className="p-4">Pinterest, Instagram</td>
                <td className="p-4">22-38, Urban</td>
                <td className="p-4 text-right">84% Positive</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
          <p className="text-muted-foreground text-sm md:text-base">Latest updates and changes in fashion trend data</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
            <div className="rounded-full bg-primary/20 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">New trend report available</p>
              <p className="text-sm text-muted-foreground">Summer 2025 Forecast has been published</p>
              <div className="flex items-center pt-2">
                <time className="text-xs text-muted-foreground">2 hours ago</time>
              </div>
            </div>
            <button className="rounded-full h-8 w-8 p-0 flex items-center justify-center text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
              <span className="sr-only">View</span>
            </button>
          </div>
          
          <div className="flex items-start gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
            <div className="rounded-full bg-secondary/20 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-secondary">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Data update completed</p>
              <p className="text-sm text-muted-foreground">All platform data has been refreshed with latest metrics</p>
              <div className="flex items-center pt-2">
                <time className="text-xs text-muted-foreground">Yesterday at 3:45 PM</time>
              </div>
            </div>
            <button className="rounded-full h-8 w-8 p-0 flex items-center justify-center text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
              <span className="sr-only">View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
