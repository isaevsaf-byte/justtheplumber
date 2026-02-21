import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/config';

export const runtime = 'edge';
export const alt = 'JustThePlumber Profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let plumber: { business_name: string; display_postcode: string; hourly_rate_day_pence: number; callout_charge_pence: number } | null = null;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data } = await supabase
      .from('view_profiles_public')
      .select('business_name, display_postcode, hourly_rate_day_pence, callout_charge_pence')
      .eq('slug', slug)
      .single();
    plumber = data;
  } catch {
    // Fallback to generic image
  }

  if (!plumber) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#2563eb', color: 'white', fontSize: 48 }}>
          JustThePlumber
        </div>
      ),
      { ...size }
    );
  }

  const dayRate = `£${(plumber.hourly_rate_day_pence / 100).toFixed(0)}/hr`;
  const callout = plumber.callout_charge_pence === 0 ? 'Free callout' : `£${(plumber.callout_charge_pence / 100).toFixed(0)} callout`;

  return new ImageResponse(
    (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        width: '100%', height: '100%', backgroundColor: 'white', padding: 80,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: 12, backgroundColor: '#2563eb',
            color: 'white', fontWeight: 700, fontSize: 24,
          }}>
            JP
          </div>
          <span style={{ fontSize: 20, color: '#6b7280' }}>JustThePlumber.co.uk</span>
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
          {plumber.business_name}
        </div>
        <div style={{ fontSize: 28, color: '#6b7280', marginBottom: 32 }}>
          {plumber.display_postcode}
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: 24, color: '#111827' }}>
          <span style={{ fontWeight: 600 }}>{dayRate}</span>
          <span style={{ color: '#9ca3af' }}>|</span>
          <span>{callout}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
