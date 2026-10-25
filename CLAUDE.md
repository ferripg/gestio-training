# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Què és

PWA d'entrenador personal (programa d'entrenament, dieta, progrés) en HTML + CSS + JavaScript pur: sense frameworks, sense build, sense dependències, sense servidor. Tota la interfície, els comentaris i els missatges de commit són en **català** (els commits, sense accents: "Recomanacio", "Gestio").

## Desenvolupament i publicació

- No hi ha build, lint ni tests. Per provar: obrir `index.html` al navegador.
- El service worker no es registra amb `file://` (vegeu el final d'`app.js`); per provar el comportament offline cal servir la carpeta per HTTP (p. ex. `python -m http.server`).
- Es publica a GitHub Pages (`ferripg.github.io/gestio-training`) des de `main`: fer push a `main` és desplegar.
- `sw.js` és *network-first*, així que els canvis arriben sense tocar res. Però si s'afegeix un fitxer nou, cal afegir-lo a `ASSETS` de `sw.js` (i pujar `CACHE`) perquè funcioni offline.

## Arquitectura

Ordre de càrrega a `index.html` (importa): `program.js` → `charts.js` → `pose.js` → `app.js`.

- **`program.js`** defineix `window.PROGRAM`: només dades (exercicis amb `kind` `load`/`level`/`time`, sessions A/B a `workouts`, escalfament, refredament, vídeos, fites, dieta amb catàleg d'aliments i `defaultPantry`). Canviar el programa o la dieta = editar aquest fitxer. Camps d'exercici que l'app fa servir per guiar la tècnica: `feel` (on s'ha de notar), `check` (què comprovar en un vídeo propi), `stop` (quan parar), `alt`, `perHand` (pes per manuella). `meta.techWeeks` marca les primeres setmanes del bloc com a setmanes de tècnica (`isTechWeek()` a `app.js`), amb els textos de `PROGRAM.form`.
- **`charts.js`** defineix `window.Charts = { lineChart, barChart, heatmap, weightChart }`: SVG fet a mà, injecta el seu propi `<style>` i llegeix els colors de les variables CSS de `style.css`.
- **`app.js`** és un únic IIFE amb tota la lògica, dividit per seccions `/* ========== ... ========== */` (Emmagatzematge, Programa, Pes, Dieta, Navegació, una secció per vista, Entrenament actiu, Ajustos, Inici).

- **`pose.js`** defineix `window.PoseCheck = { open, createTracker }`: comprovació de tècnica amb la càmera. Carrega MediaPipe Tasks Vision (versió fixada, des de jsDelivr, amb `import()` dinàmic) i el model `pose_landmarker_lite` el primer cop; és l'única part que depèn d'internet (el service worker només guarda fitxers del mateix origen). Un exercici en té si porta `pose: "squat" | "bridge" | "lateral" | "tricep"` a `program.js`; cada clau és un analitzador a `ANALYZERS` (angle principal, zones de repòs/moviment amb histèresi, `track` i `judge` que retorna els errors en català). `createTracker` no toca el DOM, i per això els analitzadors es poden provar a Node amb punts simulats. MediaPipe pot quedar-se en error (`ROI width and height must be > 0`) i fallar a cada imatge: `restartLandmarker()` el torna a crear. No s'han de passar imatges de mida 0.

### Dades (localStorage)

- `gt-data-v1`: l'objecte `data` sencer. L'esquema és a `defaultData()`. `loadData()` fa de capa de migració: cada camp nou s'ha de posar per defecte allà perquè les dades antigues dels usuaris continuïn funcionant. Qualsevol canvi a `data` va seguit de `saveData()`.
- `gt-active-v1`: l'entrenament en curs (`draft`), guardat amb `saveDraft()` perquè sobrevisqui si es tanca l'app.
- **Pujar `PROGRAM.meta.version` esborra `data.program.levels` i `loads`** (pesos i nivells de progressió) i torna el bloc a la setmana 1 (`programStart` = avui, sessió A) en la propera càrrega, i ho desa a l'acte; les sessions es conserven. Fer-ho només quan canvien els exercicis.
- `data.learned[exKey] = { clean, checks, done }`: aprenentatge per exercici (`learnState`, `onPoseResult`, `CLEAN_SETS`). El resultat de la càmera arriba amb `PoseCheck.open({ onResult, onClose })`.
- L'usuari només té les seves dades al dispositiu (exportar/importar JSON a Ajustos): no trencar mai la compatibilitat amb dades existents.

### Patró de renderització

`showView(name)` → `render()` → `renderAvui/renderPrograma/renderDieta/renderProgres/renderMes`. Cada vista construeix un string HTML, fa `innerHTML` de la seva `<section id="view-...">` i després connecta els botons amb `querySelectorAll('[data-...]').forEach(b => b.onclick = ...)`. Després d'una acció es crida `saveData()` i `render()`. Els textos que venen de l'usuari s'han de passar per `esc()`. Les overlays (entrenament, editor de rutines, repàs) i els modals ja existeixen buits a `index.html` i s'omplen igual.

### Entrenament i progressió

- `startProgramWorkout(key)` crea el `draft` a partir de `PROGRAM.workouts[key]`; `finishWorkout()` el converteix en una sessió a `data.sessions` i crida `applyProgression()`, que puja pes/nivell/segons quan totes les sèries arriben al màxim de reps i alterna A/B.
- Hi ha un únic compte enrere global (`cd`) compartit pel pastilló de descans (`#restPill`) i la pantalla sencera (`#overlay-timer`): `startCountdown`, `pauseCountdown`, `addCountdown`, `stopCountdown`. Inclou la fase de preparació de 5 s, bips i Wake Lock (`keepAwake`).

### Dieta

Model rebost + registre + recomanació: `allFoods()` uneix el catàleg de `program.js` amb `data.customFoods`; el registre del dia és a `data.diet[iso].log` (1 toc = 1 porció); `recommend()` proposa aliments del rebost per cobrir el que falta (proteïna primer). Els totals són sempre la suma exacta del registrat, sense estimacions inventades.
