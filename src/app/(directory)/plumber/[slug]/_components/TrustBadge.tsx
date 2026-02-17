import { Badge } from '@/components/ui/badge';

interface TrustBadgeProps {
  score: number;
}

export function TrustBadge({ score }: TrustBadgeProps) {
  if (score >= 90) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
        Trusted
      </Badge>
    );
  }
  if (score >= 70) {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        Verified
      </Badge>
    );
  }
  return null;
}
