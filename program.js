/* program.js — Contingut del programa personalitzat d'entrenament.
   Dissenyat per a: home, 22 anys, 179 cm, 58 kg, hardgainer, principiant,
   3 dies/setmana de 30-45 min. Material a casa: Technogym Unica (jaló, press de pit, pec deck,
   extensió de cames, coixí de bíceps), manuelles ajustables, banc (alt), màquina de rem.
   Versió 4 (06/11/2026): NOMÉS exercicis que Ferran ha dit que sap fer i amb què se sent segur
   (flexions, planxa i abdominals inclosos). Res de banc per recolzar-s'hi. Tot és dades. */

window.PROGRAM = {
  meta: {
    name: "El teu programa",
    subtitle: "3 dies · sessions A/B · només exercicis que ja coneixes",
    version: 4,
    blockWeeks: 8,
    techWeeks: 2,
    sessionMinutes: 40
  },

  /* ---------- Fer-ho bé ----------
     Es mostra a Programa, al Repàs i durant les setmanes de tècnica */
  form: {
    title: "🛡️ Fer-ho bé i sense lesions",
    techBanner: "Setmana de tècnica: pes lleuger expressament. Lent, bonic, i acaba cada sèrie podent-ne fer 3 més.",
    rules: [
      "Setmanes 1-2 = tècnica. El pes de partida és lleuger a propòsit: acaba cada sèrie podent-ne fer 3 més.",
      "Lent i controlat: 2 s per baixar. Si has de fer impuls o tirar amb el cos, sobra pes.",
      "Grava't de costat amb el mòbil (1 sèrie per exercici) i compara amb el clip i la llista ✔ de la fitxa ⓘ.",
      "Dolor bo: cremor al múscul i agulletes 1-2 dies. Dolor dolent: punxada a una articulació o a l'esquena → para aquell exercici.",
      "Has de notar-ho al múscul que diu la fitxa. Si ho notes a un altre lloc (lumbar, coll, genoll), treu pes i revisa la tècnica.",
      "Aprèn cada exercici fins que sigui ✅: amb el 📷, 2 sèries netes; sense càmera, grava't i marca la llista ✔ de la fitxa ⓘ. Quan tots siguin ✅, ja ho saps fer."
    ]
  },

  /* ---------- Exercicis ----------
     kind: "load"  → progressa amb pes (+step kg quan totes les sèries arriben al màxim)
                     perHand: el pes és el de CADA manuella
           "level" → progressa canviant a la següent variant de la llista levels (startLevel: on comença)
           "time"  → progressa afegint segons (planxa)
     feel: on l'has de notar · check: què mirar al vídeo de tu mateix · stop: quan parar o canviar
     pose: analitzador de pose.js per comprovar la tècnica amb la càmera (squat, pushup, bridge, lateral, tricep)
     alt: què fer si no pots fer l'exercici tal com és */
  exercises: {
    squat: {
      name: "Esquat", kind: "level", pose: "squat",
      muscle: "Cames i glutis", equip: "Banc darrere teu · manuella quan toqui",
      levels: [
        "Sense pes, baixant fins a tocar el banc amb el cul",
        "Amb una manuella de 6 kg aguantada al pit",
        "Amb una manuella de 10 kg al pit",
        "Amb una manuella de 14 kg al pit",
        "Amb una manuella de 18 kg al pit"
      ],
      cues: [
        "Banc darrere teu. Peus una mica més amples que les espatlles, puntes una mica enfora",
        "Baixa enviant el cul enrere com si t'asseguessis, fins a tocar el banc suaument (no t'hi deixis caure)",
        "Puja empenyent amb tot el peu, pit amunt i genolls en la direcció de les puntes"
      ],
      feel: "Cuixes (davant) i cul. No a la lumbar ni a dins del genoll.",
      check: [
        "Talons a terra tota l'estona",
        "Genolls cap a les puntes dels peus, no cap endins",
        "El pit no cau endavant"
      ],
      stop: "Punxada al genoll o a l'esquena: baixa una mica menys o treu el pes.",
      mistake: "Deixar-se caure al banc o que els genolls es tanquin cap endins."
    },
    chestpress: {
      name: "Press de pit (Unica)", kind: "load", startLoad: 20, step: 5,
      muscle: "Pit, tríceps", equip: "Unica · nanses tipus manillar de moto",
      cues: [
        "Seu amb l'esquena al respatller i agafa les nanses tipus manillar de moto, a l'altura del pit",
        "Empeny endavant fins a estirar els braços, com Superman (sense bloquejar del tot els colzes)",
        "Torna a poc a poc (2 s) fins a notar l'estirament al pit"
      ],
      feel: "Pit i tríceps (darrere del braç). No a la part davantera de l'espatlla.",
      check: [
        "Esquena enganxada al respatller tota l'estona",
        "Les espatlles no pugen cap a les orelles",
        "Tornes a poc a poc, sense deixar caure la placa"
      ],
      stop: "Molèstia punxant a l'espatlla: no tornis tan enrere i treu 5 kg.",
      alt: "Pec deck (Unica): els coixinets en forma de T, que tanques cap endins davant del pit.",
      mistake: "Aixecar les espatlles cap a les orelles."
    },
    latpull: {
      name: "Jaló al pit (Unica)", kind: "load", startLoad: 20, step: 5,
      muscle: "Esquena, bíceps", equip: "Unica · barra de dalt",
      cues: [
        "Seu recte, agafa la barra una mica més ampla que les espatlles",
        "Estira la barra fins a la part alta del pit, colzes cap avall i enrere",
        "Torna a dalt a poc a poc (2 s), sense deixar caure la placa"
      ],
      feel: "Esquena (sota les aixelles) i bíceps.",
      check: [
        "Et tires enrere només una mica, no et balancejes",
        "La barra arriba a la part alta del pit, mai darrere el cap",
        "Les espatlles baixen, no pugen cap a les orelles"
      ],
      stop: "Dolor a l'espatlla o al coll: treu 5 kg.",
      mistake: "Tirar-se enrere i fer-ho amb el cos. Si has d'oscil·lar, treu 5 kg."
    },
    bicep: {
      name: "Curl de bíceps (Unica)", kind: "load", startLoad: 10, step: 5,
      muscle: "Bíceps", equip: "Unica · coixí inclinat",
      cues: [
        "Aixelles recolzades a dalt del coixí, braços estirats, agafa la barra o nanses",
        "Puja doblant només els colzes fins a dalt de tot, apreta 1 s",
        "Baixa a poc a poc (2 s) fins a quasi estirar del tot"
      ],
      feel: "Bíceps. No a l'esquena ni a les espatlles.",
      check: [
        "Aixelles sempre enganxades al coixí",
        "Baixes fins a quasi estirar el braç"
      ],
      stop: "Dolor al colze: treu pes.",
      alt: "Curl amb manuelles, dret, colzes enganxats al cos.",
      mistake: "Aixecar els colzes del coixí o fer-ho amb l'esquena."
    },
    plank: {
      name: "Planxa", kind: "time", startSecs: 30, step: 5, unit: "s",
      muscle: "Abdominals i core", equip: "Terra",
      cues: [
        "Colzes sota les espatlles, cos recte del cap als talons",
        "Apreta el cul i la panxa, mira al terra",
        "Respira; si el maluc cau, para i compta només el temps ben fet"
      ],
      feel: "Panxa i cul. No a la lumbar.",
      check: [
        "Línia recta del cap als talons",
        "Maluc ni caigut ni enlaire"
      ],
      stop: "Si notes la lumbar: para. Compta només el temps ben fet.",
      mistake: "Maluc caigut o cul enlaire."
    },
    crunch: {
      name: "Abdominals (encongiments)", kind: "level",
      muscle: "Abdominals", equip: "Terra",
      levels: [
        "Mans creuades al pit",
        "Mans tocant les orelles (sense estirar el cap)",
        "Amb una manuella lleugera al pit"
      ],
      cues: [
        "Estirat d'esquena, genolls doblats, peus a terra",
        "Puja només les espatlles del terra encongint la panxa, com si acostessis les costelles al maluc",
        "Baixa a poc a poc. La part de baix de l'esquena es queda a terra"
      ],
      feel: "Panxa. No al coll.",
      check: [
        "La lumbar no s'aixeca del terra",
        "No estires el cap amb les mans: mira al sostre en diagonal"
      ],
      stop: "Molèstia al coll: mans al pit i mira amunt.",
      mistake: "Estirar el cap amb les mans o pujar fins a seure."
    },
    legext: {
      name: "Extensió de cames (Unica)", kind: "load", startLoad: 20, step: 5,
      muscle: "Quàdriceps (cuixa davant)", equip: "Unica · coixí davant dels turmells",
      cues: [
        "Seu amb l'esquena al respatller, el coixí davant dels turmells",
        "Empeny el coixí endavant i amunt fins a estirar les cames, aguanta 1 s",
        "Baixa a poc a poc (2 s), sense deixar caure el pes"
      ],
      feel: "Cuixa de davant. No al genoll.",
      check: [
        "L'esquena no es despega del respatller",
        "Baixes a poc a poc, sense cop de placa"
      ],
      stop: "Dolor dins del genoll: treu 5 kg i no estiris tan de cop.",
      mistake: "Fer-ho amb impuls o deixar caure el pes."
    },
    pushup: {
      name: "Flexions", kind: "level", startLevel: 1, pose: "pushup",
      muscle: "Pit, tríceps, espatlla", equip: "Terra",
      levels: [
        "Amb els genolls a terra",
        "Flexions normals",
        "Normals, baixant en 2 s",
        "Amb els peus sobre una cadira"
      ],
      cues: [
        "Mans una mica més amples que les espatlles, cos recte com una taula",
        "Baixa fins que el pit quasi toqui el terra, colzes cap enrere (no oberts en creu)",
        "Puja empenyent fort; el cul no puja ni baixa"
      ],
      feel: "Pit i darrere del braç.",
      check: [
        "Cos recte del cap als peus (o als genolls)",
        "Baixes fins a quasi tocar el terra amb el pit",
        "Colzes cap enrere, no oberts en creu"
      ],
      stop: "Dolor al canell o a l'espatlla: fes-les amb els genolls a terra.",
      alt: "Si no arribes a 6: amb els genolls a terra.",
      mistake: "Enfonsar el maluc o fer mitja flexió."
    },
    shoulderpress: {
      name: "Press d'espatlles amb manuelles", kind: "load", startLoad: 4, step: 2, perHand: true,
      muscle: "Espatlles, tríceps", equip: "2 manuelles · assegut",
      cues: [
        "Assegut amb l'esquena recta, manuelles a l'alçada de les orelles, palmells endavant",
        "Empeny amunt fins a quasi estirar els braços, sense xocar les manuelles",
        "Baixa a poc a poc (2 s) fins a les orelles"
      ],
      feel: "Espatlles i tríceps.",
      check: [
        "No arquejes la lumbar per pujar",
        "Les dues manuelles pugen igual"
      ],
      stop: "Pessigada a l'espatlla: no obris tant els colzes i treu pes.",
      mistake: "Arquejar l'esquena per pujar més pes."
    },
    legraise: {
      name: "Elevacions de cames", kind: "level",
      muscle: "Abdominals (part de baix)", equip: "Terra",
      levels: [
        "Amb els genolls doblats",
        "Amb les cames estirades",
        "Cames estirades, baixant en 3 s"
      ],
      cues: [
        "Estirat d'esquena, mans sota el cul",
        "Puja les cames fins que quedin verticals",
        "Baixa a poc a poc sense tocar el terra. La lumbar enganxada al terra"
      ],
      feel: "Panxa, sobretot la part de baix. No a la lumbar.",
      check: [
        "La lumbar no s'arqueja quan baixes les cames",
        "Baixes a poc a poc, sense deixar-les caure"
      ],
      stop: "Si notes la lumbar: doblega els genolls o no baixis tant les cames.",
      mistake: "Arquejar la lumbar quan les cames baixen."
    },
    twist: {
      name: "Russian twist", kind: "level", unit: "reps/costat",
      muscle: "Abdominals i oblics", equip: "Terra · manuella opcional",
      levels: [
        "Sense pes, peus a terra",
        "Amb una manuella de 4 kg, peus a terra",
        "Amb la manuella i els peus enlaire"
      ],
      cues: [
        "Assegut a terra, genolls doblats, tronc inclinat enrere amb l'esquena recta",
        "Gira el tronc a un costat i toca el terra al costat del maluc, després a l'altre",
        "Lent i controlat: el que gira és el tronc, no només els braços"
      ],
      feel: "Costats de la panxa.",
      check: [
        "Esquena recta, no arrodonida",
        "Gira el tronc sencer, no només els braços"
      ],
      stop: "Molèstia a la lumbar: inclina't menys enrere.",
      mistake: "Arrodonir l'esquena o anar massa ràpid."
    }
  },

  /* Clips curts (YouTube Shorts). Clau = clau d'exercici, o nom exacte de l'ítem d'escalfament/refredament. */
  videos: {
    squat:         [{ id: "ScvZnl8pqO4", title: "Esquat al banc amb manuella (Alba Prieto)" }],
    chestpress:    [{ id: "qbkrwo9fTiw", title: "Press de pit en màquina (Vitar Club)" }],
    latpull:       [{ id: "TIZbG7Tjbf8", title: "Jaló al pit, tècnica correcta (Javi NewBody)" }],
    bicep:         [{ id: "uXaz4wPNaxs", title: "Curl de bíceps al coixí (Zona del Entrenador)" }],
    plank:         [{ id: "ysX1CpHKGCo", title: "Tècnica de la planxa (Dra. Isabel Junio)" }],
    crunch:        [{ id: "HLAPlJhxqEE", title: "Encongiments abdominals ben fets (El Nivel Fit)" }],
    legext:        [{ id: "xj5u9RvlkmA", title: "Extensió de quàdriceps en màquina (BenjaminTrainer)" }],
    pushup:        [{ id: "ZeDUsPI8Ufc", title: "Flexions sense lesionar-te (Diego Fernando)" }],
    shoulderpress: [{ id: "sWJoAATDlGM", title: "Press d'espatlles assegut (Laura Rozo)" }],
    legraise:      [{ id: "hTm5SjiW4gY", title: "Elevacions de cames estirat (Priscilla_bc)" }],
    twist:         [{ id: "9brzc9B1ZIU", title: "Russian twist (DKV)" }],
    "Màquina de rem": [{ id: "vj8MVU2UiEk", title: "Com remar bé (Fran, entrenador de remers)" }],
    "Gat-camell": [{ id: "gWbfVPK4RAU", title: "Gat-camell (Consorci Sanitari Integral, en català)" }],
    "Cobra a terra": [{ id: "yhkOiReYqy4", title: "Postura de la cobra pas a pas (Pau's Secrets)" }],
    "Estirament pectoral al marc de la porta": [{ id: "D1W8Zkk68WE", title: "Estirament de pit a la porta (Gimnasio Grandmontagne)" }],
    "Estirament flexors de maluc": [{ id: "HmfHMdmmVhc", title: "Estirament de maluc i flexors (Estudio Training)" }]
  },

  /* Descans després de cada sèrie (segons), per exercici */
  restSecs: {
    squat: 90, chestpress: 90, latpull: 90, legext: 75, pushup: 75, shoulderpress: 75,
    bicep: 60, plank: 45, crunch: 45, legraise: 45, twist: 45
  },

  /* ---------- Sessions ----------
     Només exercicis triats per Ferran. Jaló a totes dues (esquena). Abdominals cada dia. */
  workouts: {
    A: {
      name: "Sessió A", focus: "Cames, pit, esquena, bíceps, abdominals",
      items: [
        { ex: "squat",      sets: 3, reps: [10, 15] },
        { ex: "chestpress", sets: 3, reps: [8, 12] },
        { ex: "latpull",    sets: 3, reps: [8, 12] },
        { ex: "bicep",      sets: 2, reps: [10, 12] },
        { ex: "plank",      sets: 2, reps: [30, 30] },
        { ex: "crunch",     sets: 2, reps: [12, 20] }
      ]
    },
    B: {
      name: "Sessió B", focus: "Cames, pit, esquena, espatlles, abdominals",
      items: [
        { ex: "legext",        sets: 3, reps: [10, 15] },
        { ex: "pushup",        sets: 3, reps: [6, 12] },
        { ex: "latpull",       sets: 3, reps: [8, 12] },
        { ex: "shoulderpress", sets: 3, reps: [8, 12] },
        { ex: "legraise",      sets: 2, reps: [8, 12] },
        { ex: "twist",         sets: 2, reps: [10, 15] }
      ]
    }
  },

  warmup: [
    { name: "Màquina de rem", detail: "5 min tranquil, per escalfar tot el cos", secs: 300 },
    { name: "Gat-camell", detail: "×8 a quatre grapes: esquena amunt com un gat, després panxa avall" },
    { name: "Cercles de braços", detail: "×10 endavant i ×10 enrere" }
  ],

  cooldown: [
    { name: "Cobra a terra", detail: "2×10: de panxa a terra, aixeca el pit amb l'esquena" },
    { name: "Estirament pectoral al marc de la porta", detail: "30 s per costat, colze a 90° (▶ dos cops)", secs: 30 },
    { name: "Estirament flexors de maluc", detail: "30 s per costat, genoll a terra (▶ un cop per costat)", secs: 30 }
  ],

  finisher: {
    name: "Extra opcional",
    detail: "10 min més a la màquina de rem o caminant ràpid. Màxim 2 dies per setmana."
  },

  restDay: {
    title: "Dia de descans actiu",
    items: [
      { name: "Caminar 20 min", detail: "Ritme tranquil; també val anar a peu a algun lloc" },
      { name: "Estirament pectoral 30 s", detail: "Al marc d'una porta, colze a 90°" },
      { name: "Dormir 7 h o més", detail: "El múscul es construeix descansant" }
    ]
  },

  progressionRules: [
    "Cada exercici té un rang de reps (ex. 8-12). Fes totes les sèries dins del rang.",
    "Quan totes les sèries arriben al màxim → la propera sessió puja sola: +5 kg a la Unica, +2 kg a les manuelles, següent nivell a l'esquat, flexions i abdominals, +5 s a la planxa.",
    "Si una sèrie no arriba al mínim → mantens. Sense pressa.",
    "L'última rep de cada sèrie ha de costar, però amb bona tècnica. Si la tècnica es trenca, la sèrie s'acaba aquí.",
    "Setmana 8 = descàrrega: una sèrie menys a tot.",
    "Si un dia no pots, no el recuperis: fes la següent sessió el següent dia planificat."
  ],

  notes: {
    posture: "Feina asseguda = pit tancat i esquena alta feble. Per això hi ha jaló a totes dues sessions i estiraments al final.",
    pullupBar: "",
    disclaimer: "Recomanacions generals de fitness, no consells mèdics. Si apareix dolor, para i consulta un fisioterapeuta."
  },

  milestones: [
    /* gain = kg per sobre del pes inicial del perfil */
    { week: 2,  gain: 1,   text: "Tècnica apresa: tots els exercicis ✅." },
    { week: 4,  gain: 2,   text: "Força +20-40%: +10 kg al jaló i al press de pit, més flexions seguides." },
    { week: 8,  gain: 3.5, text: "Primer canvi visible al mirall: braços i pit més plens, postura més recta." },
    { week: 13, gain: 5,   text: "La gent del teu voltant ho comenta." },
    { week: 26, gain: 7,   text: "Abdominals marcats si el greix es manté baix." },
    { week: 40, gain: 9.5, text: "Objectiu: +10 kg. Revisió del pla." }
  ]
};
