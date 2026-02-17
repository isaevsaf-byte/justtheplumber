import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AvailabilityToggle } from './_components/AvailabilityToggle';
import { StatsCard } from './_components/StatsCard';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Welcome to JustThePlumber</h1>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-600 mb-4">
              You haven&apos;t set up your plumber profile yet.
            </p>
            <Button asChild>
              <Link href="/signup">Complete Your Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{profile.business_name}</h1>
        <Button asChild variant="outline" size="sm">
          <Link href={`/plumber/${profile.slug}`}>View Public Profile</Link>
        </Button>
      </div>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailabilityToggle
            currentStatus={profile.status}
            availableUntil={profile.available_until}
          />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatsCard
          title="Total Reveals"
          value={profile.total_reveals}
          description="Number of times customers have viewed your contact details"
        />
        <StatsCard
          title="Reputation Score"
          value={`${profile.reputation_score}/100`}
          description="Based on community trust signals"
        />
      </div>

      {profile.status === 'inactive' && profile.total_reveals === 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <p className="text-sm text-blue-800">
              Set your availability above to start appearing in search results.
              Customers search by postcode and will see your rates upfront.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
