'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, RefreshCw, ChevronRight, CheckCircle2, Plus } from 'lucide-react';
import { SetupData } from '@/types/planner';

export default function AIAdvisorPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<SetupData | null>(null);
  const [moodboardContext, setMoodboardContext] = useState<string | null>(null);
  const [creativeContext, setCreativeContext] = useState<string>('');
  
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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Try new unified format first
      const creativeDataRaw = window.localStorage.getItem('olawave_creative_data');
      if (creativeDataRaw) {
        const creativeData = JSON.parse(creativeDataRaw);
        const contextParts: string[] = [];
        
        if (creativeData.moodboardImages?.length > 0) {
          contextParts.push(`User moodboard: ${creativeData.moodboardImages.length} reference images`);
        }
        
        if (creativeData.pinterestBoards?.length > 0) {
          const boardNames = creativeData.pinterestBoards.map((b: any) => b.name).join(', ');
          contextParts.push(`Pinterest boards: ${boardNames}`);
        }
        
        if (creativeData.keyColors?.length > 0) {
          contextParts.push(`Key colors: ${creativeData.keyColors.join(', ')}`);
        }
        
        if (creativeData.keyTrends?.length > 0) {
          contextParts.push(`Key trends: ${creativeData.keyTrends.join(', ')}`);
        }
        
        if (creativeData.keyItems?.length > 0) {
          contextParts.push(`Key items: ${creativeData.keyItems.join(', ')}`);
        }
        
        setCreativeContext(contextParts.join('. '));
      } else {
        // Fallback to old format
        const raw = window.localStorage.getItem('olawave_moodboard_summary');
        if (!raw) return;
        const parsed = JSON.parse(raw) as { count?: number; names?: string[] };
        if (!parsed || !parsed.count) return;

        const names = parsed.names?.slice(0, 10) || [];
        const summaryText = `User moodboard contains ${parsed.count} image references. Example filenames or labels: ${names.join(", ")}.`;
        setMoodboardContext(summaryText);
      }
    } catch (e) {
      // ignore parse/storage errors
    }
  }, []);

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

  const handleNextStep = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate range plan with AI
      setIsGenerating(true);

      try {
        const response = await fetch('/api/ai/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetConsumer:
              formData.targetConsumer === 'custom'
                ? formData.customTargetConsumer
                : formData.targetConsumer,
            season:
              formData.season === 'custom'
                ? formData.customSeason
                : formData.season,
            skuCount:
              formData.skuCount === 'custom'
                ? formData.customSkuCount
                : formData.skuCount,
            priceMin: formData.priceMin,
            priceMax: formData.priceMax,
            categories: formData.categories,
            location: 'Shoreditch', // MVP fijo
            userMoodboardContext: creativeContext || moodboardContext,
          }),
        });

        if (!response.ok) throw new Error('Failed to generate plan');

        const planData = await response.json();
        setGeneratedPlan(planData as SetupData);
        setShowResults(true);
      } catch (error) {
        console.error(error);
        alert('Error generating plan. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleSaveToPlanner = async () => {
    if (!generatedPlan) return;

    try {
      const response = await fetch('/api/planner/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${
            formData.season === 'custom'
              ? formData.customSeason
              : formData.season
          } Collection`,
          description: `Generated for ${formData.targetConsumer}`,
          season: formData.season,
          location: 'Shoreditch',
          setup_data: generatedPlan,
        }),
      });

      if (!response.ok) throw new Error('Failed to save plan');

      const newPlan = await response.json();
      router.push(`/planner/${newPlan.id}`);
    } catch (error) {
      console.error(error);
      alert('Error saving plan');
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
    setGeneratedPlan(null);
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
    <div className="flex flex-col gap-6 max-w-5xl mx-auto px-4 py-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold">
            2
          </div>
          <div>
            <h3 className="font-semibold">Step 2: Strategy</h3>
            <p className="text-sm text-muted-foreground">Define your collection framework</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Generated
        </Badge>
      </div>

      {/* Context from Block 1 */}
      {(creativeContext || moodboardContext) && (
        <div className="bg-gradient-to-r from-pink-50/50 to-purple-50/50 rounded-lg p-4 border border-pink-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-sm">Using your creative inspiration</span>
          </div>
          <p className="text-sm text-muted-foreground pl-8">
            {creativeContext || moodboardContext}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Collection Advisor
        </h1>
        <p className="text-muted-foreground">
          Define your collection parameters and let AI generate your strategic framework.
        </p>
      </div>

      {/* Collection Plan Section */}
      <div className="grid gap-6">
        <Card>
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
                            {generatedPlan?.expectedSkus ||
                              (formData.skuCount === 'custom'
                                ? formData.customSkuCount
                                : formData.skuCount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Optimized SKUs
                          </div>
                        </div>
                        <div className="bg-background p-4 rounded-md text-center">
                          <div className="text-2xl font-bold">
                            €{generatedPlan?.avgPriceTarget ?? formData.priceMin}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Avg Price Target
                          </div>
                        </div>
                        <div className="bg-background p-4 rounded-md text-center">
                          <div className="text-2xl font-bold">
                            {generatedPlan?.productFamilies?.length ??
                              formData.categories.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Product Families
                          </div>
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
                        <h4 className="text-sm font-medium mb-3">
                          Optimized Product Mix (AI Generated)
                        </h4>
                        <div className="space-y-3">
                          {generatedPlan?.productFamilies?.map((family) => (
                            <div key={family.name} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{family.name}</span>
                                <span>{family.percentage}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary rounded-full h-2"
                                  style={{ width: `${family.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
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
                    <Button onClick={handleSaveToPlanner} className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Save & Open Planner
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
