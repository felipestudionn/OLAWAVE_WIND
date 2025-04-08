import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Filter, Instagram, Search } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function TrendsPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-4 py-4">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Trend Analysis</h1>
        <p className="text-muted-foreground max-w-3xl">
          Detailed analysis of current fashion trends across platforms, revealing patterns and consumer preferences.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="h-9">
            Export Report
          </Button>
        </div>
      </div>
      
      <div className="grid gap-8">
        {[
          {
            id: 1,
            title: "Sustainable Fashion",
            growth: "+18%",
            description: "Eco-friendly and ethically produced clothing continues to gain momentum",
            platforms: ["Instagram", "Pinterest", "Google"],
            demographics: "25-34 age group, urban areas",
            keywords: ["eco-friendly", "ethical", "sustainable", "recycled", "organic"],
            sentiment: "Positive"
          },
          {
            id: 2,
            title: "Y2K Revival",
            growth: "+24%",
            description: "Early 2000s fashion making a strong comeback among Gen Z",
            platforms: ["TikTok", "Instagram"],
            demographics: "16-24 age group, global trend",
            keywords: ["y2k", "2000s", "low-rise", "butterfly", "rhinestone"],
            sentiment: "Very Positive"
          },
          {
            id: 3,
            title: "Oversized Silhouettes",
            growth: "+15%",
            description: "Loose-fitting clothing and oversized proportions dominating casual wear",
            platforms: ["Instagram", "TikTok"],
            demographics: "18-35 age group, urban centers",
            keywords: ["oversized", "baggy", "loose-fit", "comfort", "streetwear"],
            sentiment: "Positive"
          },
          {
            id: 4,
            title: "Cottagecore Aesthetic",
            growth: "+12%",
            description: "Romanticized interpretation of rural life reflected in fashion choices",
            platforms: ["Pinterest", "Instagram"],
            demographics: "22-38 age group, suburban and rural areas",
            keywords: ["cottagecore", "pastoral", "floral", "vintage", "handmade"],
            sentiment: "Positive"
          },
          {
            id: 5,
            title: "Genderless Fashion",
            growth: "+21%",
            description: "Gender-neutral clothing breaking traditional fashion boundaries",
            platforms: ["Instagram", "TikTok", "Google"],
            demographics: "18-40 age group, urban areas",
            keywords: ["genderless", "unisex", "gender-neutral", "inclusive", "fluid"],
            sentiment: "Very Positive"
          }
        ].map(trend => (
          <Card key={trend.id} className="overflow-hidden relative group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-1">{trend.title}</CardTitle>
                  <CardDescription className="text-base">{trend.description}</CardDescription>
                </div>
                <div className="text-2xl font-bold text-primary">{trend.growth}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Platform Distribution</h4>
                  <div className="flex gap-2">
                    {trend.platforms.map(platform => (
                      <div key={platform} className="flex items-center gap-1 text-sm">
                        {platform === "Instagram" && <Instagram className="h-4 w-4 text-pink-500" />}
                        {platform === "TikTok" && <TrendingUp className="h-4 w-4 text-blue-500" />}
                        {(platform === "Pinterest" || platform === "Google") && <Search className="h-4 w-4 text-gray-500" />}
                        <span>{platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Demographics</h4>
                  <p className="text-sm text-muted-foreground">{trend.demographics}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {trend.keywords.map(keyword => (
                      <Badge key={keyword} variant="outline" className="text-xs">{keyword}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Sentiment</h4>
                  <Badge className={`${
                    trend.sentiment.includes("Very Positive") ? "bg-green-600" :
                    trend.sentiment.includes("Positive") ? "bg-green-500" :
                    trend.sentiment.includes("Neutral") ? "bg-gray-500" :
                    trend.sentiment.includes("Negative") ? "bg-red-500" : "bg-red-600"
                  }`}>
                    {trend.sentiment}
                  </Badge>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 h-24 w-24 -mb-8 -mr-8 rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-150"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
