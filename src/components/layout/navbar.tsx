"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-white/90 backdrop-blur-sm dark:bg-gray-950/90 shadow-sm">
      <div className="flex h-20 items-center px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* OLAWAVE Logo */}
          <div className="relative h-20 w-20 flex items-center">
            <Image
              src="/images/olawave-logo.svg"
              alt="OLAWAVE Logo"
              width={84}
              height={84}
              className="object-contain"
              priority
            />
          </div>
          <Link href="/" className="flex flex-col">
            <span className="olawave-heading text-xl font-normal tracking-normal uppercase">
              OLAWAVE AI
            </span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/creative-space"
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              Creative Space
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/ai-advisor"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center relative group"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              AI Advisor
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              Trends
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/analytics"
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              Analytics
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Sign In
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              Get Started
            </button>
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
            <Link
              href="/creative-space"
              className="text-base font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Creative Space
            </Link>
            <Link
              href="/ai-advisor"
              className="text-base font-medium py-2 transition-colors hover:text-primary flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Advisor
            </Link>
            <Link
              href="/dashboard"
              className="text-base font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trends
            </Link>
            <Link
              href="/analytics"
              className="text-base font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <div className="pt-4 flex flex-col space-y-3">
              <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                Sign In
              </button>
              <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
