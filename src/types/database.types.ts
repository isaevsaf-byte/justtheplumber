// Auto-generated types placeholder
// Run: npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
// For now, manual types are used in the DAL layer.

export type ProfileStatus = 'onboarding' | 'active' | 'inactive' | 'suspended' | 'hidden';

export type ServiceCategory =
  | 'general_plumbing'
  | 'emergency_repair'
  | 'gas_work'
  | 'drainage'
  | 'bathroom_fitting'
  | 'heating'
  | 'boiler_service';

export interface Profile {
  id: string;
  business_name: string;
  slug: string;
  bio: string | null;
  callout_charge_pence: number;
  hourly_rate_day_pence: number;
  hourly_rate_night_pence: number;
  services: ServiceCategory[];
  gas_safe_number: string | null;
  phone_number: string;
  email: string;
  whatsapp_number: string | null;
  website_url: string | null;
  preferred_contact: 'whatsapp' | 'phone' | 'email';
  location: unknown;
  display_postcode: string;
  service_radius_miles: number;
  status: ProfileStatus;
  available_from: string | null;
  available_until: string | null;
  reputation_score: number;
  total_reveals: number;
  created_at: string;
  updated_at: string;
}
