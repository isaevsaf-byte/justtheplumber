'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactOptions } from './ContactOptions';
import { revealContactDetails } from '../actions';

interface RevealButtonProps {
  plumberId: string;
  isAuthenticated: boolean;
}

export function RevealButton({ plumberId, isAuthenticated }: RevealButtonProps) {
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState<{
    phone: string;
    email: string;
    whatsapp: string | null;
    preferred: string;
    businessName: string;
  } | null>(null);
  const [error, setError] = useState('');

  async function handleReveal() {
    setLoading(true);
    setError('');

    const result = await revealContactDetails(plumberId);

    if ('error' in result && result.error) {
      setError(result.error);
    } else if (result.phone) {
      setContact({
        phone: result.phone,
        email: result.email!,
        whatsapp: result.whatsapp ?? null,
        preferred: result.preferred!,
        businessName: result.businessName!,
      });
    }
    setLoading(false);
  }

  if (contact) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-lg">Contact {contact.businessName}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactOptions {...contact} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-6 text-center space-y-3">
        {!isAuthenticated ? (
          <>
            <p className="text-sm text-gray-600">Sign in to see contact details</p>
            <Button asChild>
              <a href="/login">Sign In</a>
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleReveal} disabled={loading} size="lg" className="w-full">
              {loading ? 'Loading...' : 'Show Contact Details'}
            </Button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
