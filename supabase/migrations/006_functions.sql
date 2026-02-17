-- Search Nearby Plumbers
CREATE OR REPLACE FUNCTION public.search_nearby_plumbers(
  search_lat DOUBLE PRECISION,
  search_lng DOUBLE PRECISION,
  radius_m DOUBLE PRECISION DEFAULT 32186,
  service_filter service_category DEFAULT NULL
)
RETURNS TABLE (
  id UUID, business_name TEXT, slug TEXT, display_postcode TEXT,
  callout_charge_pence INT, hourly_rate_day_pence INT,
  hourly_rate_night_pence INT, services service_category[],
  gas_safe_number TEXT, reputation_score INT, total_reveals INT,
  distance_meters DOUBLE PRECISION, available_since TIMESTAMPTZ,
  bio TEXT, service_radius_miles INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.business_name, p.slug, p.display_postcode,
    p.callout_charge_pence, p.hourly_rate_day_pence,
    p.hourly_rate_night_pence, p.services, p.gas_safe_number,
    p.reputation_score, p.total_reveals,
    ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography
    ) AS distance_meters,
    p.updated_at AS available_since,
    p.bio,
    p.service_radius_miles
  FROM public.profiles p
  WHERE p.status = 'active'
    AND ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography,
      LEAST(radius_m, p.service_radius_miles * 1609.34)
    )
    AND (available_from IS NULL OR available_from <= NOW())
    AND available_until > NOW()
    AND (service_filter IS NULL OR service_filter = ANY(p.services))
  ORDER BY
    ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography
    ) ASC,
    p.reputation_score DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reveal Contact (rate-limited)
CREATE OR REPLACE FUNCTION public.reveal_contact(target_plumber_id UUID)
RETURNS TABLE (
  phone_number TEXT, email TEXT, whatsapp_number TEXT,
  preferred_contact TEXT, business_name TEXT
) AS $$
DECLARE recent_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.contact_reveals
  WHERE user_id = auth.uid() AND created_at > NOW() - INTERVAL '1 hour';

  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. JustThePlumber protects plumbers from spam.';
  END IF;

  INSERT INTO public.contact_reveals (user_id, plumber_id)
  VALUES (auth.uid(), target_plumber_id);

  UPDATE public.profiles SET total_reveals = total_reveals + 1
  WHERE id = target_plumber_id;

  RETURN QUERY
  SELECT p.phone_number, p.email, p.whatsapp_number,
         p.preferred_contact, p.business_name
  FROM public.profiles p
  WHERE p.id = target_plumber_id AND p.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Go Available
CREATE OR REPLACE FUNCTION public.go_available(
  duration_hours INT DEFAULT 12,
  start_from TIMESTAMPTZ DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET status = 'active',
      available_from = COALESCE(start_from, NOW()),
      available_until = COALESCE(start_from, NOW()) + (duration_hours || ' hours')::INTERVAL,
      updated_at = NOW()
  WHERE id = auth.uid()
    AND status NOT IN ('suspended', 'onboarding');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Go Offline
CREATE OR REPLACE FUNCTION public.go_offline()
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET status = 'inactive',
      available_from = NULL,
      available_until = NULL,
      updated_at = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
