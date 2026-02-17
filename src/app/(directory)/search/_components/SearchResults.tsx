import { searchPlumbers } from '@/lib/dal/search';
import { PlumberCard } from './PlumberCard';
import { NoResults } from './NoResults';

interface SearchResultsProps {
  lat: number;
  lng: number;
  postcode: string;
  service?: string;
}

export async function SearchResults({ lat, lng, postcode, service }: SearchResultsProps) {
  const results = await searchPlumbers({ lat, lng, service });

  if (results.length === 0) {
    return <NoResults postcode={postcode} />;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        {results.length} plumber{results.length !== 1 ? 's' : ''} available near {postcode}
      </p>
      {results.map((plumber) => (
        <PlumberCard key={plumber.id} plumber={plumber} />
      ))}
    </div>
  );
}
