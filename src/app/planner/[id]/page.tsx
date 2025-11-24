import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { PlannerDashboard } from '@/components/planner/PlannerDashboard';
import type { CollectionPlan } from '@/types/planner';

interface PlannerPageProps {
  params: Promise<{ id: string }>;
}

async function getPlan(id: string): Promise<CollectionPlan | null> {
  const { data, error } = await supabaseAdmin
    .from('collection_plans')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as CollectionPlan;
}

export default async function PlannerPage({ params }: PlannerPageProps) {
  const { id } = await params;
  const plan = await getPlan(id);

  if (!plan) {
    notFound();
  }

  return (
    <PlannerDashboard plan={plan as CollectionPlan} />
  );
}
