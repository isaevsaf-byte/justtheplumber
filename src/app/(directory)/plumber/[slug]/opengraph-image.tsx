import { ImageResponse } from 'next/og';
import { getPlumberBySlug } from '@/lib/dal/plumber';

export const runtime = 'edge';
export const alt = 'JustThePlumber Profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plumber = await getPlumberBySlug(slug);

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
