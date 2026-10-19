import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { PublicKey, SystemProgram, type AccountInfo } from '@solana/web3.js';
import { AuthorityType, MintLayout, MINT_SIZE, TOKEN_PROGRAM_ID, decodeInitializeMint2Instruction, decodeMintToCheckedInstruction, decodeSetAuthorityInstruction } from '@solana/spl-token';
import { getCreateMetadataAccountV3InstructionDataSerializer, getMetadataAccountDataSerializer, getSetTokenStandardInstructionDataSerializer, TokenStandard, type MetadataAccountDataArgs } from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';
import { assertMetadataDocument, assertPrelaunchAccounts, assertPrelaunchArgs, buildPrelaunchInstructions, metadata, metadataPda, METADATA_PROGRAM_ID, PRELAUNCH_SUPPLY, spec } from '../scripts/token/prelaunch.ts';
import { SUPPLY } from '../scripts/safety.ts';

// Fixed public-only fixture addresses. No Keypair, private key, wallet or signer.
const mint = new PublicKey(new Uint8Array(32).fill(11));
const authority = new PublicKey(new Uint8Array(32).fill(12));
const payer = new PublicKey(new Uint8Array(32).fill(13));
const destination = new PublicKey(new Uint8Array(32).fill(14));
const info = (data: Buffer, owner: PublicKey): AccountInfo<Buffer> => ({data, owner, executable:false, lamports:0, rentEpoch:0});
function mintAccount(overrides = {}) {
  const data = Buffer.alloc(MINT_SIZE);
  MintLayout.encode({mintAuthorityOption:0, mintAuthority:PublicKey.default, supply:PRELAUNCH_SUPPLY, decimals:6, isInitialized:true, freezeAuthorityOption:0, freezeAuthority:PublicKey.default, ...overrides}, data);
  return info(data, TOKEN_PROGRAM_ID);
}
function metadataAccount(overrides: Partial<MetadataAccountDataArgs> = {}) {
  return info(Buffer.from(getMetadataAccountDataSerializer().serialize({
    updateAuthority:publicKey(authority.toBase58()), mint:publicKey(mint.toBase58()),
    name:'GLITCH',symbol:'GLTCH',uri:spec.metadataUri,sellerFeeBasisPoints:0,
    creators:null,primarySaleHappened:false,isMutable:false,editionNonce:null,
    tokenStandard:TokenStandard.Fungible,collection:null,uses:null,collectionDetails:null,programmableConfig:null,
    ...overrides,
  })), METADATA_PROGRAM_ID);
}
function fixture() {
  return {mint, mintAccount:mintAccount(), metadataAddress:metadataPda(mint), metadataAccount:metadataAccount(), expectedUpdateAuthority:authority};
}

test('supply uses exact integers: one billion tokens with six decimals, no legacy test burn', () => {
  assert.equal(spec.name,'GLITCH'); assert.equal(spec.symbol,'GLTCH');
  assert.equal(spec.decimals,6);
  assert.equal(PRELAUNCH_SUPPLY,1_000_000_000_000_000n);
  assert.equal(PRELAUNCH_SUPPLY,BigInt(spec.displaySupply)*10n**BigInt(spec.decimals));
  assert.equal(PRELAUNCH_SUPPLY,SUPPLY);
  assert.doesNotThrow(()=>assertPrelaunchAccounts(fixture()));
  assert.throws(()=>assertPrelaunchAccounts({...fixture(),mintAccount:mintAccount({supply:SUPPLY-1_000_000n})}), /supply mismatch/);
});

test('serialized SPL instructions enforce decimals, supply and authority policy', () => {
  const instructions = buildPrelaunchInstructions({mint,payer,authority,destination});
  const init = decodeInitializeMint2Instruction(instructions[0]);
  assert.equal(init.data.decimals,6);
  assert.ok(init.data.mintAuthority.equals(authority));
  assert.equal(init.data.freezeAuthority,null);
  const issue = decodeMintToCheckedInstruction(instructions[3]);
  assert.equal(issue.data.amount,PRELAUNCH_SUPPLY); assert.equal(issue.data.decimals,6);
  assert.ok(issue.keys.destination.pubkey.equals(destination));
  const revoke = decodeSetAuthorityInstruction(instructions[4]);
  assert.equal(revoke.data.authorityType,AuthorityType.MintTokens);
  assert.equal(revoke.data.newAuthority,null);
  assert.ok(instructions[0].programId.equals(TOKEN_PROGRAM_ID));
  assert.equal(spec.tokenProgram,TOKEN_PROGRAM_ID.toBase58());
});

test('metadata instruction precedes mint-authority revocation and targets the correct PDA', () => {
  const instructions = buildPrelaunchInstructions({mint,payer,authority,destination});
  const instruction = instructions[1];
  assert.ok(instruction.programId.equals(METADATA_PROGRAM_ID));
  assert.ok(instruction.keys[0].pubkey.equals(metadataPda(mint)));
  assert.ok(instruction.keys[1].pubkey.equals(mint));
  assert.ok(instruction.keys[2].pubkey.equals(authority));
  assert.equal(instruction.keys[2].isSigner,true);
  const [data] = getCreateMetadataAccountV3InstructionDataSerializer().deserialize(instruction.data);
  assert.equal(data.data.name,'GLITCH'); assert.equal(data.data.symbol,'GLTCH');
  assert.equal(data.data.uri,spec.metadataUri); assert.equal(data.data.sellerFeeBasisPoints,0);
  assert.equal(data.isMutable,false);
  const [standard] = getSetTokenStandardInstructionDataSerializer().deserialize(instructions[2].data);
  assert.equal(standard.discriminator,35);
  assert.ok(instructions[2].keys[1].pubkey.equals(authority));
  assert.equal(instructions[2].keys[1].isSigner,true);
});

test('account verification rejects wrong supply, decimals and retained mint/freeze authorities', () => {
  for (const overrides of [
    {supply:PRELAUNCH_SUPPLY+1n}, {decimals:9}, {isInitialized:false},
    {mintAuthorityOption:1,mintAuthority:authority}, {freezeAuthorityOption:1,freezeAuthority:authority},
  ]) assert.throws(()=>assertPrelaunchAccounts({...fixture(),mintAccount:mintAccount(overrides)}));
  assert.throws(()=>assertPrelaunchAccounts({...fixture(),mintAccount:{...mintAccount(),owner:SystemProgram.programId}}));
});

test('metadata verification rejects mismatched content, authorities, mint, standard, PDA and owner', () => {
  const mutations: Partial<MetadataAccountDataArgs>[] = [
    {name:'FAKE'}, {symbol:'$GLTCH'}, {uri:'https://example.org/fake.json'},
    {mint:publicKey(payer.toBase58())}, {updateAuthority:publicKey(payer.toBase58())},
    {isMutable:true}, {sellerFeeBasisPoints:100}, {tokenStandard:TokenStandard.NonFungible},
  ];
  for (const change of mutations) assert.throws(()=>assertPrelaunchAccounts({...fixture(),metadataAccount:metadataAccount(change)}));
  assert.throws(()=>assertPrelaunchAccounts({...fixture(),metadataAddress:payer}));
  assert.throws(()=>assertPrelaunchAccounts({...fixture(),metadataAccount:{...metadataAccount(),owner:TOKEN_PROGRAM_ID}}));
  assert.throws(()=>assertPrelaunchAccounts({...fixture(),metadataAccount:info(Buffer.alloc(3),METADATA_PROGRAM_ID)}));
  assert.doesNotThrow(()=>assertPrelaunchAccounts({...fixture(),metadataAccount:metadataAccount({name:'GLITCH\0\0',symbol:'GLTCH\0'})}));
});

test('off-chain document binds GLITCH/GLTCH to local G-01 assets without pretending to be deployed', () => {
  assertMetadataDocument(metadata);
  for (const change of [{name:'wrong'},{symbol:'$GLTCH'},{image:'https://example.org/fake.png'},{properties:{files:[],category:'image'}}]) assert.throws(()=>assertMetadataDocument({...metadata,...change}));
  const image = readFileSync(new URL('../public/token/g-01.svg',import.meta.url),'utf8');
  assert.match(image,/id="x-eye"/); assert.match(image,/id="circular-eye"/);
  assert.ok(!/<script|foreignObject|https?:\/\/(?!www.w3.org)/i.test(image));
  assert.equal(spec.mintAddress,null); assert.equal(spec.network,null); assert.equal(spec.assetPublicationVerified,false);
});

test('prelaunch CLI accepts offline review only and never defaults to execution', () => {
  assert.doesNotThrow(()=>assertPrelaunchArgs(['--plan']));
  for (const args of [[],['--execute'],['--mainnet'],['--plan','--wallet','secret.json'],['--plan','--rpc','https://api.devnet.solana.com']]) assert.throws(()=>assertPrelaunchArgs(args));
  const denied = spawnSync(process.execPath, ['--import','tsx','scripts/token/plan.ts','--execute'], {encoding:'utf8'});
  assert.equal(denied.status,1); assert.match(denied.stderr,/Offline only/);
  const plan = spawnSync(process.execPath, ['--import','tsx','scripts/token/plan.ts','--plan'], {encoding:'utf8'});
  assert.equal(plan.status,0,plan.stderr);
  const report = JSON.parse(plan.stdout);
  assert.equal(report.signed,false); assert.equal(report.broadcast,false); assert.equal(report.networkRequests,false);
});
