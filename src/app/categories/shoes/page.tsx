import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Footprints } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function ShoesCategoryPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-4 py-4">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Shoe Trends</h1>
        <p className="text-muted-foreground max-w-3xl">
          Explore the latest trends in footwear across various platforms and demographics.
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
            title: "Chunky Sneakers",
            growth: "+18%",
            description: "Oversized, platform sneakers continuing their popularity across demographics",
            platforms: ["Instagram", "TikTok"],
            demographics: "16-30 age group, urban areas",
            keywords: ["chunky", "platform", "sneakers", "streetwear", "retro"],
            sentiment: "Positive"
          },
          {
            id: 2,
            title: "Sustainable Footwear",
            growth: "+27%",
            description: "Eco-friendly materials and production methods in shoe manufacturing",
            platforms: ["Instagram", "Pinterest"],
            demographics: "25-45 age group, environmentally conscious consumers",
            keywords: ["sustainable", "eco-friendly", "recycled", "vegan", "ethical"],
            sentiment: "Very Positive"
          },
          {
            id: 3,
            title: "Minimalist Designs",
            growth: "+12%",
            description: "Clean, simple shoe designs with focus on versatility and comfort",
            platforms: ["Pinterest", "Instagram"],
            demographics: "25-40 age group, professionals",
            keywords: ["minimalist", "clean", "versatile", "neutral", "timeless"],
            sentiment: "Positive"
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
