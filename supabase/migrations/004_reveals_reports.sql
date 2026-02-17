CREATE TABLE public.contact_reveals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plumber_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reveals_user_time
  ON public.contact_reveals (user_id, created_at DESC);

CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id),
  target_id UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT NOT NULL CHECK (char_length(reason) BETWEEN 10 AND 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(reporter_id, target_id)
);

CREATE TABLE public.moderation_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  target_id UUID NOT NULL REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  reason TEXT,
  report_score NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
