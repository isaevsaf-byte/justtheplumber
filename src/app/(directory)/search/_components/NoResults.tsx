import { Card, CardContent } from '@/components/ui/card';

interface NoResultsProps {
  postcode: string;
}

export function NoResults({ postcode }: NoResultsProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="mx-auto max-w-md space-y-3">
          <p className="text-lg font-medium text-gray-900">
            No plumbers available near {postcode} right now
          </p>
          <p className="text-sm text-gray-500">
            Plumbers set their own availability windows. Try checking back later
            or expanding your search to a nearby area.
          </p>
          <p className="text-sm text-gray-500">
            Are you a plumber?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Join JustThePlumber for free
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
