CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Business Identity
  business_name TEXT NOT NULL CHECK (char_length(business_name) BETWEEN 3 AND 100),
  slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  bio TEXT CHECK (char_length(bio) <= 500),

  -- PRICE TRANSPARENCY (mandatory — the core product value)
  -- Stored in pence as integers to avoid float rounding errors
  -- £65/hr = 6500. Display layer divides by 100.
  callout_charge_pence INT NOT NULL CHECK (callout_charge_pence >= 0),
  hourly_rate_day_pence INT NOT NULL CHECK (hourly_rate_day_pence > 0),
  hourly_rate_night_pence INT NOT NULL CHECK (hourly_rate_night_pence > 0),

  -- Services
  services service_category[] NOT NULL DEFAULT '{general_plumbing}',

  -- Certifications
  gas_safe_number TEXT,
  CONSTRAINT chk_gas_safe CHECK (
    NOT ('gas_work' = ANY(services)) OR gas_safe_number IS NOT NULL
  ),

  -- Contact Information (PROTECTED by RLS — never exposed in public queries)
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT,
  website_url TEXT,
  preferred_contact TEXT NOT NULL DEFAULT 'whatsapp'
    CHECK (preferred_contact IN ('whatsapp', 'phone', 'email')),

  -- Spatial Data
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  display_postcode TEXT NOT NULL,
  service_radius_miles INT NOT NULL DEFAULT 15
    CHECK (service_radius_miles BETWEEN 1 AND 50),

  -- Availability (daily opt-in window model)
  status profile_status NOT NULL DEFAULT 'onboarding',
  available_from TIMESTAMPTZ,
  available_until TIMESTAMPTZ,

  -- Trust & Reputation
  reputation_score INT NOT NULL DEFAULT 100
    CHECK (reputation_score BETWEEN 0 AND 100),
  total_reveals INT NOT NULL DEFAULT 0,

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_profiles_location ON public.profiles USING GIST (location);
CREATE INDEX idx_profiles_active ON public.profiles (status) WHERE status = 'active';
CREATE INDEX idx_profiles_slug ON public.profiles (slug);
CREATE INDEX idx_profiles_search_rank
  ON public.profiles (reputation_score DESC, total_reveals DESC)
  WHERE status = 'active';
