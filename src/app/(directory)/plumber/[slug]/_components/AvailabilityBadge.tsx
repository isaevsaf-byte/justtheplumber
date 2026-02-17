import { formatAvailability } from '@/lib/utils';

interface AvailabilityBadgeProps {
  availableFrom: string | null;
  availableUntil: string | null;
}

export function AvailabilityBadge({ availableFrom, availableUntil }: AvailabilityBadgeProps) {
  const text = formatAvailability(availableFrom, availableUntil);
  const isAvailable = availableUntil && new Date(availableUntil) > new Date();

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2.5 w-2.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`} />
      <span className={`text-sm font-medium ${isAvailable ? 'text-green-700' : 'text-gray-500'}`}>
        {text}
      </span>
    </div>
  );
}
