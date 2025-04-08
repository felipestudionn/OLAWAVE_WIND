import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Filter, Instagram, Search, ChevronRight } from 'lucide-react';
import { TrendEvolutionChart } from "@/components/charts/trend-evolution-chart";
import Link from "next/link";

export default function BagsCategoryPage() {
  // Sample trend evolution data for each trend
  const trendEvolutionData = {
    "micro": [
      { month: "Jan", value: 52 },
      { month: "Feb", value: 58 },
      { month: "Mar", value: 65 },
      { month: "Apr", value: 70 },
      { month: "May", value: 75 },
      { month: "Jun", value: 78 }
    ],
    "sustainable": [
      { month: "Jan", value: 35 },
      { month: "Feb", value: 40 },
      { month: "Mar", value: 45 },
      { month: "Apr", value: 52 },
      { month: "May", value: 58 },
      { month: "Jun", value: 65 }
    ],
    "oversized": [
      { month: "Jan", value: 30 },
      { month: "Feb", value: 35 },
      { month: "Mar", value: 42 },
      { month: "Apr", value: 48 },
      { month: "May", value: 55 },
      { month: "Jun", value: 60 }
    ],
    "vintage": [
      { month: "Jan", value: 40 },
      { month: "Feb", value: 45 },
      { month: "Mar", value: 50 },
      { month: "Apr", value: 55 },
      { month: "May", value: 60 },
      { month: "Jun", value: 65 }
    ],
    "multi": [
      { month: "Jan", value: 25 },
      { month: "Feb", value: 30 },
      { month: "Mar", value: 38 },
      { month: "Apr", value: 45 },
      { month: "May", value: 52 },
      { month: "Jun", value: 60 }
    ]
  };

  // Type for the evolution data to fix TypeScript error
  type TrendEvolutionKeys = keyof typeof trendEvolutionData;

  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-4 py-4">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Bag Trends</h1>
        <p className="text-muted-foreground max-w-3xl">
          Analysis of current handbag and accessory trends across platforms, revealing patterns and consumer preferences in bags.
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
            title: "Micro Bags",
            growth: "+26%",
            description: "Ultra-small handbags that prioritize fashion over function continue to dominate luxury trends",
            platforms: ["Instagram", "TikTok", "Pinterest"],
            demographics: "18-35 age group, fashion-forward consumers",
            keywords: ["micro", "mini", "tiny", "statement", "luxury"],
            sentiment: "Very Positive",
            evolutionKey: "micro" as TrendEvolutionKeys,
            color: "#E91E63"
          },
          {
            id: 2,
            title: "Sustainable Bag Materials",
            growth: "+30%",
            description: "Eco-friendly bags made from recycled, vegan, and sustainable materials gaining popularity",
            platforms: ["Instagram", "Pinterest", "Google"],
            demographics: "25-45 age group, environmentally conscious consumers",
            keywords: ["sustainable", "eco-friendly", "recycled", "vegan", "ethical"],
            sentiment: "Very Positive",
            evolutionKey: "sustainable" as TrendEvolutionKeys,
            color: "#4CAF50"
          },
          {
            id: 3,
            title: "Oversized Totes",
            growth: "+18%",
            description: "Large, practical tote bags for everyday use with emphasis on functionality",
            platforms: ["Instagram", "Pinterest"],
            demographics: "25-40 age group, professionals and commuters",
            keywords: ["oversized", "tote", "practical", "everyday", "spacious"],
            sentiment: "Positive",
            evolutionKey: "oversized" as TrendEvolutionKeys,
            color: "#FF9800"
          },
          {
            id: 4,
            title: "Vintage-Inspired Designs",
            growth: "+25%",
            description: "Retro bag styles with modern updates drawing inspiration from past decades",
            platforms: ["Instagram", "Pinterest", "TikTok"],
            demographics: "20-40 age group, vintage enthusiasts",
            keywords: ["vintage", "retro", "heritage", "classic", "nostalgic"],
            sentiment: "Positive",
            evolutionKey: "vintage" as TrendEvolutionKeys,
            color: "#9C27B0"
          },
          {
            id: 5,
            title: "Multi-Functional Bags",
            growth: "+35%",
            description: "Convertible bags that can be worn multiple ways (crossbody, backpack, tote) for versatility",
            platforms: ["Instagram", "TikTok", "Google"],
            demographics: "22-38 age group, practical shoppers",
            keywords: ["convertible", "versatile", "multi-wear", "adaptable", "practical"],
            sentiment: "Very Positive",
            evolutionKey: "multi" as TrendEvolutionKeys,
            color: "#2196F3"
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
