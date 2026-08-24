import {NextRequest,NextResponse} from 'next/server';
import {verifyServerless} from '@/lib/server/serverless-chain';
export const runtime='nodejs';
export async function GET(req:NextRequest,{params}:{params:Promise<{recordId:string}>}){const {recordId}=await params;const evidenceHash=req.nextUrl.searchParams.get('evidenceHash')||undefined;const result=await verifyServerless(recordId,evidenceHash);return result?NextResponse.json(result):NextResponse.json({valid:false,error:'Not found'},{status:404})}
