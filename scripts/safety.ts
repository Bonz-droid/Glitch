export const RPC = 'https://api.devnet.solana.com';
export const GENESIS = 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1';
export const SUPPLY = 1_000_000_000n * 1_000_000n;
export function assertDevnet(endpoint: string, genesis: string) {
  if (endpoint !== RPC || genesis !== GENESIS) throw new Error('STOP: endpoint o genesis non corrispondono alla devnet Solana.');
}
export function assertArgs(args: string[]) {
  if (args.length !== 1 || !['--plan', '--execute'].includes(args[0])) throw new Error('Usa esclusivamente --plan oppure --execute. Nessun RPC o wallet esterno è accettato.');
  return args[0];
}
