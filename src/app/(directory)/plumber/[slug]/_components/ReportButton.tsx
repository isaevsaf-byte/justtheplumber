'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { reportPlumber } from '../actions';

interface ReportButtonProps {
  plumberId: string;
  isAuthenticated: boolean;
}

export function ReportButton({ plumberId, isAuthenticated }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  async function handleSubmit() {
    if (reason.length < 10) return;
    setLoading(true);

    const res = await reportPlumber(plumberId, reason);
    setResult(res);
    setLoading(false);

    if ('success' in res) {
      setTimeout(() => setOpen(false), 2000);
    }
  }

  if (!isAuthenticated) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
          Report this listing
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this plumber</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {result?.success ? (
            <p className="text-sm text-green-600">
              Thank you. Your report has been submitted and will be reviewed automatically.
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                Reports are reviewed automatically. False reports from new accounts carry less weight.
              </p>
              <Textarea
                placeholder="Describe the issue (minimum 10 characters)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                minLength={10}
                maxLength={500}
                rows={4}
              />
              <p className="text-xs text-gray-400">{reason.length}/500</p>
              {result?.error && (
                <p className="text-sm text-red-600">{result.error}</p>
              )}
              <Button
                onClick={handleSubmit}
                disabled={loading || reason.length < 10}
                variant="destructive"
                className="w-full"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
