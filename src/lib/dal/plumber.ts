import 'server-only';
import { unstable_cache } from 'next/cache';
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
  return unstable_cache(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('view_profiles_public')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) return null;
      return data as PlumberProfile;
    },
    [`plumber-${slug}`],
    { revalidate: 3600, tags: [`plumber-${slug}`] }
  )();
};
