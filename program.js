/* program.js — Contingut del programa personalitzat (entrenament + dieta).
   Dissenyat per a: home, 22 anys, 179 cm, 58 kg, hardgainer, principiant,
   3 dies/setmana de 30-45 min, material: Technogym Unica, cinta, rem, KB 12 kg, manuelles 2/8 kg.
   Tot és dades: cap lògica aquí. La lògica de progressió i els càlculs són a app.js. */

window.PROGRAM = {
  meta: {
    name: "Programa Hardgainer",
    subtitle: "Full-body 3 dies · sessions A/B alternades · bloc de 8 setmanes",
    blockWeeks: 8,
    sessionMinutes: 40
  },

  /* ---------- Exercicis ----------
     kind: "load"  → progressa amb la placa de la Unica (+step kg quan totes les sèries arriben al màxim de reps)
           "level" → progressa canviant a la següent variant de la llista levels
           "time"  → progressa afegint segons (planxa) */
  exercises: {
    pushup: {
      name: "Flexions", kind: "level",
      muscle: "Pit, tríceps, espatlla anterior", equip: "Pes corporal",
      levels: [
        "Flexions inclinades (mans sobre una taula o el seient de la Unica)",
        "Flexions normals a terra",
        "Flexions amb els peus elevats (sofà o banc)",
        "Flexions amb motxilla carregada (5-10 kg)"
      ],
      cues: [
        "Cos com una taula: glutis i abdomen apretats, que el maluc no baixi",
        "Mans una mica més amples que les espatlles, colzes a 45° (no oberts a 90°)",
        "Baixa en 2 s fins que el pit quasi toqui, puja amb força",
        "A dalt, empeny el terra lluny de tu i separa les escàpules"
      ],
      mistake: "Enfonsar el maluc o mirar amunt. Si no arribes al mínim de reps, torna al nivell anterior.",
      video: "https://www.youtube.com/results?search_query=flexiones+tecnica+correcta"
    },
    latpull: {
      name: "Jaló al pit (Unica)", kind: "load", startLoad: 20, step: 5,
      muscle: "Dorsals, bíceps, esquena alta", equip: "Unica · politja alta",
      cues: [
        "Agafada una mica més ampla que les espatlles, palmells endavant",
        "Baixa primer les espatlles (com si les guardessis a les butxaques), després dobla els colzes",
        "Pit amunt: porta la barra a la part alta del pit amb els colzes cap avall i enrere",
        "Torna a dalt en 2 s controlant, sense deixar anar la placa"
      ],
      mistake: "Tirar-se enrere i fer-ho amb el cos. Si has d'oscil·lar, treu 5 kg.",
      video: "https://www.youtube.com/results?search_query=jalon+al+pecho+tecnica"
    },
    goblet: {
      name: "Esquat goblet", kind: "level",
      muscle: "Quàdriceps, glutis, core", equip: "Kettlebell 12 kg",
      levels: [
        "Esquat goblet amb la kettlebell de 12 kg al pit",
        "Goblet amb els talons elevats (dos llibres): més profund",
        "Goblet amb pausa de 2 s a baix",
        "Goblet amb pausa + extensió de cames a la Unica 2×12 (extra)"
      ],
      cues: [
        "Peus a l'amplada de les espatlles, puntes lleugerament enfora",
        "KB agafada per les 'banyes' contra el pit, colzes cap avall",
        "Seu entre els talons: baixa fins que les cuixes passin de paral·lel si pots",
        "Genolls en la direcció de les puntes, talons sempre a terra, pit amunt"
      ],
      mistake: "Que els genolls es tanquin cap endins o aixecar els talons.",
      video: "https://www.youtube.com/results?search_query=goblet+squat+kettlebell+tecnica"
    },
    rdl: {
      name: "Pes mort romanès", kind: "level",
      muscle: "Isquiotibials, glutis, lumbars (postura)", equip: "Kettlebell 12 kg",
      levels: [
        "RDL amb la KB de 12 kg a dues mans",
        "RDL a una cama (KB a la mà contrària de la cama de suport)",
        "RDL a una cama amb pausa de 2 s a baix"
      ],
      cues: [
        "Genolls lleugerament doblats i fixos: el moviment és del maluc, no dels genolls",
        "Empeny el cul enrere com si tanquessis una porta amb ell; esquena recta i llarga",
        "Baixa la KB fregant les cames fins a notar l'estirament darrere la cuixa",
        "Puja apretant els glutis fins a quedar recte, sense arquejar la lumbar"
      ],
      mistake: "Arrodonir l'esquena. Si notes la lumbar, baixa menys.",
      video: "https://www.youtube.com/results?search_query=peso+muerto+rumano+kettlebell"
    },
    facepull: {
      name: "Face pull (politja alta)", kind: "load", startLoad: 10, step: 5,
      muscle: "Deltoide posterior, rotadors externs, trapezi mig — POSTURA", equip: "Unica · politja alta amb corda o nanses",
      cues: [
        "Politja a l'alçada de la cara; agafa amb els polzes cap a tu",
        "Tira cap a la cara separant les mans, colzes alts i enfora",
        "Al final els punys queden al costat de les orelles: 'mostra els bíceps'",
        "Aguanta 1 s apretant les escàpules, torna lent"
      ],
      mistake: "Fer-ho massa pesat i tirar amb el cos. Aquest és de qualitat, no de pes.",
      video: "https://www.youtube.com/results?search_query=face+pull+tecnica"
    },
    deadbug: {
      name: "Dead bug", kind: "level", unit: "reps/costat",
      muscle: "Core profund, control lumbar (postura)", equip: "Terra",
      levels: [
        "Dead bug bàsic (braç i cama contraris)",
        "Dead bug amb extensió lenta de 3 s",
        "Dead bug amb la KB sostinguda sobre el pit"
      ],
      cues: [
        "Estirat de panxa enlaire, lumbar apretada contra el terra TOT el temps",
        "Braços cap al sostre, genolls a 90°",
        "Estira el braç dret i la cama esquerra alhora fins a prop del terra",
        "Expira mentre estires; torna i canvia de costat"
      ],
      mistake: "Que la lumbar s'arquegi. Si passa, no baixis tant la cama.",
      video: "https://www.youtube.com/results?search_query=dead+bug+ejercicio+tecnica"
    },
    row: {
      name: "Rem assegut (Unica)", kind: "load", startLoad: 20, step: 5,
      muscle: "Esquena mitjana, dorsals, bíceps — POSTURA", equip: "Unica · politja baixa",
      cues: [
        "Seu recte, pit amunt, genolls una mica doblats",
        "Tira les nanses cap al melic portant els colzes enrere, arran del cos",
        "Al final apreta les escàpules com si aguantessis un llapis entre elles (1 s)",
        "Torna endavant deixant que les escàpules s'obrin, sense encorbar l'esquena"
      ],
      mistake: "Encorbar-se endavant a la tornada o tirar amb la lumbar.",
      video: "https://www.youtube.com/results?search_query=remo+sentado+polea+tecnica"
    },
    chestpress: {
      name: "Press de pit (Unica)", kind: "load", startLoad: 20, step: 5,
      muscle: "Pit, tríceps, espatlla anterior", equip: "Unica · press de pit",
      cues: [
        "Seient ajustat perquè les nanses quedin a l'alçada del pit",
        "Escàpules enrere i avall contra el respatller, pit amunt",
        "Empeny endavant fins a estirar els braços sense bloquejar del tot els colzes",
        "Torna en 2 s fins a notar l'estirament al pit"
      ],
      mistake: "Aixecar les espatlles cap a les orelles. Mantén-les 'guardades'.",
      video: "https://www.youtube.com/results?search_query=press+de+pecho+maquina+tecnica"
    },
    split: {
      name: "Esquat búlgar", kind: "level", unit: "reps/cama",
      muscle: "Quàdriceps, glutis, equilibri", equip: "Pes corporal → KB 12 kg",
      levels: [
        "Gambada enrere amb pes corporal",
        "Esquat búlgar (peu de darrere sobre el sofà o el seient de la Unica)",
        "Esquat búlgar amb la KB de 12 kg al pit (goblet)"
      ],
      cues: [
        "Pas llarg: el genoll de davant no ha de passar gaire la punta del peu",
        "Baixa recte fins que el genoll de darrere quasi toqui el terra",
        "Pit amunt, tronc una mica inclinat endavant, pes al taló de davant",
        "Puja empenyent amb el taló i apretant el gluti"
      ],
      mistake: "Peu de davant massa a prop: el genoll pateix. Fes el pas més llarg.",
      video: "https://www.youtube.com/results?search_query=sentadilla+bulgara+tecnica"
    },
    bridge: {
      name: "Pont de glutis / Hip thrust", kind: "level",
      muscle: "Glutis, isquios — clau per a la pelvis i la lumbar", equip: "Terra → sofà → KB 12 kg",
      levels: [
        "Pont de glutis a terra",
        "Hip thrust amb l'esquena alta al sofà o banc",
        "Hip thrust amb la KB de 12 kg sobre els malucs",
        "Hip thrust a una cama"
      ],
      cues: [
        "Peus a terra a l'amplada del maluc, talons a prop del cul",
        "Empeny amb els talons i aixeca el maluc fins que cuixes i tronc facin una línia recta",
        "A dalt apreta els glutis 2 s: barbeta cap al pit, no arquegis la lumbar",
        "Baixa lent sense tocar del tot el terra"
      ],
      mistake: "Arquejar la lumbar per pujar més. El moviment ve del gluti.",
      video: "https://www.youtube.com/results?search_query=hip+thrust+en+casa+tecnica"
    },
    ytw: {
      name: "Y-T-W (esquena alta)", kind: "level", unit: "reps per lletra",
      muscle: "Trapezi baix, romboides, rotadors — POSTURA", equip: "Terra → manuelles 2 kg → Unica",
      levels: [
        "Y-T-W estirat de panxa a terra, sense pes",
        "Y-T-W amb les manuelles de 2 kg",
        "Rotació externa a la politja de la Unica (5 kg, colze enganxat al costat)"
      ],
      cues: [
        "Estirat de panxa, front recolzat: braços en Y, aixeca'ls apretant les escàpules avall",
        "Després en T (braços oberts, polzes al sostre) i en W (colzes doblats)",
        "Aixeca les mans només amb l'esquena alta, no amb el coll",
        "Lent: 2 s amunt, 1 s aguantant, 2 s avall"
      ],
      mistake: "Arronsar les espatlles cap a les orelles.",
      video: "https://www.youtube.com/results?search_query=YTW+raises+floor+posture"
    },
    plank: {
      name: "Planxa + planxa lateral", kind: "time", startSecs: 30, step: 5, unit: "s",
      muscle: "Core complet", equip: "Terra",
      cues: [
        "Colzes sota les espatlles, cos recte del cap als talons",
        "Apreta glutis i abdomen com si t'anessin a donar un cop a la panxa",
        "Mira al terra, coll neutre; respira",
        "Planxa lateral: maluc amunt, cos en línia, mateix temps per costat"
      ],
      mistake: "Maluc caigut o cul enlaire. Compta només els segons amb bona forma.",
      video: "https://www.youtube.com/results?search_query=plancha+abdominal+tecnica+correcta"
    }
  },

  /* Vídeos incrustats a la fitxa (YouTube, verificats 21/09/2026).
     Clau = clau d'exercici, o nom exacte de l'ítem d'escalfament/refredament. */
  videos: {
    pushup:     [{ id: "hbGR_wq7wzo", title: "Flexions per a principiants: tècnica i progressió (Endurance Fitness)" }],
    latpull:    [{ id: "1JiNvChA0_Q", title: "Jaló al pit, com fer-lo correctament (Paloma Sala)" }],
    goblet:     [{ id: "4RN0YJF4YtE", title: "Esquat goblet amb kettlebell en 30 segons (Jeronimo Milo)" }],
    rdl:        [{ id: "O-MLxyVYRBY", title: "Pes mort romanès: tutorial (Prowellness)" }],
    facepull:   [{ id: "X-xCQ1gh-kA", title: "Face pull correctament, evita lesions (Powerexplosive · HSN)" }],
    deadbug:    [{ id: "HN3wyEcYC2g", title: "Com fer el dead bug (Estudio Training)" }],
    row:        [{ id: "JtTusrYzAos", title: "Rem assegut en politja: com fer-lo bé (EresFitness)" }],
    chestpress: [{ id: "lw4uUkBl_HE", title: "Press de pit en màquina: tècnica i ajust del seient (Ramona Gorraiz)" }],
    split:      [{ id: "IdilLr9nyuQ", title: "Esquat búlgar pas a pas (Your House Fitness)" }],
    bridge:     [{ id: "GpJYbtAgtAk", title: "Hip thrust i pont de glutis a casa (Fitter Health)" }],
    ytw:        [{ id: "QdGTI4Lshg4", title: "Y-T-W estirat a terra (The Active Life)" }],
    plank:      [{ id: "nmX0DysvqcQ", title: "Planxa abdominal correctament (Calistenia con Isaac)" },
                 { id: "kyOeSuh7LLo", title: "Planxa lateral: tècnica correcta (Vitar Club)" }],
    "Rem suau": [{ id: "vj8MVU2UiEk", title: "Tècnica de rem indoor: com remar (Fran, entrenador de remers)" }],
    "Gat-camell": [{ id: "gWbfVPK4RAU", title: "Gat-camell (Consorci Sanitari Integral, en català)" }],
    "Rotacions toràciques": [{ id: "IMirvX4trqE", title: "Rotació toràcica a quatre grapes (Elevate)" }],
    "Estirament flexors de maluc": [{ id: "HmfHMdmmVhc", title: "Estirament de maluc i flexors (Estudio Training)" }],
    "Cobra a terra": [{ id: "yhkOiReYqy4", title: "Postura de la cobra pas a pas (Pau's Secrets)" }],
    "Estirament pectoral al marc de la porta": [{ id: "D1W8Zkk68WE", title: "Estirament de pit a la porta (Gimnasio Grandmontagne)" }]
  },

  /* Descans després de cada sèrie (segons), per exercici */
  restSecs: {
    latpull: 90, row: 90, chestpress: 90, goblet: 90, rdl: 90,
    pushup: 75, split: 75,
    bridge: 60, facepull: 60, ytw: 60,
    deadbug: 45, plank: 45
  },

  /* ---------- Sessions ---------- */
  workouts: {
    A: {
      name: "Sessió A", focus: "Empenta + frontissa de maluc",
      items: [
        { ex: "pushup",   sets: 3, reps: [6, 12] },
        { ex: "latpull",  sets: 3, reps: [8, 12] },
        { ex: "goblet",   sets: 3, reps: [8, 12] },
        { ex: "rdl",      sets: 3, reps: [10, 15] },
        { ex: "facepull", sets: 2, reps: [12, 15] },
        { ex: "deadbug",  sets: 2, reps: [8, 8] }
      ]
    },
    B: {
      name: "Sessió B", focus: "Tracció + esquat unilateral",
      items: [
        { ex: "row",        sets: 3, reps: [8, 12] },
        { ex: "chestpress", sets: 3, reps: [8, 12] },
        { ex: "split",      sets: 3, reps: [8, 12] },
        { ex: "bridge",     sets: 3, reps: [10, 15] },
        { ex: "ytw",        sets: 2, reps: [10, 12] },
        { ex: "plank",      sets: 2, reps: [30, 30] }
      ]
    }
  },

  warmup: [
    { name: "Rem suau", detail: "3 min a ritme tranquil, 18-20 palades/min", secs: 180 },
    { name: "Gat-camell", detail: "×8, lent, mobilitzant tota l'esquena" },
    { name: "Rotacions toràciques", detail: "×8 per costat, a quatre grapes, mà darrere el cap" },
    { name: "Estirament flexors de maluc", detail: "30 s per costat, genoll a terra, gluti apretat (▶ un cop per costat)", secs: 30 },
    { name: "Cercles de braços", detail: "×10 endavant i ×10 enrere" }
  ],

  cooldown: [
    { name: "Cobra a terra", detail: "2×10: aixeca el pit amb l'esquena, mans fora del terra" },
    { name: "Estirament pectoral al marc de la porta", detail: "2×30 s, colze a 90° (▶ dos cops)", secs: 30 },
    { name: "Estirament flexors de maluc", detail: "30 s per costat, lent i respirant (▶ un cop per costat)", secs: 30 }
  ],

  finisher: {
    name: "Finisher opcional (màx. 2 dies/setmana)",
    detail: "8-10 min de rem suau o cinta inclinada al 6-8% caminant ràpid. Només si tens temps i ganes."
  },

  restDay: {
    title: "Dia de descans actiu",
    items: [
      { name: "Posture snack (2 min)", detail: "Chin tucks ×10 · wall slides ×10 · estirament pectoral 30 s" },
      { name: "Caminar 20 min", detail: "Ritme tranquil; també val anar a peu a algun lloc" },
      { name: "Menjar igual que un dia d'entrenament", detail: "El múscul es construeix avui" }
    ]
  },

  progressionRules: [
    "Cada exercici té un rang de reps (ex. 8-12). Fes totes les sèries dins del rang.",
    "Quan totes les sèries arriben al màxim → la propera sessió puja sola: +5 kg a la Unica, següent nivell en calistènia, +5 s a la planxa.",
    "Si una sèrie no arriba al mínim → mantens. Sense pressa.",
    "L'última rep de cada sèrie ha de costar, però amb bona tècnica.",
    "Setmana 8 = descàrrega: una sèrie menys a tot.",
    "Si un dia no pots, no el recuperis: fes la següent sessió el següent dia planificat."
  ],

  notes: {
    posture: "Feina asseguda = pectorals i flexors de maluc curts, esquena alta i glutis febles. Per això cada sessió porta rem, face pull, Y-T-W, pont de glutis i estiraments. En 4-6 setmanes ho notaràs.",
    pullupBar: "No cal barra de dominades: el jaló de la Unica cobreix la tracció vertical.",
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
