import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, LineChart, Sparkles, TrendingUp } from "lucide-react";
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
        {/* Hero Section - Now without its own background elements */}
        <section className="relative w-full py-20 md:py-28 lg:py-32">
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="olawave-heading text-4xl font-normal tracking-normal sm:text-5xl xl:text-6xl/none">
                    <span className="block text-white">OLAWAVE AI</span>
                    <span className="olawave-subheading block text-xl sm:text-2xl xl:text-3xl font-light mt-3 text-foreground/80">
                      ARTIFICIAL INTELLIGENCE SOLUTIONS
                    </span>
                  </h1>
                  <p className="olawave-subheading max-w-[600px] text-lg text-foreground/70 md:text-xl leading-relaxed mt-4">
                    Fashion in motion. Decoding patterns, revealing context, and transforming uncertainty into strategic insight.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row mt-4">
                  <Link
                    href="/dashboard"
                    className="olawave-button olawave-button-primary inline-flex items-center justify-center text-sm font-medium shadow-lg transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Explore Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/ai-advisor"
                    className="olawave-button olawave-button-secondary inline-flex items-center justify-center backdrop-blur-sm text-sm font-medium shadow-md transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Advisor
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
        
        {/* Retail Insights Section - Inspired by Image 1 */}
        <section className="relative w-full py-24 px-4 md:px-6 overflow-hidden">
          <div className="w-full mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-12 items-center">
              <div className="w-full">
                <h2 className="text-4xl md:text-5xl font-normal tracking-tight mb-6">
                  Retail moves fast.<br />
                  But decisions are<br />
                  still blind.
                </h2>
                <div className="h-px w-full bg-black/20 my-8"></div>
                <div className="flex justify-end pr-8 md:pr-16">
                  <ul className="space-y-4 max-w-xl">
                    <li className="flex items-start">
                      <span className="text-black/70 mr-2">&gt;</span>
                      <p>Sales reports show what happened, but not why.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-black/70 mr-2">&gt;</span>
                      <p>Inventory decisions based on outdated forecasts.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-black/70 mr-2">&gt;</span>
                      <p>Pricing strategies that react too late.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-black/70 mr-2">&gt;</span>
                      <p>Marketing campaigns launched in the dark.</p>
                    </li>
                  </ul>
                </div>
                <div className="h-px w-full bg-black/20 my-8"></div>
                <div className="flex justify-end">
                  <button className="bg-black text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-black/80 transition-colors">
                    FIND THE MISSING PIECE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data-Driven Decisions Section - Inspired by Image 2 */}
        <section className="relative w-full py-24 px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight mb-8">
              Decisions should be data-driven.<br />
              But without cutting-edge context, you're<br />
              only seeing half the picture.
            </h2>
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

        {/* How It Works Section - Inspired by Image 5 */}
        <section className="relative w-full py-24 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-16 text-center">
              How It Works?
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="h-0.5 w-full bg-black/10 mb-12"></div>
              
              <p className="text-center mb-8">
                <span className="font-medium">Our approach combines </span>
                <span className="font-bold">Machine Learning, Natural Language Processing (NLP), Predictive Models, and Sentiment Analysis </span>
                <span className="font-medium">to generate deep contextual understanding.</span>
              </p>
              
              <p className="text-center mb-8">
                <span className="font-medium">Olawave AI draws from </span>
                <span className="font-bold">best-in-class practices </span>
                <span className="font-medium">used by leaders like BlackRock to build predictive intelligence systems.</span>
              </p>
              
              <div className="h-0.5 w-full bg-black/10 mt-12"></div>
              
              <div className="flex justify-center mt-12 mb-12">
                <div className="w-64 h-64">
                  <ColoredSvg 
                    src="/icons/5.svg" 
                    alt="How It Works"
                    width={256}
                    height={256}
                    color="#333333"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BlackRock Reference Section - Inspired by Image 6 */}
        <section className="relative w-full py-24 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-sm">
              <div className="inline-block bg-gray-400/80 text-black px-4 py-1 rounded-full text-sm font-medium mb-8">
                Benchmark Reference Model
              </div>
              
              <h3 className="text-2xl font-medium mb-4">
                BlackRock's Approach<br />
                (AI-Powered Market & Sentiment Analysis)
              </h3>
              
              <div className="h-0.5 w-full bg-black/10 my-8"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                  <p className="text-black/80 mb-6">
                    BlackRock's AI system analyzes vast financial datasets, including sentiment analysis from financial articles, social media, and economic indicators. By integrating these insights into predictive models, BlackRock identifies market shifts before they fully materialize, optimizing investment strategies in real-time.
                  </p>
                  <a href="#" className="text-black underline hover:no-underline">Learn more from BlackRock.</a>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="w-48 h-48">
                    <ColoredSvg 
                      src="/icons/6.svg" 
                      alt="Economic Indicator"
                      width={192}
                      height={192}
                      color="#333333"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full py-16 md:py-24">
          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="olawave-heading text-3xl font-normal sm:text-4xl md:text-5xl mb-4">
                Ready to Transform Your Fashion Strategy?
              </h2>
              <p className="olawave-subheading text-lg text-foreground/70 md:text-xl mb-8">
                Start identifying emerging trends and make data-driven decisions today.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Link
                  href="/dashboard"
                  className="olawave-button olawave-button-primary inline-flex items-center justify-center text-sm font-medium shadow-lg transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="olawave-button olawave-button-secondary inline-flex items-center justify-center backdrop-blur-sm text-sm font-medium shadow-md transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Contact Sales
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
                  2025 OLAWAVE AI. All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <Link href="#" className="text-sm text-foreground/60 transition-colors hover:text-foreground">
                  Terms
                </Link>
                <Link href="#" className="text-sm text-foreground/60 transition-colors hover:text-foreground">
                  Privacy
                </Link>
                <Link href="#" className="text-sm text-foreground/60 transition-colors hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
