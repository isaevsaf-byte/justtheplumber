import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateWhatsAppLink(
  whatsappNumber: string,
  businessName: string,
  userPostcode?: string
): string {
  const cleaned = whatsappNumber.replace(/\D/g, '');
  const withCountry = cleaned.startsWith('44') ? cleaned :
                      cleaned.startsWith('0') ? `44${cleaned.slice(1)}` : cleaned;

  const message = encodeURIComponent(
    `Hi, I found you on JustThePlumber.co.uk. I need help with a plumbing issue${userPostcode ? ` in ${userPostcode}` : ''}.`
  );

  return `https://wa.me/${withCountry}?text=${message}`;
}

export function penceToPounds(pence: number): string {
  return `£${(pence / 100).toFixed(pence % 100 === 0 ? 0 : 2)}`;
}

export function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  return miles < 1 ? `${Math.round(miles * 10) / 10} miles` : `${Math.round(miles)} miles`;
}

export function formatAvailability(from: string | null, until: string | null): string {
  if (!until) return 'Not available';
  const untilDate = new Date(until);
  const now = new Date();
  const fromDate = from ? new Date(from) : null;

  if (fromDate && fromDate > now) {
    return `Available from ${fromDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return `Available until ${untilDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

export function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const SERVICE_LABELS: Record<string, string> = {
  general_plumbing: 'General Plumbing',
  emergency_repair: 'Emergency Repair',
  gas_work: 'Gas Work',
  drainage: 'Drainage',
  bathroom_fitting: 'Bathroom Fitting',
  heating: 'Heating',
  boiler_service: 'Boiler Service',
};
