# GLITCH · $GLTCH

Landing cyberpunk di un concept AI meme coin su Solana. Next.js 15, TypeScript, React 19 e Tailwind CSS 4. Budget iniziale: **0 €**. Nessuna vendita, mainnet, integrazione wallet o API AI a pagamento.

## Avvio

Node.js 22.18+ e npm:

```bash
npm install
npm run dev
```

Apri http://localhost:3000. Dopo la prima installazione, conserva e committa `package-lock.json`; usa poi `npm ci` per installazioni riproducibili. Il lockfile non è incluso nella consegna iniziale perché l'accesso npm nell'ambiente di sviluppo non è stato completato.

```bash
npm run typecheck
npm test
npm run build
npm audit --omit=dev --audit-level=high
npm audit
```

`out/` contiene l'export statico. Le dipendenze Solana sono solo per gli script e non vengono importate dalla landing.

## Contenuti

- About, Tokenomics, Memes, Community, navigazione responsive.
- Mascotte originale G–01 in SVG, effetti glitch, pausa animazioni e rispetto di `prefers-reduced-motion`.
- Meme Lab con quattro caption, copia negli appunti e download SVG locale. Non genera contenuti tramite un modello AI remoto.
- Collegamento al repository ufficiale; nessun canale social inventato.
- Tokenomics **proposte**, non distribuzioni effettuate: 60% community, 20% ecosistema, 15% riserva, 5% contributori.

## SPL: esclusivamente devnet

Piano offline, senza RPC né transazioni:

```bash
npm run devnet -- --plan
```

Test di integrazione esplicito (usa soltanto SOL gratuiti devnet):

```bash
npm run devnet -- --execute
```

Lo script controlla endpoint fisso `https://api.devnet.solana.com` e genesis devnet prima dell'airdrop e prima della transazione. Non accetta RPC, chiavi o wallet esterni. Genera un payer effimero in memoria, richiede 1 SOL di test al faucet e, in un'unica transazione atomica:

1. Crea un mint SPL standard con 6 decimali, senza freeze authority.
2. Emette 1.000.000.000 token nel conto temporaneo.
3. Trasferisce 1 token a un secondo account di test.
4. Brucia 1 token: supply finale attesa 999.999.999.
5. Revoca la mint authority e verifica supply, autorità e saldi.

Salva in `.devnet/` un report con soli dati pubblici e link Explorer devnet. Le chiavi non sono salvate: i conti sono deliberatamente usa e getta. Non inviare fondi a questi indirizzi. Il test non realizza la ripartizione tokenomics e non aggiunge metadata on-chain (nome/simbolo GLITCH/$GLTCH sono branding del progetto). Se il faucet è limitato o la RPC non risponde, interrompere e riprovare più tardi: **non acquistare SOL**. La devnet può essere resettata.

## Deploy gratuito: GitHub Pages

Repository: https://github.com/Bonz-droid/Glitch

1. Nel repository pubblico: Settings → Pages → Source → GitHub Actions.
2. Actions → Deploy GitHub Pages (manual) → Run workflow, branch `main`.
3. Il workflow compila con `NEXT_PUBLIC_BASE_PATH=/Glitch` e pubblica `out/`.
4. L'URL atteso è https://bonz-droid.github.io/Glitch/; è attivo solo dopo un deploy riuscito.

Per il repository pubblico, Pages e gli standard runner Actions sono utilizzabili gratuitamente secondo i limiti GitHub. Non attivare servizi a pagamento, domini acquistati o runner premium. Il workflow è manuale per evitare deploy parziali durante il caricamento iniziale.

Alternativa: Cloudflare Pages Free, import del repository, comando `npm run build`, directory `out`, Node 22. Non impostare `NEXT_PUBLIC_BASE_PATH` per il dominio radice. Usa il sottodominio gratuito `pages.dev`, senza Workers, storage o servizi a consumo. `public/_headers` imposta gli header di sicurezza sui provider che supportano questo file; GitHub Pages non li applica.

## Sicurezza e verifiche

Vedi [SECURITY.md](SECURITY.md). La CI controlla tipi, protezioni devnet, build e dipendenze di produzione. Il test on-chain non viene lanciato automaticamente in CI.

Stato della consegna: test offline delle guardie eseguiti con Node; installazione dipendenze, typecheck, build, audit e test on-chain non verificati nell'ambiente perché l'accesso di rete npm non è stato completato. Nessun deploy effettuato. Prima di pubblicare, attendere CI verde e verificare nel browser layout mobile, navigazione, pausa animazioni, download e copia caption (richiede HTTPS o localhost).
