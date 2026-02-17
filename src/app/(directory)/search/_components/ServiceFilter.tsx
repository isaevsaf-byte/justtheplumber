'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { SERVICE_LABELS } from '@/lib/utils';

export function ServiceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentService = searchParams.get('service');
  const currentQuery = searchParams.get('q') || '';

  function selectService(service: string | null) {
    const params = new URLSearchParams();
    if (currentQuery) params.set('q', currentQuery);
    if (service) params.set('service', service);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={!currentService ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => selectService(null)}
      >
        All
      </Badge>
      {Object.entries(SERVICE_LABELS).map(([key, label]) => (
        <Badge
          key={key}
          variant={currentService === key ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => selectService(key)}
        >
          {label}
        </Badge>
      ))}
    </div>
  );
}
