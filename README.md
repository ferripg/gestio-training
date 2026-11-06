# Gestió Training 💪

App web (PWA) que fa d'entrenador personal: programa d'entrenament i seguiment del progrés, tot personalitzat.
Feta amb HTML + CSS + JavaScript pur — sense frameworks, sense build, sense servidor.

## Què fa (v4)

- **Avui** — et diu exactament què toca: la sessió del programa (amb objectius de pes/nivell calculats), o el dia de descans actiu. Entrada ràpida del pes del matí, exercicis apresos i anell d'objectiu setmanal.
- **Programa** — només exercicis que l'usuari sap fer i amb què se sent segur (Unica, manuelles, flexions, planxa i abdominals): 3 dies, sessions A/B de 6 exercicis, escalfament a la màquina de rem i refredament curt, i progressió automàtica (+5 kg a la Unica, +2 kg a les manuelles, següent nivell a l'esquat, flexions i abdominals, +5 s a la planxa). Cada fitxa d'exercici té tècnica, clip curt (YouTube Shorts), **on l'has de notar**, **què comprovar gravant-te de costat** i **quan parar**. Les 2 primeres setmanes són de **tècnica** (pes lleuger a propòsit). Botó **Repàs (3 min)** abans de començar: tots els clips de la sessió de cop.
- **Entrenament guiat** — checklist d'escalfament, objectiu de cada exercici i què vas fer l'últim cop, checklist de refredament. En acabar, l'app aplica les progressions i et diu què puges la propera vegada.
- **Aprendre els exercicis (📚 → ✅)** — cada exercici queda com a *après* amb 2 sèries netes amb la càmera (6 reps o més, com a molt 1 errada) o, sense càmera, marcant tots els punts de la llista ✔ de la fitxa després de gravar-te. Avui i Programa mostren quants en portes ("Apresos 3/11") i quan una sessió està dominada.
- **Comprovació de tècnica amb la càmera (📷)** — a l'esquat i les flexions: la càmera del mòbil detecta el cos (MediaPipe Pose, tot dins del navegador, les imatges no surten del mòbil), compta les repeticions i et diu de viva veu si cada rep està ben feta o què has de corregir (profunditat, inclinació, cos recte, velocitat...). En acabar, apunta les reps a la sèrie. El primer cop baixa uns 17 MB i cal connexió.
- **Temporitzadors controlables** — descans propi de cada exercici (arrenca sol en marcar la sèrie ✓; pausa, +30 s, aturar), compte enrere amb ▶ als exercicis de temps, als estiraments i al rem suau **a pantalla sencera**: 5 s de "Prepara't" per col·locar-te, número gran, bips als últims 3 s, es marquen sols en acabar i el descans segueix a pantalla sencera (la pantalla no s'apaga). Tocar el pastilló del descans també l'obre a pantalla sencera. Cronòmetre total de sessió amb pausa (el temps pausat no compta a l'històric).
- **Progrés** — pes corporal (punts diaris + mitjana de 7 dies), tendència en kg/setmana, exercicis apresos, fites del programa, gràfiques per exercici, calendari de constància, sessions per setmana i rècords.
- **Més** — històric de sessions, rutines pròpies per a dies extra, i perfil (objectius, ajustos, còpies de seguretat).

## On es guarden les dades

Al `localStorage` del navegador del teu dispositiu. No hi ha servidor ni comptes.
Fes còpies de seguretat des de ⚙️ **Ajustos → Exportar dades (JSON)**; es poden restaurar amb **Importar**.

## Fitxers

| Fitxer | Què és |
|---|---|
| `index.html` | Estructura de la pàgina, pestanyes i modals |
| `style.css` | Estils (mode clar i fosc automàtics) |
| `program.js` | **Contingut** del programa: exercicis amb tècnica, sessions, escalfament, fites |
| `app.js` | Tota la lògica: vistes, dades, progressió, aprenentatge, entrenament actiu |
| `charts.js` | Gràfiques SVG (línia, barres, heatmap, pes) sense llibreries |
| `pose.js` | Comprovació de tècnica amb la càmera: detector de postura, recompte de reps i avisos per exercici |
| `manifest.webmanifest` | Fa que sigui instal·lable com a app (PWA) |
| `sw.js` | Service worker: fa que funcioni offline |
| `icons/` | Icones de l'app |

Per canviar el programa només cal editar `program.js`: és tot dades.

## Instal·lar-la al mòbil

1. Obre la URL de l'app amb Chrome (Android) o Safari (iPhone).
2. Menú del navegador → **"Afegir a la pantalla d'inici"** / **"Instal·lar aplicació"**.
3. S'obrirà a pantalla completa com una app nativa i funcionarà sense connexió.

## Desenvolupament

No cal instal·lar res. Edita els fitxers i obre `index.html` al navegador.
Quan publiquis canvis, el mòbil els rep a la primera obertura si té connexió (el service worker és *network-first*); sense connexió fa servir la versió guardada.

## Avís

Recomanacions generals de fitness, no consells mèdics. Si apareix dolor, consulta un professional.
