import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Filter, Instagram, Search, ChevronRight } from 'lucide-react';
import { TrendEvolutionChart } from "@/components/charts/trend-evolution-chart";
import Link from "next/link";

export default function ShoesCategoryPage() {
  // Sample trend evolution data for each trend
  const trendEvolutionData = {
    "chunky": [
      { month: "Jan", value: 38 },
      { month: "Feb", value: 42 },
      { month: "Mar", value: 45 },
      { month: "Apr", value: 50 },
      { month: "May", value: 55 },
      { month: "Jun", value: 58 }
    ],
    "sustainable": [
      { month: "Jan", value: 30 },
      { month: "Feb", value: 35 },
      { month: "Mar", value: 40 },
      { month: "Apr", value: 45 },
      { month: "May", value: 52 },
      { month: "Jun", value: 58 }
    ],
    "retro": [
      { month: "Jan", value: 45 },
      { month: "Feb", value: 50 },
      { month: "Mar", value: 55 },
      { month: "Apr", value: 62 },
      { month: "May", value: 68 },
      { month: "Jun", value: 72 }
    ],
    "minimalist": [
      { month: "Jan", value: 40 },
      { month: "Feb", value: 42 },
      { month: "Mar", value: 45 },
      { month: "Apr", value: 48 },
      { month: "May", value: 50 },
      { month: "Jun", value: 52 }
    ],
    "tech": [
      { month: "Jan", value: 35 },
      { month: "Feb", value: 40 },
      { month: "Mar", value: 48 },
      { month: "Apr", value: 55 },
      { month: "May", value: 62 },
      { month: "Jun", value: 70 }
    ]
  };

  // Type for the evolution data to fix TypeScript error
  type TrendEvolutionKeys = keyof typeof trendEvolutionData;

  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-4 py-4">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Shoe Trends</h1>
        <p className="text-muted-foreground max-w-3xl">
          Analysis of current footwear trends across platforms, revealing patterns and consumer preferences in shoes.
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
            title: "Chunky Sneakers",
            growth: "+20%",
            description: "Oversized, platform sneakers with exaggerated soles continue to dominate casual footwear",
            platforms: ["Instagram", "TikTok"],
            demographics: "18-30 age group, urban fashion enthusiasts",
            keywords: ["chunky", "platform", "dad shoes", "statement", "streetwear"],
            sentiment: "Positive",
            evolutionKey: "chunky" as TrendEvolutionKeys,
            color: "#FF5722"
          },
          {
            id: 2,
            title: "Sustainable Footwear",
            growth: "+28%",
            description: "Eco-friendly shoes made from recycled and sustainable materials gaining significant traction",
            platforms: ["Instagram", "Pinterest", "Google"],
            demographics: "25-40 age group, environmentally conscious consumers",
            keywords: ["sustainable", "eco-friendly", "recycled", "vegan", "ethical"],
            sentiment: "Very Positive",
            evolutionKey: "sustainable" as TrendEvolutionKeys,
            color: "#4CAF50"
          },
          {
            id: 3,
            title: "Retro Sneaker Revival",
            growth: "+27%",
            description: "Classic sneaker styles from the 80s and 90s making a strong comeback",
            platforms: ["Instagram", "TikTok"],
            demographics: "16-35 age group, sneaker collectors and enthusiasts",
            keywords: ["retro", "vintage", "classic", "heritage", "throwback"],
            sentiment: "Very Positive",
            evolutionKey: "retro" as TrendEvolutionKeys,
            color: "#9C27B0"
          },
          {
            id: 4,
            title: "Minimalist Designs",
            growth: "+12%",
            description: "Clean, simple shoe designs with minimal branding and neutral colors",
            platforms: ["Instagram", "Pinterest"],
            demographics: "25-45 age group, professionals and minimalists",
            keywords: ["minimalist", "clean", "simple", "versatile", "timeless"],
            sentiment: "Positive",
            evolutionKey: "minimalist" as TrendEvolutionKeys,
            color: "#607D8B"
          },
          {
            id: 5,
            title: "Tech-Integrated Footwear",
            growth: "+35%",
            description: "Smart shoes with integrated technology for performance tracking and enhanced comfort",
            platforms: ["Instagram", "TikTok", "Google"],
            demographics: "18-40 age group, tech enthusiasts and athletes",
            keywords: ["smart shoes", "tech", "performance", "connected", "innovative"],
            sentiment: "Very Positive",
            evolutionKey: "tech" as TrendEvolutionKeys,
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
