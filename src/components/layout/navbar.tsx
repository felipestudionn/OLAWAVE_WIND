import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">FashionTrend</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/dashboard" passHref>
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/trends" passHref>
              <Button variant="ghost">Trends</Button>
            </Link>
            <Link href="/analytics" passHref>
              <Button variant="ghost">Analytics</Button>
            </Link>
            <Link href="/about" passHref>
              <Button variant="ghost">About</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
