import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Footer } from '@/components/shared/Footer';
import { SearchBar } from '@/app/(directory)/search/_components/SearchBar';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Logo />
          <nav className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-gray-900">For Plumbers</Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">Sign In</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Find a local plumber with{' '}
              <span className="text-blue-600">honest pricing</span>
            </h1>
            <p className="text-lg text-gray-600">
              Just the plumber. Just the price. No middleman.
            </p>
            <div className="mx-auto max-w-md">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t bg-white px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-12">
              How it works
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold">Search</h3>
                <p className="text-sm text-gray-600">
                  Enter your postcode to find plumbers available near you right now.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold">Compare prices</h3>
                <p className="text-sm text-gray-600">
                  See callout charges and hourly rates upfront. No hidden fees, no surprises.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold">Contact directly</h3>
                <p className="text-sm text-gray-600">
                  WhatsApp, call, or email the plumber directly. No middleman takes a cut.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="border-t bg-gray-50 px-4 py-16">
          <div className="mx-auto max-w-2xl text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              No fees. No middleman. Just plumbers.
            </h2>
            <p className="text-gray-600">
              JustThePlumber is 100% free for everyone. Plumbers list for free.
              You search for free. Nobody takes a cut. We built this because getting
              ripped off by a middleman on a Sunday night shouldn&apos;t happen to anyone.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
