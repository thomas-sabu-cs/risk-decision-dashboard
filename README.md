# Risk Decision Dashboard

A full-stack **React 18 + TypeScript** web application that displays transactions with risk scoring. The dashboard fetches data from a REST API, filters by risk level using **React Context API**, and manages global state with **Redux Toolkit**. All UI is built with **React Hooks** and styled with **Tailwind CSS**.

For an architecture overview, data flow, and notes on what was tricky during the build, see **[LEARNINGS.md](./LEARNINGS.md)**.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, React Hooks, Context API, Redux Toolkit
- **Styling:** Tailwind CSS
- **Backend:** Mock REST API via json-server
- **Deployment:** AWS S3 + CloudFront (script and instructions only)
- **CI/CD:** GitHub Actions (lint + test on push and pull request)

## Features

- **Dashboard** – Fetches a list of transactions from the REST API
- **Transaction fields** – Each transaction has: `id`, `amount`, `user`, `timestamp`, `riskScore` (0–100)
- **Risk bands:**
  - **HIGH RISK** (red): `riskScore > 70`
  - **MEDIUM RISK** (yellow): `riskScore` 40–70
  - **LOW RISK** (green): `riskScore < 40`
- **Filter bar** – Filter by risk level (All / High / Medium / Low) using React Context
- **Detail drawer** – Click a transaction to open a side panel with full details (React state / Hooks)
- **Redux Toolkit** – Transactions are loaded and stored in a global Redux slice

## Project Structure

```
src/
  api/          # REST API client (fetchTransactions)
  components/   # FilterBar, TransactionList, TransactionRow, TransactionDetail
  context/      # FilterContext (risk filter: All / High / Medium / Low)
  pages/        # Dashboard (loads data, filter bar, list, detail drawer)
  store/        # Redux store + transactions slice (loadTransactions thunk)
  types/        # Transaction, RiskLevel, getRiskLevel()
  test/         # Vitest setup
scripts/        # deploy-s3-cloudfront.js (build + deploy instructions)
.github/        # workflows/ci.yml (lint + test)
```

## Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)

## Setup

1. **Clone and install**

   ```bash
   cd "03-React + TypeScript Decision Dashboard"
   npm install
   ```

2. **Start the mock API** (in one terminal)

   ```bash
   npm run api
   ```

   This runs json-server on `http://localhost:3001` and serves `db.json`.

3. **Start the dev server** (in another terminal)

   ```bash
   npm run dev
   ```

   Vite runs on `http://localhost:5173` and proxies `/api` to the mock API.

4. **Run both together (optional)**

   ```bash
   npm run dev:all
   ```

## Scripts

| Script        | Description                          |
|---------------|--------------------------------------|
| `npm run dev` | Start Vite dev server                |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally   |
| `npm run lint` | Run ESLint (no `any` types)         |
| `npm run test` | Run Vitest tests                    |
| `npm run api`  | Start json-server mock API (port 3001) |
| `npm run dev:all` | API + dev server concurrently    |
| `npm run deploy` | Build + print AWS deploy instructions |

## REST API

The app expects a REST API that serves transactions at `GET /transactions` with JSON:

```json
[
  {
    "id": "tx-001",
    "amount": 12500,
    "user": "alice@example.com",
    "timestamp": "2025-02-22T10:30:00Z",
    "riskScore": 85
  }
]
```

Development uses **json-server** with `db.json`; the Vite proxy forwards `/api` to `http://localhost:3001`.

## AWS S3 + CloudFront Deployment

Deployment is **not** performed automatically. The repo includes a deploy script and instructions only.

1. **Build**

   ```bash
   npm run build
   ```

2. **Upload to S3**

   ```bash
   aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete
   ```

3. **Invalidate CloudFront** (if using CloudFront)

   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

4. **Optional:** Use the deploy script (build + instructions):

   ```bash
   npm run deploy
   ```

   Configure `S3_BUCKET` and `CLOUDFRONT_DIST_ID` in your environment or CI if you extend the script to run `aws s3 sync` and `aws cloudfront create-invalidation`.

For a production setup: create an S3 bucket, enable static hosting or use CloudFront as the origin, and set appropriate caching and security headers.

## GitHub Actions CI/CD

The repository includes **GitHub Actions** workflow (`.github/workflows/ci.yml`) that runs on every **push** and **pull request** to `main` or `master`:

- **Lint:** `npm run lint`
- **Tests:** `npm run test`

No deploy step is included; you can add an S3/CloudFront deploy job using AWS credentials (e.g. OIDC or secrets) if needed.

## TypeScript

All components and modules are typed with TypeScript interfaces. The ESLint rule `@typescript-eslint/no-explicit-any` is set to `error` so `any` types are disallowed.

## Acknowledgments

Initial implementation was built with assistance from **Cursor** (cursor.com). Credit in the repo instead of in git history.

## License

MIT
