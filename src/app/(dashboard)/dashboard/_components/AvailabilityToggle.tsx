'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface AvailabilityToggleProps {
  currentStatus: string;
  availableUntil: string | null;
}

export function AvailabilityToggle({ currentStatus, availableUntil }: AvailabilityToggleProps) {
  const [loading, setLoading] = useState('');
  const router = useRouter();
  const isActive = currentStatus === 'active';

  async function goAvailable(durationHours: number, startFrom?: string) {
    setLoading(`available-${durationHours}`);
    const supabase = createClient();
    const { error } = await supabase.rpc('go_available', {
      duration_hours: durationHours,
      start_from: startFrom || null,
    });
    if (!error) router.refresh();
    setLoading('');
  }

  async function goOffline() {
    setLoading('offline');
    const supabase = createClient();
    const { error } = await supabase.rpc('go_offline');
    if (!error) router.refresh();
    setLoading('');
  }

  // Calculate "this evening" start (5pm today)
  function getEveningStart(): string {
    const d = new Date();
    d.setHours(17, 0, 0, 0);
    if (d < new Date()) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString();
  }

  // Calculate "tomorrow" start (8am tomorrow)
  function getTomorrowStart(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(8, 0, 0, 0);
    return d.toISOString();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
        <span className="font-medium">
          {isActive ? 'You are visible in search results' : 'You are offline'}
        </span>
      </div>

      {isActive && availableUntil && (
        <p className="text-sm text-gray-500">
          Available until {new Date(availableUntil).toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit',
          })} on {new Date(availableUntil).toLocaleDateString('en-GB', {
            weekday: 'short', day: 'numeric', month: 'short',
          })}
        </p>
      )}

      {currentStatus === 'suspended' ? (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          Your profile has been suspended due to reports. This is reviewed automatically every Monday.
        </div>
      ) : currentStatus === 'onboarding' ? (
        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Complete your profile to start appearing in search results.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => goAvailable(12)}
            disabled={loading === 'available-12'}
            variant={isActive ? 'outline' : 'default'}
          >
            {loading === 'available-12' ? '...' : 'Available Today (12hr)'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => goAvailable(6, getEveningStart())}
            disabled={loading === 'available-6'}
          >
            {loading === 'available-6' ? '...' : 'This Evening'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => goAvailable(12, getTomorrowStart())}
            disabled={loading === 'available-12'}
          >
            Tomorrow
          </Button>
          {isActive && (
            <Button
              size="sm"
              variant="destructive"
              onClick={goOffline}
              disabled={loading === 'offline'}
            >
              {loading === 'offline' ? '...' : 'Go Offline'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
