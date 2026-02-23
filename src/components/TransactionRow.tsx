import type { Transaction } from '@/types/transaction';
import { getRiskLevel } from '@/types/transaction';

interface TransactionRowProps {
  transaction: Transaction;
  onSelect: (t: Transaction) => void;
}

const riskStyles: Record<'high' | 'medium' | 'low', string> = {
  high: 'bg-red-100 text-risk-high font-semibold',
  medium: 'bg-amber-100 text-risk-medium font-semibold',
  low: 'bg-green-100 text-risk-low font-semibold',
};

const riskLabels: Record<'high' | 'medium' | 'low', string> = {
  high: 'HIGH RISK',
  medium: 'MEDIUM RISK',
  low: 'LOW RISK',
};

export function TransactionRow({ transaction, onSelect }: TransactionRowProps) {
  const level = getRiskLevel(transaction.riskScore);
  const label = riskLabels[level];
  const style = riskStyles[level];

  return (
    <tr
      className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors"
      onClick={() => onSelect(transaction)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(transaction);
        }
      }}
    >
      <td className="px-4 py-3 text-sm text-gray-900">{transaction.id}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        ${transaction.amount.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{transaction.user}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {new Date(transaction.timestamp).toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded px-2 py-0.5 text-xs ${style}`}>
          {label}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{transaction.riskScore}</td>
    </tr>
  );
}
