import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('view_profiles_public').select('id').limit(1);
    return NextResponse.json({
      status: error ? 'error' : 'alive',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
