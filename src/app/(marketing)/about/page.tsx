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
          One Sunday night, a pipe burst. Nothing dramatic — just a leak under
          the kitchen sink. The kind of thing any plumber could fix in twenty minutes.
        </p>

        <p className="text-gray-700">
          The bill came to <strong>£503</strong>. Not because the plumber was expensive,
          but because the &quot;emergency plumber service&quot; — the middleman who answered the
          phone — took their cut. A hefty one.
        </p>

        <p className="text-gray-700">
          That&apos;s why JustThePlumber exists. It connects you directly with local plumbers
          who show their real prices upfront. No agency, no platform fee, no markup.
        </p>

        <div className="rounded-lg bg-blue-50 p-6 my-8">
          <p className="font-medium text-blue-900">
            Built by Saf after a £503 emergency plumber bill. Always free. No fees for
            plumbers, no fees for you. Just honest pricing and a direct line.
          </p>
        </div>

        <h2 className="text-xl font-bold mt-8">How it stays free</h2>

        <p className="text-gray-700">
          JustThePlumber has no investors, no ads, and no revenue model. It runs on
          free-tier infrastructure and costs nothing to operate. It exists purely to
          stop people getting ripped off when their pipes burst.
        </p>

        <h2 className="text-xl font-bold mt-8">The rules</h2>

        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Plumbers list for free, forever.</li>
          <li>Customers search and contact for free, forever.</li>
          <li>All plumbers must display their real prices upfront.</li>
          <li>No middleman ever touches the connection between you and the plumber.</li>
          <li>No reviews, no ratings (yet) — just transparent pricing and direct contact.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8">Contact</h2>

        <p className="text-gray-700">
          Got feedback or found a bug? Email{' '}
          <a href="mailto:hello@justtheplumber.co.uk" className="text-blue-600 hover:underline">
            hello@justtheplumber.co.uk
          </a>
        </p>
      </div>
    </div>
  );
}
