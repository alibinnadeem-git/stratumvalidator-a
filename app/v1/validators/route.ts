import {NextResponse} from 'next/server';
import {chainStatus} from '@/lib/server/serverless-chain';
import {stagedRegistryStatus,staticGenesisRegistryPlan} from '@/lib/server/validator-registry';
export const runtime='nodejs';
export async function GET(){
 try{
  const chain=await chainStatus();
  const registry=await stagedRegistryStatus(chain.height);
  return NextResponse.json({
   ...registry,
   currentHeight:chain.height,
   genesisMigrationPlan:staticGenesisRegistryPlan(),
   note:'Read-only staged registry view. Membership mutations require governed future-height activation and are not exposed by this endpoint.',
  });
 }catch(e:any){return NextResponse.json({error:e.message||'Validator registry status failed'},{status:503});}
}
