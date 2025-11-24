import { Navbar } from "@/components/layout/navbar";

export default function CreativeSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <Navbar />
      <main className="pt-24 pb-12">
        {children}
      </main>
    </div>
  );
}
