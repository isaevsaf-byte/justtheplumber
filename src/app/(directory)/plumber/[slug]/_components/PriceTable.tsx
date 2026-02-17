import { penceToPounds } from '@/lib/utils';

interface PriceTableProps {
  calloutChargePence: number;
  hourlyRateDayPence: number;
  hourlyRateNightPence: number;
}

export function PriceTable({ calloutChargePence, hourlyRateDayPence, hourlyRateNightPence }: PriceTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left font-medium text-gray-500">Fee Type</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr>
            <td className="px-4 py-3 text-gray-900">Callout Charge</td>
            <td className="px-4 py-3 text-right font-medium text-gray-900">
              {calloutChargePence === 0 ? 'Free' : penceToPounds(calloutChargePence)}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-gray-900">Day Rate</td>
            <td className="px-4 py-3 text-right font-medium text-gray-900">
              {penceToPounds(hourlyRateDayPence)}/hr
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-gray-900">Night/Weekend Rate</td>
            <td className="px-4 py-3 text-right font-medium text-gray-900">
              {penceToPounds(hourlyRateNightPence)}/hr
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
