/* app.js — Gestió Training
   Tota la lògica de l'app. Les dades es guarden a localStorage del dispositiu. */

(function () {
  'use strict';

  /* ========== Emmagatzematge ========== */

  const STORE_KEY = 'gt-data-v1';   // dades permanents
  const ACTIVE_KEY = 'gt-active-v1'; // entrenament en curs (esborrany)

  function defaultData() {
    return {
      version: 1,
      routines: [],   // { id, name, items: [{id, name, mode, sets, reps, weight, dist, time}] }
      plan: { '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '0': '' },
      sessions: []    // { id, date, start, end, routineName, entries: [...] }
    };
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultData();
      const d = JSON.parse(raw);
      if (!d || !Array.isArray(d.routines) || !Array.isArray(d.sessions)) return defaultData();
      d.plan = d.plan || defaultData().plan;
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
  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function parseISO(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function fmtDate(iso, opts) {
    const s = parseISO(iso).toLocaleDateString('ca-ES', opts || { weekday: 'long', day: 'numeric', month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function mondayOf(d) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const shift = (x.getDay() + 6) % 7; // dilluns=0 ... diumenge=6
    x.setDate(x.getDate() - shift);
    return x;
  }

  function isoOf(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  const DAY_ORDER = ['1', '2', '3', '4', '5', '6', '0']; // dilluns → diumenge
  const DAY_NAMES = { '1': 'Dilluns', '2': 'Dimarts', '3': 'Dimecres', '4': 'Dijous', '5': 'Divendres', '6': 'Dissabte', '0': 'Diumenge' };

  function routineById(id) {
    return data.routines.find(r => r.id === id) || null;
  }

  // Resum d'un exercici d'una rutina ("3×10 · 40 kg" / "5 km · 30 min")
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

  // Volum (kg aixecats) d'una sessió
  function sessionVolume(s) {
    let v = 0;
    for (const e of s.entries) {
      if (e.mode !== 'cardio' && Array.isArray(e.sets)) {
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

  /* ========== Navegació ========== */

  const VIEW_TITLES = { avui: 'Avui', pla: 'Pla setmanal', rutines: 'Rutines', historial: 'Històric', progres: 'Progrés' };

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
    if (currentView === 'pla') renderPla();
    if (currentView === 'rutines') renderRutines();
    if (currentView === 'historial') renderHistorial();
    if (currentView === 'progres') renderProgres();
  }

  /* ========== Vista: Avui ========== */

  function renderAvui() {
    const v = $('#view-avui');
    const today = todayISO();
    const dow = String(new Date().getDay());
    const planned = routineById(data.plan[dow]);
    const weekStart = mondayOf(new Date());
    const doneDays = new Set(data.sessions.map(s => s.date));

    // Punts de la setmana (dl → dg)
    let weekDots = '';
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const iso = isoOf(d);
      const trained = doneDays.has(iso);
      const isToday = iso === today;
      weekDots += `<div style="text-align:center; flex:1">
        <div class="muted" style="font-size:0.68rem">${'DlDtDcDjDvDsDg'.slice(i * 2, i * 2 + 2)}</div>
        <div style="width:26px;height:26px;line-height:26px;border-radius:50%;margin:3px auto 0;
          font-size:0.8rem; ${trained
            ? 'background:var(--good-bg);color:var(--good);font-weight:700'
            : 'background:var(--page);border:1px solid ' + (isToday ? 'var(--accent)' : 'var(--border)')}">${trained ? '✓' : ''}</div>
      </div>`;
    }

    let html = `<p class="muted" style="font-size:1rem">${fmtDate(today)}</p>`;

    if (draft) {
      html += `<div class="card" style="border-color: var(--accent)">
        <h2>⏱️ Entrenament en curs</h2>
        <p class="muted">${esc(draft.routineName || 'Entrenament lliure')} — no l'has acabat.</p>
        <div class="stack" style="margin-bottom:0">
          <button class="btn primary" id="btnResume">Continuar entrenament</button>
        </div>
      </div>`;
    } else if (planned) {
      html += `<div class="card">
        <h2>${esc(planned.name)}</h2>
        ${planned.items.map(it => `<div class="ex-line">• ${esc(it.name)} <span class="muted">${itemSummary(it)}</span></div>`).join('')}
        <div class="stack" style="margin-bottom:0">
          <button class="btn primary" id="btnStartPlanned">▶️ Començar entrenament</button>
        </div>
      </div>`;
    } else {
      html += `<div class="card empty">
        <span class="big">😌</span>
        Avui no tens cap rutina planificada.
        <p class="muted" style="margin-top:4px">Assigna rutines als dies a la pestanya <b>Pla</b>.</p>
      </div>`;
    }

    if (!draft) {
      html += `<button class="btn ghost full" id="btnFreeWorkout">＋ Entrenament lliure</button>`;
    }

    html += `<div class="card"><h2>Aquesta setmana</h2><div class="row">${weekDots}</div></div>`;

    const last = [...data.sessions].sort((a, b) => b.date.localeCompare(a.date) || (b.start || 0) - (a.start || 0))[0];
    if (last) {
      const vol = sessionVolume(last);
      const km = sessionKm(last);
      const bits = [nExercicis(last.entries.length)];
      if (vol) bits.push(`${fmt(vol)} kg de volum`);
      if (km) bits.push(`${fmt(km)} km`);
      html += `<div class="card">
        <h2>Últim entrenament</h2>
        <div class="spread">
          <div>
            <h3>${esc(last.routineName || 'Entrenament lliure')}</h3>
            <p class="session-summary">${fmtDate(last.date, { day: 'numeric', month: 'short' })} · ${bits.join(' · ')}</p>
          </div>
        </div>
      </div>`;
    }

    v.innerHTML = html;

    if ($('#btnResume')) $('#btnResume').onclick = openWorkout;
    if ($('#btnStartPlanned')) $('#btnStartPlanned').onclick = () => startWorkout(planned);
    if ($('#btnFreeWorkout')) $('#btnFreeWorkout').onclick = () => startWorkout(null);
  }

  /* ========== Vista: Pla setmanal ========== */

  function renderPla() {
    const v = $('#view-pla');
    const todayDow = String(new Date().getDay());
    const opts = r => `<option value="">— Descans —</option>` +
      data.routines.map(x => `<option value="${x.id}" ${data.plan[r] === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('');

    let html = `<div class="card">`;
    for (const d of DAY_ORDER) {
      html += `<div class="day-row ${d === todayDow ? 'today' : ''}">
        <span class="day-name">${DAY_NAMES[d]}</span>
        <select data-day="${d}">${opts(d)}</select>
      </div>`;
    }
    html += `</div>`;
    if (data.routines.length === 0) {
      html += `<p class="muted" style="text-align:center">Primer crea alguna rutina a la pestanya <b>Rutines</b> per poder-la assignar.</p>`;
    }
    v.innerHTML = html;

    v.querySelectorAll('select[data-day]').forEach(sel => {
      sel.onchange = () => {
        data.plan[sel.dataset.day] = sel.value;
        saveData();
      };
    });
  }

  /* ========== Vista: Rutines ========== */

  function renderRutines() {
    const v = $('#view-rutines');
    let html = `<button class="btn primary full" id="btnNewRoutine">＋ Nova rutina</button>`;

    if (data.routines.length === 0) {
      html += `<div class="card empty">
        <span class="big">📋</span>
        Encara no tens cap rutina.
        <div class="stack"><button class="btn" id="btnSample">Crear una rutina d'exemple</button></div>
      </div>`;
    }

    for (const r of data.routines) {
      html += `<div class="card routine-card">
        <div class="spread">
          <h2 style="margin-bottom:4px">${esc(r.name)}</h2>
          <span class="chip">${nExercicis(r.items.length)}</span>
        </div>
        ${r.items.map(it => `<div class="ex-line">• ${esc(it.name)} <span class="muted">${itemSummary(it)}</span></div>`).join('')}
        <div class="row" style="margin-top:10px">
          <button class="btn small" data-edit="${r.id}">✏️ Edita</button>
          <button class="btn small" data-dup="${r.id}">📄 Duplica</button>
          <button class="btn small danger" data-del="${r.id}">Elimina</button>
        </div>
      </div>`;
    }
    v.innerHTML = html;

    $('#btnNewRoutine').onclick = () => openRoutineEditor(null);
    if ($('#btnSample')) $('#btnSample').onclick = createSampleRoutine;
    v.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => openRoutineEditor(routineById(b.dataset.edit)));
    v.querySelectorAll('[data-dup]').forEach(b => b.onclick = () => {
      const r = routineById(b.dataset.dup);
      const copy = JSON.parse(JSON.stringify(r));
      copy.id = uid();
      copy.name = r.name + ' (còpia)';
      copy.items.forEach(it => it.id = uid());
      data.routines.push(copy);
      saveData();
      render();
    });
    v.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      const r = routineById(b.dataset.del);
      if (!confirm(`Eliminar la rutina "${r.name}"? Les sessions ja registrades no es toquen.`)) return;
      data.routines = data.routines.filter(x => x.id !== r.id);
      for (const d in data.plan) if (data.plan[d] === r.id) data.plan[d] = '';
      saveData();
      render();
    });
  }

  function createSampleRoutine() {
    data.routines.push({
      id: uid(),
      name: 'Full Body (exemple)',
      items: [
        { id: uid(), name: 'Esquat', mode: 'forca', sets: 3, reps: 8, weight: 40 },
        { id: uid(), name: 'Press banca', mode: 'forca', sets: 3, reps: 8, weight: 30 },
        { id: uid(), name: 'Rem amb barra', mode: 'forca', sets: 3, reps: 10, weight: 25 },
        { id: uid(), name: 'Dominades', mode: 'forca', sets: 3, reps: 6, weight: 0 },
        { id: uid(), name: 'Cinta de córrer', mode: 'cardio', dist: 2, time: 12 }
      ]
    });
    saveData();
    render();
  }

  /* ========== Editor de rutines ========== */

  function openRoutineEditor(routine) {
    editingRoutine = routine
      ? JSON.parse(JSON.stringify(routine))
      : { id: uid(), name: '', items: [] };
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
        <label class="field grow"><span>Distància (km)</span>
          <input type="number" step="0.1" min="0" inputmode="decimal" data-f="dist" value="${it.dist || ''}"></label>
        <label class="field grow"><span>Temps (min)</span>
          <input type="number" step="1" min="0" inputmode="numeric" data-f="time" value="${it.time || ''}"></label>
      </div>`;
    }
    return `<div class="row">
      <label class="field grow"><span>Sèries</span>
        <input type="number" step="1" min="1" inputmode="numeric" data-f="sets" value="${it.sets || ''}"></label>
      <label class="field grow"><span>Reps</span>
        <input type="number" step="1" min="1" inputmode="numeric" data-f="reps" value="${it.reps || ''}"></label>
      <label class="field grow"><span>Pes (kg)</span>
        <input type="number" step="0.5" min="0" inputmode="decimal" data-f="weight" value="${it.weight || ''}"></label>
    </div>`;
  }

  function renderRoutineEditor() {
    const o = $('#overlay-routine');
    const r = editingRoutine;
    let html = `<div class="sheet">
      <h2 style="font-size:1.15rem">${routineById(r.id) ? 'Editar rutina' : 'Nova rutina'}</h2>
      <label class="field"><span>Nom de la rutina</span>
        <input type="text" id="rName" placeholder="Ex: Push, Cames, Cardio suau…" value="${esc(r.name)}"></label>`;

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
        <div class="stack" style="margin:0 0 8px">
          <div class="row">
            <input type="text" class="grow" placeholder="Nom de l'exercici" list="exNames" data-f="name" data-i="${i}" value="${esc(it.name)}">
            <select data-f="mode" data-i="${i}" style="width:110px">
              <option value="forca" ${it.mode !== 'cardio' ? 'selected' : ''}>Força</option>
              <option value="cardio" ${it.mode === 'cardio' ? 'selected' : ''}>Cardio</option>
            </select>
          </div>
        </div>
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
      if (inp.id === 'rName') return;
      const i = Number(inp.dataset.i ?? inp.closest('[data-fields]')?.dataset.fields);
      const f = inp.dataset.f;
      if (f === 'mode') {
        inp.onchange = () => {
          r.items[i].mode = inp.value;
          renderRoutineEditor();
        };
      } else if (f === 'name') {
        inp.oninput = () => { r.items[i].name = inp.value; };
      } else {
        inp.oninput = () => { r.items[i][f] = num(inp.value); };
      }
    });

    o.querySelectorAll('[data-up]').forEach(b => b.onclick = () => {
      const i = Number(b.dataset.up);
      [r.items[i - 1], r.items[i]] = [r.items[i], r.items[i - 1]];
      renderRoutineEditor();
    });
    o.querySelectorAll('[data-down]').forEach(b => b.onclick = () => {
      const i = Number(b.dataset.down);
      [r.items[i + 1], r.items[i]] = [r.items[i], r.items[i + 1]];
      renderRoutineEditor();
    });
    o.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => {
      r.items.splice(Number(b.dataset.rm), 1);
      renderRoutineEditor();
    });

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
      if (idx >= 0) data.routines[idx] = r;
      else data.routines.push(r);
      saveData();
      closeRoutineEditor();
      render();
    };
  }

  /* ========== Entrenament actiu ========== */

  function startWorkout(routine) {
    draft = {
      id: uid(),
      date: todayISO(),
      start: Date.now(),
      routineName: routine ? routine.name : null,
      entries: routine ? routine.items.map(it => entryFromItem(it)) : []
    };
    saveDraft();
    openWorkout();
  }

  function entryFromItem(it) {
    if (it.mode === 'cardio') {
      return { id: uid(), name: it.name, mode: 'cardio', dist: it.dist || 0, time: it.time || 0, done: false };
    }
    const sets = [];
    for (let i = 0; i < (it.sets || 3); i++) {
      sets.push({ reps: it.reps || 0, weight: it.weight || 0, done: false });
    }
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
  }

  function updateTimer() {
    const t = $('#wTimer');
    if (!t || !draft) return;
    const s = Math.floor((Date.now() - draft.start) / 1000);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    t.textContent = h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
      : `${m}:${String(ss).padStart(2, '0')}`;
  }

  function renderWorkout() {
    const o = $('#overlay-workout');
    if (!draft) return;

    let html = `<div class="sheet">
      <div class="spread">
        <h2 style="font-size:1.15rem">${esc(draft.routineName || 'Entrenament lliure')}</h2>
        <span class="timer" id="wTimer">0:00</span>
      </div>
      <p class="muted">${fmtDate(draft.date)}</p>`;

    draft.entries.forEach((e, i) => {
      html += `<div class="card">
        <div class="spread" style="margin-bottom:6px">
          <h3>${esc(e.name)}</h3>
          <div class="row">
            <span class="chip ${e.mode === 'cardio' ? 'cardio' : ''}">${e.mode === 'cardio' ? 'Cardio' : 'Força'}</span>
            <button class="btn small danger" data-rmex="${i}">✕</button>
          </div>
        </div>`;

      if (e.mode === 'cardio') {
        html += `<div class="row">
          <label class="field grow"><span>Distància (km)</span>
            <input type="number" step="0.1" min="0" inputmode="decimal" data-c="dist" data-i="${i}" value="${e.dist || ''}"></label>
          <label class="field grow"><span>Temps (min)</span>
            <input type="number" step="1" min="0" inputmode="numeric" data-c="time" data-i="${i}" value="${e.time || ''}"></label>
          <button class="check ${e.done ? 'on' : ''}" data-cdone="${i}" style="margin-top:18px">✓</button>
        </div>`;
      } else {
        html += `<div class="set-head"><span></span><span>Reps</span><span>Pes (kg)</span><span></span></div>`;
        e.sets.forEach((st, j) => {
          html += `<div class="set-row ${st.done ? 'done' : ''}">
            <span class="set-num">${j + 1}</span>
            <input type="number" step="1" min="0" inputmode="numeric" data-s="reps" data-i="${i}" data-j="${j}" value="${st.reps || ''}">
            <input type="number" step="0.5" min="0" inputmode="decimal" data-s="weight" data-i="${i}" data-j="${j}" value="${st.weight || ''}">
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

    html += `<div class="card">
      <h3 style="margin-bottom:8px">Afegir exercici</h3>
      <div class="row">
        <input type="text" id="wNewName" class="grow" placeholder="Nom de l'exercici" list="exNames">
        <select id="wNewMode" style="width:110px">
          <option value="forca">Força</option>
          <option value="cardio">Cardio</option>
        </select>
        <button class="btn small primary" id="btnWAdd">＋</button>
      </div>
    </div></div>
    <div class="overlay-footer">
      <button class="btn danger" id="btnDiscard">Descartar</button>
      <button class="btn primary" id="btnFinish">✅ Acabar i desar</button>
    </div>`;

    o.innerHTML = html;
    updateTimer();

    // Inputs de sèries (força)
    o.querySelectorAll('[data-s]').forEach(inp => {
      inp.oninput = () => {
        const e = draft.entries[Number(inp.dataset.i)];
        e.sets[Number(inp.dataset.j)][inp.dataset.s] = num(inp.value);
        saveDraft();
      };
    });
    // Inputs cardio
    o.querySelectorAll('[data-c]').forEach(inp => {
      inp.oninput = () => {
        draft.entries[Number(inp.dataset.i)][inp.dataset.c] = num(inp.value);
        saveDraft();
      };
    });
    // Marcar sèrie feta
    o.querySelectorAll('[data-sdone]').forEach(b => {
      b.onclick = () => {
        const [i, j] = b.dataset.sdone.split('-').map(Number);
        const st = draft.entries[i].sets[j];
        st.done = !st.done;
        b.classList.toggle('on', st.done);
        b.closest('.set-row').classList.toggle('done', st.done);
        saveDraft();
      };
    });
    o.querySelectorAll('[data-cdone]').forEach(b => {
      b.onclick = () => {
        const e = draft.entries[Number(b.dataset.cdone)];
        e.done = !e.done;
        b.classList.toggle('on', e.done);
        saveDraft();
      };
    });
    // Afegir / treure sèries i exercicis
    o.querySelectorAll('[data-addset]').forEach(b => {
      b.onclick = () => {
        const e = draft.entries[Number(b.dataset.addset)];
        const lastSet = e.sets[e.sets.length - 1];
        e.sets.push({ reps: lastSet ? lastSet.reps : 0, weight: lastSet ? lastSet.weight : 0, done: false });
        saveDraft();
        renderWorkout();
      };
    });
    o.querySelectorAll('[data-rmset]').forEach(b => {
      b.onclick = () => {
        draft.entries[Number(b.dataset.rmset)].sets.pop();
        saveDraft();
        renderWorkout();
      };
    });
    o.querySelectorAll('[data-rmex]').forEach(b => {
      b.onclick = () => {
        draft.entries.splice(Number(b.dataset.rmex), 1);
        saveDraft();
        renderWorkout();
      };
    });
    $('#btnWAdd').onclick = () => {
      const name = $('#wNewName').value.trim();
      if (!name) return;
      const mode = $('#wNewMode').value;
      draft.entries.push(entryFromItem({ name, mode, sets: 3, reps: 0, weight: 0, dist: 0, time: 0 }));
      saveDraft();
      renderWorkout();
    };

    $('#btnDiscard').onclick = () => {
      if (!confirm('Descartar aquest entrenament? Es perdrà el que has apuntat.')) return;
      draft = null;
      saveDraft();
      closeWorkout();
      render();
    };
    $('#btnFinish').onclick = finishWorkout;
  }

  function finishWorkout() {
    // Neteja: només guardem sèries amb reps i exercicis amb contingut
    const entries = [];
    for (const e of draft.entries) {
      if (e.mode === 'cardio') {
        if ((e.dist || 0) > 0 || (e.time || 0) > 0) {
          entries.push({ id: e.id, name: e.name, mode: 'cardio', dist: e.dist || 0, time: e.time || 0 });
        }
      } else {
        const sets = e.sets.filter(st => (st.reps || 0) > 0)
          .map(st => ({ reps: st.reps || 0, weight: st.weight || 0 }));
        if (sets.length) entries.push({ id: e.id, name: e.name, mode: 'forca', sets });
      }
    }
    if (entries.length === 0) {
      if (!confirm('No has apuntat cap sèrie. Vols descartar l\'entrenament?')) return;
      draft = null;
      saveDraft();
      closeWorkout();
      render();
      return;
    }
    data.sessions.push({
      id: draft.id,
      date: draft.date,
      start: draft.start,
      end: Date.now(),
      routineName: draft.routineName,
      entries
    });
    saveData();
    draft = null;
    saveDraft();
    closeWorkout();
    showView('historial');
  }

  /* ========== Vista: Històric ========== */

  function renderHistorial() {
    const v = $('#view-historial');
    const sessions = [...data.sessions].sort((a, b) => b.date.localeCompare(a.date) || (b.start || 0) - (a.start || 0));

    if (sessions.length === 0) {
      v.innerHTML = `<div class="card empty"><span class="big">🕘</span>
        Encara no has registrat cap entrenament.<br>Quan n'acabis un, apareixerà aquí.</div>`;
      return;
    }

    let html = '';
    for (const s of sessions) {
      const vol = sessionVolume(s);
      const km = sessionKm(s);
      const bits = [nExercicis(s.entries.length)];
      if (vol) bits.push(`${fmt(vol)} kg`);
      if (km) bits.push(`${fmt(km)} km`);
      const dur = s.end && s.start ? Math.round((s.end - s.start) / 60000) : null;
      if (dur) bits.push(`${dur} min`);

      html += `<div class="card" data-sess="${s.id}" style="cursor:pointer">
        <div class="spread">
          <div>
            <h3>${esc(s.routineName || 'Entrenament lliure')}</h3>
            <p class="session-summary">${fmtDate(s.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · ${bits.join(' · ')}</p>
          </div>
          <span class="muted">▾</span>
        </div>
        <div class="session-detail hidden">
          ${s.entries.map(e => {
            if (e.mode === 'cardio') {
              return `<div class="ex-line"><b>${esc(e.name)}</b><div class="ex-sets">${fmt(e.dist)} km · ${fmt(e.time)} min</div></div>`;
            }
            const setsTxt = e.sets.map(st => st.weight ? `${st.reps}×${fmt(st.weight)}kg` : `${st.reps} reps`).join(' · ');
            return `<div class="ex-line"><b>${esc(e.name)}</b><div class="ex-sets">${setsTxt}</div></div>`;
          }).join('')}
          <div class="row" style="margin-top:8px">
            <button class="btn small danger" data-delsess="${s.id}">Eliminar sessió</button>
          </div>
        </div>
      </div>`;
    }
    v.innerHTML = html;

    v.querySelectorAll('[data-sess]').forEach(card => {
      card.onclick = ev => {
        if (ev.target.closest('[data-delsess]')) return;
        card.querySelector('.session-detail').classList.toggle('hidden');
      };
    });
    v.querySelectorAll('[data-delsess]').forEach(b => {
      b.onclick = () => {
        if (!confirm('Eliminar aquesta sessió de l\'històric?')) return;
        data.sessions = data.sessions.filter(s => s.id !== b.dataset.delsess);
        saveData();
        render();
      };
    });
  }

  /* ========== Vista: Progrés ========== */

  // Mètrica d'un exercici en una sessió
  function exerciseMetric(name, s) {
    for (const e of s.entries) {
      if (e.name.toLowerCase() !== name.toLowerCase()) continue;
      if (e.mode === 'cardio') {
        return { kind: 'cardio', value: e.dist || 0, time: e.time || 0 };
      }
      const weights = e.sets.map(st => st.weight || 0);
      const maxW = Math.max(...weights, 0);
      if (maxW > 0) {
        const best = e.sets.filter(st => st.weight === maxW).sort((a, b) => b.reps - a.reps)[0];
        return { kind: 'pes', value: maxW, reps: best.reps };
      }
      const maxR = Math.max(...e.sets.map(st => st.reps || 0), 0);
      return { kind: 'reps', value: maxR };
    }
    return null;
  }

  function renderProgres() {
    const v = $('#view-progres');
    const sessions = [...data.sessions].sort((a, b) => a.date.localeCompare(b.date));

    if (sessions.length === 0) {
      v.innerHTML = `<div class="card empty"><span class="big">📈</span>
        Les gràfiques apareixeran quan registris entrenaments.</div>`;
      return;
    }

    // --- Estadístiques ràpides ---
    const now = new Date();
    const monthPrefix = todayISO().slice(0, 7);
    const monthCount = sessions.filter(s => s.date.startsWith(monthPrefix)).length;

    const weeksWith = new Set(sessions.map(s => isoOf(mondayOf(parseISO(s.date)))));
    let streak = 0;
    let cursor = mondayOf(now);
    if (!weeksWith.has(isoOf(cursor))) cursor.setDate(cursor.getDate() - 7);
    while (weeksWith.has(isoOf(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 7);
    }

    const sevenAgo = new Date(now);
    sevenAgo.setDate(sevenAgo.getDate() - 6);
    const vol7 = sessions.filter(s => parseISO(s.date) >= new Date(sevenAgo.getFullYear(), sevenAgo.getMonth(), sevenAgo.getDate()))
      .reduce((acc, s) => acc + sessionVolume(s), 0);

    // --- Llista d'exercicis registrats (per freqüència) ---
    const freq = new Map();
    for (const s of sessions) for (const e of s.entries) {
      const k = e.name.toLowerCase();
      freq.set(k, { name: e.name, count: (freq.get(k)?.count || 0) + 1 });
    }
    const exList = [...freq.values()].sort((a, b) => b.count - a.count);
    if (!renderProgres.selected || !freq.has(renderProgres.selected.toLowerCase())) {
      renderProgres.selected = exList[0]?.name || '';
    }

    let html = `<div class="tiles">
      <div class="tile"><div class="t-value">${monthCount}</div><div class="t-label">Aquest mes</div></div>
      <div class="tile"><div class="t-value">${streak}</div><div class="t-label">Setmanes seguides</div></div>
      <div class="tile"><div class="t-value">${vol7 >= 10000 ? fmt(Math.round(vol7 / 100) / 10) + 'K' : fmt(vol7)}</div><div class="t-label">kg últims 7 dies</div></div>
    </div>`;

    html += `<div class="card">
      <div class="spread">
        <h2 id="chartMetricTitle">Progrés</h2>
        <select id="exSelect" style="max-width:55%">
          ${exList.map(x => `<option value="${esc(x.name)}" ${x.name === renderProgres.selected ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}
        </select>
      </div>
      <div class="chart-wrap" id="chartLine"></div>
    </div>`;

    html += `<div class="card">
      <h2>Entrenaments per setmana</h2>
      <div class="chart-wrap" id="chartBars"></div>
    </div>`;

    // --- Rècords personals ---
    const prs = [];
    for (const x of exList.slice(0, 8)) {
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
      else txt = `${fmt(best.m.value)} km`;
      prs.push(`<div class="pr-line"><span>${esc(x.name)}</span>
        <span><span class="pr-val">${txt}</span> <span class="muted">${fmtDate(best.date, { day: 'numeric', month: 'short' })}</span></span></div>`);
    }
    if (prs.length) {
      html += `<div class="card"><h2>🏆 Rècords personals</h2>${prs.join('')}</div>`;
    }

    v.innerHTML = html;

    $('#exSelect').onchange = e => {
      renderProgres.selected = e.target.value;
      renderProgres();
    };

    drawLineChart(sessions);
    drawBarChart(sessions);
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
      else {
        const pace = m.time && m.value ? (m.time / m.value) : 0;
        sub = `${fmt(m.time)} min` + (pace ? ` · ${fmt(pace)} min/km` : '');
      }
      points.push({
        date: parseISO(s.date),
        y: m.value,
        title: `${fmt(m.value)} ${m.kind === 'cardio' ? 'km' : m.kind === 'pes' ? 'kg' : 'reps'} — ${fmtDate(s.date, { day: 'numeric', month: 'short' })}`,
        sub
      });
    }
    const unit = kind === 'cardio' ? 'km' : kind === 'pes' ? 'kg' : 'reps';
    const titleEl = $('#chartMetricTitle');
    if (titleEl) {
      titleEl.textContent = kind === 'cardio' ? 'Distància (km)' : kind === 'pes' ? 'Pes màxim (kg)' : 'Màx. repeticions';
    }
    const wrap = $('#chartLine');
    if (points.length === 0) {
      wrap.innerHTML = `<p class="muted" style="padding:16px 0">Sense dades encara per a aquest exercici.</p>`;
      return;
    }
    Charts.lineChart(wrap, points, unit);
  }

  function drawBarChart(sessions) {
    const bars = [];
    const start = mondayOf(new Date());
    start.setDate(start.getDate() - 7 * 7); // 8 setmanes incloent l'actual
    for (let i = 0; i < 8; i++) {
      const wk = new Date(start);
      wk.setDate(wk.getDate() + i * 7);
      const wkEnd = new Date(wk);
      wkEnd.setDate(wkEnd.getDate() + 6);
      const count = sessions.filter(s => {
        const d = parseISO(s.date);
        return d >= wk && d <= wkEnd;
      }).length;
      bars.push({
        label: `${wk.getDate()}/${wk.getMonth() + 1}`,
        value: count,
        title: `${count} entrenament${count === 1 ? '' : 's'}`,
        sub: `Setmana del ${wk.getDate()}/${wk.getMonth() + 1}`
      });
    }
    Charts.barChart($('#chartBars'), bars, '');
  }

  /* ========== Ajustos (exportar / importar / esborrar) ========== */

  function setupSettings() {
    $('#btnSettings').onclick = () => $('#modal-settings').classList.remove('hidden');
    $('#btnCloseSettings').onclick = () => $('#modal-settings').classList.add('hidden');
    $('#modal-settings').onclick = e => {
      if (e.target === $('#modal-settings')) $('#modal-settings').classList.add('hidden');
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
          if (!d || !Array.isArray(d.routines) || !Array.isArray(d.sessions)) {
            alert('Aquest fitxer no sembla una còpia de seguretat vàlida.');
            return;
          }
          if (!confirm(`Importar ${d.routines.length} rutines i ${d.sessions.length} sessions? Substituirà les dades actuals.`)) return;
          data = d;
          data.plan = data.plan || defaultData().plan;
          saveData();
          $('#modal-settings').classList.add('hidden');
          render();
        } catch (err) {
          alert('No s\'ha pogut llegir el fitxer.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    };

    $('#btnWipe').onclick = () => {
      if (!confirm('Segur que vols esborrar TOTES les dades?')) return;
      if (!confirm('Última confirmació: rutines, pla i tot l\'històric s\'esborraran per sempre.')) return;
      data = defaultData();
      draft = null;
      saveData();
      saveDraft();
      $('#modal-settings').classList.add('hidden');
      showView('avui');
    };
  }

  /* ========== Inici ========== */

  document.querySelectorAll('.tab').forEach(t => {
    t.onclick = () => showView(t.dataset.view);
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentView === 'progres') renderProgres();
    }, 200);
  });

  setupSettings();
  showView('avui');

  // Service worker per funcionar offline (només amb https o localhost)
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW no registrat:', err));
  }
})();
