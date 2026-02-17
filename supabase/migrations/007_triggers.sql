-- Governance Trigger (Weighted Trust Scoring)
CREATE OR REPLACE FUNCTION public.evaluate_reports()
RETURNS TRIGGER AS $$
DECLARE
  weighted_score NUMERIC;
  SUSPEND_THRESHOLD CONSTANT NUMERIC := 4.0;
BEGIN
  SELECT COALESCE(SUM(
    CASE
      WHEN EXISTS (
        SELECT 1 FROM public.contact_reveals cr
        WHERE cr.user_id = r.reporter_id AND cr.plumber_id = r.target_id
      ) THEN 1.5
      WHEN (SELECT created_at FROM auth.users WHERE id = r.reporter_id)
           < NOW() - INTERVAL '30 days' THEN 1.0
      WHEN (SELECT created_at FROM auth.users WHERE id = r.reporter_id)
           > NOW() - INTERVAL '7 days' THEN 0.3
      ELSE 0.5
    END
  ), 0) INTO weighted_score
  FROM public.reports r
  WHERE r.target_id = NEW.target_id
    AND r.created_at > NOW() - INTERVAL '30 days';

  IF weighted_score >= SUSPEND_THRESHOLD THEN
    UPDATE public.profiles SET status = 'suspended'
    WHERE id = NEW.target_id AND status != 'suspended';

    INSERT INTO public.moderation_log (target_id, action, reason, report_score)
    VALUES (NEW.target_id, 'AUTO_SUSPEND', 'Weighted threshold exceeded', weighted_score);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_evaluate_reports
AFTER INSERT ON public.reports
FOR EACH ROW EXECUTE FUNCTION public.evaluate_reports();
