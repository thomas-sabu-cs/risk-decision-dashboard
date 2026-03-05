# LEARNINGS — Risk Decision Dashboard

## 1. What I Attempted

- **Display transactions with risk scores** — A dashboard that loads transaction data from a REST API and shows each row with ID, amount, user, timestamp, and a risk band (High / Medium / Low) derived from a numeric `riskScore` (0–100).
- **Let a user filter and inspect transactions by risk band** — A filter bar (All / High / Medium / Low) controls which transactions are shown; clicking a row opens a detail drawer with full transaction info.
- **Wire a React + TypeScript front-end to a mock REST API (json-server)** — The app fetches from `GET /api/transactions` (proxied to json-server on port 3001), which serves `db.json`.
- **Use both Context API and Redux Toolkit in a single app** — Transaction list and loading/error state live in Redux; the active risk filter (All/High/Medium/Low) lives in React Context so filter UI and list can stay in sync without putting filter state in Redux.

## 2. Architecture Snapshot

**Tech stack**

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **State:** Redux Toolkit (transaction list, loading, error) + React Context API (risk filter)
- **API:** Mock REST API via json-server; Vite dev server proxies `/api` to `http://localhost:3001`
- **CI:** GitHub Actions (lint + test on push/PR to `main` or `master`)
- **Deploy:** Script and docs only (S3 + CloudFront); no automated deploy in CI

**Folder structure**

- **`src/api`** — REST client (`client.ts`): `fetchTransactions()` → `GET /api/transactions`, returns `Transaction[]`.
- **`src/components`** — `FilterBar` (Context), `TransactionList` (Redux + Context + filtered list), `TransactionRow`, `TransactionDetail` (drawer).
- **`src/context`** — `FilterContext.tsx`: `FilterProvider`, `useFilter()`; holds `riskFilter: RiskLevel` and `setRiskFilter`.
- **`src/pages`** — `Dashboard.tsx`: dispatches `loadTransactions()` on mount, owns `selectedTransaction` for the detail drawer, composes FilterBar + TransactionList + TransactionDetail.
- **`src/store`** — `index.ts` (configured store, `RootState`, `AppDispatch`), `transactionsSlice.ts` (async thunk `loadTransactions`, slice state: `items`, `loading`, `error`).
- **`src/types`** — `transaction.ts`: `Transaction`, `RiskLevel`, `getRiskLevel(riskScore)`; tests in `transaction.test.ts`.
- **Root:** `db.json` (json-server data), `package.json` scripts, **`scripts/deploy-s3-cloudfront.js`** (build + print deploy instructions; no actual upload).
- **`.github/workflows`** — `ci.yml`: checkout, Node 20, `npm ci`, `npm run lint`, `npm run test`.

**Data flow**

- **From json-server to UI:** `db.json` → json-server at 3001 → Vite proxy `/api` → `fetchTransactions()` in `api/client.ts` → Redux thunk `loadTransactions` → `transactions` slice (`items`, `loading`, `error`) → `TransactionList` reads via `useSelector` and renders rows.
- **Risk filters:** `FilterBar` and `TransactionList` use `useFilter()` from `FilterContext`. The list derives a filtered list with `filterByRisk(items, riskFilter)` using `getRiskLevel(t.riskScore)` so only transactions in the selected band are shown. Filter state is Context-only; the list is Redux + derived in the component.

## 3. What Broke / Got Tricky

Inferred from the code and structure:

- **Split between Context and Redux** — Transaction data and server state live in Redux; the active risk filter lives in Context. That avoids putting a simple UI filter into Redux but means two state systems: any new feature that needs both (e.g. “last selected filter” persisted) has to touch both. The `eslint-disable-next-line react-refresh/only-export-components` in `FilterContext.tsx` is there because the module exports both the provider and the hook.
- **Duplication of risk labels and styles** — `riskStyles` and `riskLabels` (high/medium/low) are defined in both `TransactionRow.tsx` and `TransactionDetail.tsx`. If the product changes band thresholds or copy, both places must stay in sync. `getRiskLevel()` is shared in `types/transaction.ts` and unit-tested; only the presentational maps are duplicated.
- **Filtering edge cases** — `getRiskLevel` uses `> 70` for high, `>= 40` for medium, and `< 40` for low, so 70 is medium and 40 is medium. The unit tests in `transaction.test.ts` lock that. The only “empty list” case is when the user selects a band that has no transactions; the UI shows “No transactions match the current filter,” which is correct. No special handling for invalid or missing `riskScore` in the types (e.g. null/undefined would be a runtime/API concern).
- **TypeScript typing** — The codebase is consistently typed: `Transaction` and `RiskLevel` in `types/transaction.ts`, `RootState` and `AppDispatch` from the store, `FilterContextValue` for the context, and the API client return type `Promise<Transaction[]>`. ESLint has `@typescript-eslint/no-explicit-any` set to `error`, so `any` is disallowed. Typing issues that could have arisen (e.g. thunk payload, context default value) are resolved: the slice uses the inferred payload type from the thunk, and the context uses `null` with a guard in `useFilter()` that throws if used outside the provider.
