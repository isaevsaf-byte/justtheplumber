import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500">
            JustThePlumber.co.uk — No fees. No middleman. Just plumbers.
          </p>
          <nav className="flex gap-6">
            <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900">
              About
            </Link>
            <Link href="/how-it-works" className="text-sm text-gray-500 hover:text-gray-900">
              For Plumbers
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
