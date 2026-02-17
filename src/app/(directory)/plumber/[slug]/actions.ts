'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function revealContactDetails(plumberId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data, error } = await supabase.rpc('reveal_contact', {
    target_plumber_id: plumberId,
  });

  if (error) {
    if (error.message.includes('Rate limit')) {
      return { error: 'You can reveal 5 numbers per hour. This protects plumbers from spam.' };
    }
    return { error: 'Something went wrong. Please try again.' };
  }

  return {
    phone: data[0]?.phone_number,
    email: data[0]?.email,
    whatsapp: data[0]?.whatsapp_number,
    preferred: data[0]?.preferred_contact,
    businessName: data[0]?.business_name,
  };
}

export async function reportPlumber(plumberId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { error } = await supabase.from('reports').insert({
    reporter_id: user.id,
    target_id: plumberId,
    reason,
  });

  if (error) {
    if (error.code === '23505') {
      return { error: 'You have already reported this plumber.' };
    }
    return { error: 'Something went wrong. Please try again.' };
  }

  return { success: true };
}
