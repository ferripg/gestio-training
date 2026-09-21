/* app.js — Gestió Training v3
   Tota la lògica de l'app. Les dades es guarden a localStorage del dispositiu.
   El contingut del programa (exercicis, sessions, dieta) és a program.js. */

(function () {
  'use strict';

  const P = window.PROGRAM;

  /* ========== Emmagatzematge ========== */

  const STORE_KEY = 'gt-data-v1';   // dades permanents
  const ACTIVE_KEY = 'gt-active-v1'; // entrenament en curs (esborrany)

  function defaultProfile() {
    return {
      age: 22, height: 179, sex: 'm', startWeight: 58, targetWeight: 70,
      activity: 1.4, hardgainer: true,
      trainDays: ['1', '3', '5'],       // dilluns, dimecres, divendres
      programStart: todayISO(),
      kcalAdjust: 0, kcalOverride: 0, proteinOverride: 0, lastAdjust: ''
    };
  }

  function defaultData() {
    return {
      version: 3,
      routines: [],   // rutines pròpies { id, name, items: [...] }
      plan: { '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '0': '' },
      sessions: [],   // { id, date, start, end, routineName, program?, entries: [...] }
      settings: { weeklyGoal: 3, restSecs: 90 },
      profile: defaultProfile(),
      weights: [],    // { date, kg }
      diet: {},       // { 'YYYY-MM-DD': { slots: {slotId: optionId}, extras: {id: bool} } }
      program: { nextWorkout: 'A', levels: {}, loads: {}, restDone: {}, lastSummary: null, pv: P.meta.version },
      shopping: {}    // { item: bool }
    };
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultData();
      const d = JSON.parse(raw);
      if (!d || !Array.isArray(d.routines) || !Array.isArray(d.sessions)) return defaultData();
      const def = defaultData();
      d.plan = d.plan || def.plan;
      d.settings = Object.assign(def.settings, d.settings || {});
      d.profile = Object.assign(defaultProfile(), d.profile || {});
      d.weights = Array.isArray(d.weights) ? d.weights : [];
      // Migració puntual (21/09/2026): el punt de partida real és 58 kg, no 60
      if (!d.profile.v3b) {
        if (d.profile.startWeight === 60 && d.weights.length === 0) d.profile.startWeight = 58;
        d.profile.v3b = true;
      }
      d.diet = d.diet || {};
      const storedPv = d.program ? d.program.pv : undefined;
      d.program = Object.assign(def.program, d.program || {});
      // Programa nou (exercicis diferents) → pesos i nivells de zero; les sessions es conserven
      if (storedPv !== P.meta.version) {
        d.program.levels = {};
        d.program.loads = {};
        d.program.pv = P.meta.version;
      }
      d.shopping = d.shopping || {};
      d.version = 3;
      return d;
    } catch (e) {
      console.error('Error carregant dades', e);
      return defaultData();
    }
  }

  function saveData() {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(ACTIVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveDraft() {
    if (draft) localStorage.setItem(ACTIVE_KEY, JSON.stringify(draft));
    else localStorage.removeItem(ACTIVE_KEY);
  }

  let data = loadData();
  let draft = loadDraft();        // entrenament en curs
  let editingRoutine = null;      // rutina en edició
  let currentView = 'avui';
  let mesTab = 'historial';
  let timerInterval = null;

  /* ========== Utilitats ========== */

  const $ = sel => document.querySelector(sel);

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function num(v) {
    const n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }

  function fmt(n) {
    return n.toLocaleString('ca-ES', { maximumFractionDigits: 1 });
  }

  function nExercicis(n) {
    return n === 1 ? '1 exercici' : `${n} exercicis`;
  }

  // Dates (sempre en hora local)
  function isoOf(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function todayISO() {
    return isoOf(new Date());
  }

  function parseISO(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function shiftISO(iso, days) {
    const d = parseISO(iso);
    d.setDate(d.getDate() + days);
    return isoOf(d);
  }

  function daysBetween(isoA, isoB) {
    return Math.round((parseISO(isoB) - parseISO(isoA)) / 864e5);
  }

  function fmtDate(iso, opts) {
    const s = parseISO(iso).toLocaleDateString('ca-ES', opts || { weekday: 'long', day: 'numeric', month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function mondayOf(d) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const shift = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - shift);
    return x;
  }

  const DAY_ORDER = ['1', '2', '3', '4', '5', '6', '0'];
  const DAY_NAMES = { '1': 'Dilluns', '2': 'Dimarts', '3': 'Dimecres', '4': 'Dijous', '5': 'Divendres', '6': 'Dissabte', '0': 'Diumenge' };
  const DAY_SHORT = { '1': 'Dl', '2': 'Dt', '3': 'Dc', '4': 'Dj', '5': 'Dv', '6': 'Ds', '0': 'Dg' };

  function routineById(id) {
    return data.routines.find(r => r.id === id) || null;
  }

  function itemSummary(it) {
    if (it.mode === 'cardio') {
      const parts = [];
      if (it.dist) parts.push(fmt(it.dist) + ' km');
      if (it.time) parts.push(fmt(it.time) + ' min');
      return parts.join(' · ') || '—';
    }
    let s = `${it.sets || 0}×${it.reps || 0}`;
    if (it.weight) s += ` · ${fmt(it.weight)} kg`;
    return s;
  }

  function sessionVolume(s) {
    let v = 0;
    for (const e of s.entries) {
      if (e.mode !== 'cardio' && !e.timed && Array.isArray(e.sets)) {
        for (const st of e.sets) v += (st.reps || 0) * (st.weight || 0);
      }
    }
    return v;
  }

  function sessionKm(s) {
    let km = 0;
    for (const e of s.entries) if (e.mode === 'cardio') km += e.dist || 0;
    return km;
  }

  function sortedSessionsDesc() {
    return [...data.sessions].sort((a, b) => b.date.localeCompare(a.date) || (b.start || 0) - (a.start || 0));
  }

  function lastEntryFor(name) {
    for (const s of sortedSessionsDesc()) {
      for (const e of s.entries) {
        if (e.name.toLowerCase() === name.toLowerCase()) return e;
      }
    }
    return null;
  }

  function lastEntryByKey(key) {
    for (const s of sortedSessionsDesc()) {
      for (const e of s.entries) if (e.exKey === key) return e;
    }
    return null;
  }

  // "12·12·11 @ 20 kg" / "35·35 s" / "10·10"
  function perfLabel(e) {
    if (!e) return '';
    if (e.mode === 'cardio') return `${fmt(e.dist)} km · ${fmt(e.time)} min`;
    const reps = e.sets.map(s => s.reps).join('·');
    if (e.timed) return `${reps} s`;
    const w = e.sets[0] && e.sets[0].weight ? ` @ ${fmt(e.sets[0].weight)} kg` : '';
    return reps + w;
  }

  function updateExerciseDatalist() {
    let dl = $('#exNames');
    if (!dl) {
      dl = document.createElement('datalist');
      dl.id = 'exNames';
      document.body.appendChild(dl);
    }
    const names = new Set();
    for (const r of data.routines) for (const it of r.items) names.add(it.name);
    for (const s of data.sessions) for (const e of s.entries) names.add(e.name);
    dl.innerHTML = [...names].sort().map(n => `<option value="${esc(n)}">`).join('');
  }

  /* ========== Programa: estat i objectius ========== */

  function programWeek() {
    return Math.max(1, Math.floor(daysBetween(data.profile.programStart, todayISO()) / 7) + 1);
  }

  function isDeload() {
    return programWeek() % P.meta.blockWeeks === 0;
  }

  function exState(key) {
    const ex = P.exercises[key];
    const st = data.program;
    if (ex.kind === 'load') return { load: st.loads[key] ?? ex.startLoad };
    if (ex.kind === 'time') return { secs: st.loads[key] ?? ex.startSecs };
    const lvl = Math.min(st.levels[key] ?? 0, ex.levels.length - 1);
    return { level: lvl, levelName: ex.levels[lvl] };
  }

  function itemSets(item) {
    return isDeload() ? Math.max(2, item.sets - 1) : item.sets;
  }

  function targetLabel(item) {
    const ex = P.exercises[item.ex];
    const s = exState(item.ex);
    const sets = itemSets(item);
    if (ex.kind === 'load') return `${sets}×${item.reps[0]}-${item.reps[1]} · ${s.load} kg`;
    if (ex.kind === 'time') return `${sets}×${s.secs} s`;
    return `${sets}×${item.reps[0]}-${item.reps[1]}${ex.unit ? ' ' + ex.unit : ''}`;
  }

  // Objectius nutricionals (Mifflin-St Jeor + factor d'activitat + superàvit + calibració)
  function computeTargets() {
    const pr = data.profile;
    const w = weightAvg(todayISO(), 7) || pr.startWeight;
    const bmr = 10 * w + 6.25 * pr.height - 5 * pr.age + (pr.sex === 'f' ? -161 : 5);
    const tdee = bmr * (pr.activity || 1.4);
    const week = programWeek();
    let surplus = pr.hardgainer ? 500 : 400;
    if (week <= 1) surplus -= 300;              // setmana d'adaptació
    let kcal = Math.round((tdee + surplus + (pr.kcalAdjust || 0)) / 50) * 50;
    if (pr.kcalOverride > 0) kcal = pr.kcalOverride;
    let protein = Math.round((1.8 * w) / 5) * 5;
    if (pr.proteinOverride > 0) protein = pr.proteinOverride;
    return { kcal, protein, bmr: Math.round(bmr), tdee: Math.round(tdee), week, ramp: week <= 1, weight: w };
  }

  // Què toca avui
  function todayInfo() {
    const today = todayISO();
    const dow = String(new Date().getDay());
    const doneProg = data.sessions.find(s => s.date === today && s.program);
    if (data.profile.trainDays.includes(dow)) {
      return { type: 'program', key: doneProg ? doneProg.program : data.program.nextWorkout, done: !!doneProg, session: doneProg };
    }
    const r = routineById(data.plan[dow]);
    if (r) return { type: 'routine', routine: r, done: !!data.sessions.find(s => s.date === today) };
    return { type: 'rest', done: !!data.program.restDone[today] };
  }

  // Setmana actual amb la lletra de sessió de cada dia
  function weekSchedule() {
    const mon = mondayOf(new Date());
    const today = todayISO();
    const out = [];
    let next = data.program.nextWorkout;
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(d.getDate() + i);
      const iso = isoOf(d);
      const dow = String(d.getDay());
      const isTrain = data.profile.trainDays.includes(dow);
      const sess = data.sessions.find(s => s.date === iso && s.program);
      let label = '';
      if (sess) label = sess.program;
      else if (isTrain && iso >= today) { label = next; next = next === 'A' ? 'B' : 'A'; }
      out.push({ iso, dow, label, isTrain, done: !!sess, isToday: iso === today, missed: isTrain && !sess && iso < today });
    }
    return out;
  }

  /* ========== Pes corporal ========== */

  function saveWeight(kg) {
    const today = todayISO();
    const i = data.weights.findIndex(w => w.date === today);
    if (i >= 0) data.weights[i].kg = kg;
    else data.weights.push({ date: today, kg });
    data.weights.sort((a, b) => a.date.localeCompare(b.date));
    saveData();
  }

  function weightAvg(endISO, days) {
    const startISO = shiftISO(endISO, -(days - 1));
    const xs = data.weights.filter(w => w.date >= startISO && w.date <= endISO);
    if (!xs.length) return null;
    return xs.reduce((a, w) => a + w.kg, 0) / xs.length;
  }

  // kg/setmana: mitjana 7 dies actual vs la de fa una setmana
  function weightTrend() {
    const today = todayISO();
    const now = weightAvg(today, 7);
    const prev = weightAvg(shiftISO(today, -7), 7);
    if (now == null || prev == null) return null;
    return now - prev;
  }

  function weightSuggestion() {
    const today = todayISO();
    const pr = data.profile;
    if (pr.lastAdjust && daysBetween(pr.lastAdjust, today) < 14) {
      return { text: `Ajust de calories aplicat el ${fmtDate(pr.lastAdjust, { day: 'numeric', month: 'long' })}. Espera 2 setmanes per valorar-ne l'efecte.` };
    }
    const t = weightTrend();
    const span = data.weights.length ? daysBetween(data.weights[0].date, today) : 0;
    if (t == null || span < 13) {
      return { text: 'Pesa\'t cada matí. A partir de 2 setmanes de dades et diré si cal ajustar les calories.' };
    }
    if (t < 0.25) return { text: `Puges ${fmt(t)} kg/setmana (objectiu 0,25-0,5). Toca afegir +250 kcal/dia: l'extra de nit cada dia, o més crema de cacauet al batut.`, delta: 250 };
    if (t > 0.6) return { text: `Puges ${fmt(t)} kg/setmana, una mica ràpid. Treu 150 kcal/dia (menys oli o sense l'extra de nit).`, delta: -150 };
    return { text: `Puges ${fmt(t)} kg/setmana: perfecte, dins de l'objectiu. No canviïs res.` };
  }

  /* ========== Dieta (tot es calcula per ingredients amb quantitat) ========== */

  // Normalitza el dia: slots[id] = { opt, excl: [] }, extras {}, adds [{food, qty}]
  function dietDay(iso) {
    if (!data.diet[iso]) data.diet[iso] = { slots: {}, extras: {}, adds: [] };
    const d = data.diet[iso];
    if (!d.extras) d.extras = {};
    if (!Array.isArray(d.adds)) d.adds = [];
    for (const k in d.slots) {
      if (typeof d.slots[k] === 'string') d.slots[k] = { opt: d.slots[k], excl: [] };
      else if (d.slots[k] && !Array.isArray(d.slots[k].excl)) d.slots[k].excl = [];
    }
    return d;
  }

  function findOption(slotId, optId) {
    const slot = P.diet.slots.find(s => s.id === slotId);
    return slot ? slot.options.find(o => o.id === optId) : null;
  }

  function selectedOptId(sel) {
    return typeof sel === 'string' ? sel : (sel && sel.opt) || null;
  }

  // kcal/prot d'una quantitat d'un aliment (valors per la quantitat "per")
  function foodCalc(foodId, qty) {
    const f = P.diet.foods[foodId];
    if (!f) return { kcal: 0, prot: 0 };
    const k = qty / f.per;
    return { kcal: Math.round(f.kcal * k), prot: f.prot * k };
  }

  // Totals d'una opció descomptant els ingredients exclosos avui
  function optionTotals(o, excl) {
    let kcal = 0, prot = 0;
    for (const [food, qty] of o.items) {
      if (excl && excl.includes(food)) continue;
      const c = foodCalc(food, qty);
      kcal += c.kcal; prot += c.prot;
    }
    return { kcal, prot: Math.round(prot) };
  }

  function dietTotals(iso) {
    const day = data.diet[iso];
    let kcal = 0, prot = 0;
    if (!day) return { kcal, prot };
    for (const slotId in day.slots) {
      const sel = day.slots[slotId];
      const o = findOption(slotId, selectedOptId(sel));
      if (!o) continue;
      const t = optionTotals(o, sel && sel.excl);
      kcal += t.kcal; prot += t.prot;
    }
    for (const a of day.adds || []) { const c = foodCalc(a.food, a.qty); kcal += c.kcal; prot += c.prot; }
    return { kcal, prot: Math.round(prot) };
  }

  // La creatina ja va dins d'algun àpat marcat avui?
  function creatineIncluded(iso) {
    const day = data.diet[iso];
    if (!day) return false;
    for (const slotId in day.slots) {
      const sel = day.slots[slotId];
      const o = findOption(slotId, selectedOptId(sel));
      if (o && o.items.some(([f]) => f === 'creatina') && !((sel && sel.excl) || []).includes('creatina')) return true;
    }
    return (day.adds || []).some(a => a.food === 'creatina');
  }

  // Fracció d'àpats obligatoris complerts (0..1)
  function dietAdherence(iso) {
    const day = data.diet[iso];
    const req = P.diet.slots.filter(s => s.required);
    if (!day) return 0;
    const done = req.filter(s => selectedOptId(day.slots[s.id])).length;
    return done / req.length;
  }

  /* ========== Navegació ========== */

  const VIEW_TITLES = { avui: 'Avui', programa: 'Programa', dieta: 'Dieta', progres: 'Progrés', mes: 'Més' };

  function showView(name) {
    currentView = name;
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    $('#view-' + name).classList.remove('hidden');
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === name));
    $('#topbarTitle').textContent = VIEW_TITLES[name];
    render();
    window.scrollTo(0, 0);
  }

  function render() {
    updateExerciseDatalist();
    if (currentView === 'avui') renderAvui();
    if (currentView === 'programa') renderPrograma();
    if (currentView === 'dieta') renderDieta();
    if (currentView === 'progres') renderProgres();
    if (currentView === 'mes') renderMes();
  }

  /* ========== Vista: Avui ========== */

  function renderAvui() {
    const v = $('#view-avui');
    const today = todayISO();
    const info = todayInfo();
    const T = computeTargets();
    const weekStart = mondayOf(new Date());

    let html = `<div class="spread">
      <p class="muted" style="font-size:1rem">${fmtDate(today)}</p>
      <span class="chip">Setmana ${T.week}${isDeload() ? ' · descàrrega' : ''}</span>
    </div>`;

    // Resum de la sessió d'avui (progressions aplicades)
    const ls = data.program.lastSummary;
    if (ls && ls.date === today && !draft) {
      html += `<div class="card" style="border-color: var(--good)">
        <h2>🎉 Sessió ${ls.workout} desada</h2>
        ${ls.lines.length
          ? `<p class="muted" style="margin-bottom:4px">La propera vegada puges:</p>` + ls.lines.map(l => `<div class="ex-line">⬆️ ${esc(l)}</div>`).join('')
          : `<p class="muted">Bona feina. Quan totes les sèries arribin al màxim de reps, pujarem pes o nivell.</p>`}
      </div>`;
    }

    if (draft) {
      html += `<div class="card" style="border-color: var(--accent)">
        <h2>⏱️ Entrenament en curs</h2>
        <p class="muted">${esc(draft.routineName || 'Entrenament lliure')} — no l'has acabat.</p>
        <div class="stack" style="margin-bottom:0">
          <button class="btn primary" id="btnResume">Continuar entrenament</button>
        </div>
      </div>`;
    } else if (info.type === 'program') {
      const wk = P.workouts[info.key];
      if (info.done) {
        html += `<div class="card">
          <h2>✅ ${esc(wk.name)} feta avui</h2>
          <p class="muted">${esc(wk.focus)}. Ara toca menjar i dormir: aquí és on creix el múscul.</p>
          <p class="muted" style="margin-top:6px">${esc(P.finisher.name)}: ${esc(P.finisher.detail)}</p>
        </div>`;
      } else {
        html += `<div class="card" style="border-color: var(--accent)">
          <div class="spread"><h2>🏋️ ${esc(wk.name)}</h2><span class="muted">~${P.meta.sessionMinutes} min</span></div>
          <p class="muted" style="margin-bottom:8px">${esc(wk.focus)}</p>
          ${wk.items.map(it => {
            const ex = P.exercises[it.ex];
            const s = exState(it.ex);
            const sub = ex.kind === 'level' ? s.levelName : targetLabel(it);
            return `<div class="ex-line">• <b>${esc(ex.name)}</b> <span class="muted">${esc(ex.kind === 'level' ? targetLabel(it) + ' · ' + sub : sub)}</span></div>`;
          }).join('')}
          <div class="row" style="margin-top:12px">
            <button class="btn" id="btnReview" style="flex:1">🎬 Repàs (3 min)</button>
            <button class="btn primary" id="btnStartProgram" style="flex:2">▶️ Començar</button>
          </div>
        </div>`;
      }
    } else if (info.type === 'routine') {
      html += `<div class="card">
        <h2>${esc(info.routine.name)}</h2>
        ${info.routine.items.map(it => `<div class="ex-line">• ${esc(it.name)} <span class="muted">${itemSummary(it)}</span></div>`).join('')}
        <div class="stack" style="margin-bottom:0">
          <button class="btn primary" id="btnStartPlanned">▶️ Començar entrenament</button>
        </div>
      </div>`;
    } else {
      html += `<div class="card">
        <h2>😌 ${esc(P.restDay.title)}</h2>
        ${P.restDay.items.map(it => `<div class="ex-line">• <b>${esc(it.name)}</b> <span class="muted">${esc(it.detail)}</span></div>`).join('')}
        <div class="stack" style="margin-bottom:0">
          <button class="btn ${info.done ? '' : 'primary'}" id="btnRestDone">${info.done ? '✅ Fet' : 'Marcar com a fet'}</button>
        </div>
      </div>`;
    }

    // Pes d'avui
    const wToday = data.weights.find(w => w.date === today);
    const wYest = data.weights.find(w => w.date === shiftISO(today, -1));
    const avg7 = weightAvg(today, 7);
    html += `<div class="card" ${wToday ? '' : 'style="border-color: var(--accent)"'}>
      <div class="spread"><h2>⚖️ Pes d'avui</h2>${wToday ? '' : '<span class="muted">Pesa\'t: és la teva brúixola</span>'}</div>
      <div class="row">
        <input type="number" step="0.1" min="30" max="200" inputmode="decimal" id="wInput" placeholder="kg" value="${wToday ? wToday.kg : ''}" style="max-width:120px">
        <button class="btn primary" id="btnSaveWeight">${wToday ? 'Actualitza' : 'Desa'}</button>
        <span class="muted grow" style="font-size:0.8rem">${wYest ? `Ahir: ${fmt(wYest.kg)} kg` : ''}${avg7 ? ` · Mitjana 7 dies: ${fmt(avg7)} kg` : ''}</span>
      </div>
      <p class="muted" style="margin-top:6px;font-size:0.78rem">Al matí, després del lavabo i abans d'esmorzar.</p>
    </div>`;

    // Dieta d'avui: una fila per àpat, toca per anar-hi
    const day = dietDay(today);
    const tot = dietTotals(today);
    const creat = creatineIncluded(today) || !!day.extras.creatine;
    html += `<div class="card">
      <div class="spread"><h2>🍽️ Dieta</h2><span class="muted">${tot.kcal} / ${T.kcal} kcal · ${tot.prot} / ${T.protein} g</span></div>
      <div class="bar"><div class="bar-fill" style="width:${Math.min(100, tot.kcal / T.kcal * 100)}%"></div></div>
      <div style="margin-top:6px">
        ${P.diet.slots.filter(s => s.required).map(s => {
          const sel = day.slots[s.id];
          const o = findOption(s.id, selectedOptId(sel));
          const t = o ? optionTotals(o, sel.excl) : null;
          return `<div class="check-row" data-goslot="${s.id}">
            <span class="opt-check ${o ? 'on' : ''}">${o ? '✓' : ''}</span>
            <div class="grow"><div>${esc(s.name)}</div>${o ? `<div class="muted" style="font-size:0.78rem">${esc(o.name)}</div>` : ''}</div>
            <span class="muted">${t ? t.kcal : ''}</span>
          </div>`;
        }).join('')}
      </div>
      <div class="chips" style="margin-top:8px">
        <button class="chip-btn ${creat ? 'on' : ''}" data-extra="creatine">${creat ? '✓ ' : ''}Creatina</button>
        ${P.diet.extras.map(x => `<button class="chip-btn ${day.extras[x.id] ? 'on' : ''}" data-extra="${x.id}">${day.extras[x.id] ? '✓ ' : ''}${esc(x.short || x.name)}</button>`).join('')}
      </div>
    </div>`;

    // Anell d'objectiu setmanal (= dies d'entrenament del programa)
    const goal = data.profile.trainDays.length || 3;
    const weekDays = new Set();
    for (const s of data.sessions) {
      const d = parseISO(s.date);
      if (d >= weekStart) weekDays.add(s.date);
    }
    const done = weekDays.size;
    const p = Math.min(done / goal, 1);
    const R = 30, C = 2 * Math.PI * R;
    const ringColor = p >= 1 ? 'var(--good)' : 'var(--accent)';
    let goalMsg;
    if (done >= goal) goalMsg = 'Objectiu complert! 🎉 Tot el que facis de més és regal.';
    else if (goal - done === 1) goalMsg = 'Només et queda 1 dia. Va, que el tens! 💪';
    else goalMsg = `Et queden ${goal - done} dies per complir l'objectiu.`;
    const doneDays = new Set(data.sessions.map(s => s.date));
    let weekDots = '';
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const iso = isoOf(d);
      const trained = doneDays.has(iso);
      const isToday = iso === today;
      weekDots += `<div style="text-align:center; flex:1">
        <div class="muted" style="font-size:0.68rem">${DAY_SHORT[String(d.getDay())]}</div>
        <div style="width:26px;height:26px;line-height:26px;border-radius:50%;margin:3px auto 0;font-size:0.8rem; ${trained
          ? 'background:var(--good-bg);color:var(--good);font-weight:700'
          : 'background:var(--page);border:1px solid ' + (isToday ? 'var(--accent)' : 'var(--border)')}">${trained ? '✓' : ''}</div>
      </div>`;
    }
    html += `<div class="card">
      <div class="row" style="gap:16px">
        <svg width="76" height="76" viewBox="0 0 76 76" style="flex-shrink:0">
          <circle cx="38" cy="38" r="${R}" fill="none" stroke="var(--grid)" stroke-width="7"></circle>
          <circle cx="38" cy="38" r="${R}" fill="none" stroke="${ringColor}" stroke-width="7"
            stroke-linecap="round" stroke-dasharray="${(C * p).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 38 38)"></circle>
          <text x="38" y="44" text-anchor="middle" fill="var(--ink)" style="font-size:17px;font-weight:700">${done}/${goal}</text>
        </svg>
        <div><h2 style="margin-bottom:2px">Objectiu setmanal</h2><p class="muted">${goalMsg}</p></div>
      </div>
      <div class="row" style="margin-top:10px">${weekDots}</div>
    </div>`;

    if (!draft) html += `<button class="btn ghost full" id="btnFreeWorkout">＋ Entrenament lliure</button>`;

    v.innerHTML = html;

    if ($('#btnResume')) $('#btnResume').onclick = openWorkout;
    if ($('#btnStartProgram')) $('#btnStartProgram').onclick = () => startProgramWorkout(info.key);
    if ($('#btnReview')) $('#btnReview').onclick = () => showReview(info.key);
    if ($('#btnStartPlanned')) $('#btnStartPlanned').onclick = () => startWorkout(info.routine);
    if ($('#btnFreeWorkout')) $('#btnFreeWorkout').onclick = () => startWorkout(null);
    if ($('#btnRestDone')) $('#btnRestDone').onclick = () => {
      data.program.restDone[today] = !data.program.restDone[today];
      saveData(); render();
    };
    $('#btnSaveWeight').onclick = () => {
      const kg = num($('#wInput').value);
      if (kg < 30 || kg > 200) return;
      saveWeight(kg); render();
    };
    v.querySelectorAll('[data-goslot]').forEach(b => b.onclick = () => {
      renderDieta.scrollTo = b.dataset.goslot;
      showView('dieta');
    });
    v.querySelectorAll('[data-extra]').forEach(b => b.onclick = () => {
      if (b.dataset.extra === 'creatine' && creatineIncluded(today)) return; // ja va al bol
      const d = dietDay(today);
      d.extras[b.dataset.extra] = !d.extras[b.dataset.extra];
      saveData(); render();
    });
  }

  /* ========== Vista: Programa ========== */

  function renderPrograma() {
    const v = $('#view-programa');
    const T = computeTargets();
    const sched = weekSchedule();

    let html = `<div class="card">
      <div class="spread"><h2>${esc(P.meta.name)}</h2><span class="chip">Setmana ${T.week}</span></div>
      <p class="muted">${esc(P.meta.subtitle)}</p>
      <div class="row" style="margin-top:12px">
        ${sched.map(d => `<div style="flex:1;text-align:center">
          <div class="muted" style="font-size:0.68rem">${DAY_SHORT[d.dow]}</div>
          <div class="sched-day ${d.done ? 'done' : ''} ${d.isToday ? 'today' : ''} ${d.missed ? 'missed' : ''} ${d.isTrain ? '' : 'rest'}">${d.done ? '✓' : (d.label || (d.isTrain ? '·' : ''))}</div>
        </div>`).join('')}
      </div>
      <p class="muted" style="margin-top:10px">Propera sessió: <b>${data.program.nextWorkout}</b>${isDeload() ? ' · Setmana de descàrrega: una sèrie menys a tot.' : ''}</p>
    </div>`;

    for (const key of ['A', 'B']) {
      const wk = P.workouts[key];
      html += `<div class="card">
        <div class="spread"><h2>${esc(wk.name)}</h2><span class="muted">${esc(wk.focus)}</span></div>
        ${wk.items.map(it => {
          const ex = P.exercises[it.ex];
          const s = exState(it.ex);
          const last = lastEntryByKey(it.ex);
          return `<div class="ex-row" data-exinfo="${it.ex}">
            <div class="grow">
              <div><b>${esc(ex.name)}</b> <span class="muted">${esc(targetLabel(it))}</span></div>
              ${ex.kind === 'level' ? `<div class="muted" style="font-size:0.78rem">Nivell ${s.level + 1}/${ex.levels.length}: ${esc(s.levelName)}</div>` : ''}
              ${last ? `<div class="muted" style="font-size:0.78rem">Últim cop: ${esc(perfLabel(last))}</div>` : ''}
            </div>
            <span class="info-btn">ⓘ</span>
          </div>`;
        }).join('')}
      </div>`;
    }

    const itemLine = (w, list, i) => `<div class="ex-line" ${videosFor(w.name).length ? `data-iteminfo="${list}-${i}" style="cursor:pointer"` : ''}>• <b>${esc(w.name)}</b> <span class="muted">${esc(w.detail)}</span>${videosFor(w.name).length ? ' <span class="info-btn">ⓘ</span>' : ''}</div>`;
    html += `<div class="card">
      <details><summary><b>🔥 Escalfament</b> <span class="muted">5 min</span></summary>${P.warmup.map((w, i) => itemLine(w, 'warmup', i)).join('')}</details>
      <details style="margin-top:8px"><summary><b>🧘 Refredament</b> <span class="muted">4 min</span></summary>${P.cooldown.map((w, i) => itemLine(w, 'cooldown', i)).join('')}</details>
      <details style="margin-top:8px"><summary><b>📈 Com puja el programa</b></summary>
        ${P.progressionRules.map(r => `<div class="ex-line">• ${esc(r)}</div>`).join('')}
        <p class="muted" style="margin-top:8px">${esc(P.notes.posture)} ${esc(P.notes.pullupBar)}</p>
        <p class="muted" style="margin-top:6px"><b>${esc(P.finisher.name)}</b>: ${esc(P.finisher.detail)}</p>
      </details>
    </div>`;

    html += `<div class="card">
      <div class="spread"><h2>📅 Dies d'entrenament</h2><span class="muted">3, no consecutius</span></div>
      <div class="chips" style="margin-top:6px">
        ${DAY_ORDER.map(d => `<button class="chip-btn ${data.profile.trainDays.includes(d) ? 'on' : ''}" data-day="${d}">${DAY_SHORT[d]}</button>`).join('')}
      </div>
    </div>`;

    html += `<p class="muted" style="font-size:0.72rem;text-align:center">${esc(P.notes.disclaimer)}</p>`;

    v.innerHTML = html;

    v.querySelectorAll('[data-exinfo]').forEach(el => el.onclick = () => showExerciseInfo(el.dataset.exinfo));
    v.querySelectorAll('[data-iteminfo]').forEach(el => el.onclick = () => {
      const [list, i] = el.dataset.iteminfo.split('-');
      showItemInfo(P[list][Number(i)]);
    });
    v.querySelectorAll('[data-day]').forEach(b => b.onclick = () => {
      const d = b.dataset.day;
      const td = data.profile.trainDays;
      if (td.includes(d)) data.profile.trainDays = td.filter(x => x !== d);
      else td.push(d);
      saveData(); render();
    });
  }

  // Vídeos incrustats (definits a program.js → videos[clau d'exercici o nom d'ítem])
  function videosFor(key) {
    return (P.videos && P.videos[key]) || [];
  }

  function videoEmbedHtml(v) {
    return `<div class="video-title muted">${esc(v.title)}</div>
      <div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(v.id)}?rel=0&modestbranding=1&playsinline=1" loading="lazy"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="${esc(v.title)}"></iframe></div>`;
  }

  // Modal genèric de fitxa (exercici o ítem d'escalfament)
  function showInfoModal(html) {
    const m = $('#modal-exercise');
    m.querySelector('.modal').innerHTML = html + `<div class="stack" style="margin-bottom:0"><button class="btn primary" id="btnCloseExercise">Tancar</button></div>`;
    m.classList.remove('hidden');
    $('#btnCloseExercise').onclick = () => { m.classList.add('hidden'); m.querySelector('.modal').innerHTML = ''; };
    m.onclick = e => { if (e.target === m) { m.classList.add('hidden'); m.querySelector('.modal').innerHTML = ''; } };
  }

  function showExerciseInfo(key) {
    const ex = P.exercises[key];
    const s = exState(key);
    let state = '';
    if (ex.kind === 'load') state = `Pes actual: <b>${s.load} kg</b> (+${ex.step} kg quan totes les sèries arribin al màxim)`;
    else if (ex.kind === 'time') state = `Objectiu actual: <b>${s.secs} s</b> per sèrie`;
    else state = `Nivell actual <b>${s.level + 1} de ${ex.levels.length}</b>: ${esc(s.levelName)}`;
    const vids = videosFor(key);
    showInfoModal(`
      <h2>${esc(ex.name)}</h2>
      <p class="muted">${esc(ex.muscle)} · ${esc(ex.equip)}</p>
      ${vids.map(videoEmbedHtml).join('')}
      ${vids.length ? '' : `<a class="btn" href="${esc(ex.video)}" target="_blank" rel="noopener" style="margin:8px 0">▶️ Veure vídeos de la tècnica</a>`}
      <p style="margin:10px 0">${state}</p>
      <h3 style="margin-bottom:4px">Tècnica</h3>
      ${ex.cues.map((c, i) => `<div class="ex-line">${i + 1}. ${esc(c)}</div>`).join('')}
      <p style="margin-top:10px"><b>Error habitual:</b> <span class="muted">${esc(ex.mistake)}</span></p>
      ${ex.alt ? `<p style="margin-top:6px"><b>Si no pots:</b> <span class="muted">${esc(ex.alt)}</span></p>` : ''}
      ${ex.levels ? `<h3 style="margin:10px 0 4px">Nivells</h3>` + ex.levels.map((l, i) => `<div class="ex-line ${i === s.level ? '' : 'muted'}">${i === s.level ? '▶' : '○'} ${esc(l)}</div>`).join('') : ''}`);
  }

  // Repàs abans de començar: tots els clips de la sessió i 3 claus per exercici, en 3 minuts
  function showReview(key) {
    const wk = P.workouts[key];
    const o = $('#overlay-review');
    let html = `<div class="sheet">
      <div class="spread"><h2 style="font-size:1.15rem">Repàs · ${esc(wk.name)}</h2><span class="muted">~3 min</span></div>
      <p class="muted">Mira cada clip un cop. Durant la sessió només tindràs les 3 claus.</p>`;
    wk.items.forEach((it, i) => {
      const ex = P.exercises[it.ex];
      const s = exState(it.ex);
      const vids = videosFor(it.ex);
      html += `<div class="card">
        <div class="spread"><h3>${i + 1}. ${esc(ex.name)}</h3><span class="muted">${esc(targetLabel(it))}</span></div>
        ${ex.kind === 'level' ? `<p class="muted" style="font-size:0.8rem">${esc(s.levelName)}</p>` : ''}
        ${vids.slice(0, 1).map(videoEmbedHtml).join('')}
        ${ex.cues.slice(0, 3).map(c => `<div class="ex-line">• ${esc(c)}</div>`).join('')}
        ${ex.alt ? `<p class="muted" style="font-size:0.78rem;margin-top:4px">Si no pots: ${esc(ex.alt)}</p>` : ''}
      </div>`;
    });
    html += `</div>
      <div class="overlay-footer">
        <button class="btn" id="btnReviewClose">Tancar</button>
        <button class="btn primary" id="btnReviewStart">▶️ Començar ${esc(wk.name)}</button>
      </div>`;
    o.innerHTML = html;
    o.classList.remove('hidden');
    window.scrollTo(0, 0);
    $('#btnReviewClose').onclick = () => { o.classList.add('hidden'); o.innerHTML = ''; };
    $('#btnReviewStart').onclick = () => { o.classList.add('hidden'); o.innerHTML = ''; startProgramWorkout(key); };
  }

  // Fitxa d'un ítem d'escalfament / refredament / descans (nom, detall, vídeo)
  function showItemInfo(it) {
    const vids = videosFor(it.name);
    showInfoModal(`
      <h2>${esc(it.name)}</h2>
      <p class="muted">${esc(it.detail)}</p>
      ${vids.map(videoEmbedHtml).join('')}`);
  }

  /* ========== Vista: Dieta ========== */

  function renderDieta() {
    const v = $('#view-dieta');
    const today = todayISO();
    const T = computeTargets();
    const day = dietDay(today);
    const tot = dietTotals(today);
    const creatAuto = creatineIncluded(today);
    const creat = creatAuto || !!day.extras.creatine;

    let html = `<div class="card">
      <div class="spread"><h2>Avui</h2><span class="chip">${T.ramp ? 'Setmana d\'adaptació' : 'Superàvit'}</span></div>
      <div class="spread" style="margin-top:8px"><span>Calories</span><b>${tot.kcal} / ${T.kcal}</b></div>
      <div class="bar"><div class="bar-fill" style="width:${Math.min(100, tot.kcal / T.kcal * 100)}%"></div></div>
      <div class="spread" style="margin-top:8px"><span>Proteïna</span><b>${tot.prot} / ${T.protein} g</b></div>
      <div class="bar"><div class="bar-fill good" style="width:${Math.min(100, tot.prot / T.protein * 100)}%"></div></div>
      <p class="muted" style="margin-top:8px;font-size:0.8rem">${esc(P.diet.intro)}</p>
    </div>`;

    for (const slot of P.diet.slots) {
      const sel = day.slots[slot.id];
      const selId = selectedOptId(sel);
      html += `<div class="card" id="slot-${slot.id}">
        <div class="spread"><h2>${esc(slot.name)}</h2><span class="muted">${esc(slot.time)}</span></div>
        ${slot.options.map(o => {
          const on = selId === o.id;
          const t = optionTotals(o, on ? sel.excl : []);
          return `<div class="option ${on ? 'selected' : ''}" data-opt="${o.id}" data-slotid="${slot.id}">
            <div class="row">
              <span class="opt-check">${on ? '✓' : ''}</span>
              <div class="grow">${esc(o.name)}</div>
              <span class="muted" style="white-space:nowrap;font-size:0.8rem">${t.kcal} kcal · ${t.prot} g</span>
            </div>
            ${on ? `<div class="ings">${o.items.map(([f, q]) => {
              const food = P.diet.foods[f];
              const c = foodCalc(f, q);
              const off = (sel.excl || []).includes(f);
              return `<button class="ing ${off ? 'off' : ''}" data-ing="${f}" data-slotid="${slot.id}">${esc(food ? food.name : f)} · ${q} ${esc(food ? food.unit : '')} · ${c.kcal} kcal</button>`;
            }).join('')}</div>` : ''}
            ${o.how ? `<details><summary class="muted">Com es fa</summary><p class="muted" style="margin-top:4px">${esc(o.how)}</p></details>` : ''}
          </div>`;
        }).join('')}
      </div>`;
    }

    // Afegits fora del pla
    html += `<div class="card">
      <h2>Alguna cosa més avui?</h2>
      ${day.adds.map((a, i) => {
        const f = P.diet.foods[a.food]; const c = foodCalc(a.food, a.qty);
        return `<div class="check-row"><span class="grow">${esc(f ? f.name : a.food)} · ${a.qty} ${esc(f ? f.unit : '')}</span><span class="muted">${c.kcal} kcal</span><button class="btn tiny danger" data-rmadd="${i}">✕</button></div>`;
      }).join('')}
      <div class="row" style="margin-top:8px">
        <select id="addFood" class="grow">${Object.entries(P.diet.foods).map(([id, f]) => `<option value="${id}">${esc(f.name)} (${f.per} ${esc(f.unit)})</option>`).join('')}</select>
        <input type="number" id="addQty" inputmode="decimal" step="any" min="0" placeholder="quant." style="width:84px">
        <button class="btn small primary" id="btnAddFood">＋</button>
      </div>
    </div>`;

    // Cada dia
    html += `<div class="card">
      <h2>Cada dia</h2>
      <div class="check-row" data-extra="creatine">
        <span class="opt-check ${creat ? 'on' : ''}">${creat ? '✓' : ''}</span>
        <div class="grow"><div>Creatina 5 g</div><div class="muted" style="font-size:0.78rem">${creatAuto ? 'Ja va dins de l\'àpat marcat' : 'Cada dia, també els de descans'}</div></div>
      </div>
      ${P.diet.extras.map(x => `<div class="check-row" data-extra="${x.id}">
        <span class="opt-check ${day.extras[x.id] ? 'on' : ''}">${day.extras[x.id] ? '✓' : ''}</span>
        <div class="grow"><div>${esc(x.name)}</div><div class="muted" style="font-size:0.78rem">${esc(x.detail)}</div></div>
      </div>`).join('')}
    </div>`;

    // Setmana: àpats complerts de 5
    const mon = mondayOf(new Date());
    let dots = '';
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon); d.setDate(d.getDate() + i);
      const iso = isoOf(d);
      const a = iso <= today ? dietAdherence(iso) : null;
      const cls = a == null ? '' : a >= 0.8 ? 'good' : a >= 0.5 ? 'half' : 'low';
      dots += `<div style="flex:1;text-align:center"><div class="muted" style="font-size:0.68rem">${DAY_SHORT[String(d.getDay())]}</div>
        <div class="adh-dot ${cls} ${iso === today ? 'today' : ''}">${a == null ? '' : Math.round(a * 5)}</div></div>`;
    }
    html += `<div class="card"><div class="spread"><h2>Setmana</h2><span class="muted">àpats de 5</span></div><div class="row" style="margin-top:6px">${dots}</div></div>`;

    // Compra i trucs, plegats
    const bought = P.diet.shopping.filter(i => data.shopping[i]).length;
    html += `<div class="card"><details>
      <summary><b>🛒 Llista de la compra</b> <span class="muted">${bought}/${P.diet.shopping.length}</span></summary>
      ${P.diet.shopping.map(i => `<div class="check-row" data-shop="${esc(i)}">
        <span class="opt-check ${data.shopping[i] ? 'on' : ''}">${data.shopping[i] ? '✓' : ''}</span><span class="grow ${data.shopping[i] ? 'muted' : ''}">${esc(i)}</span>
      </div>`).join('')}
      <div class="stack" style="margin-bottom:0"><button class="btn small" id="btnResetShop">Reiniciar (nova setmana)</button></div>
    </details></div>`;
    html += `<div class="card"><details><summary><b>💡 Trucs</b></summary>${P.diet.tips.map(t => `<div class="ex-line">• ${esc(t)}</div>`).join('')}</details></div>`;

    v.innerHTML = html;

    v.querySelectorAll('[data-opt]').forEach(el => el.onclick = ev => {
      if (ev.target.closest('details, [data-ing]')) return;
      const d = dietDay(today);
      const cur = selectedOptId(d.slots[el.dataset.slotid]);
      d.slots[el.dataset.slotid] = cur === el.dataset.opt ? null : { opt: el.dataset.opt, excl: [] };
      saveData(); render();
    });
    v.querySelectorAll('[data-ing]').forEach(el => el.onclick = () => {
      const d = dietDay(today);
      const sel = d.slots[el.dataset.slotid];
      if (!sel) return;
      const i = sel.excl.indexOf(el.dataset.ing);
      if (i >= 0) sel.excl.splice(i, 1); else sel.excl.push(el.dataset.ing);
      saveData(); render();
    });
    v.querySelectorAll('[data-extra]').forEach(el => el.onclick = () => {
      if (el.dataset.extra === 'creatine' && creatAuto) return;
      const d = dietDay(today);
      d.extras[el.dataset.extra] = !d.extras[el.dataset.extra];
      saveData(); render();
    });
    v.querySelectorAll('[data-rmadd]').forEach(el => el.onclick = () => { dietDay(today).adds.splice(Number(el.dataset.rmadd), 1); saveData(); render(); });
    $('#btnAddFood').onclick = () => {
      const qty = num($('#addQty').value);
      if (qty <= 0) return;
      dietDay(today).adds.push({ food: $('#addFood').value, qty });
      saveData(); render();
    };
    v.querySelectorAll('[data-shop]').forEach(el => el.onclick = () => {
      data.shopping[el.dataset.shop] = !data.shopping[el.dataset.shop];
      saveData(); render();
    });
    $('#btnResetShop').onclick = () => { data.shopping = {}; saveData(); render(); };

    if (renderDieta.scrollTo) {
      const target = $('#slot-' + renderDieta.scrollTo);
      renderDieta.scrollTo = null;
      if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }

  /* ========== Vista: Progrés ========== */

  function exerciseMetric(name, s) {
    for (const e of s.entries) {
      if (e.name.toLowerCase() !== name.toLowerCase()) continue;
      if (e.mode === 'cardio') return { kind: 'cardio', value: e.dist || 0, time: e.time || 0 };
      if (e.timed) return { kind: 'time', value: Math.max(...e.sets.map(st => st.reps || 0), 0) };
      const weights = e.sets.map(st => st.weight || 0);
      const maxW = Math.max(...weights, 0);
      if (maxW > 0) {
        const best = e.sets.filter(st => st.weight === maxW).sort((a, b) => b.reps - a.reps)[0];
        return { kind: 'pes', value: maxW, reps: best.reps };
      }
      return { kind: 'reps', value: Math.max(...e.sets.map(st => st.reps || 0), 0) };
    }
    return null;
  }

  function renderProgres() {
    const v = $('#view-progres');
    const today = todayISO();
    const sessions = [...data.sessions].sort((a, b) => a.date.localeCompare(b.date));
    const T = computeTargets();

    // --- Pes ---
    const avg7 = weightAvg(today, 7);
    const trend = weightTrend();
    const sug = weightSuggestion();
    let html = `<div class="card">
      <div class="spread"><h2>⚖️ Pes corporal</h2><span class="muted">${data.profile.startWeight} → ${data.profile.targetWeight} kg</span></div>
      ${avg7 ? `<p style="margin:4px 0"><b style="font-size:1.4rem">${fmt(avg7)} kg</b> <span class="muted">mitjana 7 dies${trend != null ? ` · ${trend >= 0 ? '+' : ''}${fmt(trend)} kg/setmana` : ''}</span></p>` : ''}
      <div class="chart-wrap" id="chartWeight"></div>
      <p class="muted" style="margin-top:8px">${esc(sug.text)}</p>
      ${sug.delta ? `<div class="stack" style="margin-bottom:0"><button class="btn small primary" id="btnApplyAdjust">Aplicar ${sug.delta > 0 ? '+' : ''}${sug.delta} kcal/dia</button></div>` : ''}
    </div>`;

    // --- Tiles ---
    const weekStart = mondayOf(new Date());
    const weekSessions = new Set(sessions.filter(s => parseISO(s.date) >= weekStart).map(s => s.date)).size;
    let adhSum = 0, adhN = 0;
    for (let i = 0; i < 7; i++) {
      const iso = shiftISO(today, -i);
      if (iso < data.profile.programStart) break;
      adhSum += dietAdherence(iso); adhN++;
    }
    const adh = adhN ? Math.round(adhSum / adhN * 100) : 0;
    html += `<div class="tiles">
      <div class="tile"><div class="t-value">${weekSessions}/${data.profile.trainDays.length}</div><div class="t-label">Sessions setmana</div></div>
      <div class="tile"><div class="t-value">${adh}%</div><div class="t-label">Dieta 7 dies</div></div>
      <div class="tile"><div class="t-value">${T.kcal}</div><div class="t-label">kcal objectiu</div></div>
    </div>`;

    // --- Fites ---
    html += `<div class="card"><h2>🏁 Fites del programa</h2>
      ${P.milestones.map(m => {
        const target = data.profile.startWeight + m.gain;
        const reached = avg7 != null && avg7 >= target;
        return `<div class="ex-line ${reached ? '' : 'muted'}">${reached ? '✅' : '○'} <b>Setmana ${m.week} · ${fmt(target)} kg</b> — ${esc(m.text)}</div>`;
      }).join('')}
    </div>`;

    if (sessions.length === 0) {
      html += `<div class="card empty"><span class="big">📈</span>Les gràfiques d'entrenament apareixeran quan registris sessions.</div>`;
      v.innerHTML = html;
      drawWeightChart();
      wireProgres();
      return;
    }

    // --- Exercicis ---
    const freq = new Map();
    for (const s of sessions) for (const e of s.entries) {
      const k = e.name.toLowerCase();
      freq.set(k, { name: e.name, count: (freq.get(k)?.count || 0) + 1 });
    }
    const exList = [...freq.values()].sort((a, b) => b.count - a.count);
    if (!renderProgres.selected || !freq.has(renderProgres.selected.toLowerCase())) {
      renderProgres.selected = exList[0]?.name || '';
    }

    html += `<div class="card">
      <div class="spread">
        <h2 id="chartMetricTitle">Progrés</h2>
        <select id="exSelect" style="max-width:55%">
          ${exList.map(x => `<option value="${esc(x.name)}" ${x.name === renderProgres.selected ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}
        </select>
      </div>
      <div class="chart-wrap" id="chartLine"></div>
    </div>`;

    html += `<div class="card"><h2>Constància</h2><p class="muted">Cada quadrat és un dia. No trenquis la cadena!</p><div class="chart-wrap" id="chartHeat"></div></div>`;
    html += `<div class="card"><h2>Entrenaments per setmana</h2><div class="chart-wrap" id="chartBars"></div></div>`;

    const prs = [];
    for (const x of exList.slice(0, 10)) {
      let best = null;
      for (const s of sessions) {
        const m = exerciseMetric(x.name, s);
        if (!m) continue;
        if (!best || m.value > best.m.value) best = { m, date: s.date };
      }
      if (!best || best.m.value <= 0) continue;
      let txt;
      if (best.m.kind === 'pes') txt = `${fmt(best.m.value)} kg × ${best.m.reps}`;
      else if (best.m.kind === 'reps') txt = `${best.m.value} reps`;
      else if (best.m.kind === 'time') txt = `${best.m.value} s`;
      else txt = `${fmt(best.m.value)} km`;
      prs.push(`<div class="pr-line"><span>${esc(x.name)}</span><span><span class="pr-val">${txt}</span> <span class="muted">${fmtDate(best.date, { day: 'numeric', month: 'short' })}</span></span></div>`);
    }
    if (prs.length) html += `<div class="card"><h2>🏆 Rècords personals</h2>${prs.join('')}</div>`;

    v.innerHTML = html;

    $('#exSelect').onchange = e => { renderProgres.selected = e.target.value; renderProgres(); };
    drawWeightChart();
    drawLineChart(sessions);
    drawBarChart(sessions);
    const counts = {};
    for (const s of sessions) counts[s.date] = (counts[s.date] || 0) + 1;
    Charts.heatmap($('#chartHeat'), counts);
    wireProgres();
  }

  function wireProgres() {
    const b = $('#btnApplyAdjust');
    if (b) b.onclick = () => {
      const sug = weightSuggestion();
      if (!sug.delta) return;
      data.profile.kcalAdjust = (data.profile.kcalAdjust || 0) + sug.delta;
      data.profile.lastAdjust = todayISO();
      saveData(); render();
    };
  }

  function drawWeightChart() {
    const wrap = $('#chartWeight');
    if (!wrap) return;
    if (data.weights.length === 0) {
      wrap.innerHTML = `<p class="muted" style="padding:12px 0">Apunta el pes cada matí a "Avui" i aquí veuràs la tendència.</p>`;
      return;
    }
    const pts = data.weights.map(w => ({ date: parseISO(w.date), y: w.kg, iso: w.date }));
    const avg = data.weights.map(w => ({ date: parseISO(w.date), y: weightAvg(w.date, 7) }));
    Charts.weightChart(wrap, pts, avg);
  }

  function drawLineChart(sessions) {
    const name = renderProgres.selected;
    const points = [];
    let kind = null;
    for (const s of sessions) {
      const m = exerciseMetric(name, s);
      if (!m || m.value <= 0) continue;
      kind = m.kind;
      let sub;
      if (m.kind === 'pes') sub = `Pes màxim · ${m.reps} reps`;
      else if (m.kind === 'reps') sub = 'Màx. repeticions en una sèrie';
      else if (m.kind === 'time') sub = 'Màx. segons en una sèrie';
      else {
        const pace = m.time && m.value ? (m.time / m.value) : 0;
        sub = `${fmt(m.time)} min` + (pace ? ` · ${fmt(pace)} min/km` : '');
      }
      const unit = m.kind === 'cardio' ? 'km' : m.kind === 'pes' ? 'kg' : m.kind === 'time' ? 's' : 'reps';
      points.push({ date: parseISO(s.date), y: m.value, title: `${fmt(m.value)} ${unit} — ${fmtDate(s.date, { day: 'numeric', month: 'short' })}`, sub });
    }
    const unit = kind === 'cardio' ? 'km' : kind === 'pes' ? 'kg' : kind === 'time' ? 's' : 'reps';
    const titleEl = $('#chartMetricTitle');
    if (titleEl) titleEl.textContent = kind === 'cardio' ? 'Distància (km)' : kind === 'pes' ? 'Pes màxim (kg)' : kind === 'time' ? 'Segons' : 'Màx. repeticions';
    const wrap = $('#chartLine');
    if (points.length === 0) { wrap.innerHTML = `<p class="muted" style="padding:16px 0">Sense dades encara.</p>`; return; }
    Charts.lineChart(wrap, points, unit);
  }

  function drawBarChart(sessions) {
    const bars = [];
    const start = mondayOf(new Date());
    start.setDate(start.getDate() - 7 * 7);
    for (let i = 0; i < 8; i++) {
      const wk = new Date(start); wk.setDate(wk.getDate() + i * 7);
      const wkEnd = new Date(wk); wkEnd.setDate(wkEnd.getDate() + 6);
      const count = sessions.filter(s => { const d = parseISO(s.date); return d >= wk && d <= wkEnd; }).length;
      bars.push({ label: `${wk.getDate()}/${wk.getMonth() + 1}`, value: count, title: `${count} entrenament${count === 1 ? '' : 's'}`, sub: `Setmana del ${wk.getDate()}/${wk.getMonth() + 1}` });
    }
    Charts.barChart($('#chartBars'), bars, '');
  }

  /* ========== Vista: Més (Històric · Rutines · Ajustos) ========== */

  function renderMes() {
    const v = $('#view-mes');
    let html = `<div class="subtabs">
      <button class="subtab ${mesTab === 'historial' ? 'active' : ''}" data-sub="historial">Històric</button>
      <button class="subtab ${mesTab === 'rutines' ? 'active' : ''}" data-sub="rutines">Rutines pròpies</button>
      <button class="subtab ${mesTab === 'ajustos' ? 'active' : ''}" data-sub="ajustos">Perfil</button>
    </div><div id="mesContent"></div>`;
    v.innerHTML = html;
    v.querySelectorAll('[data-sub]').forEach(b => b.onclick = () => { mesTab = b.dataset.sub; renderMes(); });
    const c = $('#mesContent');
    if (mesTab === 'historial') renderHistorial(c);
    if (mesTab === 'rutines') renderRutines(c);
    if (mesTab === 'ajustos') renderPerfil(c);
  }

  function renderPerfil(c) {
    const pr = data.profile;
    const T = computeTargets();
    c.innerHTML = `<div class="card">
      <h2>El teu perfil</h2>
      <div class="pr-line"><span>Edat · alçada</span><span class="pr-val">${pr.age} anys · ${pr.height} cm</span></div>
      <div class="pr-line"><span>Pes inicial → objectiu</span><span class="pr-val">${fmt(pr.startWeight)} → ${fmt(pr.targetWeight)} kg</span></div>
      <div class="pr-line"><span>Pes actual (mitjana 7 d)</span><span class="pr-val">${fmt(T.weight)} kg</span></div>
      <div class="pr-line"><span>Metabolisme basal estimat</span><span class="pr-val">${T.bmr} kcal</span></div>
      <div class="pr-line"><span>Manteniment estimat</span><span class="pr-val">${T.tdee} kcal</span></div>
      <div class="pr-line"><span>Objectiu diari</span><span class="pr-val">${T.kcal} kcal · ${T.protein} g prot</span></div>
      <div class="pr-line"><span>Ajust per bàscula acumulat</span><span class="pr-val">${pr.kcalAdjust >= 0 ? '+' : ''}${pr.kcalAdjust} kcal</span></div>
      <div class="pr-line"><span>Inici del programa</span><span class="pr-val">${fmtDate(pr.programStart, { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
      <div class="stack" style="margin-bottom:0"><button class="btn primary" id="btnOpenSettings">⚙️ Editar perfil i ajustos</button></div>
    </div>
    <p class="muted" style="font-size:0.75rem;text-align:center">${esc(P.notes.disclaimer)}</p>`;
    $('#btnOpenSettings').onclick = openSettings;
  }

  function renderHistorial(c) {
    const sessions = sortedSessionsDesc();
    if (sessions.length === 0) {
      c.innerHTML = `<div class="card empty"><span class="big">🕘</span>Encara no has registrat cap entrenament.</div>`;
      return;
    }
    let html = '';
    for (const s of sessions) {
      const vol = sessionVolume(s);
      const km = sessionKm(s);
      const bits = [nExercicis(s.entries.length)];
      if (vol) bits.push(`${fmt(vol)} kg`);
      if (km) bits.push(`${fmt(km)} km`);
      const dur = s.end && s.start ? Math.round((s.end - s.start - (s.pausedMs || 0)) / 60000) : null;
      if (dur) bits.push(`${dur} min`);
      html += `<div class="card" data-sess="${s.id}" style="cursor:pointer">
        <div class="spread">
          <div><h3>${esc(s.routineName || 'Entrenament lliure')}</h3>
            <p class="session-summary">${fmtDate(s.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · ${bits.join(' · ')}</p></div>
          <span class="muted">▾</span>
        </div>
        <div class="session-detail hidden">
          ${s.entries.map(e => {
            if (e.mode === 'cardio') return `<div class="ex-line"><b>${esc(e.name)}</b><div class="ex-sets">${fmt(e.dist)} km · ${fmt(e.time)} min</div></div>`;
            const setsTxt = e.timed ? e.sets.map(st => `${st.reps} s`).join(' · ')
              : e.sets.map(st => st.weight ? `${st.reps}×${fmt(st.weight)}kg` : `${st.reps} reps`).join(' · ');
            return `<div class="ex-line"><b>${esc(e.name)}</b>${e.variant ? ` <span class="muted">— ${esc(e.variant)}</span>` : ''}<div class="ex-sets">${setsTxt}</div></div>`;
          }).join('')}
          <div class="row" style="margin-top:8px"><button class="btn small danger" data-delsess="${s.id}">Eliminar sessió</button></div>
        </div>
      </div>`;
    }
    c.innerHTML = html;
    c.querySelectorAll('[data-sess]').forEach(card => {
      card.onclick = ev => {
        if (ev.target.closest('[data-delsess]')) return;
        card.querySelector('.session-detail').classList.toggle('hidden');
      };
    });
    c.querySelectorAll('[data-delsess]').forEach(b => {
      b.onclick = () => {
        if (!confirm('Eliminar aquesta sessió de l\'històric?')) return;
        data.sessions = data.sessions.filter(s => s.id !== b.dataset.delsess);
        saveData(); render();
      };
    });
  }

  /* ========== Rutines pròpies (per a dies extra o quan acabi el programa) ========== */

  function renderRutines(c) {
    const todayDow = String(new Date().getDay());
    let html = `<p class="muted">El programa cobreix els dies d'entrenament. Aquí pots crear rutines pròpies (p. ex. cardio) i assignar-les a altres dies.</p>
      <button class="btn primary full" id="btnNewRoutine">＋ Nova rutina</button>`;

    for (const r of data.routines) {
      html += `<div class="card routine-card">
        <div class="spread"><h2 style="margin-bottom:4px">${esc(r.name)}</h2><span class="chip">${nExercicis(r.items.length)}</span></div>
        ${r.items.map(it => `<div class="ex-line">• ${esc(it.name)} <span class="muted">${itemSummary(it)}</span></div>`).join('')}
        <div class="row" style="margin-top:10px">
          <button class="btn small" data-edit="${r.id}">✏️ Edita</button>
          <button class="btn small" data-dup="${r.id}">📄 Duplica</button>
          <button class="btn small danger" data-del="${r.id}">Elimina</button>
        </div>
      </div>`;
    }

    if (data.routines.length) {
      const opts = d => `<option value="">— Cap —</option>` +
        data.routines.map(x => `<option value="${x.id}" ${data.plan[d] === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('');
      html += `<div class="card"><h2>Assignar a dies</h2><p class="muted" style="margin-bottom:6px">Els dies del programa tenen prioritat.</p>`;
      for (const d of DAY_ORDER) {
        const isProg = data.profile.trainDays.includes(d);
        html += `<div class="day-row ${d === todayDow ? 'today' : ''}"><span class="day-name">${DAY_NAMES[d]}</span>
          ${isProg ? `<span class="muted">Programa (sessió ${'A/B'})</span>` : `<select data-day="${d}">${opts(d)}</select>`}</div>`;
      }
      html += `</div>`;
    }
    c.innerHTML = html;

    $('#btnNewRoutine').onclick = () => openRoutineEditor(null);
    c.querySelectorAll('select[data-day]').forEach(sel => sel.onchange = () => { data.plan[sel.dataset.day] = sel.value; saveData(); });
    c.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => openRoutineEditor(routineById(b.dataset.edit)));
    c.querySelectorAll('[data-dup]').forEach(b => b.onclick = () => {
      const r = routineById(b.dataset.dup);
      const copy = JSON.parse(JSON.stringify(r));
      copy.id = uid(); copy.name = r.name + ' (còpia)'; copy.items.forEach(it => it.id = uid());
      data.routines.push(copy); saveData(); render();
    });
    c.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      const r = routineById(b.dataset.del);
      if (!confirm(`Eliminar la rutina "${r.name}"? Les sessions ja registrades no es toquen.`)) return;
      data.routines = data.routines.filter(x => x.id !== r.id);
      for (const d in data.plan) if (data.plan[d] === r.id) data.plan[d] = '';
      saveData(); render();
    });
  }

  function openRoutineEditor(routine) {
    editingRoutine = routine ? JSON.parse(JSON.stringify(routine)) : { id: uid(), name: '', items: [] };
    renderRoutineEditor();
    $('#overlay-routine').classList.remove('hidden');
  }

  function closeRoutineEditor() {
    editingRoutine = null;
    $('#overlay-routine').classList.add('hidden');
  }

  function itemFields(it) {
    if (it.mode === 'cardio') {
      return `<div class="row">
        <label class="field grow"><span>Distància (km)</span><input type="number" step="0.1" min="0" inputmode="decimal" data-f="dist" value="${it.dist || ''}"></label>
        <label class="field grow"><span>Temps (min)</span><input type="number" step="1" min="0" inputmode="numeric" data-f="time" value="${it.time || ''}"></label>
      </div>`;
    }
    return `<div class="row">
      <label class="field grow"><span>Sèries</span><input type="number" step="1" min="1" inputmode="numeric" data-f="sets" value="${it.sets || ''}"></label>
      <label class="field grow"><span>Reps</span><input type="number" step="1" min="1" inputmode="numeric" data-f="reps" value="${it.reps || ''}"></label>
      <label class="field grow"><span>Pes (kg)</span><input type="number" step="0.5" min="0" inputmode="decimal" data-f="weight" value="${it.weight || ''}"></label>
    </div>`;
  }

  function renderRoutineEditor() {
    const o = $('#overlay-routine');
    const r = editingRoutine;
    let html = `<div class="sheet">
      <h2 style="font-size:1.15rem">${routineById(r.id) ? 'Editar rutina' : 'Nova rutina'}</h2>
      <label class="field"><span>Nom de la rutina</span><input type="text" id="rName" placeholder="Ex: Cardio suau, Extra braços…" value="${esc(r.name)}"></label>`;
    r.items.forEach((it, i) => {
      html += `<div class="card">
        <div class="spread" style="margin-bottom:8px">
          <span class="chip ${it.mode === 'cardio' ? 'cardio' : ''}">${it.mode === 'cardio' ? 'Cardio' : 'Força'}</span>
          <div class="row">
            <button class="btn small" data-up="${i}" ${i === 0 ? 'disabled' : ''}>↑</button>
            <button class="btn small" data-down="${i}" ${i === r.items.length - 1 ? 'disabled' : ''}>↓</button>
            <button class="btn small danger" data-rm="${i}">✕</button>
          </div>
        </div>
        <div class="stack" style="margin:0 0 8px"><div class="row">
          <input type="text" class="grow" placeholder="Nom de l'exercici" list="exNames" data-f="name" data-i="${i}" value="${esc(it.name)}">
          <select data-f="mode" data-i="${i}" style="width:110px">
            <option value="forca" ${it.mode !== 'cardio' ? 'selected' : ''}>Força</option>
            <option value="cardio" ${it.mode === 'cardio' ? 'selected' : ''}>Cardio</option>
          </select>
        </div></div>
        <div data-fields="${i}">${itemFields(it)}</div>
      </div>`;
    });
    html += `<button class="btn full" id="btnAddItem">＋ Afegir exercici</button></div>
      <div class="overlay-footer">
        <button class="btn" id="btnCancelRoutine">Cancel·la</button>
        <button class="btn primary" id="btnSaveRoutine">Desa la rutina</button>
      </div>`;
    o.innerHTML = html;

    $('#rName').oninput = e => { r.name = e.target.value; };
    o.querySelectorAll('[data-f]').forEach(inp => {
      const i = Number(inp.dataset.i ?? inp.closest('[data-fields]')?.dataset.fields);
      const f = inp.dataset.f;
      if (f === 'mode') inp.onchange = () => { r.items[i].mode = inp.value; renderRoutineEditor(); };
      else if (f === 'name') inp.oninput = () => { r.items[i].name = inp.value; };
      else inp.oninput = () => { r.items[i][f] = num(inp.value); };
    });
    o.querySelectorAll('[data-up]').forEach(b => b.onclick = () => { const i = Number(b.dataset.up); [r.items[i - 1], r.items[i]] = [r.items[i], r.items[i - 1]]; renderRoutineEditor(); });
    o.querySelectorAll('[data-down]').forEach(b => b.onclick = () => { const i = Number(b.dataset.down); [r.items[i + 1], r.items[i]] = [r.items[i], r.items[i + 1]]; renderRoutineEditor(); });
    o.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { r.items.splice(Number(b.dataset.rm), 1); renderRoutineEditor(); });
    $('#btnAddItem').onclick = () => {
      r.items.push({ id: uid(), name: '', mode: 'forca', sets: 3, reps: 10, weight: 0 });
      renderRoutineEditor();
      const inputs = o.querySelectorAll('[data-f="name"]');
      if (inputs.length) inputs[inputs.length - 1].focus();
    };
    $('#btnCancelRoutine').onclick = closeRoutineEditor;
    $('#btnSaveRoutine').onclick = () => {
      r.name = r.name.trim() || 'Rutina sense nom';
      r.items = r.items.filter(it => it.name.trim());
      const idx = data.routines.findIndex(x => x.id === r.id);
      if (idx >= 0) data.routines[idx] = r; else data.routines.push(r);
      saveData(); closeRoutineEditor(); render();
    };
  }

  /* ========== Entrenament actiu ========== */

  function startWorkout(routine) {
    draft = {
      id: uid(), date: todayISO(), start: Date.now(),
      routineName: routine ? routine.name : null,
      entries: routine ? routine.items.map(it => entryFromItem(it)) : []
    };
    saveDraft();
    openWorkout();
  }

  function startProgramWorkout(key) {
    const wk = P.workouts[key];
    draft = {
      id: uid(), date: todayISO(), start: Date.now(),
      routineName: `${wk.name} · ${wk.focus}`, program: key,
      warmup: P.warmup.map(() => false),
      cooldown: P.cooldown.map(() => false),
      entries: wk.items.map(item => entryFromProgramItem(item))
    };
    data.program.lastSummary = null;
    saveData(); saveDraft();
    openWorkout();
  }

  function entryFromProgramItem(item) {
    const ex = P.exercises[item.ex];
    const st = exState(item.ex);
    const sets = itemSets(item);
    const last = lastEntryByKey(item.ex);
    const entry = {
      id: uid(), exKey: item.ex, name: ex.name, mode: 'forca', timed: ex.kind === 'time',
      target: targetLabel(item), repsMin: item.reps[0], repsMax: item.reps[1],
      rest: (P.restSecs && P.restSecs[item.ex]) || 0,
      variant: ex.kind === 'level' ? st.levelName : null, sets: []
    };
    for (let i = 0; i < sets; i++) {
      let reps = item.reps[0];
      const weight = ex.kind === 'load' ? st.load : 0;
      // Si l'últim cop era al mateix pes/nivell, precarrega les reps reals (per superar-les)
      const same = last && last.sets[i] && ((ex.kind === 'load' && last.sets[i].weight === weight) || (ex.kind === 'level' && last.variant === entry.variant));
      if (same) reps = last.sets[i].reps;
      if (ex.kind === 'time') reps = st.secs;
      entry.sets.push({ reps, weight, done: false });
    }
    return entry;
  }

  function entryFromItem(it) {
    const prev = lastEntryFor(it.name);
    if (it.mode === 'cardio') {
      const base = prev && prev.mode === 'cardio' ? prev : it;
      return { id: uid(), name: it.name, mode: 'cardio', dist: base.dist || 0, time: base.time || 0, done: false };
    }
    if (prev && prev.mode === 'forca' && prev.sets.length) {
      return { id: uid(), name: it.name, mode: 'forca', timed: !!prev.timed, sets: prev.sets.map(st => ({ reps: st.reps || 0, weight: st.weight || 0, done: false })) };
    }
    const sets = [];
    for (let i = 0; i < (it.sets || 3); i++) sets.push({ reps: it.reps || 0, weight: it.weight || 0, done: false });
    return { id: uid(), name: it.name, mode: 'forca', sets };
  }

  function openWorkout() {
    renderWorkout();
    $('#overlay-workout').classList.remove('hidden');
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }

  function closeWorkout() {
    $('#overlay-workout').classList.add('hidden');
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    stopRest();
  }

  /* ---- Compte enrere únic: descans entre sèries, planxa, escalfament ----
     Un sol temporitzador actiu al pastilló #restPill, amb pausa, +30 s i aturar. */

  let cd = null;   // { kind: 'rest'|'hold'|'warm', label, endsAt, remainingMs, paused, onDone, lastTick }
  let cdTicker = null, cdHideTimeout = null;

  function fmtSecs(total) {
    const m = Math.floor(total / 60), s = total % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function startCountdown(opts) {
    if (!opts.secs || opts.secs <= 0) return;
    clearTimeout(cdHideTimeout);
    cd = { kind: opts.kind, label: opts.label, endsAt: Date.now() + opts.secs * 1000, remainingMs: 0, paused: false, onDone: opts.onDone || null, lastTick: null };
    $('#restPill').classList.remove('hidden', 'finished', 'paused');
    $('#restPause').textContent = '⏸';
    if (!cdTicker) cdTicker = setInterval(tickCountdown, 250);
    tickCountdown();
  }

  function cdText(left) {
    // Etiqueta curta perquè càpiga al mòbil: sense parèntesis i màxim 16 caràcters
    let label = String(cd.label || '').replace(/\s*\(.*?\)/g, '').trim();
    if (label.length > 16) label = label.slice(0, 15) + '…';
    // El temps sempre primer: si cal retallar, es retalla el nom
    return cd.kind === 'rest' ? `Descans ${fmtSecs(left)} · ${label}` : `${fmtSecs(left)} · ${label}`;
  }

  function tickCountdown() {
    if (!cd || cd.paused) return;
    const left = Math.ceil((cd.endsAt - Date.now()) / 1000);
    if (left <= 0) {
      const done = cd;
      clearInterval(cdTicker); cdTicker = null; cd = null;
      $('#restTime').textContent = done.kind === 'rest' ? 'Descans acabat! 💥' : 'Temps! 💥';
      $('#restPill').classList.add('finished');
      beep();
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      cdHideTimeout = setTimeout(() => $('#restPill').classList.add('hidden'), 4000);
      if (done.onDone) done.onDone();
      return;
    }
    // Als exercicis de temps, bip curt als últims 3 segons
    if (cd.kind !== 'rest' && left <= 3 && cd.lastTick !== left) { cd.lastTick = left; beep(true); }
    $('#restTime').textContent = cdText(left);
  }

  function pauseCountdown() {
    if (!cd || cd.paused) return;
    cd.paused = true;
    cd.remainingMs = Math.max(0, cd.endsAt - Date.now());
    $('#restPill').classList.add('paused');
    $('#restPause').textContent = '▶';
  }

  function resumeCountdown() {
    if (!cd || !cd.paused) return;
    cd.paused = false;
    cd.endsAt = Date.now() + cd.remainingMs;
    $('#restPill').classList.remove('paused');
    $('#restPause').textContent = '⏸';
    tickCountdown();
  }

  function addCountdown(secs) {
    if (!cd) return;
    if (cd.paused) {
      cd.remainingMs += secs * 1000;
      $('#restTime').textContent = cdText(Math.ceil(cd.remainingMs / 1000));
    } else {
      cd.endsAt += secs * 1000;
      tickCountdown();
    }
  }

  function stopCountdown() {
    clearInterval(cdTicker); cdTicker = null; cd = null;
    clearTimeout(cdHideTimeout);
    const pill = $('#restPill');
    if (pill) pill.classList.add('hidden');
  }

  // Descans després d'una sèrie: el propi de l'exercici, o el global per a rutines pròpies
  function startRest(entry) {
    const secs = (entry && entry.rest) || data.settings.restSecs || 0;
    startCountdown({ kind: 'rest', label: entry ? entry.name : 'Descans', secs });
  }

  function stopRest() { stopCountdown(); }

  function beep(short) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      (short ? [0] : [0, 0.25]).forEach(delay => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);
        osc.start(ctx.currentTime + delay); osc.stop(ctx.currentTime + delay + 0.2);
      });
      setTimeout(() => ctx.close(), 800);
    } catch (e) { /* sense àudio no passa res */ }
  }

  // Temps real de sessió: descomptant les pauses
  function elapsedMs() {
    if (!draft) return 0;
    const now = Date.now();
    return now - draft.start - (draft.pausedMs || 0) - (draft.pausedAt ? now - draft.pausedAt : 0);
  }

  function toggleSessionPause() {
    if (!draft) return;
    if (draft.pausedAt) {
      draft.pausedMs = (draft.pausedMs || 0) + (Date.now() - draft.pausedAt);
      draft.pausedAt = null;
      resumeCountdown();
    } else {
      draft.pausedAt = Date.now();
      pauseCountdown();
    }
    saveDraft();
    const b = $('#btnPauseSession');
    if (b) b.textContent = draft.pausedAt ? '▶' : '⏸';
    updateTimer();
  }

  function updateTimer() {
    const t = $('#wTimer');
    if (!t || !draft) return;
    const s = Math.floor(elapsedMs() / 1000);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    t.textContent = (h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}` : `${m}:${String(ss).padStart(2, '0')}`) + (draft.pausedAt ? ' ⏸' : '');
  }

  function checklistHtml(items, states, attr) {
    return items.map((it, i) => `<div class="check-row" data-${attr}="${i}">
      <span class="opt-check ${states[i] ? 'on' : ''}">${states[i] ? '✓' : ''}</span>
      <div class="grow"><div class="${states[i] ? 'muted' : ''}">${esc(it.name)}${videosFor(it.name).length ? ` <span class="info-btn" data-${attr}info="${i}">ⓘ</span>` : ''}</div><div class="muted" style="font-size:0.78rem">${esc(it.detail)}</div></div>
      ${it.secs ? `<button class="btn tiny" data-${attr}play="${i}">▶ ${fmtSecs(it.secs)}</button>` : ''}
    </div>`).join('');
  }

  function renderWorkout() {
    const o = $('#overlay-workout');
    if (!draft) return;

    let html = `<div class="sheet">
      <div class="spread"><h2 style="font-size:1.15rem">${esc(draft.routineName || 'Entrenament lliure')}</h2>
        <span class="row" style="gap:6px"><span class="timer" id="wTimer">0:00</span><button class="btn tiny" id="btnPauseSession" title="Pausar el cronòmetre">${draft.pausedAt ? '▶' : '⏸'}</button></span></div>
      <p class="muted">${fmtDate(draft.date)}${draft.program && isDeload() ? ' · setmana de descàrrega' : ''}</p>`;

    if (draft.warmup) {
      html += `<div class="card"><h3 style="margin-bottom:6px">🔥 Escalfament</h3>${checklistHtml(P.warmup, draft.warmup, 'wu')}</div>`;
    }

    draft.entries.forEach((e, i) => {
      const prev = e.exKey ? lastEntryByKey(e.exKey) : lastEntryFor(e.name);
      const prevTxt = prev ? perfLabel(prev) : '';
      html += `<div class="card">
        <div class="spread" style="margin-bottom:4px">
          <h3>${esc(e.name)}${e.exKey ? ` <span class="info-btn" data-info="${e.exKey}">ⓘ</span>` : ''}</h3>
          <div class="row">
            <span class="chip ${e.mode === 'cardio' ? 'cardio' : ''}">${e.mode === 'cardio' ? 'Cardio' : e.timed ? 'Temps' : 'Força'}</span>
            <button class="btn small danger" data-rmex="${i}">✕</button>
          </div>
        </div>
        ${e.variant ? `<p class="muted" style="font-size:0.8rem">${esc(e.variant)}</p>` : ''}
        ${e.target ? `<p class="target-line">🎯 ${esc(e.target)}${e.rest ? ` · descans ${e.rest} s` : ''}${prevTxt ? ` <span class="muted">· últim cop: ${esc(prevTxt)}</span>` : ''}</p>`
          : (prevTxt ? `<p class="muted" style="font-size:0.78rem;margin-bottom:6px">Últim cop: ${esc(prevTxt)}</p>` : '')}`;

      if (e.mode === 'cardio') {
        html += `<div class="row">
          <label class="field grow"><span>Distància (km)</span><input type="number" step="0.1" min="0" inputmode="decimal" data-c="dist" data-i="${i}" value="${e.dist || ''}"></label>
          <label class="field grow"><span>Temps (min)</span><input type="number" step="1" min="0" inputmode="numeric" data-c="time" data-i="${i}" value="${e.time || ''}"></label>
          <button class="check ${e.done ? 'on' : ''}" data-cdone="${i}" style="margin-top:18px">✓</button>
        </div>`;
      } else {
        html += `<div class="set-head ${e.timed ? 'timed' : ''}"><span></span><span>${e.timed ? 'Segons' : 'Reps'}</span><span>${e.timed ? '' : 'Pes (kg)'}</span><span></span></div>`;
        e.sets.forEach((st, j) => {
          html += `<div class="set-row ${st.done ? 'done' : ''} ${e.timed ? 'timed' : ''}">
            <span class="set-num">${j + 1}</span>
            <input type="number" step="1" min="0" inputmode="numeric" data-s="reps" data-i="${i}" data-j="${j}" value="${st.reps || ''}">
            ${e.timed ? `<button class="btn tiny" data-hold="${i}-${j}" title="Compte enrere">▶</button>` : `<input type="number" step="0.5" min="0" inputmode="decimal" data-s="weight" data-i="${i}" data-j="${j}" value="${st.weight || ''}">`}
            <button class="check ${st.done ? 'on' : ''}" data-sdone="${i}-${j}">✓</button>
          </div>`;
        });
        html += `<div class="row" style="margin-top:8px">
          <button class="btn small" data-addset="${i}">＋ Sèrie</button>
          ${e.sets.length > 1 ? `<button class="btn small" data-rmset="${i}">− Sèrie</button>` : ''}
        </div>`;
      }
      html += `</div>`;
    });

    if (draft.cooldown) {
      html += `<div class="card"><h3 style="margin-bottom:6px">🧘 Refredament i postura</h3>${checklistHtml(P.cooldown, draft.cooldown, 'cd')}</div>`;
    }

    html += `<div class="card">
      <h3 style="margin-bottom:8px">Afegir exercici</h3>
      <div class="row">
        <input type="text" id="wNewName" class="grow" placeholder="Nom de l'exercici" list="exNames">
        <select id="wNewMode" style="width:110px"><option value="forca">Força</option><option value="cardio">Cardio</option></select>
        <button class="btn small primary" id="btnWAdd">＋</button>
      </div>
    </div></div>
    <div class="overlay-footer">
      <button class="btn danger" id="btnDiscard">Descartar</button>
      <button class="btn primary" id="btnFinish">✅ Acabar i desar</button>
    </div>`;

    o.innerHTML = html;
    updateTimer();

    o.querySelectorAll('[data-wu]').forEach(el => el.onclick = ev => { if (ev.target.closest('[data-wuplay],[data-wuinfo]')) return; draft.warmup[Number(el.dataset.wu)] = !draft.warmup[Number(el.dataset.wu)]; saveDraft(); renderWorkout(); });
    o.querySelectorAll('[data-cd]').forEach(el => el.onclick = ev => { if (ev.target.closest('[data-cdplay],[data-cdinfo]')) return; draft.cooldown[Number(el.dataset.cd)] = !draft.cooldown[Number(el.dataset.cd)]; saveDraft(); renderWorkout(); });
    o.querySelectorAll('[data-wuinfo]').forEach(b => b.onclick = () => showItemInfo(P.warmup[Number(b.dataset.wuinfo)]));
    o.querySelectorAll('[data-cdinfo]').forEach(b => b.onclick = () => showItemInfo(P.cooldown[Number(b.dataset.cdinfo)]));
    // ▶ als ítems d'escalfament/refredament amb durada: en acabar es marquen sols
    o.querySelectorAll('[data-wuplay]').forEach(b => b.onclick = () => {
      const i = Number(b.dataset.wuplay), it = P.warmup[i];
      startCountdown({ kind: 'warm', label: it.name, secs: it.secs, onDone: () => { if (draft && draft.warmup) { draft.warmup[i] = true; saveDraft(); renderWorkout(); } } });
    });
    o.querySelectorAll('[data-cdplay]').forEach(b => b.onclick = () => {
      const i = Number(b.dataset.cdplay), it = P.cooldown[i];
      startCountdown({ kind: 'warm', label: it.name, secs: it.secs, onDone: () => { if (draft && draft.cooldown) { draft.cooldown[i] = true; saveDraft(); renderWorkout(); } } });
    });
    // ▶ a les sèries de temps (planxa): en acabar, sèrie feta + descans
    o.querySelectorAll('[data-hold]').forEach(b => b.onclick = () => {
      const [i, j] = b.dataset.hold.split('-').map(Number);
      const e = draft.entries[i];
      startCountdown({ kind: 'hold', label: e.name, secs: e.sets[j].reps || 0, onDone: () => {
        if (!draft || !draft.entries[i]) return;
        draft.entries[i].sets[j].done = true;
        saveDraft(); renderWorkout();
        startRest(draft.entries[i]);
      } });
    });
    if ($('#btnPauseSession')) $('#btnPauseSession').onclick = toggleSessionPause;
    o.querySelectorAll('[data-info]').forEach(el => el.onclick = () => showExerciseInfo(el.dataset.info));
    o.querySelectorAll('[data-s]').forEach(inp => {
      inp.oninput = () => {
        const e = draft.entries[Number(inp.dataset.i)];
        e.sets[Number(inp.dataset.j)][inp.dataset.s] = num(inp.value);
        saveDraft();
      };
    });
    o.querySelectorAll('[data-c]').forEach(inp => {
      inp.oninput = () => { draft.entries[Number(inp.dataset.i)][inp.dataset.c] = num(inp.value); saveDraft(); };
    });
    o.querySelectorAll('[data-sdone]').forEach(b => {
      b.onclick = () => {
        const [i, j] = b.dataset.sdone.split('-').map(Number);
        const st = draft.entries[i].sets[j];
        st.done = !st.done;
        b.classList.toggle('on', st.done);
        b.closest('.set-row').classList.toggle('done', st.done);
        saveDraft();
        if (st.done) startRest(draft.entries[i]); else stopRest();
      };
    });
    o.querySelectorAll('[data-cdone]').forEach(b => {
      b.onclick = () => { const e = draft.entries[Number(b.dataset.cdone)]; e.done = !e.done; b.classList.toggle('on', e.done); saveDraft(); };
    });
    o.querySelectorAll('[data-addset]').forEach(b => {
      b.onclick = () => {
        const e = draft.entries[Number(b.dataset.addset)];
        const lastSet = e.sets[e.sets.length - 1];
        e.sets.push({ reps: lastSet ? lastSet.reps : 0, weight: lastSet ? lastSet.weight : 0, done: false });
        saveDraft(); renderWorkout();
      };
    });
    o.querySelectorAll('[data-rmset]').forEach(b => b.onclick = () => { draft.entries[Number(b.dataset.rmset)].sets.pop(); saveDraft(); renderWorkout(); });
    o.querySelectorAll('[data-rmex]').forEach(b => b.onclick = () => { draft.entries.splice(Number(b.dataset.rmex), 1); saveDraft(); renderWorkout(); });
    $('#btnWAdd').onclick = () => {
      const name = $('#wNewName').value.trim();
      if (!name) return;
      draft.entries.push(entryFromItem({ name, mode: $('#wNewMode').value, sets: 3, reps: 0, weight: 0, dist: 0, time: 0 }));
      saveDraft(); renderWorkout();
    };
    $('#btnDiscard').onclick = () => {
      if (!confirm('Descartar aquest entrenament? Es perdrà el que has apuntat.')) return;
      draft = null; saveDraft(); closeWorkout(); render();
    };
    $('#btnFinish').onclick = finishWorkout;
  }

  function applyProgression(entries, key) {
    const lines = [];
    for (const item of P.workouts[key].items) {
      const e = entries.find(x => x.exKey === item.ex);
      if (!e) continue;
      const ex = P.exercises[item.ex];
      const st = exState(item.ex);
      const need = itemSets(item);
      const top = ex.kind === 'time' ? st.secs : item.reps[1];
      const ok = e.sets.length >= need && e.sets.every(s => s.reps >= top);
      if (!ok) continue;
      if (ex.kind === 'load') {
        data.program.loads[item.ex] = st.load + ex.step;
        lines.push(`${ex.name}: ${st.load} → ${st.load + ex.step} kg`);
      } else if (ex.kind === 'time') {
        if (st.secs < 60) { data.program.loads[item.ex] = st.secs + ex.step; lines.push(`${ex.name}: ${st.secs} → ${st.secs + ex.step} s`); }
      } else if (st.level < ex.levels.length - 1) {
        data.program.levels[item.ex] = st.level + 1;
        lines.push(`${ex.name} → nivell ${st.level + 2}: ${ex.levels[st.level + 1]}`);
      }
    }
    data.program.nextWorkout = key === 'A' ? 'B' : 'A';
    data.program.lastSummary = { date: todayISO(), workout: key, lines };
  }

  function finishWorkout() {
    const entries = [];
    for (const e of draft.entries) {
      if (e.mode === 'cardio') {
        if ((e.dist || 0) > 0 || (e.time || 0) > 0) entries.push({ id: e.id, name: e.name, mode: 'cardio', dist: e.dist || 0, time: e.time || 0 });
      } else {
        const sets = e.sets.filter(st => (st.reps || 0) > 0).map(st => ({ reps: st.reps || 0, weight: st.weight || 0 }));
        if (sets.length) {
          const out = { id: e.id, name: e.name, mode: 'forca', sets };
          if (e.exKey) out.exKey = e.exKey;
          if (e.timed) out.timed = true;
          if (e.variant) out.variant = e.variant;
          entries.push(out);
        }
      }
    }
    if (entries.length === 0) {
      if (!confirm('No has apuntat cap sèrie. Vols descartar l\'entrenament?')) return;
      draft = null; saveDraft(); closeWorkout(); render();
      return;
    }
    if (draft.pausedAt) { draft.pausedMs = (draft.pausedMs || 0) + (Date.now() - draft.pausedAt); draft.pausedAt = null; }
    const session = { id: draft.id, date: draft.date, start: draft.start, end: Date.now(), pausedMs: draft.pausedMs || 0, routineName: draft.routineName, entries };
    if (draft.program) {
      session.program = draft.program;
      applyProgression(entries, draft.program);
    }
    data.sessions.push(session);
    saveData();
    draft = null;
    saveDraft();
    closeWorkout();
    showView('avui');
  }

  /* ========== Ajustos i perfil ========== */

  function openSettings() {
    const pr = data.profile;
    $('#setAge').value = pr.age;
    $('#setHeight').value = pr.height;
    $('#setStartWeight').value = pr.startWeight;
    $('#setTargetWeight').value = pr.targetWeight;
    $('#setKcalOverride').value = pr.kcalOverride || '';
    $('#setProtOverride').value = pr.proteinOverride || '';
    $('#setRest').value = String(data.settings.restSecs);
    $('#modal-settings').classList.remove('hidden');
  }

  function setupSettings() {
    $('#btnSettings').onclick = openSettings;
    $('#btnCloseSettings').onclick = () => { $('#modal-settings').classList.add('hidden'); render(); };
    $('#modal-settings').onclick = e => { if (e.target === $('#modal-settings')) { $('#modal-settings').classList.add('hidden'); render(); } };

    const bind = (id, fn) => { $(id).onchange = e => { fn(e.target.value); saveData(); }; };
    bind('#setAge', v => { data.profile.age = num(v) || 22; });
    bind('#setHeight', v => { data.profile.height = num(v) || 179; });
    bind('#setStartWeight', v => { data.profile.startWeight = num(v) || 60; });
    bind('#setTargetWeight', v => { data.profile.targetWeight = num(v) || 70; });
    bind('#setKcalOverride', v => { data.profile.kcalOverride = num(v); });
    bind('#setProtOverride', v => { data.profile.proteinOverride = num(v); });
    bind('#setRest', v => { data.settings.restSecs = Number(v); });

    $('#btnResetProgram').onclick = () => {
      if (!confirm('Reiniciar el programa? Es posa la setmana a 1 i els pesos/nivells al punt de partida. Les sessions i el pes es conserven.')) return;
      data.profile.programStart = todayISO();
      data.program = { nextWorkout: 'A', levels: {}, loads: {}, restDone: {}, lastSummary: null };
      data.profile.kcalAdjust = 0; data.profile.lastAdjust = '';
      saveData(); $('#modal-settings').classList.add('hidden'); showView('avui');
    };

    $('#btnExport').onclick = () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `training-backup-${todayISO()}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    };

    $('#fileImport').onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const d = JSON.parse(reader.result);
          if (!d || !Array.isArray(d.routines) || !Array.isArray(d.sessions)) { alert('Aquest fitxer no sembla una còpia de seguretat vàlida.'); return; }
          if (!confirm(`Importar ${d.routines.length} rutines i ${d.sessions.length} sessions? Substituirà les dades actuals.`)) return;
          localStorage.setItem(STORE_KEY, JSON.stringify(d));
          data = loadData();
          $('#modal-settings').classList.add('hidden');
          render();
        } catch (err) { alert('No s\'ha pogut llegir el fitxer.'); }
      };
      reader.readAsText(file);
      e.target.value = '';
    };

    $('#btnWipe').onclick = () => {
      if (!confirm('Segur que vols esborrar TOTES les dades?')) return;
      if (!confirm('Última confirmació: sessions, pes, dieta i tot l\'històric s\'esborraran per sempre.')) return;
      data = defaultData();
      draft = null;
      saveData(); saveDraft();
      $('#modal-settings').classList.add('hidden');
      showView('avui');
    };
  }

  /* ========== Inici ========== */

  document.querySelectorAll('.tab').forEach(t => { t.onclick = () => showView(t.dataset.view); });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (currentView === 'progres') renderProgres(); }, 200);
  });

  $('#restPlus').onclick = () => addCountdown(30);
  $('#restStop').onclick = stopCountdown;
  $('#restPause').onclick = () => { if (!cd) return; if (cd.paused) resumeCountdown(); else pauseCountdown(); };

  setupSettings();
  showView('avui');

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW no registrat:', err));
  }
})();
