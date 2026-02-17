import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            About
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            For Plumbers
          </Link>
          {user ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
