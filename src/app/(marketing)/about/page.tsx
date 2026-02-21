import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — JustThePlumber',
  description: 'The story behind JustThePlumber. Built after a £503 emergency plumber bill.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold">The Legend</h1>

      <div className="prose prose-gray max-w-none space-y-4">
        <p className="text-lg text-gray-700">
          One Sunday night, a stopcock failed in the study. Nothing dramatic —
          just a steady leak from the main internal valve. The kind of thing any
          plumber could sort in twenty minutes.
        </p>

        <p className="text-gray-700">
          The bill came to <strong>£503</strong>.
        </p>

        <p className="text-gray-700">
          Not because the plumber was expensive. Because the &quot;emergency plumber
          service&quot; — the middleman who answered the phone — took their cut. A hefty
          one. For doing nothing but passing on a phone number.
        </p>

        <p className="text-gray-700">
          That night, JustThePlumber was born.
        </p>

        <p className="text-gray-700">
          It connects you directly with local plumbers who show their real prices
          upfront. No agency. No platform fee. No markup. No middleman between you
          and the person who actually fixes your pipes.
        </p>

        <div className="rounded-lg bg-blue-50 p-6 my-8">
          <p className="font-medium text-blue-900">
            Built by Saf. Always free. Always will be.
          </p>
        </div>

        <h2 className="text-xl font-bold mt-8">How it stays free</h2>

        <p className="text-gray-700">
          JustThePlumber has no investors, no ads, and no business model. It runs on
          free-tier infrastructure and is maintained as a public service. It exists
          for one reason: to stop people getting ripped off when their pipes burst
          at the worst possible moment.
        </p>

        <h2 className="text-xl font-bold mt-8">The rules</h2>

        <p className="text-gray-700">
          Plumbers list for free, forever. Customers search and contact for free,
          forever. Every plumber must display their callout charge and hourly rates —
          day and night — before they appear in a single search result. No middleman
          ever touches the connection between you and the plumber. You find them, you
          contact them directly, you deal with them and only them.
        </p>

        <h2 className="text-xl font-bold mt-8">Contact</h2>

        <p className="text-gray-700">
          Got feedback, found a bug, or want to help?{' '}
          <a href="mailto:hello@justtheplumber.co.uk" className="text-blue-600 hover:underline">
            hello@justtheplumber.co.uk
          </a>
        </p>
      </div>
    </div>
  );
}
