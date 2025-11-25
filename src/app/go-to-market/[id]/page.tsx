import { supabaseAdmin } from '@/lib/supabase-admin';
import { GoToMarketDashboard } from '@/components/gtm/GoToMarketDashboard';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GoToMarketPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch the collection plan with setup data
  const { data: plan, error } = await supabaseAdmin
    .from('collection_plans')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !plan) {
    notFound();
  }

  // Fetch SKUs for this plan
  const { data: skus } = await supabaseAdmin
    .from('collection_skus')
    .select('*')
    .eq('collection_plan_id', id)
    .order('drop_number', { ascending: true });

  return (
    <GoToMarketDashboard 
      plan={plan} 
      initialSkus={skus || []} 
    />
  );
}
