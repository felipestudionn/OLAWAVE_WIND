'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Palette, Brain, Calculator, CheckCircle2, Upload, Layers, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { ColoredSvg } from "@/components/ui/colored-svg";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-[#fff6dc]"></div>
      
      <Navbar />
      <main className="flex-1 relative z-10">
        {/* Hero Section - Redesigned with clear value prop */}
        <section className="relative w-full pt-32 pb-20 md:pt-36 md:pb-28 lg:pt-40 lg:pb-32">
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex items-center justify-between gap-8">
              {/* Hero Content */}
              <div className="max-w-3xl flex-1">
                <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-2xl text-sm font-medium text-gray-700 w-fit shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)] border border-white/40 animate-fade-in-up">
                      <Sparkles className="h-4 w-4 text-pink-500" />
                      AI-Powered Collection Planning
                    </div>
                    <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                      <span className="block text-gray-900 animate-fade-in-up animate-delay-100">Plan Your Fashion</span>
                      <span className="block text-gray-900 animate-fade-in-up animate-delay-200">Collection in</span>
                      <span className="block text-3xl sm:text-4xl xl:text-5xl font-medium mt-4 text-gray-600 animate-fade-in-up animate-delay-300">
                        3 AI-Powered Steps
                      </span>
                    </h1>
                    <p className="max-w-[550px] text-lg text-gray-600 md:text-xl leading-relaxed animate-fade-in-up animate-delay-400">
                      From Pinterest boards to SKU-level financial plans. Combine your creative vision with real market trends and let AI build your collection strategy.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row pt-2 animate-fade-in-up animate-delay-500">
                    <Link
                      href="/creative-space"
                      className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gray-900 text-white text-base font-semibold shadow-xl transition-all hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-0.5"
                    >
                      Create Your Collection
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      href="#how-it-works"
                      className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 text-base font-semibold shadow-lg border border-white/50 transition-all hover:bg-white hover:shadow-xl"
                    >
                      See How It Works
                    </Link>
                  </div>
                </div>
              </div>
              {/* Logo */}
              <div className="hidden lg:flex flex-1 justify-end items-center">
                <Image
                  src="/images/olawave-logo.png"
                  alt="OLAWAVE Logo"
                  width={450}
                  height={450}
                  className="object-contain animate-logo-fade"
                  priority
                  quality={100}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - 4 AI Power Steps */}
        <section id="how-it-works" className="relative w-full py-24 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <AnimateOnScroll delay={800} duration={3} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Four AI Power Steps to go from creative inspiration to a complete go-to-market plan.
              </p>
            </AnimateOnScroll>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <AnimateOnScroll delay={1200} duration={2.5} className="relative">
                <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_4px_30px_-4px_rgba(0,0,0,0.12)] border border-white/50 h-full flex flex-col transition-all hover:shadow-[0_8px_40px_-4px_rgba(0,0,0,0.18)] hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      1
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-pink-500 uppercase tracking-wider">Step 1</span>
                      <h3 className="text-xl font-bold text-gray-900">Inspiration</h3>
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
              </AnimateOnScroll>
              
              {/* Step 2 */}
              <AnimateOnScroll delay={1600} duration={2.5} className="relative">
                <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_4px_30px_-4px_rgba(0,0,0,0.12)] border border-white/50 h-full flex flex-col transition-all hover:shadow-[0_8px_40px_-4px_rgba(0,0,0,0.18)] hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      2
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Step 2</span>
                      <h3 className="text-xl font-bold text-gray-900">Strategy</h3>
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
              </AnimateOnScroll>
              
              {/* Step 3 */}
              <AnimateOnScroll delay={2000} duration={2.5} className="relative">
                <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_4px_30px_-4px_rgba(0,0,0,0.12)] border border-white/50 h-full flex flex-col transition-all hover:shadow-[0_8px_40px_-4px_rgba(0,0,0,0.18)] hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      3
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">Step 3</span>
                      <h3 className="text-xl font-bold text-gray-900">Planning</h3>
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
                        <span>AI generates SKUs to hit your target</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Sparkles className="h-3 w-3" /> AI-Optimized
                    </span>
                  </div>
                </div>
                {/* Connector arrow (hidden on mobile) */}
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-primary/30" />
                </div>
              </AnimateOnScroll>

              {/* Step 4 */}
              <AnimateOnScroll delay={2400} duration={2.5} className="relative">
                <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_4px_30px_-4px_rgba(0,0,0,0.12)] border border-white/50 h-full flex flex-col transition-all hover:shadow-[0_8px_40px_-4px_rgba(0,0,0,0.18)] hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      4
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Step 4</span>
                      <h3 className="text-xl font-bold text-gray-900">Go to Market</h3>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="font-medium">GTM Planning</span>
                    </div>
                    <ul className="space-y-2 text-sm text-foreground/70">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Organize drops & launch timeline</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Plan commercial actions & collabs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>AI validates vs market demand</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                      <Sparkles className="h-3 w-3" /> AI-Validated
                    </span>
                  </div>
                </div>
              </AnimateOnScroll>
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
        <section className="relative w-full py-20 md:py-28">
          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center bg-white/80 backdrop-blur-xl rounded-3xl p-12 md:p-16 shadow-xl shadow-black/5 border border-white/60">
              <h2 className="text-4xl font-bold sm:text-5xl mb-6 text-gray-900">
                Ready to Plan Your Collection?
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Go from inspiration to a complete collection plan in under 30 minutes.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Link
                  href="/creative-space"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gray-900 text-white text-base font-semibold shadow-xl transition-all hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Create Your Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-gray-700 text-base font-semibold shadow-lg border border-gray-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Explore Trends
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="w-full border-t border-white/30 py-8 md:py-12 relative z-10 bg-white/30 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-center text-sm leading-loose text-gray-600 md:text-left">
                  © 2025 OLAWAVE AI. All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/terms" className="text-sm text-gray-600 transition-colors hover:text-gray-900">
                  Terms
                </Link>
                <Link href="/privacy" className="text-sm text-gray-600 transition-colors hover:text-gray-900">
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
