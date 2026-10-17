import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { MINT_SIZE, TOKEN_PROGRAM_ID, AuthorityType, getAssociatedTokenAddressSync, createInitializeMint2Instruction, createAssociatedTokenAccountInstruction, createMintToCheckedInstruction, createTransferCheckedInstruction, createBurnCheckedInstruction, createSetAuthorityInstruction, getMint, getAccount } from '@solana/spl-token';
import { mkdir, writeFile } from 'node:fs/promises';
import { strict as assert } from 'node:assert';
import { assertArgs, assertDevnet, RPC, GENESIS, SUPPLY } from './safety.ts';
async function main() {
 const mode = assertArgs(process.argv.slice(2));
 if (mode === '--plan') { console.log('OFFLINE PLAN: devnet soltanto. Genera wallet effimero, richiedi 1 SOL di test, crea mint SPL con 6 decimali, emetti 1 miliardo, trasferisci e brucia 1 token di test, revoca mint authority. Nessuna chiave importata, nessuna mainnet, nessuna spesa reale.'); return; }
 const connection = new Connection(RPC, 'confirmed');
 assertDevnet(connection.rpcEndpoint, await connection.getGenesisHash());
 const payer=Keypair.generate(), mint=Keypair.generate(), receiver=Keypair.generate().publicKey;
 // Chiavi esclusivamente in memoria: nessun wallet personale, nessun secret scritto su disco.
 console.log('Wallet effimero devnet:',payer.publicKey.toBase58());
 const airdrop=await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
 const deadline=Date.now()+60_000;
 while(await connection.getBalance(payer.publicKey)<LAMPORTS_PER_SOL) {
  if(Date.now()>deadline) throw new Error('Airdrop non confermato entro 60s. Riprova più tardi; non acquistare SOL.');
  await new Promise(resolve=>setTimeout(resolve,2000));
 }
 assertDevnet(connection.rpcEndpoint, await connection.getGenesisHash());
 const source=getAssociatedTokenAddressSync(mint.publicKey,payer.publicKey);
 const destination=getAssociatedTokenAddressSync(mint.publicKey,receiver);
 const rent=await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
 const tx=new Transaction().add(
  SystemProgram.createAccount({fromPubkey:payer.publicKey,newAccountPubkey:mint.publicKey,space:MINT_SIZE,lamports:rent,programId:TOKEN_PROGRAM_ID}),
  createInitializeMint2Instruction(mint.publicKey,6,payer.publicKey,null),
  createAssociatedTokenAccountInstruction(payer.publicKey,source,payer.publicKey,mint.publicKey),
  createAssociatedTokenAccountInstruction(payer.publicKey,destination,receiver,mint.publicKey),
  createMintToCheckedInstruction(mint.publicKey,source,payer.publicKey,SUPPLY,6),
  createTransferCheckedInstruction(source,mint.publicKey,destination,payer.publicKey,1_000_000n,6),
  createBurnCheckedInstruction(source,mint.publicKey,payer.publicKey,1_000_000n,6),
  createSetAuthorityInstruction(mint.publicKey,payer.publicKey,AuthorityType.MintTokens,null)
 );
 const signature=await sendAndConfirmTransaction(connection,tx,[payer,mint],{commitment:'confirmed'});
 const state=await getMint(connection,mint.publicKey);
 assert.equal(state.decimals,6);assert.equal(state.supply,SUPPLY-1_000_000n);
 assert.equal(state.mintAuthority,null);assert.equal(state.freezeAuthority,null);
 assert.equal((await getAccount(connection,destination)).amount,1_000_000n);
 assert.equal((await getAccount(connection,source)).amount,SUPPLY-2_000_000n);
 await mkdir('.devnet',{recursive:true});
 const report={cluster:'devnet',genesis:GENESIS,mint:mint.publicKey.toBase58(),payer:payer.publicKey.toBase58(),signature,airdrop,supply:state.supply.toString(),decimals:6,mintAuthority:null,freezeAuthority:null,verified:true,explorer:`https://explorer.solana.com/address/${mint.publicKey.toBase58()}?cluster=devnet`};
 await writeFile(`.devnet/report-${Date.now()}.json`,JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
}
main().catch(error=>{console.error('Test interrotto:',error.message,'\nNon inviare fondi reali. Il faucet gratuito può essere limitato.');process.exitCode=1;});
