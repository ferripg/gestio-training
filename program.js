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
     Tot es calcula a partir d'ALIMENTS amb quantitat: cada opció és una llista [aliment, quantitat].
     kcal/prot són per la quantitat "per" de l'aliment (valors nutricionals estàndard). */
  diet: {
    intro: "Superàvit cada dia, no un dia sí i tres no. Toca un ingredient per treure'l si avui no l'has menjat.",
    foods: {
      iogurt:     { name: "Iogurt natural",              unit: "g",            per: 100, kcal: 61,  prot: 3.5 },
      iogurtgrec: { name: "Iogurt grec natural",         unit: "g",            per: 100, kcal: 97,  prot: 9 },
      maduixes:   { name: "Maduixes congelades",         unit: "g",            per: 100, kcal: 35,  prot: 0.7 },
      chia:       { name: "Llavors de chia",             unit: "g",            per: 15,  kcal: 73,  prot: 2.5 },
      whey:       { name: "Whey de maduixa",             unit: "scoop (30 g)", per: 1,   kcal: 120, prot: 24 },
      creatina:   { name: "Creatina",                    unit: "g",            per: 5,   kcal: 0,   prot: 0 },
      civada:     { name: "Civada",                      unit: "g",            per: 40,  kcal: 150, prot: 5.4 },
      cacauet:    { name: "Crema de cacauet",            unit: "c.s. (15 g)",  per: 1,   kcal: 90,  prot: 3.8 },
      llet:       { name: "Llet sencera",                unit: "ml",           per: 250, kcal: 160, prot: 8 },
      platan:     { name: "Plàtan",                      unit: "peça",         per: 1,   kcal: 105, prot: 1.3 },
      mel:        { name: "Mel",                         unit: "c.s.",         per: 1,   kcal: 60,  prot: 0 },
      nous:       { name: "Nous o fruits secs",          unit: "g",            per: 30,  kcal: 190, prot: 5 },
      datils:     { name: "Dàtils",                      unit: "peces",        per: 3,   kcal: 70,  prot: 0.5 },
      pasta:      { name: "Pasta (pes en cru)",          unit: "g",            per: 100, kcal: 355, prot: 12.5 },
      tonyina:    { name: "Tonyina en llauna",           unit: "llauna",       per: 1,   kcal: 100, prot: 15 },
      pollastre:  { name: "Pollastre rostit",            unit: "g",            per: 100, kcal: 200, prot: 27 },
      oli:        { name: "Oli d'oliva",                 unit: "c.s.",         per: 1,   kcal: 90,  prot: 0 },
      tomaquet:   { name: "Tomàquet fregit",             unit: "g",            per: 50,  kcal: 40,  prot: 0.7 },
      ou:         { name: "Ou",                          unit: "peça",         per: 1,   kcal: 75,  prot: 6.5 },
      pa:         { name: "Pa integral",                 unit: "llesca",       per: 1,   kcal: 85,  prot: 3.5 },
      formatge:   { name: "Formatge",                    unit: "g",            per: 30,  kcal: 110, prot: 7 },
      alvocat:    { name: "Alvocat",                     unit: "meitat",       per: 1,   kcal: 115, prot: 1.5 },
      hummus:     { name: "Hummus",                      unit: "g",            per: 50,  kcal: 90,  prot: 4 },
      galldindi:  { name: "Gall dindi en llesques",      unit: "g",            per: 40,  kcal: 45,  prot: 8 },
      arros:      { name: "Arròs precuit (bossa)",       unit: "g",            per: 125, kcal: 175, prot: 3.5 },
      llegums:    { name: "Llegums de pot",              unit: "g",            per: 120, kcal: 130, prot: 8 },
      sardines:   { name: "Sardines en llauna",          unit: "llauna",       per: 1,   kcal: 190, prot: 20 },
      amanida:    { name: "Amanida en bossa",            unit: "g",            per: 100, kcal: 15,  prot: 1 },
      fruita:     { name: "Peça de fruita",              unit: "peça",         per: 1,   kcal: 80,  prot: 0.5 },
      platfora:   { name: "Plat combinat fora (estimació)", unit: "plat",      per: 1,   kcal: 800, prot: 35 },
      platcasa:   { name: "Plat de casa (estimació)",    unit: "plat",         per: 1,   kcal: 400, prot: 20 }
    },
    slots: [
      {
        id: "esmorzar", name: "Esmorzar", time: "~8h", required: true,
        options: [
          { id: "e1", name: "El teu bol (+ civada i crema de cacauet)",
            items: [["iogurt", 200], ["maduixes", 100], ["chia", 15], ["whey", 1], ["creatina", 5], ["civada", 40], ["cacauet", 1]],
            how: "El bol de sempre: iogurt, maduixes, chia, whey i creatina. Afegeix-hi 40 g de civada i una cullerada de crema de cacauet. Si les quantitats no són les teves, digue-m'ho i les ajusto." },
          { id: "e2", name: "Ous + torrades + formatge + llet",
            items: [["ou", 2], ["pa", 2], ["formatge", 30], ["llet", 250]],
            how: "2 ous batuts al microones 60-90 s, sobre 2 torrades amb formatge. Got de llet." }
        ]
      },
      {
        id: "migmati", name: "Mig matí", time: "~11h", required: true,
        options: [
          { id: "m1", name: "Llet + plàtan + nous",
            items: [["llet", 250], ["platan", 1], ["nous", 30]],
            how: "Per emportar a la feina. Zero preparació." },
          { id: "m2", name: "Iogurt grec + mel + fruits secs",
            items: [["iogurtgrec", 200], ["mel", 1], ["nous", 30]],
            how: "Un iogurt grec gran, una cullerada de mel i un grapat de fruits secs." },
          { id: "m3", name: "Batut extra (2n scoop del dia)",
            items: [["llet", 300], ["whey", 1], ["civada", 50], ["platan", 1], ["cacauet", 1]],
            how: "Només si l'esmorzar ha estat fluix o el pes no puja: 300 ml de llet, 1 scoop, 50 g de civada, plàtan i crema de cacauet a la batedora." }
        ]
      },
      {
        id: "dinar", name: "Dinar", time: "~14h", required: true,
        options: [
          { id: "d1", name: "Tàper de pasta + tonyina + oli",
            items: [["pasta", 100], ["tonyina", 1], ["oli", 1], ["tomaquet", 50]],
            how: "A la pasta del tàper: una llauna de tonyina escorreguda, un raig d'oli i tomàquet fregit si en tens." },
          { id: "d2", name: "Arròs de bossa + llegums + ous",
            items: [["arros", 125], ["llegums", 120], ["ou", 2], ["oli", 1]],
            how: "Arròs de bossa al microones, mig pot de llegums escorregut, 2 ous durs, oli i sal. Es munta en 4 min." },
          { id: "d3", name: "Menjo fora",
            items: [["platfora", 1]],
            how: "Plat amb proteïna (pollastre, ous, tonyina, llegums) + arròs, pasta o patata. Res d'amanida sola. Valor estimat." }
        ]
      },
      {
        id: "berenar", name: "Berenar", time: "~17-18h", required: true,
        options: [
          { id: "t1", name: "Entrepà de gall dindi + fruita",
            items: [["pa", 2], ["galldindi", 40], ["oli", 1], ["fruita", 1]],
            how: "Ideal 1-2 h abans d'entrenar." },
          { id: "t2", name: "Fruits secs + dàtils + llet",
            items: [["nous", 30], ["datils", 3], ["llet", 250]],
            how: "Per quan no tens temps de res." },
          { id: "t3", name: "Batut post-entreno de maduixa",
            items: [["llet", 250], ["whey", 1], ["maduixes", 100], ["mel", 1]],
            how: "En arribar d'entrenar: llet, 1 scoop, maduixes congelades i mel. Batedora 20 s. Substitueix el berenar els dies que entrenes tard." }
        ]
      },
      {
        id: "sopar", name: "Sopar", time: "~21h", required: true,
        options: [
          { id: "s1", name: "Ous remenats + pa + alvocat",
            items: [["ou", 3], ["pa", 2], ["alvocat", 1], ["oli", 1]],
            how: "3 ous batuts al microones 90 s (remena a la meitat). Pa i mig alvocat amb sal. Un bol per netejar." },
          { id: "s2", name: "Pollastre rostit + amanida + hummus + pa",
            items: [["pollastre", 150], ["amanida", 100], ["hummus", 50], ["pa", 2], ["oli", 1]],
            how: "Un quart de pollastre rostit del súper, amanida de bossa, hummus per sucar el pa. Zero cuina." },
          { id: "s3", name: "Sardines + pa amb tomàquet + formatge",
            items: [["sardines", 1], ["pa", 2], ["oli", 1], ["formatge", 30]],
            how: "Pa amb tomàquet i oli, sardines a sobre, un tros de formatge. 3 min." },
          { id: "s4", name: "El que hi hagi + llet + iogurt grec",
            items: [["platcasa", 1], ["llet", 250], ["iogurtgrec", 200]],
            how: "Dia sense res: el que hi hagi a casa (valor estimat) i afegeix-hi un got de llet i un iogurt grec." }
        ]
      },
      {
        id: "extra", name: "Extra de nit", time: "opcional", required: false,
        options: [
          { id: "x1", name: "Bol proteic: iogurt grec + ½ whey + civada + nous",
            items: [["iogurtgrec", 200], ["whey", 0.5], ["civada", 30], ["nous", 30]],
            how: "Barreja mig scoop de whey amb el iogurt fins que quedi cremós; civada i nous a sobre." },
          { id: "x2", name: "Llet + torrades amb crema de cacauet",
            items: [["llet", 250], ["pa", 2], ["cacauet", 2]],
            how: "El més ràpid que existeix, just abans d'anar a dormir." }
        ]
      }
    ],
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
