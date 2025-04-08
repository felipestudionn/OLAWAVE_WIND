'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, TrendingUp, ShoppingBag, ArrowRight, MessageSquare, RefreshCw, Download } from 'lucide-react';
import { TrendEvolutionChart } from "@/components/charts/trend-evolution-chart";

export default function AIAdvisorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState("collection");

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-4 py-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">AI Fashion Advisor</h1>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          Get AI-powered strategic recommendations for your fashion business based on real-time trend analysis.
        </p>
      </div>

      {/* Section Navigation */}
      <div className="flex space-x-2 border-b pb-4">
        <Button 
          variant={activeSection === "collection" ? "default" : "outline"} 
          onClick={() => setActiveSection("collection")}
          className="flex items-center"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Collection Plan
        </Button>
        <Button 
          variant={activeSection === "inseason" ? "default" : "outline"} 
          onClick={() => setActiveSection("inseason")}
          className="flex items-center"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          In-Season Opportunities
        </Button>
        <Button 
          variant={activeSection === "forecast" ? "default" : "outline"} 
          onClick={() => setActiveSection("forecast")}
          className="flex items-center"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Trend Forecast
        </Button>
      </div>

      {/* Collection Plan Section */}
      {activeSection === "collection" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Collection Plan Proposal</CardTitle>
              <CardDescription>
                AI-generated collection plan based on upcoming seasonal trends and market analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Key Recommendations</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Focus on sustainable materials for Spring/Summer collection</li>
                  <li>Incorporate oversized silhouettes in outerwear</li>
                  <li>Develop a capsule collection of versatile basics</li>
                  <li>Introduce more vibrant color palette for accessories</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Suggested Timeline</h3>
                <div className="rounded-md border p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Design Phase</span>
                      <span className="text-sm text-muted-foreground">8 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Production</span>
                      <span className="text-sm text-muted-foreground">12 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Marketing</span>
                      <span className="text-sm text-muted-foreground">6 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Launch</span>
                      <span className="text-sm text-muted-foreground">2 weeks</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Plan
              </Button>
              <Button size="sm">
                View Detailed Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Planning</CardTitle>
              <CardDescription>
                Customize your collection plan with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4 bg-muted/50">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Ask AI for specific recommendations</h3>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        What color palette would work best for a sustainable summer collection targeting Gen Z?
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary p-2">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          For a sustainable summer collection targeting Gen Z, I recommend a palette of:
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className="bg-[#94A3B8]">Muted Sage</Badge>
                          <Badge className="bg-[#F59E0B]">Amber Yellow</Badge>
                          <Badge className="bg-[#3B82F6]">Ocean Blue</Badge>
                          <Badge className="bg-[#10B981]">Eco Green</Badge>
                          <Badge className="bg-[#EC4899]">Soft Coral</Badge>
                        </div>
                        <p className="text-sm mt-2">
                          These colors reflect natural elements while maintaining vibrancy that appeals to younger consumers. They also work well with sustainable dyes and materials.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md border p-4">
                <input 
                  type="text" 
                  placeholder="Ask about your collection plan..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* In-Season Opportunities Section */}
      {activeSection === "inseason" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>In-Season Product Opportunities</CardTitle>
              <CardDescription>
                Identify emerging trends and product opportunities for immediate action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Hot Right Now</h3>
                <div className="grid gap-3">
                  {[
                    {
                      name: "Oversized Linen Shirts",
                      growth: "+42%",
                      category: "Clothing",
                      timeframe: "Last 2 weeks"
                    },
                    {
                      name: "Platform Sandals",
                      growth: "+38%",
                      category: "Shoes",
                      timeframe: "Last 2 weeks"
                    },
                    {
                      name: "Crochet Bags",
                      growth: "+35%",
                      category: "Bags",
                      timeframe: "Last 2 weeks"
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.category} • {item.timeframe}</div>
                      </div>
                      <Badge className="bg-green-600">{item.growth}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Restocking Recommendations</h3>
                <div className="rounded-md border p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cropped Cardigans</span>
                      <Badge variant="outline" className="text-amber-500 border-amber-500">Medium Priority</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Wide-Leg Jeans</span>
                      <Badge variant="outline" className="text-red-500 border-red-500">High Priority</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Bucket Hats</span>
                      <Badge variant="outline" className="text-green-500 border-green-500">Low Priority</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button size="sm">
                View All Opportunities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time Trend Shifts</CardTitle>
              <CardDescription>
                Monitor how trends are evolving in real-time to make quick decisions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64">
                <TrendEvolutionChart
                  data={[
                    { month: "Week 1", value: 30 },
                    { month: "Week 2", value: 35 },
                    { month: "Week 3", value: 45 },
                    { month: "Week 4", value: 60 },
                    { month: "Week 5", value: 75 },
                    { month: "Week 6", value: 82 }
                  ]}
                  title="Crochet Accessories Trend Growth"
                  color="#F59E0B"
                  height={240}
                />
              </div>

              <div className="rounded-md border p-4 bg-muted/50">
                <h3 className="text-sm font-medium mb-2">AI Recommendation</h3>
                <p className="text-sm text-muted-foreground">
                  Based on the rapid growth of crochet accessories, we recommend expediting production of crochet bags and hats. Consider a limited-edition collection to capitalize on this trend before it peaks in approximately 3-4 weeks.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Updating Recommendations...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Trend Data
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Trend Forecast Section */}
      {activeSection === "forecast" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Trends & Hero Product Forecast</CardTitle>
              <CardDescription>
                Long-term trend predictions and hero product recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Upcoming Trends (6-12 Months)</h3>
                <div className="grid gap-3">
                  {[
                    {
                      name: "Digital Fashion Integration",
                      confidence: "92%",
                      impact: "High",
                      timeframe: "Q3 2025"
                    },
                    {
                      name: "Adaptive Clothing",
                      confidence: "88%",
                      impact: "Medium",
                      timeframe: "Q4 2025"
                    },
                    {
                      name: "Biodegradable Accessories",
                      confidence: "85%",
                      impact: "High",
                      timeframe: "Q2 2025"
                    }
                  ].map((item, i) => (
                    <div key={i} className="rounded-md border p-3">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium">{item.name}</div>
                        <Badge variant="outline">{item.timeframe}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Confidence: {item.confidence}</span>
                        <span>Market Impact: {item.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Predicted Hero Products</h3>
                <div className="rounded-md border p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Modular Convertible Jacket</span>
                        <Badge className="bg-primary">Top Pick</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Versatile jacket with detachable elements that can transform into different styles
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Tech-Integrated Handbag</span>
                        <Badge className="bg-primary">Top Pick</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Smart bag with charging capabilities and digital display for customization
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Climate-Adaptive Footwear</span>
                        <Badge className="bg-primary">Top Pick</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Shoes that adjust to temperature changes with breathable/insulating materials
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Forecast
              </Button>
              <Button size="sm">
                View Detailed Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Innovation Spotlight</CardTitle>
              <CardDescription>
                Disruptive concepts and technologies reshaping fashion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                <h3 className="text-base font-medium mb-2 text-primary">Virtual Fitting Room AI</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  AI-powered virtual fitting room technology that creates hyper-realistic simulations of how garments will look and move on individual customers.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-primary/10">AR/VR</Badge>
                  <Badge variant="outline" className="bg-primary/10">AI</Badge>
                  <Badge variant="outline" className="bg-primary/10">E-commerce</Badge>
                </div>
                <div className="mt-3 text-xs">
                  <span className="text-primary font-medium">Adoption Timeline:</span> 12-18 months
                </div>
              </div>

              <div className="rounded-md border p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <h3 className="text-base font-medium mb-2 text-green-600">Circular Fashion Marketplace</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Blockchain-based platform that tracks the lifecycle of garments, facilitating resale, recycling, and upcycling to extend product lifespan.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20">Blockchain</Badge>
                  <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20">Sustainability</Badge>
                  <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20">Marketplace</Badge>
                </div>
                <div className="mt-3 text-xs">
                  <span className="text-green-600 font-medium">Adoption Timeline:</span> 6-12 months
                </div>
              </div>

              <div className="rounded-md border p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                <h3 className="text-base font-medium mb-2 text-amber-600">Mood-Responsive Textiles</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Smart fabrics that change color or pattern based on the wearer's mood, body temperature, or environmental conditions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-amber-600/10 text-amber-600 border-amber-600/20">Smart Textiles</Badge>
                  <Badge variant="outline" className="bg-amber-600/10 text-amber-600 border-amber-600/20">Wearable Tech</Badge>
                  <Badge variant="outline" className="bg-amber-600/10 text-amber-600 border-amber-600/20">Innovation</Badge>
                </div>
                <div className="mt-3 text-xs">
                  <span className="text-amber-600 font-medium">Adoption Timeline:</span> 18-24 months
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate More Innovations
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
