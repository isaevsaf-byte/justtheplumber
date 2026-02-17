import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Plumbers — JustThePlumber',
  description: 'Join JustThePlumber for free. No fees, no commission, no catches. List your plumbing business with transparent pricing.',
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">For Plumbers</h1>
        <p className="text-lg text-gray-600">
          List your business on JustThePlumber. No fees. No catches. No commission. Ever.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-2">
            <h3 className="font-semibold text-lg">1. Sign up in 2 minutes</h3>
            <p className="text-gray-600 text-sm">
              Enter your email, business name, postcode, rates, and contact details.
              That&apos;s it. No documents, no verification calls, no waiting.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <h3 className="font-semibold text-lg">2. Set your availability</h3>
            <p className="text-gray-600 text-sm">
              Toggle yourself as available when you want work. Set a time window —
              &quot;Available today&quot;, &quot;This evening&quot;, or a custom window. When your window
              expires, you automatically go offline.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <h3 className="font-semibold text-lg">3. Get contacted directly</h3>
            <p className="text-gray-600 text-sm">
              Customers see your real prices and contact you directly via WhatsApp,
              phone, or email. No middleman, no lead fee, no percentage cut. You set
              the price, you keep everything.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg bg-blue-50 p-6 space-y-3">
        <h3 className="font-semibold">Why is it free?</h3>
        <p className="text-sm text-gray-700">
          JustThePlumber was built after the founder got charged £503 for a simple
          emergency repair — most of which went to the middleman, not the plumber.
          This platform exists so that never happens again. It runs on free-tier
          infrastructure and has no revenue model by design.
        </p>
      </div>

      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/signup">Join JustThePlumber — It&apos;s Free</Link>
        </Button>
      </div>
    </div>
  );
}
