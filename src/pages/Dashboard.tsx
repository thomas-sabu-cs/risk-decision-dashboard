import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { loadTransactions } from '@/store/transactionsSlice';
import type { Transaction } from '@/types/transaction';
import { FilterBar } from '@/components/FilterBar';
import { TransactionList } from '@/components/TransactionList';
import { TransactionDetail } from '@/components/TransactionDetail';

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    dispatch(loadTransactions());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Risk Decision Dashboard</h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <FilterBar />
          <TransactionList onSelectTransaction={setSelectedTransaction} />
        </div>
      </main>
      {selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}
