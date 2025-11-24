import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, season, location, setup_data, user_id } = body;

    if (!name || !setup_data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('collection_plans')
      .insert({
        name,
        description,
        season,
        location,
        setup_data,
        user_id,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving plan:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
