import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Filter, Instagram, Search, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { TrendEvolutionChart } from "@/components/charts/trend-evolution-chart";
import Link from "next/link";

export default function TrendsPage() {
  // Sample trend evolution data for each trend
  const trendEvolutionData = {
    "sustainable": [
      { month: "Jan", value: 42 },
      { month: "Feb", value: 45 },
      { month: "Mar", value: 48 },
      { month: "Apr", value: 52 },
      { month: "May", value: 55 },
      { month: "Jun", value: 60 }
    ],
    "y2k": [
      { month: "Jan", value: 35 },
      { month: "Feb", value: 42 },
      { month: "Mar", value: 48 },
      { month: "Apr", value: 55 },
      { month: "May", value: 62 },
      { month: "Jun", value: 68 }
    ],
    "oversized": [
      { month: "Jan", value: 40 },
      { month: "Feb", value: 43 },
      { month: "Mar", value: 45 },
      { month: "Apr", value: 48 },
      { month: "May", value: 52 },
      { month: "Jun", value: 55 }
    ],
    "dopamine": [
      { month: "Jan", value: 25 },
      { month: "Feb", value: 32 },
      { month: "Mar", value: 38 },
      { month: "Apr", value: 45 },
      { month: "May", value: 52 },
      { month: "Jun", value: 60 }
    ],
    "genderless": [
      { month: "Jan", value: 30 },
      { month: "Feb", value: 35 },
      { month: "Mar", value: 42 },
      { month: "Apr", value: 48 },
      { month: "May", value: 55 },
      { month: "Jun", value: 62 }
    ],
    "craftcore": [
      { month: "Jan", value: 20 },
      { month: "Feb", value: 28 },
      { month: "Mar", value: 35 },
      { month: "Apr", value: 42 },
      { month: "May", value: 50 },
      { month: "Jun", value: 58 }
    ],
    "digital": [
      { month: "Jan", value: 28 },
      { month: "Feb", value: 35 },
      { month: "Mar", value: 42 },
      { month: "Apr", value: 50 },
      { month: "May", value: 58 },
      { month: "Jun", value: 65 }
    ]
  };

  // Type for the evolution data to fix TypeScript error
  type TrendEvolutionKeys = keyof typeof trendEvolutionData;

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
      
      <div className="grid gap-8 md:grid-cols-2">
        {[
          {
            id: 1,
            title: "Sustainable Fashion",
            growth: "+18%",
            description: "Eco-friendly and ethically produced clothing continues to gain momentum",
            platforms: ["Instagram", "Pinterest", "Google"],
            demographics: "25-34 age group, urban areas",
            keywords: ["eco-friendly", "ethical", "sustainable", "recycled", "organic"],
            sentiment: "Positive",
            evolutionKey: "sustainable" as TrendEvolutionKeys,
            color: "#4CAF50"
          },
          {
            id: 2,
            title: "Y2K Revival",
            growth: "+24%",
            description: "Early 2000s fashion making a strong comeback among Gen Z",
            platforms: ["TikTok", "Instagram"],
            demographics: "16-24 age group, global trend",
            keywords: ["y2k", "2000s", "low-rise", "butterfly", "rhinestone"],
            sentiment: "Very Positive",
            evolutionKey: "y2k" as TrendEvolutionKeys,
            color: "#9C27B0"
          },
          {
            id: 3,
            title: "Oversized Silhouettes",
            growth: "+15%",
            description: "Loose-fitting clothing and oversized proportions dominating casual wear",
            platforms: ["Instagram", "TikTok"],
            demographics: "18-35 age group, urban centers",
            keywords: ["oversized", "baggy", "loose-fit", "comfort", "streetwear"],
            sentiment: "Positive",
            evolutionKey: "oversized" as TrendEvolutionKeys,
            color: "#2196F3"
          },
          {
            id: 4,
            title: "Dopamine Dressing",
            growth: "+22%",
            description: "Vibrant colors and playful patterns to boost mood and express joy",
            platforms: ["Instagram", "Pinterest", "TikTok"],
            demographics: "18-40 age group, fashion-forward consumers",
            keywords: ["colorful", "vibrant", "playful", "mood-boosting", "expressive"],
            sentiment: "Very Positive",
            evolutionKey: "dopamine" as TrendEvolutionKeys,
            color: "#FF9800"
          },
          {
            id: 5,
            title: "Genderless Fashion",
            growth: "+20%",
            description: "Gender-neutral clothing challenging traditional fashion boundaries",
            platforms: ["Instagram", "TikTok", "Pinterest"],
            demographics: "18-30 age group, urban areas",
            keywords: ["genderless", "unisex", "gender-neutral", "inclusive", "fluid"],
            sentiment: "Very Positive",
            evolutionKey: "genderless" as TrendEvolutionKeys,
            color: "#607D8B"
          },
          {
            id: 6,
            title: "Craftcore Aesthetic",
            growth: "+19%",
            description: "Handmade, artisanal elements and traditional craftsmanship in modern fashion",
            platforms: ["Instagram", "Pinterest"],
            demographics: "25-45 age group, creative professionals",
            keywords: ["handmade", "artisanal", "crochet", "patchwork", "craftsmanship"],
            sentiment: "Positive",
            evolutionKey: "craftcore" as TrendEvolutionKeys,
            color: "#795548"
          },
          {
            id: 7,
            title: "Digital Fashion",
            growth: "+28%",
            description: "Virtual clothing and digital-only fashion items for online personas",
            platforms: ["Instagram", "TikTok"],
            demographics: "16-28 age group, tech-savvy consumers",
            keywords: ["virtual", "digital", "NFT", "metaverse", "avatar"],
            sentiment: "Very Positive",
            evolutionKey: "digital" as TrendEvolutionKeys,
            color: "#673AB7"
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
                
                <TrendEvolutionChart 
                  data={trendEvolutionData[trend.evolutionKey]} 
                  title="6-Month Evolution" 
                  color={trend.color}
                  height={180}
                />
                
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
                
                <div className="pt-2">
                  <Link 
                    href={`/trends/${trend.id}`} 
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    View detailed analysis
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
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
