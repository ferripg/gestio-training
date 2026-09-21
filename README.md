# Gestió Training 💪

App web (PWA) que fa d'entrenador personal: programa d'entrenament, dieta i seguiment del progrés, tot personalitzat.
Feta amb HTML + CSS + JavaScript pur — sense frameworks, sense build, sense servidor.

## Què fa (v3)

- **Avui** — et diu exactament què toca: la sessió del programa (amb objectius de pes/nivell calculats), o el dia de descans actiu. Entrada ràpida del pes del matí, tics de la dieta del dia i anell d'objectiu setmanal.
- **Programa** — programa Hardgainer de 8 setmanes: full-body 3 dies, sessions A/B alternades, escalfament i refredament de postura, fitxes d'exercici amb tècnica i vídeos, regles de progressió automàtica (+5 kg a la Unica, següent nivell en calistènia, +5 s a la planxa) i tria dels dies d'entrenament.
- **Entrenament guiat** — checklist d'escalfament, objectiu de cada exercici i què vas fer l'últim cop, temporitzador de descans amb so i vibració, checklist de refredament. En acabar, l'app aplica les progressions i et diu què puges la propera vegada.
- **Dieta** — objectius de calories i proteïna calculats (Mifflin-St Jeor + activitat + superàvit, amb calibració per bàscula), 5 franges d'àpats amb opcions "muntar, no cuinar" i com es fan (batuts amb whey i creatina inclosos), tics diaris, adherència setmanal, llista de la compra i trucs.
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
Quan publiquis canvis, el mòbil els rebrà a la segona obertura de l'app.

## Avís

Recomanacions generals de fitness i nutrició, no consells mèdics. Si apareix dolor, consulta un professional.
