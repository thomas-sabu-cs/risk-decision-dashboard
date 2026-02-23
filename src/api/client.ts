const API_BASE = '/api';

export async function fetchTransactions(): Promise<import('@/types/transaction').Transaction[]> {
  const res = await fetch(`${API_BASE}/transactions`);
  if (!res.ok) {
    throw new Error(`Failed to fetch transactions: ${res.status}`);
  }
  return res.json();
}
