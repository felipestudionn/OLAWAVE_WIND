import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="olawave-font text-4xl font-normal tracking-normal uppercase sm:text-5xl xl:text-6xl/none">
                    <span className="block">OLAWAVE AI</span>
                    <span className="block text-2xl sm:text-3xl xl:text-4xl font-medium mt-2">Fashion Trend Analyzer</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Intelligence in motion. Decoding patterns, revealing context, and transforming uncertainty into strategic insight.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/dashboard"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Explore Dashboard
                  </Link>
                  <Link
                    href="/ai-advisor"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Advisor
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-[400px] md:h-[600px] md:w-[600px] lg:h-[700px] lg:w-[700px]">
                  <div className="absolute inset-0 olawave-gradient rounded-full opacity-20 blur-3xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/images/olawave-logo.svg"
                      alt="OLAWAVE Logo"
                      width={600}
                      height={300}
                      className="h-64 w-auto md:h-96 lg:h-128 wave-animation"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Comprehensive Fashion Trend Analysis
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered platform analyzes fashion trends from multiple sources to provide you with actionable insights.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 olawave-gradient"></div>
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
                </div>
                <h3 className="text-xl font-bold">Multi-Platform Analysis</h3>
                <p className="text-center text-muted-foreground">
                  Analyze fashion trends from Instagram, Pinterest, TikTok, and Google to get a comprehensive view.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 olawave-gradient"></div>
                <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <h3 className="text-xl font-bold">Real-Time Insights</h3>
                <p className="text-center text-muted-foreground">
                  Get up-to-date information on emerging trends, growth rates, and platform distribution.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 olawave-gradient"></div>
                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="m12 12 4 10 1.7-4.3L22 16Z"/></svg>
                </div>
                <h3 className="text-xl font-bold">Actionable Recommendations</h3>
                <p className="text-center text-muted-foreground">
                  Receive strategic recommendations based on trend analysis to inform your fashion decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Fashion Strategy?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start exploring fashion trends with OLAWAVE AI's powerful analytics platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="w-full border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              2025 OLAWAVE AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
