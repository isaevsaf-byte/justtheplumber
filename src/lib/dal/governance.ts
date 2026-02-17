import 'server-only';
import { createClient } from '@/lib/supabase/server';

export async function reportPlumber(targetId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('reports').insert({
    reporter_id: user.id,
    target_id: targetId,
    reason,
  });

  if (error) {
    if (error.code === '23505') {
      return { error: 'You have already reported this plumber.' };
    }
    throw error;
  }

  return { success: true };
}

export async function hasUserReported(targetId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('reports')
    .select('id')
    .eq('reporter_id', user.id)
    .eq('target_id', targetId)
    .single();

  return !!data;
}
