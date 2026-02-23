import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from '@/types/transaction';
import { fetchTransactions } from '@/api/client';

export const loadTransactions = createAsyncThunk(
  'transactions/fetch',
  async () => {
    return fetchTransactions();
  }
);

interface TransactionsState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(loadTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load transactions';
      });
  },
});

export default transactionsSlice.reducer;
