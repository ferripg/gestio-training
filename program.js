/* program.js — Contingut del programa personalitzat (entrenament + dieta).
   Dissenyat per a: home, 22 anys, 179 cm, 58 kg, hardgainer, principiant,
   3 dies/setmana de 30-45 min. Material a casa: manuelles ajustables (fins a ~20 kg), banc inclinable,
   Technogym Unica (jaló, coixí de bíceps, politja baixa...), cinta, rem, KB 12 kg.
   Versió 3 (25/10/2026): manuelles + banc, 5 exercicis per sessió, esquat i pont de glutis a totes dues
   sessions per aprendre'ls abans, i a cada exercici: on l'has de notar, què comprovar i quan parar. Tot és dades. */

window.PROGRAM = {
  meta: {
    name: "Programa Casa",
    subtitle: "Full-body 3 dies · sessions A/B · 5 exercicis · manuelles, banc i Unica",
    version: 3,
    blockWeeks: 8,
    techWeeks: 2,
    sessionMinutes: 35
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
      "Has de notar-ho al múscul que diu la fitxa. Si ho notes a un altre lloc (lumbar, coll, genoll), treu pes i revisa la tècnica."
    ]
  },

  /* ---------- Exercicis ----------
     kind: "load"  → progressa amb pes (+step kg quan totes les sèries arriben al màxim)
                     perHand: el pes és el de CADA manuella
           "level" → progressa canviant a la següent variant de la llista levels
           "time"  → progressa afegint segons (planxa)
     feel: on l'has de notar · check: què mirar al vídeo de tu mateix · stop: quan parar o canviar
     pose: analitzador de pose.js per comprovar la tècnica amb la càmera (squat, bridge, lateral, tricep)
     alt: què fer si no pots fer l'exercici tal com és */
  exercises: {
    gobletbox: {
      name: "Esquat al banc amb manuella", kind: "load", startLoad: 8, step: 2, pose: "squat",
      muscle: "Cames i glutis", equip: "1 manuella · banc pla darrere teu",
      cues: [
        "Banc pla darrere teu. Aguanta una manuella vertical contra el pit, amb les dues mans sota el disc de dalt",
        "Peus una mica més amples que les espatlles. Baixa enviant el cul enrere fins a tocar el banc suaument",
        "Puja empenyent amb tot el peu, pit amunt i genolls en la direcció de les puntes"
      ],
      feel: "Cuixes (davant) i cul. No a la lumbar ni a dins del genoll.",
      check: [
        "Talons a terra tota l'estona",
        "Genolls cap a les puntes dels peus, no cap endins",
        "El pit no cau endavant: la manuella queda enganxada al pit"
      ],
      stop: "Punxada al genoll o a l'esquena: treu pes o baixa una mica menys.",
      alt: "Si costa, fes-lo sense manuella, amb els braços estirats endavant.",
      mistake: "Deixar-se caure al banc o que els genolls es tanquin cap endins."
    },
    chestpress: {
      name: "Press de pit (Unica)", kind: "load", startLoad: 20, step: 5,
      muscle: "Pit, tríceps", equip: "Unica · nanses de press",
      cues: [
        "Seu amb l'esquena al respatller, nanses a l'alçada del pit",
        "Empeny endavant fins a estirar els braços (sense bloquejar del tot els colzes)",
        "Torna a poc a poc (2 s) fins a notar l'estirament al pit"
      ],
      feel: "Pit i tríceps (darrere del braç). No a la part davantera de l'espatlla.",
      check: [
        "Esquena enganxada al respatller tota l'estona",
        "Les espatlles no pugen cap a les orelles",
        "Tornes a poc a poc, sense deixar caure la placa"
      ],
      stop: "Molèstia punxant a l'espatlla: no tornis tan enrere i treu 5 kg.",
      alt: "Si la teva Unica no té el press: flexions normals (3×6-12).",
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
        "Et tires enrere només una mica, no et balances",
        "La barra arriba a la part alta del pit, mai darrere el cap",
        "Les espatlles baixen, no pugen cap a les orelles"
      ],
      stop: "Dolor a l'espatlla o al coll: treu 5 kg.",
      mistake: "Tirar-se enrere i fer-ho amb el cos. Si has d'oscil·lar, treu 5 kg."
    },
    inclinerow: {
      name: "Rem al banc inclinat", kind: "load", startLoad: 6, step: 2, perHand: true,
      muscle: "Esquena mitjana — POSTURA", equip: "2 manuelles · banc inclinat (~30-45°)",
      cues: [
        "Inclina el banc. Estira't de panxa amb el pit al respatller i els peus a terra, manuelles penjant",
        "Porta els colzes enrere i a prop del cos, cap a la cintura, i apreta les escàpules 1 s",
        "Baixa a poc a poc fins a estirar els braços. El pit no es desenganxa del banc"
      ],
      feel: "Entre les escàpules i darrere de l'espatlla. La lumbar descansa.",
      check: [
        "El pit sempre enganxat al banc",
        "Les espatlles no pugen cap a les orelles",
        "A dalt, els colzes arriben a l'altura de l'esquena"
      ],
      stop: "Coll tens: mira al terra i treu pes.",
      alt: "Si el banc no s'inclina: rem a la politja baixa de la Unica.",
      mistake: "Aixecar el pit del banc per fer força amb l'esquena o el coll."
    },
    lateralraise: {
      name: "Elevacions laterals", kind: "load", startLoad: 3, step: 1, perHand: true, pose: "lateral",
      muscle: "Espatlla (costat) — és el que fa l'esquena més ampla", equip: "2 manuelles lleugeres",
      cues: [
        "Dret o assegut a la vora del banc, manuelles als costats, colzes una mica doblats i fixos",
        "Puja els braços cap als costats fins a l'altura de les espatlles, com si empenyessis les parets amb els colzes",
        "Baixa a poc a poc (2-3 s). El pes és petit: l'important és que no balancegis"
      ],
      feel: "A la part del costat de l'espatlla. No al coll ni a dalt de les espatlles.",
      check: [
        "No balancejes el cos per pujar",
        "Les espatlles no pugen cap a les orelles",
        "Les mans no passen de l'altura de les espatlles"
      ],
      stop: "Pessigada a l'espatlla: puja una mica menys i porta les manuelles una mica per davant del cos.",
      alt: "Si 3 kg és massa: fes-ho amb la barra de la manuella sense discos.",
      mistake: "Fer-ho amb massa pes i impuls: llavors treballa el coll, no l'espatlla."
    },
    bridge: {
      name: "Pont de glutis amb manuella", kind: "load", startLoad: 8, step: 2, pose: "bridge",
      muscle: "Glutis — clau per a l'esquena i la pelvis", equip: "Terra · 1 manuella · tovallola",
      cues: [
        "Estirat d'esquena a terra, genolls doblats, peus a prop del cul i a l'amplada del maluc",
        "Manuella travessada sobre el maluc (amb una tovallola), aguantada amb les dues mans",
        "Empeny amb els talons i puja el maluc fins que genolls, maluc i espatlles facin una línia. Apreta el cul 2 s i baixa a poc a poc"
      ],
      feel: "Cul, molt. Si ho notes a la lumbar o darrere la cuixa, ajusta.",
      check: [
        "A dalt, genolls, maluc i espatlles en línia recta",
        "No arquejes la lumbar: les costelles avall",
        "Els talons no s'aixequen del terra"
      ],
      stop: "Lumbar: puja menys i apreta el cul. Darrere la cuixa: acosta els peus.",
      alt: "Si 8 kg és massa: sense pes.",
      mistake: "Arquejar la lumbar per pujar més."
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
      mistake: "Aixecar els colzes del coixí o fer-ho amb l'esquena."
    },
    ohtricep: {
      name: "Extensió de tríceps per sobre el cap", kind: "load", startLoad: 6, step: 2, pose: "tricep",
      muscle: "Tríceps — 2/3 del braç", equip: "1 manuella · banc gairebé vertical",
      cues: [
        "Seu amb l'esquena recolzada al banc vertical. Aguanta una manuella amb les dues mans, braços estirats a sobre del cap",
        "Baixa la manuella darrere del cap doblant només els colzes, fins a notar l'estirament",
        "Puja estirant els braços. Els colzes miren endavant i gairebé no es mouen"
      ],
      feel: "Darrere del braç (tríceps). No al colze ni a la lumbar.",
      check: [
        "Esquena enganxada al respatller, sense arquejar",
        "Els colzes no s'obren cap als costats",
        "Baixes fins a notar l'estirament, no a mig camí"
      ],
      stop: "Molèstia al colze: treu pes i baixa una mica menys.",
      alt: "Si l'espatlla no et deixa pujar els braços: flexions amb les mans al banc.",
      mistake: "Obrir els colzes o arquejar l'esquena per fer força."
    }
  },

  /* Clips curts (YouTube Shorts). Els nous de la v3 triats per títol el 25/10/2026: revisar-los.
     Clau = clau d'exercici, o nom exacte de l'ítem d'escalfament/refredament. */
  videos: {
    gobletbox:     [{ id: "ScvZnl8pqO4", title: "Esquat al banc amb manuella (Alba Prieto)" }],
    chestpress:    [{ id: "qbkrwo9fTiw", title: "Press de pit en màquina (Vitar Club)" }],
    latpull:       [{ id: "TIZbG7Tjbf8", title: "Jaló al pit, tècnica correcta (Javi NewBody)" }],
    inclinerow:    [{ id: "8Q4kzzydoRA", title: "Rem amb manuelles al banc inclinat (Effort Gym)" }],
    lateralraise:  [{ id: "Vh_Kjw3O-DQ", title: "Elevacions laterals, fes-les així (Alberto Mareque)" }],
    ohtricep:      [{ id: "KZUytRrvghc", title: "Extensió de tríceps per sobre el cap (Rodrigo Oscos)" }],
    bridge:        [{ id: "QIQtIs6yfXk", title: "Pont de glutis ben fet (sofitmami)" }],
    bicep:         [{ id: "uXaz4wPNaxs", title: "Curl de bíceps al coixí (Zona del Entrenador)" }],
    "Cinta o rem suau": [{ id: "vj8MVU2UiEk", title: "Si tries el rem: com remar bé (Fran, entrenador de remers)" }],
    "Gat-camell": [{ id: "gWbfVPK4RAU", title: "Gat-camell (Consorci Sanitari Integral, en català)" }],
    "Cobra a terra": [{ id: "yhkOiReYqy4", title: "Postura de la cobra pas a pas (Pau's Secrets)" }],
    "Estirament pectoral al marc de la porta": [{ id: "D1W8Zkk68WE", title: "Estirament de pit a la porta (Gimnasio Grandmontagne)" }],
    "Estirament flexors de maluc": [{ id: "HmfHMdmmVhc", title: "Estirament de maluc i flexors (Estudio Training)" }]
  },

  /* Descans després de cada sèrie (segons), per exercici */
  restSecs: {
    gobletbox: 90, chestpress: 90, latpull: 90, inclinerow: 90,
    bridge: 75, lateralraise: 60, ohtricep: 60, bicep: 60
  },

  /* ---------- Sessions ----------
     Criteri: fàcil de fer bé (recolzat al banc o a la màquina) i molt efectiu (músculs grans, recorregut complet).
     L'esquat i el pont de glutis surten a totes dues: com més els repeteixes, abans els aprens */
  workouts: {
    A: {
      name: "Sessió A", focus: "Cames, pit, esquena, tríceps",
      items: [
        { ex: "gobletbox", sets: 3, reps: [8, 12] },
        { ex: "chestpress", sets: 3, reps: [8, 12] },
        { ex: "latpull",   sets: 3, reps: [8, 12] },
        { ex: "bridge",    sets: 3, reps: [10, 15] },
        { ex: "ohtricep",  sets: 2, reps: [10, 15] }
      ]
    },
    B: {
      name: "Sessió B", focus: "Cames, esquena, espatlles, bíceps",
      items: [
        { ex: "gobletbox",    sets: 3, reps: [8, 12] },
        { ex: "inclinerow",   sets: 3, reps: [8, 12] },
        { ex: "lateralraise", sets: 3, reps: [12, 20] },
        { ex: "bridge",       sets: 3, reps: [10, 15] },
        { ex: "bicep",        sets: 2, reps: [10, 12] }
      ]
    }
  },

  warmup: [
    { name: "Cinta o rem suau", detail: "3 min caminant ràpid a la cinta (o rem tranquil)", secs: 180 },
    { name: "Gat-camell", detail: "×8 a quatre grapes: esquena amunt com un gat, després panxa avall" },
    { name: "Cercles de braços", detail: "×10 endavant i ×10 enrere" },
    { name: "Esquat al banc sense pes", detail: "×10 lents, per recordar el moviment" }
  ],

  cooldown: [
    { name: "Cobra a terra", detail: "2×10: de panxa a terra, aixeca el pit amb l'esquena" },
    { name: "Estirament pectoral al marc de la porta", detail: "30 s per costat, colze a 90° (▶ dos cops)", secs: 30 },
    { name: "Estirament flexors de maluc", detail: "30 s per costat, genoll a terra (▶ un cop per costat)", secs: 30 }
  ],

  finisher: {
    name: "Finisher opcional",
    detail: "10 min a la cinta caminant ràpid amb inclinació 6-8%. Màxim 2 dies per setmana."
  },

  restDay: {
    title: "Dia de descans actiu",
    items: [
      { name: "Caminar 20 min", detail: "Ritme tranquil; també val anar a peu a algun lloc" },
      { name: "Estirament pectoral 30 s", detail: "Al marc d'una porta, colze a 90°" },
      { name: "Menjar igual que un dia d'entrenament", detail: "El múscul es construeix avui" }
    ]
  },

  progressionRules: [
    "Cada exercici té un rang de reps (ex. 8-12). Fes totes les sèries dins del rang.",
    "Quan totes les sèries arriben al màxim → la propera sessió puja sola: +2 kg a les manuelles (+1 kg a les elevacions laterals), +5 kg a la Unica.",
    "Si una sèrie no arriba al mínim → mantens. Sense pressa.",
    "L'última rep de cada sèrie ha de costar, però amb bona tècnica. Si la tècnica es trenca, la sèrie s'acaba aquí.",
    "Setmana 8 = descàrrega: una sèrie menys a tot.",
    "Si un dia no pots, no el recuperis: fes la següent sessió el següent dia planificat."
  ],

  notes: {
    posture: "Feina asseguda = pit tancat, esquena alta i glutis febles. Per això hi ha rem, pont de glutis i estiraments cada setmana.",
    pullupBar: "",
    disclaimer: "Recomanacions generals de fitness i nutrició, no consells mèdics. Si apareix dolor, para i consulta un fisioterapeuta."
  },

  milestones: [
    /* gain = kg per sobre del pes inicial del perfil */
    { week: 2,  gain: 1.5, text: "Tècnica apresa: ja saps fer els 5 exercicis sense mirar el clip." },
    { week: 4,  gain: 2,   text: "Força +20-40%: +4 kg a les manuelles, +10 kg al jaló i al press de pit." },
    { week: 8,  gain: 3.5, text: "Primer canvi visible al mirall: braços i pit més plens, postura més recta." },
    { week: 13, gain: 5,   text: "La gent del teu voltant ho comenta." },
    { week: 26, gain: 7,   text: "Abdominals marcats si el greix es manté baix." },
    { week: 40, gain: 9.5, text: "Objectiu: +10 kg amb poc greix. Revisió del pla." }
  ],

  /* ---------- Dieta ----------
     Model: REBOST (el menjar real de l'usuari) + REGISTRE per porcions + RECOMANACIÓ del que falta.
     Cada aliment té UNA porció normal (1 iogurt, 1 scoop, 1 ou, 1 plat) amb kcal i proteïna
     estàndard (BEDCA/USDA). L'usuari pot editar els valors amb l'etiqueta del seu producte.
     role: prot (proteïna) · carb · fat · mix   cap: porcions màximes per àpat
     meals: en quins àpats té sentit (per a la recomanació) */
  diet: {
    intro: "Valors estàndard per porció. Si l'etiqueta del teu producte diu una altra cosa, edita'l al rebost.",
    mealTimes: [
      { id: "esmorzar", name: "Esmorzar",     until: 10.5 },
      { id: "migmati",  name: "Mig matí",     until: 13 },
      { id: "dinar",    name: "Dinar",        until: 16.5 },
      { id: "berenar",  name: "Berenar",      until: 19.5 },
      { id: "sopar",    name: "Sopar",        until: 23 },
      { id: "extra",    name: "Extra de nit", until: 30 }
    ],
    foods: {
      iogurt:     { name: "Iogurt natural",      portion: "1 iogurt (125 g)",     kcal: 76,  prot: 4.4,  role: "prot", cap: 2, meals: ["esmorzar", "migmati", "berenar", "extra"] },
      iogurtgrec: { name: "Iogurt grec",         portion: "1 iogurt (150 g)",     kcal: 145, prot: 13.5, role: "prot", cap: 1, meals: ["esmorzar", "migmati", "berenar", "sopar", "extra"] },
      maduixes:   { name: "Maduixes congelades", portion: "grapat (100 g)",       kcal: 35,  prot: 0.7,  role: "carb", cap: 1, meals: ["esmorzar", "migmati", "berenar", "extra"] },
      chia:       { name: "Llavors de chia",     portion: "1 c.s. (15 g)",        kcal: 73,  prot: 2.5,  role: "fat",  cap: 1, meals: ["esmorzar", "extra"] },
      whey:       { name: "Whey de maduixa",     portion: "1 scoop (30 g)",       kcal: 120, prot: 24,   role: "prot", cap: 1, meals: ["esmorzar", "migmati", "berenar", "extra"] },
      creatina:   { name: "Creatina",            portion: "5 g",                  kcal: 0,   prot: 0,    role: "mix",  cap: 1, meals: [] },
      civada:     { name: "Civada",              portion: "mig got (40 g)",       kcal: 150, prot: 5.4,  role: "carb", cap: 2, meals: ["esmorzar", "migmati", "extra"] },
      cacauet:    { name: "Crema de cacauet",    portion: "1 c.s. (15 g)",        kcal: 90,  prot: 3.8,  role: "fat",  cap: 2, meals: ["esmorzar", "migmati", "berenar", "extra"] },
      llet:       { name: "Llet sencera",        portion: "1 got (250 ml)",       kcal: 160, prot: 8,    role: "mix",  cap: 1, meals: ["esmorzar", "migmati", "berenar", "sopar", "extra"] },
      platan:     { name: "Plàtan",              portion: "1",                    kcal: 105, prot: 1.3,  role: "carb", cap: 1, meals: ["esmorzar", "migmati", "berenar"] },
      mel:        { name: "Mel",                 portion: "1 c.s.",               kcal: 60,  prot: 0,    role: "carb", cap: 1, meals: ["esmorzar", "migmati", "berenar", "extra"] },
      nous:       { name: "Fruits secs",         portion: "grapat (30 g)",        kcal: 190, prot: 5,    role: "fat",  cap: 1, meals: ["migmati", "berenar", "extra"] },
      datils:     { name: "Dàtils",              portion: "3",                    kcal: 70,  prot: 0.5,  role: "carb", cap: 1, meals: ["migmati", "berenar"] },
      pasta:      { name: "Pasta",               portion: "1 plat (100 g en cru)", kcal: 355, prot: 12.5, role: "carb", cap: 1, meals: ["dinar", "sopar"] },
      arros:      { name: "Arròs precuit",       portion: "1 bossa (125 g)",      kcal: 175, prot: 3.5,  role: "carb", cap: 1, meals: ["dinar", "sopar"] },
      tonyina:    { name: "Tonyina",             portion: "1 llauna",             kcal: 100, prot: 15,   role: "prot", cap: 2, meals: ["dinar", "sopar"] },
      sardines:   { name: "Sardines",            portion: "1 llauna",             kcal: 190, prot: 20,   role: "prot", cap: 1, meals: ["dinar", "sopar"] },
      pollastre:  { name: "Pollastre rostit",    portion: "1 tros (150 g)",       kcal: 300, prot: 40,   role: "prot", cap: 1, meals: ["dinar", "sopar"] },
      ou:         { name: "Ou",                  portion: "1",                    kcal: 75,  prot: 6.5,  role: "prot", cap: 3, meals: ["esmorzar", "dinar", "sopar"] },
      llegums:    { name: "Llegums de pot",      portion: "mig pot (120 g)",      kcal: 130, prot: 8,    role: "mix",  cap: 1, meals: ["dinar", "sopar"] },
      galldindi:  { name: "Gall dindi",          portion: "3 llesques (40 g)",    kcal: 45,  prot: 8,    role: "prot", cap: 2, meals: ["esmorzar", "berenar", "sopar"] },
      formatge:   { name: "Formatge",            portion: "tros (30 g)",          kcal: 110, prot: 7,    role: "fat",  cap: 2, meals: ["esmorzar", "berenar", "sopar", "extra"] },
      pa:         { name: "Pa",                  portion: "1 llesca",             kcal: 85,  prot: 3.5,  role: "carb", cap: 3, meals: ["esmorzar", "berenar", "sopar", "extra"] },
      oli:        { name: "Oli d'oliva",         portion: "1 c.s.",               kcal: 90,  prot: 0,    role: "fat",  cap: 1, meals: ["dinar", "sopar"] },
      tomaquet:   { name: "Tomàquet fregit",     portion: "3 c.s. (50 g)",        kcal: 40,  prot: 0.7,  role: "carb", cap: 1, meals: ["dinar", "sopar"] },
      alvocat:    { name: "Alvocat",             portion: "mig",                  kcal: 115, prot: 1.5,  role: "fat",  cap: 1, meals: ["esmorzar", "sopar"] },
      hummus:     { name: "Hummus",              portion: "3 c.s. (50 g)",        kcal: 90,  prot: 4,    role: "mix",  cap: 1, meals: ["berenar", "sopar"] },
      amanida:    { name: "Amanida de bossa",    portion: "1 bol",                kcal: 15,  prot: 1,    role: "carb", cap: 1, meals: ["dinar", "sopar"] },
      fruita:     { name: "Fruita",              portion: "1 peça",               kcal: 80,  prot: 0.5,  role: "carb", cap: 1, meals: ["migmati", "berenar"] },
      platcasa:   { name: "Plat de casa (estimació)", portion: "1 plat",         kcal: 400, prot: 20,   role: "mix",  cap: 1, meals: [] },
      platfora:   { name: "Menjar fora (estimació)",  portion: "1 plat combinat", kcal: 800, prot: 35,  role: "mix",  cap: 1, meals: [] }
    },
    /* Rebost inicial: el que Ferran ha dit que menja (es pot canviar a l'app) */
    defaultPantry: ["iogurt", "maduixes", "chia", "whey", "creatina", "civada", "cacauet", "llet", "platan", "pasta", "tonyina", "oli", "ou", "pa", "formatge", "nous", "fruita", "platcasa", "platfora"],
    extras: [
      { id: "sleep", name: "He dormit 7 h o més", short: "Son ≥7 h", detail: "El múscul es construeix dormint." },
      { id: "water", name: "Aigua ≥2 L", short: "Aigua", detail: "Amb la creatina, l'aigua importa més." }
    ],
    shopping: [
      "Civada (1 kg)", "Llet sencera (6-8 L)", "Crema de cacauet", "Plàtans (7-10)", "Maduixes congelades",
      "Iogurt natural (7)", "Iogurt grec (7)", "Ous (2 dotzenes)", "Tonyina en llauna (5-6)", "Sardines en llauna (3)",
      "Pollastre rostit (1-2)", "Formatge", "Pa integral", "Hummus (2)", "Fruits secs (500 g)", "Dàtils",
      "Arròs precuit en bossa (4)", "Llegums de pot (3)", "Amanida en bossa (3)", "Alvocats (3)", "Gall dindi en llesques",
      "Mel", "Oli d'oliva", "Whey de maduixa", "Creatina"
    ],
    tips: [
      "Llet en lloc d'aigua als àpats: +160 kcal i 8 g de proteïna per got.",
      "Oli d'oliva a tot: una cullerada són 90 kcal que no omplen.",
      "Compra el diumenge amb la llista. Sense menjar a casa no hi ha pla.",
      "Els McDonald's puntuals no compten: compta la mitjana de la setmana, i això ho veu la bàscula.",
      "Pesa't cada matí després del lavabo. El que importa és la mitjana de 7 dies."
    ]
  }
};
