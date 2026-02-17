-- Public View (safe for anonymous access — no contact info)
CREATE VIEW public.view_profiles_public AS
SELECT
  id, business_name, slug, bio, display_postcode,
  callout_charge_pence, hourly_rate_day_pence, hourly_rate_night_pence,
  services, gas_safe_number, reputation_score, total_reveals,
  status, service_radius_miles, location,
  available_from, available_until, created_at
FROM public.profiles
WHERE status = 'active';

GRANT SELECT ON public.view_profiles_public TO anon, authenticated;

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS for contact_reveals
ALTER TABLE public.contact_reveals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reveals"
  ON public.contact_reveals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reveals"
  ON public.contact_reveals FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS for reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Users can insert own reports"
  ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
