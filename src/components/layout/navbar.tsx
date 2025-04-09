import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export function Navbar() {
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
            <span className="olawave-font text-xl font-normal tracking-normal uppercase">
              OLAWAVE AI
            </span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/trends"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Trends
            </Link>
            <Link
              href="/analytics"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Analytics
            </Link>
            <Link
              href="/ai-advisor"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              AI Advisor
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
          <button className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9">
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
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
