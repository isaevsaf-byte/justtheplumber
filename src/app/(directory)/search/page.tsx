import { Suspense } from 'react';
import { resolvePostcode } from '@/lib/geocoding';
import { SearchBar } from './_components/SearchBar';
import { ServiceFilter } from './_components/ServiceFilter';
import { SearchResults } from './_components/SearchResults';
import { Card, CardContent } from '@/components/ui/card';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; service?: string }>;
}

function SearchSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-5 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const service = params.service;

  let geo: { latitude: number; longitude: number } | null = null;
  let geoError = false;

  if (query) {
    try {
      geo = await resolvePostcode(query);
    } catch {
      geoError = true;
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <SearchBar defaultValue={query} />

      {query && !geoError && (
        <Suspense fallback={null}>
          <ServiceFilter />
        </Suspense>
      )}

      {!query && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Enter your postcode to find local plumbers with transparent pricing.</p>
          </CardContent>
        </Card>
      )}

      {geoError && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-red-600 font-medium">
              We couldn&apos;t find that postcode. Please check and try again.
            </p>
          </CardContent>
        </Card>
      )}

      {geo && (
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults
            lat={geo.latitude}
            lng={geo.longitude}
            postcode={query.toUpperCase()}
            service={service}
          />
        </Suspense>
      )}
    </div>
  );
}
