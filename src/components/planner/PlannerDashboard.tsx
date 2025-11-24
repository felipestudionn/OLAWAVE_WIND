"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CollectionPlan } from "@/types/planner";
import { CollectionBuilder } from './CollectionBuilder';

interface PlannerDashboardProps {
  plan: CollectionPlan;
}

export function PlannerDashboard({ plan }: PlannerDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("builder");
  const setupData = plan.setup_data;

  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
            3
          </div>
          <div>
            <h3 className="font-semibold">Step 3: Execution</h3>
            <p className="text-sm text-muted-foreground">Build your SKU-level collection plan</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Optimized
        </Badge>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border rounded-xl mb-6">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/ai-advisor')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Strategy
              </Button>
              <div className="border-l pl-4">
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {plan.name}
                </h1>
                {plan.description && (
                  <p className="text-slate-600 text-sm">{plan.description}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Season: {plan.season || "N/A"} · Location: {plan.location || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="builder">Constructor</TabsTrigger>
            <TabsTrigger value="strategic">Strategic Dashboard</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            {/* Full Collection Builder with SKU table */}
            <CollectionBuilder 
              setupData={setupData}
              collectionPlanId={plan.id}
            />
            
            {/* Collection Framework Summary */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Collection Framework</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Strategic parameters from AI Advisor (Block 2)
                  </p>
                  <div className="grid gap-4 md:grid-cols-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">Expected SKUs</p>
                      <p className="text-xl font-semibold">{setupData.expectedSkus}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">Drops</p>
                      <p className="text-xl font-semibold">{setupData.dropsCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">Target Margin</p>
                      <p className="text-xl font-semibold">{setupData.targetMargin}%</p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">Total Sales Target</p>
                      <p className="text-xl font-semibold">€{setupData.totalSalesTarget.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">Average Price Target</p>
                      <p className="text-xl font-semibold">€{setupData.avgPriceTarget}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">Price Range</p>
                      <p className="text-sm font-medium">
                        €{setupData.minPrice} 
                        <span className="text-slate-400 px-1">→</span>
                        €{setupData.maxPrice}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Monthly Distribution</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Seasonality profile for this collection (sum = 100).
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
                    {setupData.monthlyDistribution.map((value, index) => (
                      <div
                        key={index}
                        className="space-y-1 rounded-md border bg-background p-2 flex flex-col items-start"
                      >
                        <span className="text-[10px] uppercase text-slate-500">
                          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][index]}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-semibold text-sm">{value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Families Snapshot</h2>
                  <div className="space-y-2 text-sm">
                    {setupData.productFamilies.map((family) => (
                      <div key={family.name} className="flex items-center justify-between">
                        <span>{family.name}</span>
                        <span className="font-medium">{family.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Product Types Mix</h2>
                  <div className="space-y-2 text-sm">
                    {setupData.productTypeSegments.map((seg) => (
                      <div key={seg.type} className="flex items-center justify-between">
                        <span>{seg.type}</span>
                        <span className="font-medium">{seg.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strategic" className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Product Families</h2>
              <div className="space-y-3">
                {setupData.productFamilies.map((family) => (
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

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Price Segments</h2>
              <div className="space-y-3 text-sm">
                {setupData.priceSegments.map((seg) => (
                  <div key={seg.name} className="flex justify-between">
                    <div>
                      <p className="font-medium">{seg.name}</p>
                      <p className="text-xs text-slate-500">
                        €{seg.minPrice} - €{seg.maxPrice}
                      </p>
                    </div>
                    <p className="font-medium">{seg.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Product Types</h2>
              <div className="space-y-2 text-sm">
                {setupData.productTypeSegments.map((seg) => (
                  <div key={seg.type} className="flex justify-between">
                    <span>{seg.type}</span>
                    <span>{seg.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historical" className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-2">Historical View</h2>
              <p className="text-sm text-muted-foreground">
                Historical performance dashboards will be added here once sales and
                buy-in data are available.
              </p>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}
