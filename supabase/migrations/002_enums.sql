CREATE TYPE profile_status AS ENUM (
  'onboarding',
  'active',
  'inactive',
  'suspended',
  'hidden'
);

CREATE TYPE service_category AS ENUM (
  'general_plumbing',
  'emergency_repair',
  'gas_work',
  'drainage',
  'bathroom_fitting',
  'heating',
  'boiler_service'
);
