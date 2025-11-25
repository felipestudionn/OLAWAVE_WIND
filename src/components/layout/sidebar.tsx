'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Lightbulb,
  Brain,
  CalendarDays,
  Rocket,
  FolderOpen,
  Settings,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const journeySteps = [
    { name: 'Inspiration', href: '/creative-space', icon: Lightbulb, step: 1 },
    { name: 'Strategy', href: '/ai-advisor', icon: Brain, step: 2 },
    { name: 'Planning', href: '/planner', icon: CalendarDays, step: 3 },
    { name: 'Go to Market', href: '/go-to-market', icon: Rocket, step: 4 },
  ];

  const getCurrentStep = () => {
    if (pathname?.startsWith('/creative-space')) return 1;
    if (pathname?.startsWith('/ai-advisor')) return 2;
    if (pathname?.startsWith('/planner')) return 3;
    if (pathname?.startsWith('/go-to-market')) return 4;
    return 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen w-64 border-r bg-background p-6 pt-8">
      <div className="space-y-8">
        {/* Journey Steps */}
        <div className="py-2">
          <h2 className="mb-5 px-4 text-lg font-semibold">Collection Journey</h2>
          <div className="space-y-2">
            {journeySteps.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const isCompleted = currentStep > item.step;
              const Icon = item.icon;
              
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : isCompleted
                        ? 'text-green-600 hover:bg-accent'
                        : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <div className={`mr-3 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? 'bg-primary text-white' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? '✓' : item.step}
                  </div>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Collections & Settings */}
        <div className="py-2">
          <div className="space-y-2">
            <Link 
              href="/my-collections" 
              className={`flex items-center rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                pathname?.startsWith('/my-collections')
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <FolderOpen className="mr-3 h-4 w-4" />
              My Collections
            </Link>
            <Link 
              href="/settings" 
              className={`flex items-center rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                pathname?.startsWith('/settings')
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Settings className="mr-3 h-4 w-4" />
              Preferences
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
