# Laboratorio Virtuale di Fisica

Un semplice laboratorio didattico di fisica per l'analisi degli errori.

Il laboratorio è accessibile gratuitamente su Github Pages: https://giulioleuci.github.io/laboratorio-virtuale-fisica/

Un'applicazione web costruita con **Next.js** che permette di simulare esperimenti di fisica per la scuola, completa di analisi degli errori, grafici e tabelle. L'idea è nata per dare a docenti e studenti, specialmente del primo biennio del licee scientifico, la possibilità di fare esperienza pratica anche quando il tempo a disposizione è limitato.

-----

## A cosa serve

L'obiettivo è far sì che gli studenti possano condurre esperimenti virtuali (come moto rettilineo uniforme, pendolo e conservazione della quantità di moto) e ottenere **dati completi con incertezze sperimentali** e **propagazione degli errori**, il tutto in maniera guidata.

Dato che spesso il tempo non basta, l'app è pensata per aiutare a svolgere queste attività pratiche senza dover prima dedicare troppe lezioni alla teoria e alle formule sulla propagazione degli errori. Il focus è sulla **comprensione pratica** e sull'**analisi critica dei dati**.

-----

## Stato del progetto

Attualmente l'applicazione è in **fase di sviluppo**, quindi alcune parti del codice potrebbero non essere perfette. Moduli e interfacce potrebbero cambiare spesso.

Se noti problemi o imprecisioni, sentiti libero di segnalarli (trovi i contatti più in basso).

-----

## Stack e strumenti

  * **Framework**: Next.js 15, React 18, TypeScript
  * **UI/Stile**: Tailwind CSS, Radix UI e le icone di Lucide, Tabler, Phosphor
  * **Dati e librerie**: mathjs, date-fns, recharts, xlsx
  * **Form e validazione**: react-hook-form, zod
  * **Sviluppo**: gran parte del codice è stato scritto in "vibe coding" usando **Google Firebase Studio** e **Windsurf**, con l'aiuto degli LLM **Gemini 2.5 Pro** e **Claude 4 Sonnet**.
  * **Build e minificazione**: Next.js si occupa della minificazione del codice durante la build (`next build`). Ho incluso anche **Terser** per gestire manualmente la minificazione di file JavaScript extra, se serve.

-----

## Come usarlo

### Requisiti

  * Node.js versione 18 o superiore
  * npm (o pnpm/yarn, basta adattare i comandi)

### Installazione e avvio

Per installare e avviare il progetto, segui questi semplici passaggi:

```bash
# Installa le dipendenze
npm install

# Avvia in modalità sviluppo (con Turbopack, sulla porta 9002)
npm run dev

# Crea la build per la produzione
npm run build

# Avvia in modalità produzione
npm start

# Controlla il codice con lint e type-check
npm run lint
npm run typecheck
```

-----

## Struttura del progetto (parziale)

  * `src/app/` – Contiene l'App Router di Next.js e le pagine principali
      * `src/app/page.tsx` – La pagina principale
      * `src/app/experiments/` – Configurazioni e UI dei singoli esperimenti
  * `src/components/` – Componenti UI riutilizzabili
  * `src/contexts/`, `src/hooks/` – Gestione dello stato e logiche condivise

-----

## Feedback e contatti

Il progetto è in continua evoluzione. Se trovi un **errore, un'imprecisione o hai un suggerimento** sarei grato del tuo aiuto.

Grazie per il supporto e buon lavoro in laboratorio!
