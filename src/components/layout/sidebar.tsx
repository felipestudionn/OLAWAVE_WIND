import Link from 'next/link';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart3, 
  Instagram, 
  Search, 
  Settings 
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
