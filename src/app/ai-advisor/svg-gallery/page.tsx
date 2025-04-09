import React from 'react';
import { SVGShowcase } from '@/components/svg-showcase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SVGGalleryPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fashion Trend Visualizations</h1>
          <p className="text-muted-foreground">
            SVG visualizations for fashion trend analysis
          </p>
        </div>
        <Link href="/ai-advisor">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Advisor
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SVG Visualization Gallery</CardTitle>
          <CardDescription>
            These SVG files are optimized for use in your fashion trend analysis application.
            Each visualization represents different aspects of fashion trend data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SVGShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Use These SVGs</CardTitle>
          <CardDescription>
            Implementation guide for using these SVG visualizations in your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Basic Usage</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Import the SVGIcon component and use it in your React components:
            </p>
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md mt-2 overflow-x-auto">
              <code>{`import { SVGIcon } from '@/components/ui/svg-icon';

// In your component:
<SVGIcon name="1" width={150} height={150} alt="Fashion trend visualization" />`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium">Available SVG Icons</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
              <li>1.svg - Circular fashion trend visualization</li>
              <li>2.svg - Detailed fashion trend analysis</li>
              <li>3.svg - Fashion trend color patterns</li>
              <li>4.svg - Fashion trend distribution</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
