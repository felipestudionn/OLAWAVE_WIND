import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'OLAWAVE AI - Fashion Trend Analyzer',
  description: 'Analyze fashion trends across multiple platforms with AI-powered insights.',
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
          <div className="fixed inset-0 -z-10 bg-[#f8f7f2]"></div>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
