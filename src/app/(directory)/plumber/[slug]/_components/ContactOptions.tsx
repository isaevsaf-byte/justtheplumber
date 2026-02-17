'use client';

import { Button } from '@/components/ui/button';
import { generateWhatsAppLink } from '@/lib/utils';

interface ContactOptionsProps {
  phone: string;
  email: string;
  whatsapp: string | null;
  preferred: string;
  businessName: string;
}

export function ContactOptions({ phone, email, whatsapp, preferred, businessName }: ContactOptionsProps) {
  const whatsappNumber = whatsapp || phone;

  const actions = [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      href: generateWhatsAppLink(whatsappNumber, businessName),
      className: 'bg-green-600 hover:bg-green-700 text-white',
    },
    {
      key: 'phone',
      label: `Call ${phone}`,
      href: `tel:${phone}`,
      className: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      key: 'email',
      label: 'Send Email',
      href: `mailto:${email}?subject=Plumbing enquiry via JustThePlumber`,
      className: '',
    },
  ];

  // Put preferred first
  const sorted = [
    ...actions.filter((a) => a.key === preferred),
    ...actions.filter((a) => a.key !== preferred),
  ];

  return (
    <div className="space-y-2">
      {sorted.map((action, i) => (
        <Button
          key={action.key}
          asChild
          className={`w-full ${i === 0 ? action.className : ''}`}
          variant={i === 0 ? 'default' : 'outline'}
          size={i === 0 ? 'lg' : 'default'}
        >
          <a href={action.href} target={action.key === 'whatsapp' ? '_blank' : undefined} rel="noopener noreferrer">
            {action.label}
            {i === 0 && ' (Preferred)'}
          </a>
        </Button>
      ))}
    </div>
  );
}
