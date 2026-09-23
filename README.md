# Gestió Training 💪

App web (PWA) que fa d'entrenador personal: programa d'entrenament, dieta i seguiment del progrés, tot personalitzat.
Feta amb HTML + CSS + JavaScript pur — sense frameworks, sense build, sense servidor.

## Què fa (v3)

- **Avui** — et diu exactament què toca: la sessió del programa (amb objectius de pes/nivell calculats), o el dia de descans actiu. Entrada ràpida del pes del matí, tics de la dieta del dia i anell d'objectiu setmanal.
- **Programa** — programa Hardgainer de 8 setmanes: full-body 3 dies, sessions A/B alternades, màquina primer (Unica) i moviments simples, escalfament i refredament curts, fitxes d'exercici amb 3 claus, clip curt (YouTube Shorts) i alternativa si no pots fer-lo, regles de progressió automàtica (+5 kg a la Unica, següent nivell en calistènia, +5 s a la planxa) i tria dels dies d'entrenament. Botó **Repàs (3 min)** abans de començar: tots els clips de la sessió de cop.
- **Entrenament guiat** — checklist d'escalfament, objectiu de cada exercici i què vas fer l'últim cop, checklist de refredament. En acabar, l'app aplica les progressions i et diu què puges la propera vegada.
- **Temporitzadors controlables** — descans propi de cada exercici (arrenca sol en marcar la sèrie ✓; pausa, +30 s, aturar), compte enrere amb ▶ a la planxa, als estiraments i al rem suau **a pantalla sencera**: 5 s de "Prepara't" per col·locar-te, número gran, bips als últims 3 s, es marquen sols en acabar i el descans segueix a pantalla sencera (la pantalla no s'apaga). Tocar el pastilló del descans també l'obre a pantalla sencera. Cronòmetre total de sessió amb pausa (el temps pausat no compta a l'històric).
- **Dieta** — objectius de calories i proteïna calculats (Mifflin-St Jeor + activitat + superàvit, amb calibració per bàscula). Model **rebost + registre + recomanació**: el rebost és el menjar que tens de veritat (catàleg amb valors estàndard per porció, o productes propis amb els valors de l'etiqueta); registres tocant un aliment = 1 porció; l'app agrupa per àpat, aprèn els teus àpats habituals (un toc) i **et recomana què menjar ara** amb el teu rebost per tancar el que et falta avui (proteïna primer). Res inventat: els totals són la suma exacta del que has registrat.
- **Progrés** — pes corporal (punts diaris + mitjana de 7 dies), tendència en kg/setmana i suggeriment automàtic d'ajust de calories, fites del programa, gràfiques per exercici, calendari de constància, sessions per setmana i rècords.
- **Més** — històric de sessions, rutines pròpies per a dies extra, i perfil (metabolisme estimat, objectius, ajustos, còpies de seguretat).

## On es guarden les dades

Al `localStorage` del navegador del teu dispositiu. No hi ha servidor ni comptes.
Fes còpies de seguretat des de ⚙️ **Ajustos → Exportar dades (JSON)**; es poden restaurar amb **Importar**.

## Fitxers

| Fitxer | Què és |
|---|---|
| `index.html` | Estructura de la pàgina, pestanyes i modals |
| `style.css` | Estils (mode clar i fosc automàtics) |
| `program.js` | **Contingut** del programa: exercicis amb tècnica, sessions, escalfament, dieta, receptes, compra, fites |
| `app.js` | Tota la lògica: vistes, dades, progressió, càlcul d'objectius, entrenament actiu |
| `charts.js` | Gràfiques SVG (línia, barres, heatmap, pes) sense llibreries |
| `manifest.webmanifest` | Fa que sigui instal·lable com a app (PWA) |
| `sw.js` | Service worker: fa que funcioni offline |
| `icons/` | Icones de l'app |

Per canviar el programa o la dieta només cal editar `program.js`: és tot dades.

## Instal·lar-la al mòbil

1. Obre la URL de l'app amb Chrome (Android) o Safari (iPhone).
2. Menú del navegador → **"Afegir a la pantalla d'inici"** / **"Instal·lar aplicació"**.
3. S'obrirà a pantalla completa com una app nativa i funcionarà sense connexió.

## Desenvolupament

No cal instal·lar res. Edita els fitxers i obre `index.html` al navegador.
Quan publiquis canvis, el mòbil els rep a la primera obertura si té connexió (el service worker és *network-first*); sense connexió fa servir la versió guardada.

## Avís

Recomanacions generals de fitness i nutrició, no consells mèdics. Si apareix dolor, consulta un professional.
