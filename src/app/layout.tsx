import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'OLAWAVE AI - Fashion Trend Analyzer',
  description: 'Intelligence in motion. Decoding patterns, revealing context, and transforming uncertainty into strategic insight.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="fixed inset-0 -z-10 olawave-gradient opacity-20"></div>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
