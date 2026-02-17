import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { penceToPounds, formatDistance, SERVICE_LABELS } from '@/lib/utils';
import type { PlumberSearchResult } from '@/lib/dal/search';

interface PlumberCardProps {
  plumber: PlumberSearchResult;
}

export function PlumberCard({ plumber }: PlumberCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{plumber.business_name}</h3>
              {plumber.reputation_score >= 90 && (
                <Badge variant="secondary" className="text-xs">Trusted</Badge>
              )}
            </div>

            {/* Distance + Postcode */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{formatDistance(plumber.distance_meters)} away</span>
              <span>{plumber.display_postcode}</span>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-green-700">Available now</span>
            </div>

            {/* Services */}
            <div className="flex flex-wrap gap-1">
              {plumber.services.map((service) => (
                <Badge key={service} variant="outline" className="text-xs">
                  {SERVICE_LABELS[service] || service}
                </Badge>
              ))}
              {plumber.gas_safe_number && (
                <Badge className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-100">
                  Gas Safe
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing + CTA */}
          <div className="flex flex-col items-end gap-3 sm:min-w-[160px]">
            <div className="text-right space-y-1">
              <div className="text-sm text-gray-500">
                Callout: <span className="font-medium text-gray-900">
                  {plumber.callout_charge_pence === 0 ? 'Free' : penceToPounds(plumber.callout_charge_pence)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Day: <span className="font-medium text-gray-900">{penceToPounds(plumber.hourly_rate_day_pence)}/hr</span>
              </div>
              <div className="text-sm text-gray-500">
                Night: <span className="font-medium text-gray-900">{penceToPounds(plumber.hourly_rate_night_pence)}/hr</span>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href={`/plumber/${plumber.slug}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
