import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className ?? ''}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
        JP
      </div>
      <span className="font-semibold text-lg text-gray-900">
        Just<span className="text-blue-600">The</span>Plumber
      </span>
    </Link>
  );
}
