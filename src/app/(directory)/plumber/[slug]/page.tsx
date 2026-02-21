import { notFound } from 'next/navigation';
import { getPlumberBySlug } from '@/lib/dal/plumber';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PriceTable } from './_components/PriceTable';
import { ServiceTags } from './_components/ServiceTags';
import { AvailabilityBadge } from './_components/AvailabilityBadge';
import { TrustBadge } from './_components/TrustBadge';
import { RevealButton } from './_components/RevealButton';
import { ReportButton } from './_components/ReportButton';
import type { Metadata } from 'next';

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const plumber = await getPlumberBySlug(slug);
    if (!plumber) return { title: 'Not Found' };

    return {
      title: `${plumber.business_name} — JustThePlumber`,
      description: `${plumber.business_name} in ${plumber.display_postcode}. Day rate: £${(plumber.hourly_rate_day_pence / 100).toFixed(0)}/hr. No middleman fees.`,
    };
  } catch {
    return { title: 'Plumber Profile — JustThePlumber' };
  }
}

export default async function PlumberProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const plumber = await getPlumberBySlug(slug);
  if (!plumber) notFound();

  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    // Auth check failed — treat as unauthenticated
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{plumber.business_name}</h1>
          <TrustBadge score={plumber.reputation_score} />
        </div>
        <p className="text-gray-500">{plumber.display_postcode}</p>
        <AvailabilityBadge
          availableFrom={plumber.available_from}
          availableUntil={plumber.available_until}
        />
      </div>

      {/* Bio */}
      {plumber.bio && (
        <p className="text-gray-700">{plumber.bio}</p>
      )}

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceTable
            calloutChargePence={plumber.callout_charge_pence}
            hourlyRateDayPence={plumber.hourly_rate_day_pence}
            hourlyRateNightPence={plumber.hourly_rate_night_pence}
          />
        </CardContent>
      </Card>

      {/* Services */}
      <div className="space-y-2">
        <h2 className="font-medium">Services</h2>
        <ServiceTags services={plumber.services} gasSafeNumber={plumber.gas_safe_number} />
      </div>

      <Separator />

      {/* Contact Reveal */}
      <RevealButton plumberId={plumber.id} isAuthenticated={!!user} />

      <Separator />

      {/* Report */}
      <div className="flex justify-center">
        <ReportButton plumberId={plumber.id} isAuthenticated={!!user} />
      </div>
    </div>
  );
}
