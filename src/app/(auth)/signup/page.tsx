'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SERVICE_LABELS, generateSlug } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const STEPS = ['Email', 'Business', 'Pricing', 'Services', 'Contact'];

type ServiceKey = keyof typeof SERVICE_LABELS;

interface FormData {
  email: string;
  business_name: string;
  postcode: string;
  bio: string;
  callout_charge: string;
  hourly_rate_day: string;
  hourly_rate_night: string;
  services: ServiceKey[];
  gas_safe_number: string;
  phone_number: string;
  whatsapp_number: string;
  preferred_contact: string;
  service_radius_miles: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [form, setForm] = useState<FormData>({
    email: '',
    business_name: '',
    postcode: '',
    bio: '',
    callout_charge: '',
    hourly_rate_day: '',
    hourly_rate_night: '',
    services: ['general_plumbing'],
    gas_safe_number: '',
    phone_number: '',
    whatsapp_number: '',
    preferred_contact: 'whatsapp',
    service_radius_miles: '15',
  });

  const update = (field: keyof FormData, value: string | ServiceKey[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleEmailStep(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        emailRedirectTo: `${window.location.origin}/callback?next=/signup`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setEmailSent(true);
    }
    setLoading(false);
  }

  async function handleFinalSubmit() {
    setLoading(true);
    setError('');

    try {
      // Geocode postcode
      const geoRes = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(form.postcode.replace(/\s+/g, ''))}`
      );
      if (!geoRes.ok) {
        setError('Invalid postcode. Please check and try again.');
        setLoading(false);
        return;
      }
      const geoData = await geoRes.json();
      const { latitude, longitude } = geoData.result;

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in first.');
        setLoading(false);
        return;
      }

      // Check if user already has a profile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        router.push('/dashboard');
        return;
      }

      const slug = generateSlug(form.business_name);

      const { error } = await supabase.from('profiles').insert({
        id: user.id,
        business_name: form.business_name,
        slug,
        bio: form.bio || null,
        callout_charge_pence: Math.round((parseFloat(form.callout_charge) || 0) * 100),
        hourly_rate_day_pence: Math.round((parseFloat(form.hourly_rate_day) || 0) * 100),
        hourly_rate_night_pence: Math.round((parseFloat(form.hourly_rate_night) || 0) * 100),
        services: form.services,
        gas_safe_number: form.gas_safe_number || null,
        phone_number: form.phone_number,
        email: form.email,
        whatsapp_number: form.whatsapp_number || null,
        preferred_contact: form.preferred_contact,
        location: `POINT(${longitude} ${latitude})`,
        display_postcode: form.postcode.toUpperCase(),
        service_radius_miles: parseInt(form.service_radius_miles),
        status: 'inactive',
      });

      if (error) {
        if (error.code === '23505' && error.message.includes('slug')) {
          // Slug collision — append random suffix
          const retrySlug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
          const { error: retryError } = await supabase.from('profiles').insert({
            id: user.id,
            business_name: form.business_name,
            slug: retrySlug,
            bio: form.bio || null,
            callout_charge_pence: Math.round((parseFloat(form.callout_charge) || 0) * 100),
            hourly_rate_day_pence: Math.round((parseFloat(form.hourly_rate_day) || 0) * 100),
            hourly_rate_night_pence: Math.round((parseFloat(form.hourly_rate_night) || 0) * 100),
            services: form.services,
            gas_safe_number: form.gas_safe_number || null,
            phone_number: form.phone_number,
            email: form.email,
            whatsapp_number: form.whatsapp_number || null,
            preferred_contact: form.preferred_contact,
            location: `POINT(${longitude} ${latitude})`,
            display_postcode: form.postcode.toUpperCase(),
            service_radius_miles: parseInt(form.service_radius_miles),
            status: 'inactive',
          });
          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }

      router.push('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: string }).message) : 'Something went wrong. Please try again.';
      console.error('Signup error:', err);
      setError(msg);
    }
    setLoading(false);
  }

  function toggleService(service: ServiceKey) {
    const current = form.services;
    if (current.includes(service)) {
      if (current.length > 1) {
        update('services', current.filter((s) => s !== service));
      }
    } else {
      update('services', [...current, service]);
    }
  }

  // Step 0: Email (magic link)
  if (step === 0) {
    if (emailSent) {
      // Check if user returned authenticated
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) setStep(1);
      });

      return (
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a magic link to <strong>{form.email}</strong>.
              Click it to continue your registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const supabase = createClient();
                supabase.auth.getUser().then(({ data: { user } }) => {
                  if (user) setStep(1);
                  else setError('Not signed in yet. Check your email and click the link.');
                });
              }}
            >
              I&apos;ve clicked the link
            </Button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Join JustThePlumber</CardTitle>
          <CardDescription>
            List your plumbing business for free. No fees, ever.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailStep} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Your email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Continue'}
            </Button>
          </form>
          <div className="mt-4 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {step === 1 && 'Business Details'}
          {step === 2 && 'Your Pricing'}
          {step === 3 && 'Services You Offer'}
          {step === 4 && 'Contact Details'}
        </CardTitle>
        <CardDescription>
          {step === 1 && 'Tell customers about your business.'}
          {step === 2 && 'Transparent pricing is what makes JustThePlumber different.'}
          {step === 3 && 'Select all that apply.'}
          {step === 4 && 'How customers will contact you directly.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step 1: Business Details */}
        {step === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                placeholder="e.g. Smith Plumbing"
                value={form.business_name}
                onChange={(e) => update('business_name', e.target.value)}
                required
                minLength={3}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Your Postcode</Label>
              <Input
                id="postcode"
                placeholder="e.g. SO14 0AA"
                value={form.postcode}
                onChange={(e) => update('postcode', e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">Used to find you in searches. Only the area is shown publicly.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="radius">Service Radius (miles)</Label>
              <Select
                value={form.service_radius_miles}
                onValueChange={(v) => update('service_radius_miles', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 25, 30, 40, 50].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {r} miles
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell customers about your experience, specialities, etc."
                value={form.bio}
                onChange={(e) => update('bio', e.target.value)}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-gray-500">{form.bio.length}/500</p>
            </div>
          </>
        )}

        {/* Step 2: Pricing */}
        {step === 2 && (
          <>
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              Price transparency is the core of JustThePlumber. Customers see your rates upfront — no surprises.
            </div>
            <div className="space-y-2">
              <Label htmlFor="callout">Callout Charge (£)</Label>
              <Input
                id="callout"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.callout_charge}
                onChange={(e) => update('callout_charge', e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">Set to 0 for no callout charge.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="day_rate">Day Rate (£/hr)</Label>
              <Input
                id="day_rate"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 65.00"
                value={form.hourly_rate_day}
                onChange={(e) => update('hourly_rate_day', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="night_rate">Night/Weekend Rate (£/hr)</Label>
              <Input
                id="night_rate"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 95.00"
                value={form.hourly_rate_night}
                onChange={(e) => update('hourly_rate_night', e.target.value)}
                required
              />
            </div>
          </>
        )}

        {/* Step 3: Services */}
        {step === 3 && (
          <>
            <div className="space-y-3">
              {(Object.entries(SERVICE_LABELS) as [ServiceKey, string][]).map(([key, label]) => (
                <div key={key} className="flex items-center gap-3">
                  <Checkbox
                    id={key}
                    checked={form.services.includes(key)}
                    onCheckedChange={() => toggleService(key)}
                  />
                  <Label htmlFor={key} className="cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>
            {form.services.includes('gas_work') && (
              <div className="space-y-2">
                <Label htmlFor="gas_safe">Gas Safe Registration Number</Label>
                <Input
                  id="gas_safe"
                  placeholder="e.g. 123456"
                  value={form.gas_safe_number}
                  onChange={(e) => update('gas_safe_number', e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">Required for gas work services.</p>
              </div>
            )}
          </>
        )}

        {/* Step 4: Contact */}
        {step === 4 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. 07700 900000"
                value={form.phone_number}
                onChange={(e) => update('phone_number', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number (if different)</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="Leave blank if same as phone"
                value={form.whatsapp_number}
                onChange={(e) => update('whatsapp_number', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred Contact Method</Label>
              <Select
                value={form.preferred_contact}
                onValueChange={(v) => update('preferred_contact', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              onClick={() => {
                // Basic validation per step
                if (step === 1 && (!form.business_name || !form.postcode)) {
                  setError('Please fill in all required fields.');
                  return;
                }
                if (step === 2 && (!form.hourly_rate_day || !form.hourly_rate_night)) {
                  setError('Please enter your rates.');
                  return;
                }
                if (step === 3 && form.services.includes('gas_work') && !form.gas_safe_number) {
                  setError('Gas Safe number is required for gas work.');
                  return;
                }
                setError('');
                setStep(step + 1);
              }}
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (!form.phone_number) {
                  setError('Phone number is required.');
                  return;
                }
                handleFinalSubmit();
              }}
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Creating Profile...' : 'Create My Profile'}
            </Button>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
