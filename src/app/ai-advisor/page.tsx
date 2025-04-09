'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, TrendingUp, ShoppingBag, ArrowRight, MessageSquare, RefreshCw, Download, ChevronRight, CheckCircle2, Plus, ImageIcon } from 'lucide-react';
import { TrendEvolutionChart } from "@/components/charts/trend-evolution-chart";

export default function AIAdvisorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState("collection");
  
  // Range Plan Form State
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    targetConsumer: '',
    customTargetConsumer: '',
    season: '',
    customSeason: '',
    skuCount: '',
    customSkuCount: '',
    priceMin: '',
    priceMax: '',
    customPriceNotes: '',
    categories: [] as string[],
    customCategory: '',
  });
  
  // Custom input visibility states
  const [showCustomInputs, setShowCustomInputs] = useState({
    consumer: false,
    season: false,
    skuCount: false,
    price: false,
    category: false
  });

  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category]
        };
      }
    });
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate range plan
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setShowResults(true);
      }, 2000);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFormData({
      targetConsumer: '',
      customTargetConsumer: '',
      season: '',
      customSeason: '',
      skuCount: '',
      customSkuCount: '',
      priceMin: '',
      priceMax: '',
      customPriceNotes: '',
      categories: [],
      customCategory: '',
    });
    setShowCustomInputs({
      consumer: false,
      season: false,
      skuCount: false,
      price: false,
      category: false
    });
    setShowResults(false);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const toggleCustomInput = (field: 'consumer' | 'season' | 'skuCount' | 'price' | 'category') => {
    // Toggle the visibility state for the custom input
    setShowCustomInputs(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    
    // Update form data based on which custom input was toggled
    if (field === 'consumer') {
      if (!showCustomInputs.consumer) {
        // If we're showing the custom input, set targetConsumer to 'custom'
        setFormData(prev => ({
          ...prev,
          targetConsumer: 'custom'
        }));
      } else {
        // If we're hiding the custom input, reset the values
        setFormData(prev => ({
          ...prev,
          targetConsumer: '',
          customTargetConsumer: ''
        }));
      }
    } else if (field === 'season') {
      if (!showCustomInputs.season) {
        setFormData(prev => ({
          ...prev,
          season: 'custom'
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          season: '',
          customSeason: ''
        }));
      }
    } else if (field === 'skuCount') {
      if (!showCustomInputs.skuCount) {
        setFormData(prev => ({
          ...prev,
          skuCount: 'custom'
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          skuCount: '',
          customSkuCount: ''
        }));
      }
    } else if (field === 'price') {
      // For price, we just toggle the visibility of custom notes
      if (showCustomInputs.price) {
        setFormData(prev => ({
          ...prev,
          customPriceNotes: ''
        }));
      }
    } else if (field === 'category') {
      // For category, we just toggle the visibility of custom category input
      if (showCustomInputs.category) {
        setFormData(prev => ({
          ...prev,
          customCategory: ''
        }));
      }
    }
  };

  const addCustomCategory = () => {
    if (formData.customCategory.trim() !== '') {
      // Use the functional state update pattern to ensure we're working with the latest state
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, prev.customCategory.trim()],
        customCategory: ''
      }));
    }
  };

  // Form steps content
  const formSteps = [
    {
      title: "Target Consumer",
      description: "Who is your target customer?",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {["Gen Z", "Millennials", "Gen X", "Baby Boomers"].map((consumer) => (
              <Button
                key={consumer}
                variant={formData.targetConsumer === consumer ? "default" : "outline"}
                className="justify-start"
                onClick={() => {
                  handleInputChange("targetConsumer", consumer);
                  if (showCustomInputs.consumer) setShowCustomInputs({...showCustomInputs, consumer: false});
                }}
              >
                {consumer}
              </Button>
            ))}
            <Button
              variant={showCustomInputs.consumer ? "default" : "outline"}
              className="justify-start col-span-2"
              onClick={() => toggleCustomInput('consumer')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Custom Target Consumer
            </Button>
          </div>
          
          {showCustomInputs.consumer && (
            <div className="mt-4 p-4 border rounded-md">
              <label className="text-sm font-medium mb-2 block">Describe your target consumer</label>
              <textarea
                className="w-full p-2 border rounded-md min-h-[100px]"
                placeholder="E.g., Fashion-forward urban professionals aged 25-35 with high disposable income and interest in sustainable fashion..."
                value={formData.customTargetConsumer}
                onChange={(e) => handleInputChange("customTargetConsumer", e.target.value)}
              />
            </div>
          )}
        </div>
      )
    },
    {
      title: "Season / Selling Period",
      description: "Which season are you planning for?",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {["Spring/Summer 2026", "Fall/Winter 2025/26", "Resort 2026", "Holiday 2025"].map((season) => (
              <Button
                key={season}
                variant={formData.season === season ? "default" : "outline"}
                className="justify-start"
                onClick={() => {
                  handleInputChange("season", season);
                  if (showCustomInputs.season) setShowCustomInputs({...showCustomInputs, season: false});
                }}
              >
                {season}
              </Button>
            ))}
            <Button
              variant={showCustomInputs.season ? "default" : "outline"}
              className="justify-start col-span-2"
              onClick={() => toggleCustomInput('season')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Custom Season / Period
            </Button>
          </div>
          
          {showCustomInputs.season && (
            <div className="mt-4 p-4 border rounded-md">
              <label className="text-sm font-medium mb-2 block">Specify your custom season or selling period</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="E.g., Back to School 2025, Festival Season 2026..."
                value={formData.customSeason}
                onChange={(e) => handleInputChange("customSeason", e.target.value)}
              />
            </div>
          )}
        </div>
      )
    },
    {
      title: "Number of SKUs",
      description: "How many products do you plan to include?",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {["10-20", "21-50", "51-100", "100+"].map((count) => (
              <Button
                key={count}
                variant={formData.skuCount === count ? "default" : "outline"}
                className="justify-start"
                onClick={() => {
                  handleInputChange("skuCount", count);
                  if (showCustomInputs.skuCount) setShowCustomInputs({...showCustomInputs, skuCount: false});
                }}
              >
                {count} SKUs
              </Button>
            ))}
            <Button
              variant={showCustomInputs.skuCount ? "default" : "outline"}
              className="justify-start col-span-2"
              onClick={() => toggleCustomInput('skuCount')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Custom SKU Count
            </Button>
          </div>
          
          {showCustomInputs.skuCount && (
            <div className="mt-4 p-4 border rounded-md">
              <label className="text-sm font-medium mb-2 block">Specify exact number of SKUs</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                placeholder="Enter exact number of SKUs"
                value={formData.customSkuCount}
                onChange={(e) => handleInputChange("customSkuCount", e.target.value)}
              />
            </div>
          )}
        </div>
      )
    },
    {
      title: "Price Points",
      description: "What is your price range?",
      content: (
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="w-1/2">
              <label className="text-sm font-medium mb-1 block">Minimum Price ($)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                placeholder="Min Price"
                value={formData.priceMin}
                onChange={(e) => handleInputChange("priceMin", e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm font-medium mb-1 block">Maximum Price ($)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                placeholder="Max Price"
                value={formData.priceMax}
                onChange={(e) => handleInputChange("priceMax", e.target.value)}
              />
            </div>
          </div>
          
          <Button
            variant={showCustomInputs.price ? "default" : "outline"}
            className="justify-start w-full mt-2"
            onClick={() => toggleCustomInput('price')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Price Strategy Notes
          </Button>
          
          {showCustomInputs.price && (
            <div className="mt-2 p-4 border rounded-md">
              <label className="text-sm font-medium mb-2 block">Additional price strategy notes</label>
              <textarea
                className="w-full p-2 border rounded-md min-h-[80px]"
                placeholder="E.g., Premium pricing for sustainable items, entry-level pricing for basics, tiered pricing strategy..."
                value={formData.customPriceNotes}
                onChange={(e) => handleInputChange("customPriceNotes", e.target.value)}
              />
            </div>
          )}
        </div>
      )
    },
    {
      title: "Product Categories",
      description: "Which product categories do you want to include?",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {["Tops", "Bottoms", "Dresses", "Outerwear", "Footwear", "Accessories", "Activewear", "Denim"].map((category) => (
              <Button
                key={category}
                variant={formData.categories.includes(category) ? "default" : "outline"}
                className="justify-start"
                onClick={() => handleCategoryToggle(category)}
              >
                {formData.categories.includes(category) && (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                {category}
              </Button>
            ))}
          </div>
          
          <div className="mt-4 p-4 border rounded-md">
            <label className="text-sm font-medium mb-2 block">Add custom category</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-md"
                placeholder="E.g., Sustainable Swimwear, Occasion Wear..."
                value={formData.customCategory}
                onChange={(e) => handleInputChange("customCategory", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomCategory();
                  }
                }}
              />
              <Button 
                onClick={addCustomCategory}
                disabled={!formData.customCategory.trim()}
              >
                Add
              </Button>
            </div>
            
            {formData.categories.some(cat => !["Tops", "Bottoms", "Dresses", "Outerwear", "Footwear", "Accessories", "Activewear", "Denim"].includes(cat)) && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">Custom Categories:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.categories.filter(cat => 
                    !["Tops", "Bottoms", "Dresses", "Outerwear", "Footwear", "Accessories", "Activewear", "Denim"].includes(cat)
                  ).map((cat, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="flex items-center gap-1 bg-primary/10"
                    >
                      {cat}
                      <button 
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCategoryToggle(cat)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

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
        <div className="flex items-center justify-between">
          <div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Refresh Insights'}
            </Button>
            <Button variant="outline" asChild>
              <a href="/ai-advisor/svg-gallery">
                <ImageIcon className="mr-2 h-4 w-4" />
                SVG Gallery
              </a>
            </Button>
          </div>
        </div>
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
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Collection Plan Proposal</CardTitle>
              <CardDescription>
                Build a strategic range plan based on trend analysis and your specific requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showResults ? (
                <div className="space-y-6">
                  {/* Progress Steps */}
                  <div className="flex justify-between mb-6">
                    {formSteps.map((step, index) => (
                      <div 
                        key={index} 
                        className={`flex flex-col items-center ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
                        style={{ width: `${100 / formSteps.length}%` }}
                      >
                        <div className={`rounded-full w-8 h-8 flex items-center justify-center mb-2 ${index <= currentStep ? 'bg-primary text-white' : 'bg-muted'}`}>
                          {index < currentStep ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="text-xs text-center">{step.title}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Current Step Content */}
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">{formSteps[currentStep].title}</h3>
                    <p className="text-muted-foreground mb-4">{formSteps[currentStep].description}</p>
                    {formSteps[currentStep].content}
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevStep}
                      disabled={currentStep === 0}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      disabled={
                        (currentStep === 0 && !formData.targetConsumer) ||
                        (currentStep === 0 && formData.targetConsumer === 'custom' && !formData.customTargetConsumer) ||
                        (currentStep === 1 && !formData.season) ||
                        (currentStep === 1 && formData.season === 'custom' && !formData.customSeason) ||
                        (currentStep === 2 && !formData.skuCount) ||
                        (currentStep === 2 && formData.skuCount === 'custom' && !formData.customSkuCount) ||
                        (currentStep === 3 && (!formData.priceMin || !formData.priceMax)) ||
                        (currentStep === 4 && formData.categories.length === 0) ||
                        isGenerating
                      }
                    >
                      {currentStep === 4 ? (
                        isGenerating ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Range Plan
                          </>
                        )
                      ) : (
                        <>
                          Next
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Range Plan Results */}
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Range Plan for {formData.season === 'custom' ? formData.customSeason : formData.season}</h3>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {formData.targetConsumer === 'custom' ? 'Custom Audience' : formData.targetConsumer}
                      </Badge>
                    </div>
                    
                    {formData.targetConsumer === 'custom' && (
                      <div className="mb-4 p-3 bg-background rounded-md">
                        <h4 className="text-sm font-medium mb-1">Target Consumer Description:</h4>
                        <p className="text-sm text-muted-foreground">{formData.customTargetConsumer}</p>
                      </div>
                    )}
                    
                    <div className="space-y-6">
                      {/* Summary */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-background p-4 rounded-md text-center">
                          <div className="text-2xl font-bold">
                            {formData.skuCount === 'custom' ? formData.customSkuCount : formData.skuCount}
                          </div>
                          <div className="text-xs text-muted-foreground">Total SKUs</div>
                        </div>
                        <div className="bg-background p-4 rounded-md text-center">
                          <div className="text-2xl font-bold">${formData.priceMin}-${formData.priceMax}</div>
                          <div className="text-xs text-muted-foreground">Price Range</div>
                        </div>
                        <div className="bg-background p-4 rounded-md text-center">
                          <div className="text-2xl font-bold">{formData.categories.length}</div>
                          <div className="text-xs text-muted-foreground">Categories</div>
                        </div>
                      </div>
                      
                      {formData.customPriceNotes && (
                        <div className="mb-4 p-3 bg-background rounded-md">
                          <h4 className="text-sm font-medium mb-1">Price Strategy Notes:</h4>
                          <p className="text-sm text-muted-foreground">{formData.customPriceNotes}</p>
                        </div>
                      )}
                      
                      {/* Category Breakdown */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">Recommended Category Distribution</h4>
                        <div className="space-y-3">
                          {formData.categories.map((category) => {
                            // Generate random percentage for demo
                            const percentage = Math.floor(Math.random() * 30) + 10;
                            return (
                              <div key={category} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{category}</span>
                                  <span>{percentage}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-primary rounded-full h-2" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Trend-Based Recommendations */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">Trend-Based Recommendations</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border rounded-md p-4">
                            <div className="font-medium mb-1">Color Palette</div>
                            <div className="flex gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-[#94A3B8]"></div>
                              <div className="w-6 h-6 rounded-full bg-[#F59E0B]"></div>
                              <div className="w-6 h-6 rounded-full bg-[#3B82F6]"></div>
                              <div className="w-6 h-6 rounded-full bg-[#10B981]"></div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Based on trending colors for {formData.season === 'custom' ? formData.customSeason : formData.season} targeting {formData.targetConsumer === 'custom' ? 'Custom Audience' : formData.targetConsumer}
                            </p>
                          </div>
                          <div className="border rounded-md p-4">
                            <div className="font-medium mb-1">Key Silhouettes</div>
                            <p className="text-xs mb-2">
                              Oversized tops, wide-leg pants, cropped jackets
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Aligned with current platform trends across Instagram and TikTok
                            </p>
                          </div>
                          <div className="border rounded-md p-4">
                            <div className="font-medium mb-1">Materials</div>
                            <p className="text-xs mb-2">
                              Organic cotton, recycled polyester, linen blends
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Sustainable materials trending with {formData.targetConsumer === 'custom' ? 'Custom Audience' : formData.targetConsumer}
                            </p>
                          </div>
                          <div className="border rounded-md p-4">
                            <div className="font-medium mb-1">Must-Have Items</div>
                            <p className="text-xs mb-2">
                              Utility vests, platform sandals, statement accessories
                            </p>
                            <p className="text-xs text-muted-foreground">
                              High-growth items based on cross-platform analysis
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleReset}>
                      Start Over
                    </Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Export Range Plan
                    </Button>
                  </div>
                </div>
              )}
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
