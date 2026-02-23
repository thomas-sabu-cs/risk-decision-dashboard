import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useFilter } from '@/context/FilterContext';
import { getRiskLevel } from '@/types/transaction';
import type { Transaction } from '@/types/transaction';
import { TransactionRow } from './TransactionRow';

interface TransactionListProps {
  onSelectTransaction: (t: Transaction) => void;
}

function filterByRisk(
  items: Transaction[],
  filter: 'all' | 'high' | 'medium' | 'low'
): Transaction[] {
  if (filter === 'all') return items;
  return items.filter((t) => getRiskLevel(t.riskScore) === filter);
}

export function TransactionList({ onSelectTransaction }: TransactionListProps) {
  const { items, loading, error } = useSelector(
    (state: RootState) => state.transactions
  );
  const { riskFilter } = useFilter();

  const filtered = useMemo(
    () => filterByRisk(items, riskFilter),
    [items, riskFilter]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {error}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-600">
        No transactions match the current filter.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
              User
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
              Timestamp
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
              Risk
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
              Score
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {filtered.map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              onSelect={onSelectTransaction}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
