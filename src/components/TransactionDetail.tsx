import { useEffect } from 'react';
import type { Transaction } from '@/types/transaction';
import { getRiskLevel } from '@/types/transaction';

interface TransactionDetailProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const riskStyles: Record<'high' | 'medium' | 'low', string> = {
  high: 'bg-red-100 text-risk-high',
  medium: 'bg-amber-100 text-risk-medium',
  low: 'bg-green-100 text-risk-low',
};

const riskLabels: Record<'high' | 'medium' | 'low', string> = {
  high: 'HIGH RISK',
  medium: 'MEDIUM RISK',
  low: 'LOW RISK',
};

export function TransactionDetail({ transaction, onClose }: TransactionDetailProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!transaction) return null;

  const level = getRiskLevel(transaction.riskScore);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-white shadow-xl sm:max-w-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 id="detail-title" className="text-lg font-semibold text-gray-900">
            Transaction details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>
        <div className="space-y-4 px-6 py-4">
          <div>
            <span className="text-xs font-medium uppercase text-gray-500">ID</span>
            <p className="text-gray-900">{transaction.id}</p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase text-gray-500">Amount</span>
            <p className="text-lg font-medium text-gray-900">
              ${transaction.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase text-gray-500">User</span>
            <p className="text-gray-900">{transaction.user}</p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase text-gray-500">Timestamp</span>
            <p className="text-gray-900">
              {new Date(transaction.timestamp).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase text-gray-500">Risk level</span>
            <p>
              <span className={`inline-flex rounded px-2 py-1 text-sm font-semibold ${riskStyles[level]}`}>
                {riskLabels[level]}
              </span>
            </p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase text-gray-500">Risk score</span>
            <p className="text-gray-900">{transaction.riskScore} / 100</p>
          </div>
        </div>
      </div>
    </>
  );
}
