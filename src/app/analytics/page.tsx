import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, PieChart, LineChart, Calendar, Download } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed fashion trend metrics and visualizations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>
              Trend distribution across social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full rounded-md border bg-muted p-2">
              <div className="flex h-full items-center justify-center">
                <PieChart className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Platform Distribution Chart</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs text-muted-foreground">
              <div>
                <div className="h-2 w-full rounded-sm bg-blue-500"></div>
                <span>Instagram</span>
              </div>
              <div>
                <div className="h-2 w-full rounded-sm bg-red-500"></div>
                <span>Pinterest</span>
              </div>
              <div>
                <div className="h-2 w-full rounded-sm bg-purple-500"></div>
                <span>TikTok</span>
              </div>
              <div>
                <div className="h-2 w-full rounded-sm bg-green-500"></div>
                <span>Google</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trend Growth Rate</CardTitle>
            <CardDescription>
              Monthly growth rate of top fashion trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full rounded-md border bg-muted p-2">
              <div className="flex h-full items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Growth Rate Chart</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Trend Performance Over Time</CardTitle>
          <CardDescription>
            Historical performance of top fashion trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full rounded-md border bg-muted p-2">
            <div className="flex h-full items-center justify-center">
              <LineChart className="h-16 w-16 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Trend Timeline Chart</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Demographic Analysis</CardTitle>
            <CardDescription>
              Age and location distribution of trend followers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium">Age Groups</h3>
                <div className="space-y-2">
                  {[
                    { group: "16-24", percentage: 35 },
                    { group: "25-34", percentage: 42 },
                    { group: "35-44", percentage: 15 },
                    { group: "45+", percentage: 8 },
                  ].map((item) => (
                    <div key={item.group} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{item.group}</span>
                        <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>
              Regional trend popularity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: "North America", percentage: 38 },
                { region: "Europe", percentage: 32 },
                { region: "Asia", percentage: 22 },
                { region: "Other Regions", percentage: 8 },
              ].map((item) => (
                <div key={item.region} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{item.region}</span>
                    <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
            <CardDescription>
              Public sentiment towards trending fashion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { sentiment: "Very Positive", percentage: 42, color: "bg-green-500" },
                { sentiment: "Positive", percentage: 35, color: "bg-blue-500" },
                { sentiment: "Neutral", percentage: 15, color: "bg-gray-500" },
                { sentiment: "Negative", percentage: 8, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.sentiment} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{item.sentiment}</span>
                    <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
