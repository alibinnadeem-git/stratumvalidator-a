export async function GET() {
  return Response.json({
    network: process.env.STRATUM_CHAIN_ID ?? 'stratum-devnet-1',
    validator: process.env.STRATUM_VALIDATOR_ID ?? 'validator-a',
    address: process.env.STRATUM_VALIDATOR_ADDRESS ?? 'stratum16pkrl6jtm3pzpm8nlueusvpeta954qfyd3qlk8',
    role: 'validator',
    status: 'online'
  });
}
