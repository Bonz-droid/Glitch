# GLITCH ($GLTCH) — offline SPL pre-launch package

**Status: preparation only. No token has been created by this package. No keypair is generated, no private key is read, no transaction is signed or sent, and no liquidity is created.** Existing devnet integration code remains unchanged and is not run with `--execute` by this workflow.

## Proposed properties

| Property | Pre-launch expectation |
| --- | --- |
| On-chain name | GLITCH |
| Symbol | GLTCH (the `$` is display notation only) |
| Token program | Classic SPL Token / `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` |
| Decimals | 6 |
| Initial display supply | 1,000,000,000 |
| Base units | 1,000,000,000,000,000, represented as a bigint/string |
| Mint authority after issuance | None / revoked |
| Freeze authority | None from initialization |
| Metaplex token standard | Fungible |
| Metadata royalty basis points | 0 |
| Metadata mutable flag | false (proposal requiring review before any creation) |
| Mint address / network | Unassigned |

`token/prelaunch.json` is the review manifest. `public/token/glitch.json` is the off-chain metadata document. `public/token/g-01.svg` is the local source artwork of the crowned G–01 mascot, with an X eye and a circular eye. The Next.js static build produces a wallet-friendly 512×512 PNG at `out/token/g-01.png` from that source. No image API or runtime server is needed.

Proposed URLs:

- Metadata: `https://bonz-droid.github.io/Glitch/token/glitch.json`
- Image: `https://bonz-droid.github.io/Glitch/token/g-01.png`

These URLs are **not claimed to be published or verified**. Static build tests prove that local exported files exist, not that a public host serves them. Publishing the landing page is a separate action. Test public accessibility, MIME types, caching and wallet compatibility before assigning a URI to a real mint. GitHub Pages is editable hosting; `isMutable=false` freezes the on-chain metadata fields, **not the remote JSON or image bytes**. For a future mainnet launch, first select and verify immutable/content-addressed hosting, update all URI references consistently, and record content hashes. Do not freeze placeholder or unverified metadata.

## Offline review

```sh
npm install
npm run token:plan
npm test
```

The plan prints the manifest, metadata and SHA-256 of the source artwork. It performs no RPC calls or signing. The underlying CLI accepts only `--plan`: `--execute`, network/RPC overrides and wallet arguments fail. `--execute` is not a supported token-prelaunch command.

`scripts/token/prelaunch.ts` provides a pure instruction builder accepting **public addresses only**. It returns reviewable instruction objects, not a signed or serialized transaction. It deliberately does not create/fund accounts, select a blockhash, calculate network rent, call an RPC client, accept a signer, or send anything. Required signer *flags* in instruction account metadata describe future protocol requirements; they are not signatures.

The proposed order for a **new** mint is: initialize the mint without a freeze authority, create Metaplex Token Metadata while mint authority still exists, set the Fungible standard, issue the proposed supply, then revoke mint authority. Account creation and a valid destination token account must be prepared separately in a later, explicitly approved implementation. This is not a complete launch executor and must not be used as one.

Metaplex metadata stores name, symbol and URI in a PDA associated with a mint. The image lives in the JSON referenced by the URI, not inside the classic SPL mint account. The metadata update authority is distinct from the mint and freeze authorities: its public address remains in the metadata account even when `isMutable=false`; tests verify that address and the immutable flag rather than incorrectly treating it as `null`.

## Existing devnet script

`scripts/devnet.ts` and `scripts/safety.ts` are unchanged. `npm run devnet -- --plan` remains an offline plan. The legacy `--execute` path creates an ephemeral devnet mint, transfers one token, burns one token and revokes mint authority. Its final supply is **999,999,999**, whereas the pre-launch specification has **1,000,000,000** and no burn. Neither supply is silently substituted for the other.

The legacy script does not create metadata. Once its mint authority is revoked, normal Metaplex metadata creation cannot be retrofitted onto that mint using the former authority. A future metadata-enabled devnet rehearsal needs a fresh mint and the proposed ordering, with separate explicit human authorization. This PR does not run that rehearsal and does not alter the old script to auto-sign additional instructions.

## Verification and limits

Unit tests decode SPL and Metaplex instruction bytes, deserialize serialized mint/metadata account fixtures and reject wrong supply, decimals, authorities, metadata fields, PDA or owner. They also validate the off-chain metadata, asset binding, CLI restrictions and absence of implied deployment. Browser/static-export tests verify the JSON and actual PNG signature and dimensions under the `/Glitch` base path. Existing Meme Lab, sharing and devnet guard tests continue to run.

These are offline fixtures and static-export checks, **not a validator/ledger execution or an attestation of live accounts**. No existing or new on-chain execution test is run, since the task prohibits transactions and automatic signatures. A future independently reviewed devnet rehearsal and account read-back remain necessary before considering mainnet.

See [the separate mainnet checklist](mainnet-checklist.md) and [SPL versus launchpads](spl-vs-launchpad.md). With a zero budget, mainnet creation is blocked: network fees, rent and metadata account costs cannot be assumed to be zero.
