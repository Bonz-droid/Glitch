# Classic SPL token versus a launchpad

A launchpad is a launch/distribution mechanism, not an alternative token format. Many launchpads create SPL or Token-2022 tokens behind the scenes. Their program, custody and market rules must be reviewed individually.

| Topic | Direct classic SPL creation | Launchpad-mediated launch |
| --- | --- | --- |
| Token format | Classic SPL mint/account model; this project proposes 6 decimals. | Platform-dependent: may use classic SPL or Token-2022. |
| Name, symbol, artwork | Classic SPL mint itself does not store these; commonly linked through a Metaplex metadata PDA and off-chain JSON. | Platform may populate metadata and constrain editing/hosting. |
| Mint/freeze authority | Creator must intentionally set and revoke authorities according to the reviewed policy. | Platform contracts may control or revoke authorities under their own rules; verify accounts rather than assume. |
| Distribution | Creating/minting a token alone does not distribute it to a community. | May bundle sales, allocation rules, bonding curves or other mechanisms. |
| Liquidity | None automatically exists after mint creation. | Some platforms create/migrate liquidity automatically, impose fees, or custody funds. Not universal. |
| Cost | SOL transaction fees, rent/account creation and metadata costs; hosting may add costs. | Network costs plus possible platform/creation/trading/migration fees. A “free launch” label does not guarantee zero cost. |
| Existing mint support | Metadata must be ordered before mint-authority revocation when creating it through the standard authority path. | Some platforms require creating a new mint and do not accept an existing mint. |
| Additional risks | Key custody, wrong account/program/network, bad metadata URI and irreversible revocation. | Those risks plus platform contracts, custody, upgrade/admin controls, fee rules and migration assumptions. |

The current work chooses **classic SPL + a proposed Metaplex metadata package**, entirely offline. It neither endorses nor integrates a launchpad, and includes no trade, sale, bonding curve or liquidity feature. No approach creates economic value or guarantees a market, listing or return.

Token-2022 is a separate token program with optional extensions (including metadata-related capabilities); it is not interchangeable with the classic SPL program ID. Migrating to it would need an explicit design change and compatibility review, not a renamed metadata file.

References for future review:

- SPL Token: https://www.solana-program.com/docs/token
- Metaplex Token Metadata: https://developers.metaplex.com/token-metadata
- Solana fees: https://solana.com/docs/core/fees
