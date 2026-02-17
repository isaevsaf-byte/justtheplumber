'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  defaultValue?: string;
  className?: string;
}

export function SearchBar({ defaultValue = '', className }: SearchBarProps) {
  const [postcode, setPostcode] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postcode.trim()) return;
    setLoading(true);
    router.push(`/search?q=${encodeURIComponent(postcode.trim())}`);
  }

  function useMyLocation() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://api.postcodes.io/postcodes?lon=${pos.coords.longitude}&lat=${pos.coords.latitude}&limit=1`
          );
          const data = await res.json();
          if (data.result?.[0]?.postcode) {
            const pc = data.result[0].postcode;
            setPostcode(pc);
            router.push(`/search?q=${encodeURIComponent(pc)}`);
          }
        } catch {
          // Silently fail — user can type manually
        }
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { timeout: 10000 }
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter your postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          className="flex-1"
          aria-label="Postcode"
        />
        <Button type="submit" disabled={loading || !postcode.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>
      <button
        type="button"
        onClick={useMyLocation}
        disabled={geoLoading}
        className="mt-2 text-sm text-blue-600 hover:underline disabled:text-gray-400"
      >
        {geoLoading ? 'Finding your location...' : 'Use my location'}
      </button>
    </div>
  );
}
