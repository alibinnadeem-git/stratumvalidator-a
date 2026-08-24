import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { anchorServerless, verifyServerless } from '@/lib/server/serverless-chain';

export const runtime = 'nodejs';
export const maxDuration = 10;

const RECORD_ID = 'uat-20260824-first-proof';
const EVIDENCE_HASH = createHash('sha256').update('STRATUM Verified first production UAT proof 2026-08-24').digest('hex');

export async function GET() {
  if ((process.env.STRATUM_CHAIN_ID || '') !== 'stratum-devnet-1') {
    return NextResponse.json({ error: 'UAT route disabled outside stratum-devnet-1' }, { status: 403 });
  }

  const existing = await verifyServerless(RECORD_ID, EVIDENCE_HASH);
  if (existing?.valid) {
    return NextResponse.json({ reused: true, ...existing });
  }

  const record = {
    recordId: RECORD_ID,
    organizationId: 'stratum-electric-uat',
    projectId: 'uat-project-001',
    assetId: 'uat-asset-001',
    type: 'INSTALL',
    evidenceHash: EVIDENCE_HASH,
    payloadHash: createHash('sha256').update('STRATUM Verified canonical UAT payload 2026-08-24').digest('hex'),
    timestamp: '2026-08-24T22:55:00.000Z',
    signer: 'stratum:uat-system'
  };

  const anchored = await anchorServerless(record);
  const verified = await verifyServerless(RECORD_ID, EVIDENCE_HASH);
  return NextResponse.json({ reused: false, anchored, verified });
}
