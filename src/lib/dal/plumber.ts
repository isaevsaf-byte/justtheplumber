import 'server-only';
import { createClient } from '@/lib/supabase/server';

export interface PlumberProfile {
  id: string;
  business_name: string;
  slug: string;
  bio: string | null;
  display_postcode: string;
  callout_charge_pence: number;
  hourly_rate_day_pence: number;
  hourly_rate_night_pence: number;
  services: string[];
  gas_safe_number: string | null;
  reputation_score: number;
  total_reveals: number;
  status: string;
  service_radius_miles: number;
  available_from: string | null;
  available_until: string | null;
  created_at: string;
}

export const getPlumberBySlug = async (slug: string): Promise<PlumberProfile | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('view_profiles_public')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('getPlumberBySlug error:', error.message);
      return null;
    }
    return data as PlumberProfile;
  } catch (err) {
    console.error('getPlumberBySlug failed:', err);
    return null;
  }
};
