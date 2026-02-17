-- Expire stale availability windows every 10 minutes
SELECT cron.schedule('reaper-expired-availability', '*/10 * * * *',
  $$ UPDATE public.profiles
     SET status = 'inactive', available_from = NULL, available_until = NULL
     WHERE status = 'active'
       AND available_until IS NOT NULL
       AND available_until < NOW(); $$
);

-- Review suspensions every Monday at 6am
SELECT cron.schedule('review-suspensions', '0 6 * * 1',
  $$ UPDATE public.profiles p SET status = 'inactive'
     WHERE p.status = 'suspended'
       AND (
         SELECT COALESCE(SUM(
           CASE
             WHEN EXISTS (SELECT 1 FROM public.contact_reveals cr
               WHERE cr.user_id = r.reporter_id AND cr.plumber_id = r.target_id) THEN 1.5
             WHEN (SELECT created_at FROM auth.users WHERE id = r.reporter_id)
               < NOW() - INTERVAL '30 days' THEN 1.0
             WHEN (SELECT created_at FROM auth.users WHERE id = r.reporter_id)
               > NOW() - INTERVAL '7 days' THEN 0.3
             ELSE 0.5
           END
         ), 0)
         FROM public.reports r
         WHERE r.target_id = p.id AND r.created_at > NOW() - INTERVAL '30 days'
       ) < 4.0; $$
);
