# Future mainnet checklist — NOT authorization to execute

This document is planning only. No executable mainnet command, private key, funding automation, signature, token sale, pool or liquidity step is included. **All items are unchecked. Budget remains €0; stop before mainnet because fees and rent require funds.**

## Specification and identity

- [ ] Obtain separate explicit owner authorization for a future mainnet project, budget and exact scope.
- [ ] Review the name GLITCH, symbol GLTCH, 6 decimals and proposed supply of 1,000,000,000 tokens. Names/symbols are not unique; identify a token by its verified mint address.
- [ ] Decide between classic SPL plus Metaplex metadata, Token-2022 extensions, or a specific launchpad. This repository proposes classic SPL, not Token-2022.
- [ ] Review allocation, treasury/custody, disclosures and any applicable obligations independently. Conceptual website percentages do not allocate tokens automatically.
- [ ] Record the intended mint/freeze/metadata authority policies, their distinct effects and any irreversible revocations.

## Metadata publication

- [ ] Verify rights to G–01 artwork and finalize the JSON/image before creation.
- [ ] Select durable, preferably content-addressed hosting; do not assume a free editable Pages URL is immutable or permanent.
- [ ] Align URI references in the manifest, JSON, instruction builder and tests. Ensure Metaplex name/symbol/URI byte limits are satisfied.
- [ ] Verify public retrieval, correct content types, image dimensions, no authentication/redirect dependency, wallet display, and content hashes.
- [ ] Review `isMutable=false` separately from mint/freeze revocation: off-chain files may remain editable even when on-chain metadata is immutable.

## Human-controlled security review

- [ ] Prepare custody outside Git, with appropriately reviewed hardware-wallet/multisig policies. Never place a seed, private key, wallet JSON or secret in source, Actions variables, logs or PR comments.
- [ ] Independently review dependency lockfiles/advisories and pin the reviewed release. The current repository still needs a committed installation lockfile before a real launch.
- [ ] Rehearse a fresh metadata-enabled mint on devnet only after separate authorization; verify supply, decimals, PDA/program owners, name, symbol, URI, token standard, balances and authorities from confirmed account data.
- [ ] Add and review a complete transaction implementation separately. The offline instruction objects omit account creation, funding, rent and transaction construction.
- [ ] Recompute actual network fees/rent immediately before any future action and set a funded, approved budget. **No funds approved now: do not proceed.**
- [ ] Review every instruction, account and cluster before any future manual signing. Never reuse the legacy ephemeral devnet wallet or a test fixture address.
- [ ] Create metadata while the new mint authority still exists; independently verify issuance before irreversible authority revocation, according to the reviewed transaction design.
- [ ] Read back and verify all final accounts independently, then document the verified mint address and transaction evidence. Do not describe a proposed token as launched before that evidence exists.

## Explicitly separate decisions

- [ ] Any sale, launchpad use, exchange listing, pool creation, bonding curve or liquidity provisioning requires another decision and authorization. None is enabled here.
- [ ] Publishing a website, publishing metadata, creating a token, and creating a market are different actions. Approval for one does not authorize the others.
