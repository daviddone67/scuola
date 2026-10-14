<p align="center"><img src="banner.svg" alt="Piano di studio" width="100%"></p>

# Piano di studio

Web app per organizzare lo studio: inserisci verifiche, interrogazioni e compiti e il piano si costruisce da solo. Funziona offline, senza account e senza server.

## Funzioni

- **Piano automatico**: distribuisce le sessioni di studio prima di ogni scadenza, massimo 2 materie al giorno e domenica libera.
- **Scadenze** di tipo verifica, interrogazione o compito, con difficoltà personale.
- **Argomenti per scadenza** da spuntare (cap. 5, schema, esercizi).
- **Timer**: "Solo 10 minuti" per partire e Pomodoro 25/5 con suono e vibrazione.
- **Progressi**: minuti di oggi e della settimana, giorni di fila, grafico per materia.
- **Conto alla rovescia** per la maturità.
- **App installabile** (PWA) e utilizzabile offline.

I dati restano nel `localStorage` del tuo browser: non vengono inviati a nessuno.

## Come usarla

Apri `index.html` nel browser. Per installarla sul telefono e usarla offline serve un indirizzo `https`, per esempio GitHub Pages.

## Pubblicarla su GitHub Pages

1. Crea un repository su GitHub e carica tutti i file di questa cartella: sono tutti nello stesso livello, senza sottocartelle, e `index.html` deve stare nella radice del repository.
2. Vai in **Settings → Pages**.
3. In **Build and deployment** scegli **Deploy from a branch**, branch `main` e cartella `/ (root)`, poi **Save**.
4. Dopo un minuto l'app è online su `https://TUO-NOME.github.io/NOME-REPOSITORY/`.

Da riga di comando:

```bash
git init
git add .
git commit -m "Prima versione"
git branch -M main
git remote add origin https://github.com/TUO-NOME/NOME-REPOSITORY.git
git push -u origin main
```

## Struttura

```
index.html            pagina e struttura
style.css             stile, con tema chiaro e scuro
app.js                logica: piano, timer, progressi
sw.js                 service worker per l'uso offline
manifest.webmanifest  impostazioni per l'installazione
icon.svg, *.png       logo, icone e banner
```

## Personalizzare

I colori sono variabili CSS all'inizio di `style.css`. Quando cambi i file, aumenta il numero di versione `V` in `sw.js` per aggiornare la cache.

## Licenza

MIT. Ricorda di sostituire "[Il tuo nome]" nel file `LICENSE`.
