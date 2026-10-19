# Sicurezza GLITCH

## Confini

Il sito è statico e non contiene wallet adapter, richieste di firma, acquisti, analytics, secret o API AI. Non è un prodotto finanziario operativo. Non inserire chiavi o seed nel frontend, nelle variabili NEXT_PUBLIC_* o nei commit.

Lo script SPL usa solo l'endpoint devnet codificato nel sorgente e verifica il genesis hash. Gli argomenti sconosciuti sono rifiutati. Wallet generati in memoria, senza lettura di wallet personali. Mint, trasferimento, burn e revoca autorità sono atomici. Le autorità vengono controllate dopo conferma. I token non sono recuperabili dopo l'uscita: è un test usa e getta.

## Controlli prima del deploy

- Eseguire typecheck, test, build, audit completo e audit produzione; esaminare le vulnerabilità prima di pubblicare.
- Generare e committare package-lock.json; passare i workflow da npm install a npm ci.
- Non usare `npm audit fix --force` senza verificare incompatibilità e ripetere i test.
- Nessun file con segreti (.env.local, .devnet, PEM o chiavi) deve entrare in Git; .gitignore li esclude. .env.example contiene esclusivamente impostazioni pubbliche di esempio.
- Verificare Chrome/Firefox e viewport mobile, focus tastiera, reduced motion, download SVG e appunti.
- GitHub Actions ha permessi minimi e non esegue transazioni blockchain.
- Non aprire issue pubbliche contenenti segreti. Usare GitHub Private vulnerability reporting se abilitato dal proprietario.

`public/_headers` è supportato da Cloudflare Pages, non da GitHub Pages. La CSP consente script/style inline necessari all'export Next.js; non è una CSP stretta con nonce. Nessun contenuto HTML fornito dagli utenti viene iniettato. Le caption personalizzate sono validate, limitate a quattro righe ed escapate come testo XML prima di entrare negli SVG. Il markup della mascotte proviene solo dal componente interno. PNG e SVG sono generati localmente; nessuna caption viene caricata automaticamente. La Web Share API invia dati solo dopo un comando esplicito dell’utente; in caso di indisponibilità vengono offerti appunti o copia manuale. I link social accettano solo URL HTTPS dei domini previsti, ma la titolarità degli account va verificata dal proprietario. Nessun audit professionale smart contract o penetration test è stato effettuato.

## Offline token pre-launch boundary

The new `token:plan` command accepts no wallets, network overrides or execution flag. The instruction builder accepts only public addresses and never constructs, signs or sends a transaction. Asset URLs are proposed, not proof of publication. Mint and metadata tests use serialized offline fixtures, not live-chain attestations. Mainnet creation, real signatures, funding and liquidity are outside this package; see `docs/mainnet-checklist.md`. The legacy devnet `--execute` code is preserved, but it is not invoked by CI or this pre-launch task.
