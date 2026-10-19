import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { assertMetadataDocument, assertPrelaunchArgs, metadata, spec } from './prelaunch.ts';

try {
  assertPrelaunchArgs(process.argv.slice(2));
  assertMetadataDocument(metadata);
  const art = readFileSync(new URL('../../public/token/g-01.svg', import.meta.url));
  console.log(JSON.stringify({
    mode: 'OFFLINE_REVIEW_ONLY', spec, metadata,
    mascotSourceSha256: createHash('sha256').update(art).digest('hex'),
    signed: false, broadcast: false, networkRequests: false,
    notice: 'No mint exists from this plan. Asset URLs are proposed and unverified. No wallet, transaction, funding or liquidity operation is performed.',
    order: ['Create and fund new accounts separately after explicit human approval (not implemented)', 'Initialize mint: 6 decimals, freeze authority absent', 'Create Metaplex metadata while mint authority still exists', 'Set Fungible token standard', 'Issue 1,000,000,000 GLTCH', 'Revoke mint authority', 'Independently verify on-chain accounts'],
  }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Offline validation failed');
  process.exitCode = 1;
}
