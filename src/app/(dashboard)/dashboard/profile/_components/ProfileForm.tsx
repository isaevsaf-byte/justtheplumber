'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SERVICE_LABELS } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { Profile, ServiceCategory } from '@/types/database.types';

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    business_name: profile.business_name,
    bio: profile.bio || '',
    callout_charge: String((profile.callout_charge_pence / 100).toFixed(2)),
    hourly_rate_day: String((profile.hourly_rate_day_pence / 100).toFixed(2)),
    hourly_rate_night: String((profile.hourly_rate_night_pence / 100).toFixed(2)),
    services: profile.services as ServiceCategory[],
    gas_safe_number: profile.gas_safe_number || '',
    phone_number: profile.phone_number,
    whatsapp_number: profile.whatsapp_number || '',
    preferred_contact: profile.preferred_contact,
    service_radius_miles: String(profile.service_radius_miles),
    postcode: profile.display_postcode,
  });

  const update = (field: string, value: string | ServiceCategory[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function toggleService(service: ServiceCategory) {
    const current = form.services;
    if (current.includes(service)) {
      if (current.length > 1) {
        update('services', current.filter((s) => s !== service));
      }
    } else {
      update('services', [...current, service]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Re-geocode if postcode changed
      let location = undefined;
      if (form.postcode.replace(/\s+/g, '').toUpperCase() !== profile.display_postcode.replace(/\s+/g, '').toUpperCase()) {
        const geoRes = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(form.postcode.replace(/\s+/g, ''))}`
        );
        if (!geoRes.ok) {
          setError('Invalid postcode.');
          setLoading(false);
          return;
        }
        const geoData = await geoRes.json();
        location = `POINT(${geoData.result.longitude} ${geoData.result.latitude})`;
      }

      const supabase = createClient();
      const updateData: Record<string, unknown> = {
        business_name: form.business_name,
        bio: form.bio || null,
        callout_charge_pence: Math.round(parseFloat(form.callout_charge) * 100),
        hourly_rate_day_pence: Math.round(parseFloat(form.hourly_rate_day) * 100),
        hourly_rate_night_pence: Math.round(parseFloat(form.hourly_rate_night) * 100),
        services: form.services,
        gas_safe_number: form.gas_safe_number || null,
        phone_number: form.phone_number,
        email: profile.email,
        whatsapp_number: form.whatsapp_number || null,
        preferred_contact: form.preferred_contact,
        service_radius_miles: parseInt(form.service_radius_miles),
        display_postcode: form.postcode.toUpperCase(),
        updated_at: new Date().toISOString(),
      };

      if (location) {
        updateData.location = location;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) throw error;

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Details */}
      <div className="space-y-4">
        <h3 className="font-medium">Business Details</h3>
        <div className="space-y-2">
          <Label htmlFor="business_name">Business Name</Label>
          <Input
            id="business_name"
            value={form.business_name}
            onChange={(e) => update('business_name', e.target.value)}
            required
            minLength={3}
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            value={form.postcode}
            onChange={(e) => update('postcode', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Service Radius</Label>
          <Select value={form.service_radius_miles} onValueChange={(v) => update('service_radius_miles', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 25, 30, 40, 50].map((r) => (
                <SelectItem key={r} value={String(r)}>{r} miles</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(e) => update('bio', e.target.value)}
            maxLength={500}
            rows={3}
          />
          <p className="text-xs text-gray-500">{form.bio.length}/500</p>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="font-medium">Pricing</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="callout">Callout (£)</Label>
            <Input id="callout" type="number" min="0" step="0.01" value={form.callout_charge} onChange={(e) => update('callout_charge', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="day">Day Rate (£/hr)</Label>
            <Input id="day" type="number" min="0.01" step="0.01" value={form.hourly_rate_day} onChange={(e) => update('hourly_rate_day', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="night">Night Rate (£/hr)</Label>
            <Input id="night" type="number" min="0.01" step="0.01" value={form.hourly_rate_night} onChange={(e) => update('hourly_rate_night', e.target.value)} required />
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-4">
        <h3 className="font-medium">Services</h3>
        <div className="space-y-3">
          {(Object.entries(SERVICE_LABELS) as [ServiceCategory, string][]).map(([key, label]) => (
            <div key={key} className="flex items-center gap-3">
              <Checkbox
                id={`edit-${key}`}
                checked={form.services.includes(key)}
                onCheckedChange={() => toggleService(key)}
              />
              <Label htmlFor={`edit-${key}`} className="cursor-pointer">{label}</Label>
            </div>
          ))}
        </div>
        {form.services.includes('gas_work') && (
          <div className="space-y-2">
            <Label htmlFor="gas_safe">Gas Safe Number</Label>
            <Input id="gas_safe" value={form.gas_safe_number} onChange={(e) => update('gas_safe_number', e.target.value)} required />
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <h3 className="font-medium">Contact Details</h3>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" value={form.phone_number} onChange={(e) => update('phone_number', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
          <Input id="whatsapp" type="tel" value={form.whatsapp_number} onChange={(e) => update('whatsapp_number', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Preferred Contact</Label>
          <Select value={form.preferred_contact} onValueChange={(v) => update('preferred_contact', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="phone">Phone Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Profile updated successfully.</p>}

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
