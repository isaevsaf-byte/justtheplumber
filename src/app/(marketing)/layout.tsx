import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Footer } from '@/components/shared/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
