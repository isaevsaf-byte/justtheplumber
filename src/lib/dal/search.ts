import 'server-only';
import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface PlumberSearchResult {
  id: string;
  business_name: string;
  slug: string;
  display_postcode: string;
  callout_charge_pence: number;
  hourly_rate_day_pence: number;
  hourly_rate_night_pence: number;
  services: string[];
  gas_safe_number: string | null;
  reputation_score: number;
  total_reveals: number;
  distance_meters: number;
  available_since: string;
  bio: string | null;
  service_radius_miles: number;
}

export const searchPlumbers = async (params: {
  lat: number;
  lng: number;
  radiusMiles?: number;
  service?: string;
}): Promise<PlumberSearchResult[]> => {
  const gridLat = Math.round(params.lat * 100) / 100;
  const gridLng = Math.round(params.lng * 100) / 100;
  const cacheKey = `search-${gridLat}-${gridLng}-${params.service || 'all'}`;

  return unstable_cache(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase.rpc('search_nearby_plumbers', {
        search_lat: params.lat,
        search_lng: params.lng,
        radius_m: (params.radiusMiles || 20) * 1609.34,
        service_filter: params.service || null,
      });
      if (error) throw error;
      return (data ?? []) as PlumberSearchResult[];
    },
    [cacheKey],
    { revalidate: 60, tags: ['search-results'] }
  )();
};
