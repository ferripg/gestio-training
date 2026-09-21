/* program.js — Contingut del programa personalitzat (entrenament + dieta).
   Dissenyat per a: home, 22 anys, 179 cm, 60 kg, hardgainer, principiant,
   3 dies/setmana de 30-45 min, material: Technogym Unica, cinta, rem, KB 12 kg, manuelles 2/8 kg.
   Tot és dades: cap lògica aquí. La lògica de progressió és a app.js. */

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
    detail: "8-10 min de rem suau (20-22 palades/min) o cinta inclinada al 6-8% caminant ràpid. Només si tens temps i ganes: la prioritat és la força i menjar."
  },

  restDay: {
    title: "Dia de descans actiu",
    items: [
      { name: "Posture snack (2 min)", detail: "Chin tucks ×10 · wall slides ×10 · estirament pectoral 30 s" },
      { name: "Caminar 20 min", detail: "Ritme tranquil; també val anar a peu a algun lloc" },
      { name: "Batut i creatina", detail: "Els dies de descans també compten: el múscul es construeix avui" }
    ]
  },

  progressionRules: [
    "Doble progressió: cada exercici té un rang de reps (ex. 8-12). Fes totes les sèries dins del rang.",
    "Quan TOTES les sèries arriben al màxim del rang → la propera sessió puja: +5 kg a la Unica, o següent nivell als exercicis de pes corporal/KB, o +5 s a la planxa. L'app ho fa sola.",
    "Si una sèrie no arriba al mínim del rang → mantens el pes/nivell. Sense pressa: la constància guanya.",
    "Descansa 60-90 s entre sèries (el temporitzador t'avisa). L'última rep de cada sèrie ha de costar, però amb bona tècnica.",
    "Setmana 8 = descàrrega: una sèrie menys a tot. Després comença un bloc nou.",
    "Si un dia no pots, no el recuperis: continua amb la següent sessió al següent dia planificat."
  ],

  notes: {
    posture: "Tens el patró típic de feina asseguda: pectorals i flexors de maluc curts, esquena alta i glutis febles. Per això cada sessió porta rem/face pull/Y-T-W, pont de glutis i estiraments. Als dies de descans, el posture snack de 2 min. En 4-6 setmanes ho notaràs.",
    pullupBar: "No cal barra de dominades: el jaló de la Unica cobreix la tracció vertical. Si més endavant en vols una de porta (~25 €), afegirem dominades negatives al programa.",
    disclaimer: "Aquest programa són recomanacions generals de fitness i nutrició, no consells mèdics. Si el dolor d'esquena o de pelvis empitjora o apareix dolor agut en un exercici, para i consulta un fisioterapeuta."
  },

  milestones: [
    /* gain = kg per sobre del pes inicial del perfil */
    { week: 2,  gain: 1.5, text: "Pes en marxa (+1-1,5 kg de glicogen i aigua). Dorms millor, menys mal d'esquena." },
    { week: 4,  gain: 2,   text: "Força +20-40%: flexions ×2, +10 kg al jaló i al rem. Samarretes més justes a l'espatlla." },
    { week: 8,  gain: 3.5, text: "Primer canvi visible al mirall: braços i pit més plens, postura més recta. Fes-te fotos!" },
    { week: 13, gain: 5,   text: "La gent del teu voltant ho comenta. Passes a nivells superiors a l'esquat i al pont." },
    { week: 26, gain: 7,   text: "Abdominals marcats si el greix es manté baix (en un hardgainer, sí)." },
    { week: 40, gain: 9.5, text: "Objectiu: ~+10 kg amb poc greix. Aquí revisem: mantenir o continuar." }
  ],

  /* ---------- Dieta ---------- */
  diet: {
    intro: "Regla d'or del hardgainer: el superàvit ha de ser CADA DIA, no un dia sí i tres no. Calories líquides (batuts) i 5 àpats petits fan que sigui fàcil.",
    slots: [
      {
        id: "esmorzar", name: "Esmorzar", time: "~8h", required: true,
        options: [
          { id: "e1", name: "El teu bol de sempre + 40 g civada + 1 c.s. crema de cacauet", kcal: 650, prot: 40,
            how: "Al bol de iogurt, maduixes i chia afegeix-hi 40 g de civada (mig got) i una cullerada sopera de crema de cacauet. Amb el scoop de whey ja hi tens 40 g de proteïna." },
          { id: "e2", name: "2 ous al microones + 2 torrades integrals + formatge + got de llet", kcal: 550, prot: 35,
            how: "Bat 2 ous en un bol amb sal, microones 60-90 s (remena a la meitat). Posa'ls sobre les torrades amb formatge. Got de llet sencera al costat." }
        ]
      },
      {
        id: "batut", name: "Batut de mig matí", time: "~11h", required: true,
        options: [
          { id: "b1", name: "Batut hardgainer de maduixa (whey + creatina)", kcal: 750, prot: 45,
            how: "1) 300 ml de llet sencera a la batedora. 2) 1 scoop de whey de maduixa (30 g) i 5 g de creatina — la pols després del líquid no fa grumolls. 3) 50 g de civada. 4) 1 plàtan i 3-4 maduixes congelades. 5) 1 cullerada sopera de crema de cacauet. Bat 30 s fins que no es vegi la civada. Beu-lo a la feina; es pot preparar la nit abans i guardar a la nevera." },
          { id: "b2", name: "Versió shaker (sense batedora): llet + whey + creatina, i plàtan + nous a part", kcal: 600, prot: 40,
            how: "Al shaker: 300 ml de llet sencera, 1 scoop de whey de maduixa, 5 g de creatina. Agita 20 s. A part menja 1 plàtan i un grapat de nous (30 g)." }
        ]
      },
      {
        id: "dinar", name: "Dinar", time: "~14h", required: true,
        options: [
          { id: "d1", name: "Tàper de pasta + llauna de tonyina (o pollastre rostit) + raig d'oli", kcal: 750, prot: 40,
            how: "A la pasta del tàper afegeix-hi una llauna de tonyina escorreguda (o 100 g de pollastre rostit desfilat) i un bon raig d'oli d'oliva. Tomàquet fregit de pot si en tens. 2 min." },
          { id: "d2", name: "Bossa d'arròs precuit + llegums de pot + ou dur + oli", kcal: 700, prot: 30,
            how: "Arròs o quinoa de bossa al microones (1-2 min), mig pot de cigrons o llenties escorregut, 1-2 ous durs (es fan 10 en una olla el diumenge), oli i sal. Es munta a la nit en 4 min." },
          { id: "d3", name: "Menjo fora: plat amb proteïna + arròs/pasta/patata", kcal: 800, prot: 40,
            how: "Busca sempre proteïna (pollastre, ous, tonyina, llegums) amb arròs, pasta o patata. Res d'amanida sola. Demana pa." }
        ]
      },
      {
        id: "berenar", name: "Berenar (abans d'entrenar)", time: "~17-18h", required: true,
        options: [
          { id: "t1", name: "Entrepà de gall dindi o formatge + una fruita", kcal: 450, prot: 25,
            how: "Pa integral, 3-4 llesques de gall dindi o formatge, oli. Una peça de fruita. Ideal 1-2 h abans d'entrenar." },
          { id: "t2", name: "Grapat de fruits secs + fruita seca + got de llet", kcal: 450, prot: 15,
            how: "30-40 g de fruits secs, 3-4 dàtils o panses, got de llet sencera. Per quan no tens temps de res." },
          { id: "t3", name: "Batut post-entreno de maduixa (si entrenes tard, en arribar)", kcal: 420, prot: 35,
            how: "250 ml de llet sencera + 1 scoop de whey de maduixa + 100 g de maduixes congelades + 1 c.s. de mel. Batedora 20 s o shaker sense les maduixes. Substitueix el berenar els dies que entrenes tard." }
        ]
      },
      {
        id: "sopar", name: "Sopar", time: "~21h", required: true,
        options: [
          { id: "s1", name: "3 ous remenats al microones + pa + mig alvocat", kcal: 600, prot: 28,
            how: "3 ous batuts en un bol amb sal i un raig d'oli, microones 90 s remenant a la meitat. Pa integral i mig alvocat aixafat amb sal. 4 min, un bol per netejar." },
          { id: "s2", name: "Pollastre rostit del súper + bossa d'amanida + hummus + pa", kcal: 650, prot: 45,
            how: "Un quart de pollastre rostit (el venen fet), bossa d'amanida amb oli, hummus per sucar el pa. Zero cuina." },
          { id: "s3", name: "Llauna de sardines o tonyina + pa amb tomàquet i oli + formatge", kcal: 600, prot: 35,
            how: "Pa amb tomàquet ratllat i oli, sardines o tonyina en llauna a sobre, un tros de formatge. 3 min." },
          { id: "s4", name: "El que hi hagi a casa + got de llet + iogurt grec", kcal: 500, prot: 25,
            how: "Dia sense res: menja el que hi hagi i afegeix-hi un got de llet sencera i un iogurt grec per pujar proteïna i calories." }
        ]
      },
      {
        id: "extra", name: "Extra de nit (opcional, si vas curt de calories)", time: "~23h", required: false,
        options: [
          { id: "x1", name: "Bol proteic: iogurt grec + ½ scoop whey maduixa + civada + nous", kcal: 500, prot: 40,
            how: "200 g de iogurt grec, barreja-hi mig scoop de whey de maduixa fins que quedi cremós, 30 g de civada o granola i un grapat de nous." },
          { id: "x2", name: "Got de llet sencera + 2 torrades amb crema de cacauet", kcal: 450, prot: 18,
            how: "El més ràpid que existeix. Perfecte just abans d'anar a dormir." }
        ]
      }
    ],
    extras: [
      { id: "creatine", name: "Creatina 5 g", short: "Creatina", detail: "Cada dia, també els de descans. Dins del batut. No cal fase de càrrega." },
      { id: "sleep", name: "He dormit 7 h o més (aquesta nit)", short: "Son ≥7 h", detail: "El múscul es construeix dormint. Hora fixa d'anar al llit." },
      { id: "water", name: "Aigua ≥2 L", short: "Aigua", detail: "Amb la creatina, l'aigua importa més." }
    ],
    shopping: [
      "Civada (1 kg)", "Llet sencera (6-8 L)", "Crema de cacauet (pot gran)", "Plàtans (7-10)", "Maduixes congelades",
      "Ous (2 dotzenes)", "Tonyina en llauna (5-6)", "Sardines en llauna (3)", "Pollastre rostit (1-2 a la setmana)",
      "Iogurt grec (7)", "Formatge (cunya o llesques)", "Pa integral", "Hummus (2 pots)", "Fruits secs mixtos (500 g)",
      "Dàtils o panses", "Bosses d'arròs/quinoa precuit (4)", "Llegums de pot (3)", "Amanida en bossa (3)",
      "Alvocats (3)", "Gall dindi en llesques", "Mel", "Oli d'oliva", "Whey de maduixa (comprovar estoc)", "Creatina (comprovar estoc)"
    ],
    tips: [
      "Llet en lloc d'aigua als àpats: +150 kcal i 8 g de proteïna per got sense esforç.",
      "Oli d'oliva a tot: una cullerada són 120 kcal que no omplen.",
      "El batut de mig matí és innegociable: si te'l saltes, el sopar no ho compensa.",
      "Compra el diumenge amb la llista. Sense menjar a casa no hi ha pla.",
      "Els dies de McDonald's no compten com a 'menjar molt': compta la mitjana de la setmana, i això ho veu la bàscula.",
      "Pesa't cada matí després d'anar al lavabo i abans d'esmorzar. El que importa és la mitjana de 7 dies, no el dia."
    ]
  }
};
