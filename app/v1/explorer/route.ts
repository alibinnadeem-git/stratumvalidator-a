import {NextRequest,NextResponse} from 'next/server';
import {query} from '@/lib/server/db';

export const runtime='nodejs';

const CHAIN_ID=()=>process.env.STRATUM_CHAIN_ID||'stratum-devnet-1';

export async function GET(req:NextRequest){
 try{
  const expected=process.env.STRATUM_PUBLIC_API_KEY;
  if(!expected||req.headers.get('authorization')!==`Bearer ${expected}`)return NextResponse.json({error:'Unauthorized'},{status:401});
  const requested=Number(req.nextUrl.searchParams.get('limit')||25);
  const limit=Math.max(1,Math.min(100,Number.isFinite(requested)?Math.floor(requested):25));
  const chainId=CHAIN_ID();
  const [state,blocks]=await Promise.all([
   query<any>(`SELECT chain_id,height::text,latest_block_hash,genesis_hash,updated_at FROM sv_chain_state WHERE chain_id=$1`,[chainId]),
   query<any>(`
    SELECT b.height::text,b.block_hash,b.prev_hash,b.tx_hash,b.proposer_validator_id,b.finalized_at,b.votes_json,
           t.record_id,t.event_type,t.asset_id,t.evidence_hash,t.payload_hash
    FROM sv_chain_blocks b
    LEFT JOIN sv_chain_transactions t ON t.chain_id=b.chain_id AND t.tx_hash=b.tx_hash
    WHERE b.chain_id=$1
    ORDER BY b.height DESC
    LIMIT $2
   `,[chainId,limit])
  ]);
  return NextResponse.json({
   chainId,
   state:state.rows[0]||null,
   blocks:blocks.rows,
   authority:'VALIDATOR_A_CHAIN_DATABASE',
   truthBoundary:'DIR_EXPLORER_REPORTS_IMMUTABLE_RECORD_STATE_AND_DOES_NOT_ESTABLISH_PHYSICAL_TRUTH'
  });
 }catch(error){
  const message=error instanceof Error?error.message:'DIR explorer failed';
  return NextResponse.json({error:message},{status:503});
 }
}
