"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, Palette, Brain, Calculator, TrendingUp, ChevronRight } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Determine current step based on pathname
  const getCurrentStep = () => {
    if (pathname?.startsWith('/creative-space')) return 1;
    if (pathname?.startsWith('/ai-advisor')) return 2;
    if (pathname?.startsWith('/planner')) return 3;
    if (pathname?.startsWith('/go-to-market')) return 4;
    return 0;
  };

  const currentStep = getCurrentStep();
  const isInJourney = currentStep > 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 animate-fade-in">
      <div className="container mx-auto">
      <div className="flex h-24 items-center px-2 md:px-4">
        <div className="flex items-center gap-3">
          {/* OLAWAVE Logo */}
          <div className="relative h-16 w-16 flex items-center">
            <Image
              src="/images/olawave-logo.png"
              alt="OLAWAVE Logo"
              width={67}
              height={67}
              className="object-contain"
              priority
            />
          </div>
          <Link href="/" className="flex flex-col">
            <span className="olawave-heading text-xl font-light tracking-normal uppercase">
              OLAWAVE AI
            </span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {/* Journey Progress Navigation (shown when in journey) */}
          {isInJourney && (
            <nav className="hidden lg:flex items-center gap-1 bg-white/50 rounded-full px-2 py-1">
              <Link
                href="/creative-space"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  currentStep === 1 
                    ? 'bg-white shadow-sm text-primary' 
                    : currentStep > 1 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  currentStep > 1 ? 'bg-green-500 text-white' : currentStep === 1 ? 'bg-primary text-white' : 'bg-gray-300 text-white'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className="hidden xl:inline">Inspiration</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link
                href="/ai-advisor"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  currentStep === 2 
                    ? 'bg-white shadow-sm text-primary' 
                    : currentStep > 2 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  currentStep > 2 ? 'bg-green-500 text-white' : currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-300 text-white'
                }`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className="hidden xl:inline">Strategy</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link
                href="/planner"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  currentStep === 3 
                    ? 'bg-white shadow-sm text-primary' 
                    : currentStep > 3 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  currentStep > 3 ? 'bg-green-500 text-white' : currentStep === 3 ? 'bg-primary text-white' : 'bg-gray-300 text-white'
                }`}>
                  {currentStep > 3 ? '✓' : '3'}
                </div>
                <span className="hidden xl:inline">Planning</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  currentStep === 4 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-gray-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  currentStep === 4 ? 'bg-primary text-white' : 'bg-gray-300 text-white'
                }`}>
                  4
                </div>
                <span className="hidden xl:inline">Go to Market</span>
              </div>
            </nav>
          )}
          
          {/* Regular Navigation (shown on landing/other pages) */}
          {!isInJourney && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/creative-space"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 flex items-center gap-1.5"
              >
                <Palette className="h-4 w-4" />
                Inspiration
              </Link>
              <Link
                href="/ai-advisor"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 flex items-center gap-1.5"
              >
                <Brain className="h-4 w-4" />
                Strategy
              </Link>
              <Link
                href="/planner"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 flex items-center gap-1.5"
              >
                <Calculator className="h-4 w-4" />
                Planning
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 flex items-center gap-1.5"
              >
                <TrendingUp className="h-4 w-4" />
                Go to Market
              </Link>
            </nav>
          )}
          
          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/creative-space"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium transition-all hover:bg-gray-800"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              New Collection
            </Link>
          </div>
          <button 
            className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            )}
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm dark:bg-gray-950/95 border-b shadow-md">
          <div className="flex flex-col space-y-4 p-6">
            {/* Journey Steps for Mobile */}
            <div className="flex items-center justify-between gap-1 pb-4 border-b">
              <Link
                href="/creative-space"
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg ${currentStep === 1 ? 'bg-primary/10' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  currentStep > 1 ? 'bg-green-500 text-white' : currentStep === 1 ? 'bg-primary text-white' : 'bg-gray-200'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className="text-[10px] font-medium">Inspiration</span>
              </Link>
              <Link
                href="/ai-advisor"
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg ${currentStep === 2 ? 'bg-primary/10' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  currentStep > 2 ? 'bg-green-500 text-white' : currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-200'
                }`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className="text-[10px] font-medium">Strategy</span>
              </Link>
              <Link
                href="/planner"
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg ${currentStep === 3 ? 'bg-primary/10' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  currentStep > 3 ? 'bg-green-500 text-white' : currentStep === 3 ? 'bg-primary text-white' : 'bg-gray-200'
                }`}>
                  {currentStep > 3 ? '✓' : '3'}
                </div>
                <span className="text-[10px] font-medium">Planning</span>
              </Link>
              <div className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg ${currentStep === 4 ? 'bg-primary/10' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  currentStep === 4 ? 'bg-primary text-white' : 'bg-gray-200'
                }`}>
                  4
                </div>
                <span className="text-[10px] font-medium">GTM</span>
              </div>
            </div>
            
            <Link
              href="/creative-space"
              className="text-base font-medium py-2 transition-colors hover:text-primary flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Palette className="h-4 w-4" />
              Creative Space
            </Link>
            <Link
              href="/ai-advisor"
              className="text-base font-medium py-2 transition-colors hover:text-primary flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Brain className="h-4 w-4" />
              AI Advisor
            </Link>
            <Link
              href="/dashboard"
              className="text-base font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trends Library
            </Link>
            <div className="pt-4">
              <Link 
                href="/creative-space"
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                New Collection
              </Link>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
