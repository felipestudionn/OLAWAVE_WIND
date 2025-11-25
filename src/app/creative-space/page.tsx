import { supabaseAdmin } from '@/lib/supabase-admin';
import type { Signal } from '@/types';
import { CreativeSpaceClient } from './creative-space-client';

async function getSignals(): Promise<Signal[]> {
  const { data, error } = await supabaseAdmin
    .from('signals')
    .select('*')
    .eq('location', 'Shoreditch')
    .order('composite_score', { ascending: false })
    .limit(10);

  if (error || !data) {
    return [];
  }

  return data as Signal[];
}

export default async function CreativeSpacePage() {
  const signals = await getSignals();

  return (
    <div className="flex flex-col gap-10 px-4 md:px-6 py-6 md:py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Creative Space</h1>
        <p className="text-muted-foreground max-w-3xl">
          Build a visual moodboard and combine it with live trend insights to define the
          creative direction of your collection. This space can be used independently or
          as the starting point for your quantitative planning.
        </p>
      </div>

      {/* All interactive content in client component */}
      <CreativeSpaceClient signals={signals} />
    </div>
  );
}
