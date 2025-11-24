import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Palette, Brain, Calculator, CheckCircle2, Upload, Layers, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { ColoredSvg } from "@/components/ui/colored-svg";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Main background elements that span the entire page */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 olawave-pastel-gradient"></div>
        <div className="absolute -top-[30%] -right-[20%] h-[800px] w-[800px] rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -left-[20%] h-[800px] w-[800px] rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute top-[20%] right-[30%] h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl pulse-animation"></div>
        <div className="absolute bottom-[20%] left-[30%] h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl pulse-animation"></div>
        <div className="absolute inset-0 olawave-gradient-subtle opacity-30 gradient-shift"></div>
      </div>
      
      <Navbar />
      <main className="flex-1 relative z-10">
        {/* Hero Section - Redesigned with clear value prop */}
        <section className="relative w-full py-20 md:py-28 lg:py-32">
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium text-foreground/80 w-fit">
                    <Sparkles className="h-4 w-4" />
                    AI-Powered Collection Planning
                  </div>
                  <h1 className="olawave-heading text-4xl font-normal tracking-normal sm:text-5xl xl:text-6xl/none">
                    <span className="block text-white">Plan Your Fashion</span>
                    <span className="block text-white">Collection in</span>
                    <span className="olawave-subheading block text-2xl sm:text-3xl xl:text-4xl font-light mt-3 text-foreground/90">
                      3 AI-Powered Steps
                    </span>
                  </h1>
                  <p className="olawave-subheading max-w-[600px] text-lg text-foreground/70 md:text-xl leading-relaxed mt-4">
                    From Pinterest boards to SKU-level financial plans. Combine your creative vision with real market trends and let AI build your collection strategy.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row mt-4">
                  <Link
                    href="/creative-space"
                    className="olawave-button olawave-button-primary inline-flex items-center justify-center text-sm font-medium shadow-lg transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Create Your Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="olawave-button olawave-button-secondary inline-flex items-center justify-center backdrop-blur-sm text-sm font-medium shadow-md transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    See How It Works
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
                  <div className="absolute inset-0 olawave-gradient rounded-full opacity-20 blur-3xl pulse-animation"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/images/olawave-logo.svg"
                      alt="OLAWAVE Logo"
                      width={400}
                      height={200}
                      className="h-64 w-auto md:h-80 lg:h-96 float-animation"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - 3 Steps Section */}
        <section id="how-it-works" className="relative w-full py-24 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-4">
                How It Works
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Three simple steps to go from creative inspiration to a complete collection plan with budget and margins.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      1
                    </div>
                    <div>
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">Step 1</span>
                      <h3 className="text-xl font-semibold">Inspiration</h3>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Palette className="h-5 w-5 text-primary" />
                      <span className="font-medium">Creative Space</span>
                    </div>
                    <ul className="space-y-2 text-sm text-foreground/70">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Upload your moodboard images</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Connect Pinterest & select boards</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Explore AI-analyzed market trends</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      <Sparkles className="h-3 w-3" /> AI-Analyzed
                    </span>
                  </div>
                </div>
                {/* Connector arrow (hidden on mobile) */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-primary/30" />
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                      2
                    </div>
                    <div>
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">Step 2</span>
                      <h3 className="text-xl font-semibold">Strategy</h3>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Brain className="h-5 w-5 text-primary" />
                      <span className="font-medium">AI Advisor</span>
                    </div>
                    <ul className="space-y-2 text-sm text-foreground/70">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Define your target consumer & season</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Set SKU count & price range</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>AI generates your collection framework</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      <Sparkles className="h-3 w-3" /> AI-Generated
                    </span>
                  </div>
                </div>
                {/* Connector arrow (hidden on mobile) */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-primary/30" />
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                      3
                    </div>
                    <div>
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">Step 3</span>
                      <h3 className="text-xl font-semibold">Execution</h3>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Calculator className="h-5 w-5 text-primary" />
                      <span className="font-medium">Collection Planner</span>
                    </div>
                    <ul className="space-y-2 text-sm text-foreground/70">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Build SKU-level product plans</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Auto-calculate budget & margins</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Export your complete collection plan</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Sparkles className="h-3 w-3" /> AI-Optimized
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-12">
              <Link
                href="/creative-space"
                className="olawave-button olawave-button-primary inline-flex items-center justify-center text-sm font-medium shadow-lg transition-all hover:shadow-xl"
              >
                Start Your Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        
        {/* Value Proposition Section */}
        <section className="relative w-full py-24 px-4 md:px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight mb-6">
                Collection planning is complex.<br />
                <span className="text-foreground/70">We make it simple.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-500 text-lg">✕</span>
                  </div>
                  Without OLAWAVE
                </h3>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">→</span>
                    <span>Weeks building spreadsheets manually</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">→</span>
                    <span>Guessing what trends will work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">→</span>
                    <span>Unbalanced collections with margin issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">→</span>
                    <span>Disconnected creative and financial planning</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-500 text-lg">✓</span>
                  </div>
                  With OLAWAVE
                </h3>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">→</span>
                    <span>Complete collection plan in under 30 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">→</span>
                    <span>AI-backed trend insights from real data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">→</span>
                    <span>Automatic margin and budget calculations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">→</span>
                    <span>Creative vision + financial reality, unified</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Inspired by Image 3 */}
        <section className="relative w-full py-24 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 rounded-3xl flex flex-col items-center text-center">
                <h3 className="text-xl font-medium mb-2 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gray-300 before:content-[''] before:absolute before:bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-28 before:h-0.5 before:bg-gray-300">Predictive<br/>Context</h3>
                <div className="w-52 h-52 my-8 flex items-center justify-center">
                  <ColoredSvg 
                    src="/icons/1.svg" 
                    alt="Predictive Context"
                    width={210}
                    height={210}
                    color="#ffffff"
                  />
                </div>
                <p className="text-sm text-black/70">Anticipates not just trends, but their causes</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 rounded-3xl flex flex-col items-center text-center">
                <h3 className="text-xl font-medium mb-2 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gray-300 before:content-[''] before:absolute before:bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-28 before:h-0.5 before:bg-gray-300">Pattern<br/>Recognition</h3>
                <div className="w-52 h-52 my-8 flex items-center justify-center">
                  <ColoredSvg 
                    src="/icons/2.svg" 
                    alt="Pattern Recognition"
                    width={210}
                    height={210}
                    color="#ffffff"
                  />
                </div>
                <p className="text-sm text-black/70">Identifies patterns invisible to humans</p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-8 rounded-3xl flex flex-col items-center text-center">
                <h3 className="text-xl font-medium mb-2 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gray-300 before:content-[''] before:absolute before:bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-28 before:h-0.5 before:bg-gray-300">Enhanced Data-Driven<br/>Decisions</h3>
                <div className="w-52 h-52 my-8 flex items-center justify-center">
                  <ColoredSvg 
                    src="/icons/3.svg" 
                    alt="Enhanced Data-Driven Decisions"
                    width={210}
                    height={210}
                    color="#ffffff"
                  />
                </div>
                <p className="text-sm text-black/70">Turns uncertainty into strategic advantage</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-8 rounded-3xl flex flex-col items-center text-center">
                <h3 className="text-xl font-medium mb-2 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gray-300 before:content-[''] before:absolute before:bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-28 before:h-0.5 before:bg-gray-300">Retail<br/>Optimization</h3>
                <div className="w-52 h-52 my-8 flex items-center justify-center">
                  <ColoredSvg 
                    src="/icons/4.svg" 
                    alt="Retail Optimization"
                    width={210}
                    height={210}
                    color="#ffffff"
                  />
                </div>
                <p className="text-sm text-black/70">Enhances pricing, stock, conversion, and customer experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full py-16 md:py-24">
          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="olawave-heading text-3xl font-normal sm:text-4xl md:text-5xl mb-4">
                Ready to Plan Your Collection?
              </h2>
              <p className="olawave-subheading text-lg text-foreground/70 md:text-xl mb-8">
                Go from inspiration to a complete collection plan in under 30 minutes.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Link
                  href="/creative-space"
                  className="olawave-button olawave-button-primary inline-flex items-center justify-center text-sm font-medium shadow-lg transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Create Your Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="olawave-button olawave-button-secondary inline-flex items-center justify-center backdrop-blur-sm text-sm font-medium shadow-md transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Explore Trends
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="w-full border-t border-foreground/10 py-8 md:py-12 relative z-10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-center text-sm leading-loose text-foreground/60 md:text-left">
                  © 2025 OLAWAVE AI. All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/terms" className="text-sm text-foreground/60 transition-colors hover:text-foreground">
                  Terms
                </Link>
                <Link href="/privacy" className="text-sm text-foreground/60 transition-colors hover:text-foreground">
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
