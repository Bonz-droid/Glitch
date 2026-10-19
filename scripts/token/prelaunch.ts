import { strict as assert } from 'node:assert';
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction, type AccountInfo } from '@solana/web3.js';
import { AuthorityType, TOKEN_PROGRAM_ID, createInitializeMint2Instruction, createMintToCheckedInstruction, createSetAuthorityInstruction, unpackMint } from '@solana/spl-token';
import { getCreateMetadataAccountV3InstructionDataSerializer, getMetadataAccountDataSerializer, getSetTokenStandardInstructionDataSerializer, Key, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import spec from '../../token/prelaunch.json';
import metadata from '../../public/token/glitch.json';

export { spec, metadata };
export const METADATA_PROGRAM_ID = new PublicKey(spec.metadataProgram);
export const PRELAUNCH_SUPPLY = BigInt(spec.baseUnitSupply);

export function assertPrelaunchArgs(args: string[]) {
  if (args.length !== 1 || args[0] !== '--plan') throw new Error('Offline only: use --plan. Execution, signing, wallet and network arguments are not supported.');
}

export function assertMetadataDocument(value: unknown): asserts value is typeof metadata {
  assert.ok(value && typeof value === 'object', 'Metadata must be an object');
  const document = value as typeof metadata;
  assert.equal(document.name, spec.name, 'Metadata name');
  assert.equal(document.symbol, spec.symbol, 'Metadata symbol (no $ prefix)');
  assert.equal(document.image, spec.imageUri, 'Mascot image URI');
  assert.ok(document.description?.trim(), 'Metadata description');
  assert.equal(new URL(document.external_url).protocol, 'https:', 'External URL must use HTTPS');
  assert.deepEqual(document.properties.files, [{ uri: spec.imageUri, type: 'image/png' }]);
  assert.equal(document.properties.category, 'image');
  assert.equal(Buffer.byteLength(spec.name), 6);
  assert.ok(Buffer.byteLength(spec.metadataUri) <= 200, 'Metaplex URI exceeds 200 bytes');
}

export function metadataPda(mint: PublicKey) {
  return PublicKey.findProgramAddressSync([Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()], METADATA_PROGRAM_ID)[0];
}

/** Reviewable instruction objects only. No RPC client, keypair, signer or transaction submission. */
export function buildPrelaunchInstructions(addresses: { mint: PublicKey; payer: PublicKey; authority: PublicKey; destination: PublicKey }) {
  assertMetadataDocument(metadata);
  const {mint, payer, authority, destination} = addresses;
  const address = metadataPda(mint);
  const createMetadata = new TransactionInstruction({
    programId: METADATA_PROGRAM_ID,
    keys: [
      {pubkey:address,isSigner:false,isWritable:true},
      {pubkey:mint,isSigner:false,isWritable:false},
      {pubkey:authority,isSigner:true,isWritable:false},
      {pubkey:payer,isSigner:true,isWritable:true},
      {pubkey:authority,isSigner:false,isWritable:false},
      {pubkey:SystemProgram.programId,isSigner:false,isWritable:false},
      {pubkey:SYSVAR_RENT_PUBKEY,isSigner:false,isWritable:false},
    ],
    data: Buffer.from(getCreateMetadataAccountV3InstructionDataSerializer().serialize({
      data: { name: spec.name, symbol: spec.symbol, uri: spec.metadataUri, sellerFeeBasisPoints: 0, creators: null, collection: null, uses: null },
      isMutable: spec.metadataIsMutable, collectionDetails: null,
    })),
  });
  const setStandard = new TransactionInstruction({
    programId: METADATA_PROGRAM_ID,
    keys: [
      {pubkey:address,isSigner:false,isWritable:true},
      {pubkey:authority,isSigner:true,isWritable:false},
      {pubkey:mint,isSigner:false,isWritable:false},
    ],
    data: Buffer.from(getSetTokenStandardInstructionDataSerializer().serialize({})),
  });
  // The mint and destination account creation/funding are intentionally NOT included.
  // Never retrofit this onto the legacy devnet mint after its authority is revoked.
  return [
    createInitializeMint2Instruction(mint, spec.decimals, authority, null),
    createMetadata,
    setStandard,
    createMintToCheckedInstruction(mint, destination, authority, PRELAUNCH_SUPPLY, spec.decimals),
    createSetAuthorityInstruction(mint, authority, AuthorityType.MintTokens, null),
  ];
}

/** Validate externally supplied account bytes offline; this does not fetch or attest chain state. */
export function assertPrelaunchAccounts(input: {
  mint: PublicKey; mintAccount: AccountInfo<Buffer>; metadataAddress: PublicKey;
  metadataAccount: AccountInfo<Buffer>; expectedUpdateAuthority: PublicKey;
}) {
  const mint = unpackMint(input.mint, input.mintAccount, TOKEN_PROGRAM_ID);
  assert.equal(mint.isInitialized, true, 'Mint must be initialized');
  assert.equal(mint.supply, PRELAUNCH_SUPPLY, 'Prelaunch supply mismatch');
  assert.equal(mint.decimals, spec.decimals, 'Decimals mismatch');
  assert.equal(mint.mintAuthority, null, 'Mint authority must be revoked');
  assert.equal(mint.freezeAuthority, null, 'Freeze authority must be absent');
  assert.ok(input.metadataAddress.equals(metadataPda(input.mint)), 'Metadata PDA mismatch');
  assert.ok(input.metadataAccount.owner.equals(METADATA_PROGRAM_ID), 'Metadata owner mismatch');
  const [data] = getMetadataAccountDataSerializer().deserialize(input.metadataAccount.data);
  const clean = (text: string) => text.replace(/\0+$/, '');
  assert.equal(data.key, Key.MetadataV1, 'Metadata discriminator');
  assert.equal(data.mint, input.mint.toBase58(), 'Metadata mint mismatch');
  assert.equal(data.updateAuthority, input.expectedUpdateAuthority.toBase58(), 'Metadata update authority mismatch');
  assert.equal(clean(data.name), spec.name, 'On-chain metadata name');
  assert.equal(clean(data.symbol), spec.symbol, 'On-chain metadata symbol');
  assert.equal(clean(data.uri), spec.metadataUri, 'On-chain metadata URI');
  assert.equal(data.isMutable, false, 'Metadata must be immutable');
  assert.equal(data.sellerFeeBasisPoints, 0, 'Royalties must be zero');
  assert.deepEqual(data.tokenStandard, {__option:'Some',value:TokenStandard.Fungible}, 'Expected Fungible token standard');
  assertMetadataDocument(metadata);
}
