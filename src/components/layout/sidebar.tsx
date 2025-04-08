import Link from 'next/link';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart3, 
  Instagram, 
  Search, 
  Settings,
  ShoppingBag,
  Shirt,
  Footprints,
  Sparkles
} from 'lucide-react';

export function Sidebar() {
  return (
    <div className="h-screen w-64 border-r bg-background p-6 pt-8">
      <div className="space-y-8">
        <div className="py-2">
          <h2 className="mb-5 px-4 text-lg font-semibold">Main</h2>
          <div className="space-y-3">
            <Link 
              href="/dashboard" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              href="/trends" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <TrendingUp className="mr-3 h-4 w-4" />
              Trends
            </Link>
            <Link 
              href="/analytics" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <BarChart3 className="mr-3 h-4 w-4" />
              Analytics
            </Link>
            <Link 
              href="/ai-advisor" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground"
            >
              <Sparkles className="mr-3 h-4 w-4 text-primary" />
              AI Advisor
            </Link>
          </div>
        </div>

        <div className="py-2">
          <h2 className="mb-5 px-4 text-lg font-semibold">Categories</h2>
          <div className="space-y-3">
            <Link 
              href="/categories/clothing" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Shirt className="mr-3 h-4 w-4" />
              Clothing
            </Link>
            <Link 
              href="/categories/shoes" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Footprints className="mr-3 h-4 w-4" />
              Shoes
            </Link>
            <Link 
              href="/categories/bags" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <ShoppingBag className="mr-3 h-4 w-4" />
              Bags
            </Link>
          </div>
        </div>
        
        <div className="py-2">
          <h2 className="mb-5 px-4 text-lg font-semibold">Data Sources</h2>
          <div className="space-y-3">
            <Link 
              href="/sources/instagram" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Instagram className="mr-3 h-4 w-4" />
              Instagram
            </Link>
            <Link 
              href="/sources/pinterest" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Search className="mr-3 h-4 w-4" />
              Pinterest
            </Link>
            <Link 
              href="/sources/tiktok" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Search className="mr-3 h-4 w-4" />
              TikTok
            </Link>
            <Link 
              href="/sources/google" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Search className="mr-3 h-4 w-4" />
              Google Trends
            </Link>
          </div>
        </div>
        
        <div className="py-2">
          <h2 className="mb-5 px-4 text-lg font-semibold">Settings</h2>
          <div className="space-y-3">
            <Link 
              href="/settings" 
              className="flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
