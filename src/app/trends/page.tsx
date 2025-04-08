import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Filter } from 'lucide-react';

export default function TrendsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trend Analysis</h1>
          <p className="text-muted-foreground">
            Detailed analysis of current fashion trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="h-8">
            Export Report
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6">
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
            description: "Loose-fitting and oversized clothing gaining popularity across genders",
            platforms: ["Instagram", "TikTok", "Pinterest"],
            demographics: "18-35 age group, urban centers",
            keywords: ["oversized", "baggy", "loose-fit", "comfort", "relaxed"],
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
        ].map((trend) => (
          <Card key={trend.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-xl font-bold">{trend.title}</CardTitle>
                <CardDescription className="mt-1">{trend.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="font-bold text-green-500">{trend.growth}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Popular Platforms</h3>
                  <div className="flex flex-wrap gap-1">
                    {trend.platforms.map((platform) => (
                      <span 
                        key={platform} 
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Target Demographics</h3>
                  <p className="text-sm text-muted-foreground">{trend.demographics}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Sentiment Analysis</h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    trend.sentiment.includes("Very") ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {trend.sentiment}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium">Related Keywords</h3>
                <div className="flex flex-wrap gap-1">
                  {trend.keywords.map((keyword) => (
                    <span 
                      key={keyword} 
                      className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">View Detailed Analysis</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
