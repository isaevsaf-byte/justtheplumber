import 'server-only';
import { unstable_cache } from 'next/cache';

interface GeoResult {
  latitude: number;
  longitude: number;
  admin_district: string;
}

export const resolvePostcode = (postcode: string) => {
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
  return unstable_cache(
    async (): Promise<GeoResult> => {
      const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(cleaned)}`,
        { next: { revalidate: 86400 } }
      );
      if (!res.ok) throw new Error(`Invalid postcode: ${postcode}`);
      const data = await res.json();
      return {
        latitude: data.result.latitude,
        longitude: data.result.longitude,
        admin_district: data.result.admin_district,
      };
    },
    [`postcode-${cleaned}`],
    { revalidate: 86400 }
  )();
};
