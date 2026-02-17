import { Card, CardContent } from '@/components/ui/card';

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      <div className="animate-pulse space-y-3">
        <div className="h-7 w-64 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-36 bg-gray-200 rounded" />
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-5 w-20 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </CardContent>
      </Card>
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
