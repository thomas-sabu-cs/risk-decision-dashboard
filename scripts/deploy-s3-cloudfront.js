/**
 * Deploy script for AWS S3 + CloudFront.
 * Run after configuring environment variables (see README).
 * This script builds the app and prints upload instructions; actual deploy
 * is done via AWS CLI or CI. No actual deploy is performed by default.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distPath)) {
  console.error('Dist folder not found. Run: npm run build');
  process.exit(1);
}

console.log('Build output is in dist/.');
console.log('');
console.log('To deploy to AWS S3 + CloudFront:');
console.log('  1. Create an S3 bucket and enable static website hosting (or use CloudFront origin).');
console.log('  2. Run: aws s3 sync dist/ s3://YOUR_BUCKET --delete');
console.log('  3. Invalidate CloudFront cache: aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"');
console.log('  Or use the npm run deploy with env: S3_BUCKET and CLOUDFRONT_DIST_ID (see README).');
console.log('');
console.log('Deploy script finished (no actual deploy performed).');
