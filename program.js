/* program.js — Contingut del programa personalitzat (entrenament + dieta).
   Dissenyat per a: home, 22 anys, 179 cm, 58 kg, hardgainer, principiant,
   3 dies/setmana de 30-45 min. Material: Technogym Unica (jaló, pec deck, extensió de cames,
   coixí de bíceps, politja baixa amb nansa, press de pit), cinta, rem, KB 12 kg, manuelles 2/8 kg.
   Versió 2 (22/09/2026): màquina primer, moviments simples, clips curts. Tot és dades. */

window.PROGRAM = {
  meta: {
    name: "Programa Hardgainer",
    subtitle: "Full-body 3 dies · sessions A/B alternades · bloc de 8 setmanes",
    version: 2,
    blockWeeks: 8,
    sessionMinutes: 35
  },

  /* ---------- Exercicis ----------
     kind: "load"  → progressa amb la placa de la Unica (+step kg quan totes les sèries arriben al màxim)
           "level" → progressa canviant a la següent variant de la llista levels
           "time"  → progressa afegint segons (planxa)
     alt: què fer si no pots fer l'exercici tal com és */
  exercises: {
    pushup: {
      name: "Flexions", kind: "level",
      muscle: "Pit, tríceps, espatlla", equip: "Terra",
      levels: [
        "Flexions normals a terra",
        "Flexions amb els peus sobre el sofà",
        "Flexions amb una motxilla amb pes"
      ],
      cues: [
        "Mans una mica més amples que les espatlles, cos recte com una taula",
        "Baixa fins que el pit quasi toqui el terra, colzes cap enrere (no oberts)",
        "Puja empenyent fort; el cul no puja ni baixa"
      ],
      alt: "Si no arribes a 6, fes-les amb les mans sobre el seient de la Unica (més fàcil).",
      mistake: "Enfonsar el maluc o mirar amunt."
    },
    latpull: {
      name: "Jaló al pit (Unica)", kind: "load", startLoad: 20, step: 5,
      muscle: "Esquena, bíceps", equip: "Unica · barra de dalt",
      cues: [
        "Seu recte, agafa la barra una mica més ampla que les espatlles",
        "Estira la barra fins a la part alta del pit, colzes cap avall i enrere",
        "Torna a dalt a poc a poc (2 s), sense deixar caure la placa"
      ],
      mistake: "Tirar-se enrere i fer-ho amb el cos. Si has d'oscil·lar, treu 5 kg."
    },
    legext: {
      name: "Extensió de cames (Unica)", kind: "load", startLoad: 20, step: 5,
      muscle: "Quàdriceps (cuixa davant)", equip: "Unica · coixí als turmells",
      cues: [
        "Seu amb l'esquena al respatller, el coixí just sobre els turmells",
        "Estira les cames fins a quedar rectes, aguanta 1 s a dalt",
        "Baixa a poc a poc (2 s), sense deixar caure el pes"
      ],
      mistake: "Fer-ho amb impuls o deixar caure el pes."
    },
    pecdeck: {
      name: "Obrir i tancar braços (Unica)", kind: "load", startLoad: 15, step: 5,
      muscle: "Pit", equip: "Unica · pec deck",
      cues: [
        "Seu recte, esquena al respatller, braços als coixins o nanses a l'alçada del pit",
        "Tanca els braços al davant fins que quasi es toquin, apretant el pit 1 s",
        "Obre a poc a poc fins a notar l'estirament al pit, sense passar-te"
      ],
      mistake: "Obrir massa (dolor a l'espatlla) o tancar amb impuls."
    },
    bicep: {
      name: "Curl de bíceps (Unica)", kind: "load", startLoad: 10, step: 5,
      muscle: "Bíceps", equip: "Unica · coixí inclinat",
      cues: [
        "Aixelles recolzades a dalt del coixí, braços estirats, agafa la barra o nanses",
        "Puja doblant només els colzes fins a dalt de tot, apreta 1 s",
        "Baixa a poc a poc (2 s) fins a quasi estirar del tot"
      ],
      mistake: "Aixecar els colzes del coixí o fer-ho amb l'esquena."
    },
    twist: {
      name: "Russian twist (girs asseguts)", kind: "level", unit: "reps/costat",
      muscle: "Abdominals i oblics", equip: "Terra · KB 12 kg opcional",
      levels: [
        "Sense pes, peus a terra",
        "Amb la KB de 12 kg a les mans, peus a terra",
        "Amb la KB i els peus enlaire"
      ],
      cues: [
        "Assegut a terra, genolls doblats, tronc inclinat enrere amb l'esquena recta",
        "Gira el tronc a un costat i toca el terra al costat del maluc, després a l'altre",
        "Lent i controlat: el que gira és el tronc, no només els braços"
      ],
      mistake: "Arrodonir l'esquena o anar massa ràpid."
    },
    row: {
      name: "Rem assegut (Unica, politja de baix)", kind: "load", startLoad: 20, step: 5,
      muscle: "Esquena mitjana — POSTURA", equip: "Unica · nansa al ganxo de baix",
      cues: [
        "Enganxa la nansa al ganxo de baix, seu davant amb els genolls una mica doblats i el pit amunt",
        "Estira la nansa cap al melic portant els colzes enrere, apreta les escàpules 1 s",
        "Torna endavant a poc a poc sense encorbar l'esquena"
      ],
      alt: "Si no trobes com muntar la nansa: fes jaló al pit amb les mans girades cap a tu (agafada inversa).",
      mistake: "Tirar amb la lumbar o encorbar-se a la tornada."
    },
    squat: {
      name: "Esquat", kind: "level",
      muscle: "Cames i glutis", equip: "Pes corporal → KB 12 kg",
      levels: [
        "Esquat amb pes corporal (braços endavant)",
        "Esquat goblet amb la KB de 12 kg al pit",
        "Goblet amb pausa de 2 s a baix"
      ],
      cues: [
        "Peus a l'amplada de les espatlles, puntes una mica enfora",
        "Seu enrere i avall com si t'asseguessis en una cadira, pit amunt, talons a terra",
        "Baixa fins que les cuixes quedin paral·leles al terra i puja"
      ],
      mistake: "Genolls cap endins o talons que s'aixequen."
    },
    chestpress: {
      name: "Press de pit (Unica)", kind: "load", startLoad: 20, step: 5,
      muscle: "Pit, tríceps", equip: "Unica · nanses de press",
      cues: [
        "Seu amb l'esquena al respatller, nanses a l'alçada del pit",
        "Empeny endavant fins a estirar els braços (sense bloquejar del tot els colzes)",
        "Torna a poc a poc (2 s) fins a notar l'estirament al pit"
      ],
      alt: "Si la teva Unica no té el press: fes flexions normals (3×6-12).",
      mistake: "Aixecar les espatlles cap a les orelles."
    },
    bridge: {
      name: "Pont de glutis", kind: "level",
      muscle: "Glutis — clau per a l'esquena i la pelvis", equip: "Terra → sofà → KB 12 kg",
      levels: [
        "Pont de glutis a terra",
        "Hip thrust amb l'esquena alta al sofà",
        "Hip thrust amb la KB de 12 kg sobre els malucs"
      ],
      cues: [
        "Estirat d'esquena, peus a terra a prop del cul, a l'amplada del maluc",
        "Empeny amb els talons i aixeca el maluc fins que cuixes i tronc facin una línia recta",
        "Apreta el cul 2 s a dalt i baixa a poc a poc"
      ],
      mistake: "Arquejar la lumbar per pujar més."
    },
    ytw: {
      name: "Y-T-W a terra", kind: "level", unit: "reps per lletra",
      muscle: "Esquena alta i espatlles — POSTURA", equip: "Terra → manuelles 2 kg",
      levels: [
        "Sense pes, estirat de panxa a terra",
        "Amb les manuelles de 2 kg"
      ],
      cues: [
        "Estirat de panxa, front recolzat, braços en forma de Y: aixeca'ls apretant l'esquena alta",
        "Després en T (braços oberts) i en W (colzes doblats)",
        "Lent: 2 s amunt, 1 s aguantant, 2 s avall"
      ],
      mistake: "Arronsar les espatlles cap a les orelles."
    },
    plank: {
      name: "Planxa", kind: "time", startSecs: 30, step: 5, unit: "s",
      muscle: "Core", equip: "Terra",
      cues: [
        "Colzes sota les espatlles, cos recte del cap als talons",
        "Apreta el cul i la panxa, mira al terra",
        "Respira; si el maluc cau, para i compta només el temps ben fet"
      ],
      mistake: "Maluc caigut o cul enlaire."
    }
  },

  /* Clips curts (YouTube Shorts, 30-60 s, verificats 21/09/2026).
     Clau = clau d'exercici, o nom exacte de l'ítem d'escalfament/refredament. */
  videos: {
    pushup:     [{ id: "ZeDUsPI8Ufc", title: "Flexions sense lesionar-te (Diego Fernando)" }],
    latpull:    [{ id: "TIZbG7Tjbf8", title: "Jaló al pit, tècnica correcta (Javi NewBody)" }],
    legext:     [{ id: "xj5u9RvlkmA", title: "Extensió de quàdriceps en màquina (BenjaminTrainer)" }],
    pecdeck:    [{ id: "kGVhRoYlb50", title: "Obertures en màquina (BenjaminTrainer)" }],
    bicep:      [{ id: "uXaz4wPNaxs", title: "Curl de bíceps al coixí (Zona del Entrenador)" }],
    twist:      [{ id: "9brzc9B1ZIU", title: "Russian twist (DKV)" }],
    row:        [{ id: "D_UXjlrZIBw", title: "Rem en politja baixa (Maru Lekhal)" }],
    squat:      [{ id: "4RN0YJF4YtE", title: "Esquat goblet en 30 segons (Jeronimo Milo)" }],
    chestpress: [{ id: "qbkrwo9fTiw", title: "Press de pit en màquina (Vitar Club)" }],
    bridge:     [{ id: "QIQtIs6yfXk", title: "Pont de glutis ben fet (sofitmami)" }],
    ytw:        [{ id: "TMnRKdNOrrA", title: "Y-T-W a terra (Cali Hoss)" }],
    plank:      [{ id: "ysX1CpHKGCo", title: "Tècnica de la planxa (Dra. Isabel Junio)" }],
    "Cinta o rem suau": [{ id: "vj8MVU2UiEk", title: "Si tries el rem: com remar bé (Fran, entrenador de remers)" }],
    "Gat-camell": [{ id: "gWbfVPK4RAU", title: "Gat-camell (Consorci Sanitari Integral, en català)" }],
    "Cobra a terra": [{ id: "yhkOiReYqy4", title: "Postura de la cobra pas a pas (Pau's Secrets)" }],
    "Estirament pectoral al marc de la porta": [{ id: "D1W8Zkk68WE", title: "Estirament de pit a la porta (Gimnasio Grandmontagne)" }],
    "Estirament flexors de maluc": [{ id: "HmfHMdmmVhc", title: "Estirament de maluc i flexors (Estudio Training)" }]
  },

  /* Descans després de cada sèrie (segons), per exercici */
  restSecs: {
    latpull: 90, row: 90, chestpress: 90, legext: 75, squat: 90,
    pushup: 75, pecdeck: 60, bicep: 60, bridge: 60, ytw: 60,
    twist: 45, plank: 45
  },

  /* ---------- Sessions ---------- */
  workouts: {
    A: {
      name: "Sessió A", focus: "Pit, esquena, cames, braços",
      items: [
        { ex: "pushup",  sets: 3, reps: [6, 12] },
        { ex: "latpull", sets: 3, reps: [8, 12] },
        { ex: "legext",  sets: 3, reps: [10, 15] },
        { ex: "pecdeck", sets: 2, reps: [10, 15] },
        { ex: "bicep",   sets: 2, reps: [10, 12] },
        { ex: "twist",   sets: 2, reps: [10, 10] }
      ]
    },
    B: {
      name: "Sessió B", focus: "Esquena, cames, pit, postura",
      items: [
        { ex: "row",        sets: 3, reps: [8, 12] },
        { ex: "squat",      sets: 3, reps: [10, 15] },
        { ex: "chestpress", sets: 3, reps: [8, 12] },
        { ex: "bridge",     sets: 3, reps: [10, 15] },
        { ex: "ytw",        sets: 2, reps: [8, 10] },
        { ex: "plank",      sets: 2, reps: [30, 30] }
      ]
    }
  },

  warmup: [
    { name: "Cinta o rem suau", detail: "3 min caminant ràpid a la cinta (o rem tranquil)", secs: 180 },
    { name: "Gat-camell", detail: "×8 a quatre grapes: esquena amunt com un gat, després panxa avall" },
    { name: "Cercles de braços", detail: "×10 endavant i ×10 enrere" }
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
    "Quan totes les sèries arriben al màxim → la propera sessió puja sola: +5 kg a la Unica, següent nivell als de pes corporal, +5 s a la planxa.",
    "Si una sèrie no arriba al mínim → mantens. Sense pressa.",
    "L'última rep de cada sèrie ha de costar, però amb bona tècnica.",
    "Setmana 8 = descàrrega: una sèrie menys a tot.",
    "Si un dia no pots, no el recuperis: fes la següent sessió el següent dia planificat."
  ],

  notes: {
    posture: "Feina asseguda = pit tancat, esquena alta i glutis febles. Per això hi ha rem, Y-T-W, pont de glutis i estiraments cada sessió.",
    pullupBar: "",
    disclaimer: "Recomanacions generals de fitness i nutrició, no consells mèdics. Si apareix dolor, para i consulta un fisioterapeuta."
  },

  milestones: [
    /* gain = kg per sobre del pes inicial del perfil */
    { week: 2,  gain: 1.5, text: "Pes en marxa (glicogen i aigua). Dorms millor, menys mal d'esquena." },
    { week: 4,  gain: 2,   text: "Força +20-40%: flexions ×2, +10 kg al jaló i al rem." },
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
