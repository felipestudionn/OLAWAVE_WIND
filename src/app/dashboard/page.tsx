import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, PieChart, Instagram, Search } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of fashion trends across multiple platforms
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Trends Analyzed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Instagram Trends
            </CardTitle>
            <Instagram className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pinterest Trends
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">386</div>
            <p className="text-xs text-muted-foreground">
              +7% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              TikTok Trends
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">298</div>
            <p className="text-xs text-muted-foreground">
              +24% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Trend Popularity Over Time</CardTitle>
            <CardDescription>
              Monthly trend popularity across platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full rounded-md border bg-muted p-2">
              <div className="flex h-full items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Trend Chart Visualization</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Trending Categories</CardTitle>
            <CardDescription>
              Most popular fashion categories this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full rounded-md border bg-muted p-2">
              <div className="flex h-full items-center justify-center">
                <PieChart className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Category Distribution</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Hashtags</CardTitle>
            <CardDescription>
              Most used fashion hashtags across platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { tag: "#sustainablefashion", count: 24863, growth: "+12%" },
                { tag: "#vintagestyle", count: 18742, growth: "+8%" },
                { tag: "#streetwear", count: 15983, growth: "+15%" },
                { tag: "#minimalism", count: 12476, growth: "+5%" },
                { tag: "#y2kfashion", count: 10982, growth: "+22%" },
              ].map((item) => (
                <div key={item.tag} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.tag}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.count.toLocaleString()} mentions
                    </p>
                  </div>
                  <div className="text-sm text-green-500">{item.growth}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Emerging Trends</CardTitle>
            <CardDescription>
              Rapidly growing fashion trends to watch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { trend: "Oversized Blazers", growth: "+32%", platform: "Instagram" },
                { trend: "Crochet Accessories", growth: "+28%", platform: "Pinterest" },
                { trend: "Platform Boots", growth: "+24%", platform: "TikTok" },
                { trend: "Sustainable Denim", growth: "+21%", platform: "Google" },
                { trend: "Gender-Neutral Fashion", growth: "+19%", platform: "Instagram" },
              ].map((item) => (
                <div key={item.trend} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.trend}</p>
                    <p className="text-sm text-muted-foreground">
                      Trending on {item.platform}
                    </p>
                  </div>
                  <div className="text-sm text-green-500">{item.growth}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
