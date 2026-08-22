# Gestió Training 💪

App web (PWA) per planificar, registrar i seguir els teus entrenaments.
Feta amb HTML + CSS + JavaScript pur — sense frameworks, sense build, sense servidor.

## Què fa

- **Avui** — et diu quina rutina toca segons el pla setmanal i et deixa començar l'entrenament (o un de lliure).
- **Pla** — assigna una rutina a cada dia de la setmana.
- **Rutines** — crea rutines reutilitzables amb exercicis de força (sèries × reps × pes) o cardio (distància + temps).
- **Entrenament actiu** — pantalla per apuntar sèries mentre entrenes, amb cronòmetre; si tanques l'app, l'entrenament en curs es recupera.
- **Històric** — totes les sessions fetes, amb detall i volum total.
- **Progrés** — estadístiques (entrenaments del mes, ratxa de setmanes, volum), gràfica d'evolució per exercici, entrenaments per setmana i rècords personals.

## On es guarden les dades

Al `localStorage` del navegador del teu dispositiu. No hi ha servidor ni comptes.
Fes còpies de seguretat des de ⚙️ **Ajustos → Exportar dades (JSON)**; es poden restaurar amb **Importar**.

## Fitxers

| Fitxer | Què és |
|---|---|
| `index.html` | Estructura de la pàgina i pantalles |
| `style.css` | Estils (mode clar i fosc automàtics) |
| `app.js` | Tota la lògica: vistes, dades, entrenament actiu |
| `charts.js` | Gràfiques SVG (línia i barres) sense llibreries |
| `manifest.webmanifest` | Fa que sigui instal·lable com a app (PWA) |
| `sw.js` | Service worker: fa que funcioni offline |
| `icons/` | Icones de l'app |

## Instal·lar-la al mòbil

1. Obre la URL de l'app amb Chrome (Android) o Safari (iPhone).
2. Menú del navegador → **"Afegir a la pantalla d'inici"** / **"Instal·lar aplicació"**.
3. S'obrirà a pantalla completa com una app nativa i funcionarà sense connexió.

## Desenvolupament

No cal instal·lar res. Edita els fitxers i obre `index.html` al navegador.
(El service worker només s'activa amb HTTPS o localhost; en local tot funciona igualment.)

Quan publiquis canvis, el mòbil els rebrà a la segona obertura de l'app
(el service worker serveix la versió en cache i es actualitza en segon pla).
