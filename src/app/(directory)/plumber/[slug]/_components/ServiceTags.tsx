import { Badge } from '@/components/ui/badge';
import { SERVICE_LABELS } from '@/lib/utils';

interface ServiceTagsProps {
  services: string[];
  gasSafeNumber?: string | null;
}

export function ServiceTags({ services, gasSafeNumber }: ServiceTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {services.map((service) => (
        <Badge key={service} variant="outline">
          {SERVICE_LABELS[service] || service}
        </Badge>
      ))}
      {gasSafeNumber && (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          Gas Safe: {gasSafeNumber}
        </Badge>
      )}
    </div>
  );
}
