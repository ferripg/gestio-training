/* pose.js — Comprovació de tècnica amb la càmera (MediaPipe Pose, tot dins del navegador).
   Detecta els punts del cos, compta les repeticions i diu si cada rep està ben feta.
   Cada exercici amb camp `pose` a program.js fa servir un dels analitzadors d'aquí.
   Les imatges no surten mai del mòbil: el model corre al navegador. */

(function () {
  'use strict';

  const MP = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35';
  const MODEL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
  const MIN_VIS = 0.5;

  // Índexs dels punts de MediaPipe Pose (costat esquerre / dret)
  const L = { shoulder: 11, elbow: 13, wrist: 15, hip: 23, knee: 25, ankle: 27, heel: 29, toe: 31 };
  const R = { shoulder: 12, elbow: 14, wrist: 16, hip: 24, knee: 26, ankle: 28, heel: 30, toe: 32 };

  /* ========== Geometria ========== */

  // Angle a-b-c, en graus (0-180), amb el vèrtex a b
  function angle(a, b, c) {
    const v1x = a.x - b.x, v1y = a.y - b.y, v2x = c.x - b.x, v2y = c.y - b.y;
    const cos = (v1x * v2x + v1y * v2y) / (Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y) || 1);
    return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
  }

  // Inclinació del segment a→b respecte de la vertical cap amunt (0 = vertical, 90 = horitzontal)
  function tilt(a, b) {
    return Math.atan2(Math.abs(b.x - a.x), a.y - b.y) * 180 / Math.PI;
  }

  // Signe del gir a-b-c: canvia quan b passa a l'altre costat de la línia a-c
  function cross(a, b, c) {
    return (a.x - b.x) * (c.y - b.y) - (a.y - b.y) * (c.x - b.x);
  }

  function mid(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }

  function abduction(S) { return angle(S.hip, S.shoulder, S.elbow); }

  // Inclinació lateral del tronc (amb signe), per detectar balanceig
  function trunkSway(J) {
    const s = mid(J.l.shoulder, J.r.shoulder), h = mid(J.l.hip, J.r.hip);
    return Math.atan2(s.x - h.x, h.y - s.y) * 180 / Math.PI;
  }

  /* ========== Analitzadors ==========
     metric: angle principal que marca la repetició
     rest / active: zona de repòs i zona de moviment (amb marge entre totes dues perquè no tremoli)
     track: apunta el que cal durant la rep · judge: llista d'errors (buida = ben feta) */

  const ANALYZERS = {
    squat: {
      view: 'side', need: ['shoulder', 'hip', 'knee', 'ankle'],
      bones: [['shoulder', 'hip'], ['hip', 'knee'], ['knee', 'ankle']],
      setup: "Mòbil a terra a 2-3 m, que et vegi DE COSTAT i sencer, del cap als peus.",
      metric: J => angle(J.hip, J.knee, J.ankle),
      rest: m => m > 155,
      active: m => m < 135,
      // Els talons no es miren: de costat, els punts del peu i del turmell no són prou estables i donaven avisos falsos
      track(J, rep, m, t) {
        if (m < (rep.min ?? 999)) { rep.min = m; rep.tMin = t; }
        rep.lean = Math.max(rep.lean || 0, tilt(J.hip, J.shoulder));
      },
      judge(rep) {
        const f = [];
        if (rep.min > 110) f.push("Baixa més, fins a tocar el banc");
        if (rep.lean > 50) f.push("Pit amunt, no t'inclinis tant");
        if (rep.tMin - rep.t0 < 0.7) f.push("Baixa més a poc a poc");
        return f;
      }
    },

    // Pont de glutis a terra: estirat, el maluc fa uns 135° a baix i 180° a dalt (en línia)
    bridge: {
      view: 'side', need: ['shoulder', 'hip', 'knee', 'ankle'],
      bones: [['shoulder', 'hip'], ['hip', 'knee'], ['knee', 'ankle']],
      setup: "Mòbil a terra a 2 m, DE COSTAT: que es vegin espatlles, maluc, genolls i peus.",
      // Més de 180° = el maluc passa per sobre de la línia espatlla-genoll (lumbar arquejada)
      metric(J, st) {
        const a = angle(J.shoulder, J.hip, J.knee);
        const s = Math.sign(cross(J.shoulder, J.hip, J.knee));
        if (a < 150 && s) st.flexSign = s;
        return st.flexSign && s && s !== st.flexSign ? 360 - a : a;
      },
      rest: m => m < 145,
      active: m => m > 157,
      track(J, rep, m, t) {
        if (m > (rep.max ?? 0)) { rep.max = m; rep.knee = angle(J.hip, J.knee, J.ankle); }
        if (m > 165) rep.hold = (rep.hold || 0) + (t - (rep.tPrev ?? t));
        rep.tPrev = t;
      },
      judge(rep) {
        const f = [];
        if (rep.max > 198) f.push("No arquegis la lumbar, fins a fer una línia n'hi ha prou");
        else if (rep.max < 165) f.push("Puja més, apreta el cul fins a fer una línia");
        if (rep.knee > 115) f.push("Acosta els peus al cul");
        else if (rep.knee < 65) f.push("Allunya una mica els peus");
        if (!(rep.hold >= 0.8)) f.push("Aguanta 2 segons a dalt");
        return f;
      }
    },

    lateral: {
      view: 'front', need: ['shoulder', 'elbow', 'hip'],
      bones: [['shoulder', 'elbow'], ['shoulder', 'hip']],
      setup: "Mòbil davant teu a 2 m, a l'altura del pit: que et vegi DE CARA, del cap al maluc.",
      metric: J => (abduction(J.l) + abduction(J.r)) / 2,
      rest: m => m < 30,
      active: m => m > 50,
      idle(J, st) { st.sway = trunkSway(J); },
      track(J, rep, m, t, st) {
        if (m > (rep.max ?? 0)) { rep.max = m; rep.diff = Math.abs(abduction(J.l) - abduction(J.r)); rep.tMax = t; }
        rep.swing = Math.max(rep.swing || 0, Math.abs(trunkSway(J) - (st.sway ?? trunkSway(J))));
      },
      judge(rep) {
        const f = [];
        if (rep.max < 70) f.push("Puja fins a l'altura de les espatlles");
        else if (rep.max > 105) f.push("No pugis tant, fins a les espatlles n'hi ha prou");
        if (rep.diff > 15) f.push("Puja els dos braços igual");
        if (rep.swing > 10) f.push("No balancegis el cos");
        if (rep.t1 - rep.tMax < 0.8) f.push("Baixa més a poc a poc");
        return f;
      }
    },

    tricep: {
      view: 'side', need: ['shoulder', 'elbow', 'wrist'],
      bones: [['shoulder', 'elbow'], ['elbow', 'wrist']],
      setup: "Mòbil de costat a 1,5-2 m: que es vegin espatlla, colze i mans.",
      metric: J => angle(J.shoulder, J.elbow, J.wrist),
      rest: m => m > 145,
      active: m => m < 120,
      track(J, rep, m, t) {
        if (m < (rep.min ?? 999)) { rep.min = m; rep.tMin = t; }
        rep.drift = Math.max(rep.drift || 0, tilt(J.shoulder, J.elbow));
      },
      judge(rep) {
        const f = [];
        if (rep.min > 75) f.push("Baixa més, fins a notar l'estirament");
        if (rep.drift > 35) f.push("Colzes quiets, apuntant amunt");
        if (rep.tMin - rep.t0 < 0.7) f.push("Baixa més a poc a poc");
        return f;
      }
    }
  };

  /* ========== Seguiment de repeticions (sense DOM: es pot provar amb punts simulats) ========== */

  // Punts en píxels del costat que es veu millor (de costat) o de tots dos (de cara)
  function joints(lm, an, W, H) {
    const P = i => ({ x: lm[i].x * W, y: lm[i].y * H, v: lm[i].visibility ?? 1 });
    if (an.view === 'front') {
      const l = {}, r = {};
      for (const k of an.need) { l[k] = P(L[k]); r[k] = P(R[k]); }
      if (an.need.some(k => l[k].v < MIN_VIS || r[k].v < MIN_VIS)) return null;
      return { l, r };
    }
    const vis = S => an.need.reduce((s, k) => s + (lm[S[k]].visibility ?? 1), 0);
    const S = vis(L) >= vis(R) ? L : R;
    const J = {};
    for (const k of an.need) J[k] = P(S[k]);
    if (an.need.some(k => J[k].v < MIN_VIS)) return null;
    return J;
  }

  function createTracker(type) {
    const an = ANALYZERS[type];
    const st = { phase: 'rest', m: null, reps: 0, good: 0, faults: {}, lastRestT: 0, rep: null };

    // lm: 33 punts normalitzats (0-1) · W, H: mida de la imatge · t: segons
    function step(lm, W, H, t) {
      if (!lm) { st.m = null; return { status: 'nobody' }; }
      const J = joints(lm, an, W, H);
      if (!J) { st.m = null; return { status: 'partial' }; }
      const raw = an.metric(J, st);
      st.m = st.m == null ? raw : st.m * 0.6 + raw * 0.4;
      const m = st.m;
      let rep = null;
      if (st.phase === 'rest') {
        if (an.rest(m)) { st.lastRestT = t; if (an.idle) an.idle(J, st); }
        if (an.active(m)) { st.phase = 'active'; st.rep = { t0: st.lastRestT }; }
      }
      if (st.phase === 'active') {
        an.track(J, st.rep, m, t, st);
        if (an.rest(m)) {
          st.phase = 'rest';
          st.lastRestT = t;
          if (t - st.rep.t0 >= 0.5) {   // més curt = soroll, no una rep
            st.rep.t1 = t;
            const faults = an.judge(st.rep, st);
            st.reps++;
            if (!faults.length) st.good++;
            faults.forEach(f => { st.faults[f] = (st.faults[f] || 0) + 1; });
            rep = { n: st.reps, ok: !faults.length, faults };
          }
        }
      }
      return { status: 'ok', J, m, rep };
    }

    function summary() {
      const top = Object.entries(st.faults).sort((a, b) => b[1] - a[1])[0];
      return { reps: st.reps, good: st.good, topFault: top ? top[0] : null };
    }

    return { step, summary };
  }

  /* ========== Detector (es carrega el primer cop que s'obre) ========== */

  let landmarker = null, loading = null;

  function loadLandmarker() {
    if (landmarker) return Promise.resolve(landmarker);
    if (!loading) {
      loading = (async () => {
        const vision = await import(MP + '/vision_bundle.mjs');
        const files = await vision.FilesetResolver.forVisionTasks(MP + '/wasm');
        const opts = delegate => ({ baseOptions: { modelAssetPath: MODEL, delegate }, runningMode: 'VIDEO', numPoses: 1 });
        try { landmarker = await vision.PoseLandmarker.createFromOptions(files, opts('GPU')); }
        catch (e) { landmarker = await vision.PoseLandmarker.createFromOptions(files, opts('CPU')); }
        return landmarker;
      })().catch(e => { loading = null; throw e; });
    }
    return loading;
  }

  /* ========== Pantalla ========== */

  let ui = null;   // { opts, an, tracker, stream, raf, facing, voice, lastTime, wakeLock, color }

  const $ = sel => document.querySelector(sel);

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // opts = { type, name, onSave(reps), saveLabel, onResult(resum) → text per al resum, onClose }
  function open(opts) {
    const an = ANALYZERS[opts.type];
    if (!an) return;
    ui = { opts, an, tracker: createTracker(opts.type), facing: 'user', voice: true, lastTime: -1, color: '#ffffff', idleMsg: true, restarts: 0 };
    const o = $('#overlay-pose');
    o.innerHTML = `
      <div class="pose-top">
        <b>${esc(opts.name)}</b>
        <span class="row" style="gap:6px">
          <button class="btn small" id="pFlip" title="Canviar de càmera">🔄</button>
          <button class="btn small" id="pVoice" title="Veu">🔊</button>
          <button class="btn small" id="pClose" title="Tancar">✕</button>
        </span>
      </div>
      <div class="pose-feedback" id="pFeedback">Carregant el detector…</div>
      <div class="pose-stage" id="pStage">
        <div class="pose-media" id="pMedia"><video id="pVideo" playsinline muted></video><canvas id="pCanvas"></canvas></div>
      </div>
      <p class="pose-setup">📱 ${esc(an.setup)}</p>
      <div class="pose-bottom" id="pBottom">
        <div class="pose-count"><span id="pReps">0</span><small>reps</small></div>
        <div class="pose-count good"><span id="pGood">0</span><small>ben fetes</small></div>
        <button class="btn primary" id="pDone">Acabar</button>
      </div>`;
    o.classList.remove('hidden');
    $('#pClose').onclick = close;
    $('#pDone').onclick = finish;
    $('#pVoice').onclick = () => { ui.voice = !ui.voice; $('#pVoice').textContent = ui.voice ? '🔊' : '🔇'; };
    $('#pFlip').onclick = () => { ui.facing = ui.facing === 'user' ? 'environment' : 'user'; startCamera(); };
    window.addEventListener('resize', fitMedia);
    if (navigator.wakeLock) navigator.wakeLock.request('screen').then(w => { if (ui) ui.wakeLock = w; }).catch(() => {});
    loadLandmarker()
      .then(() => { if (ui) startCamera(); })
      .catch(err => { console.warn('Detector no carregat', err); feedback("No s'ha pogut carregar el detector. Cal connexió a internet el primer cop.", 'bad'); });
  }

  async function startCamera() {
    stopCamera();
    feedback('Obrint la càmera…');
    try {
      ui.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: ui.facing, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
    } catch (e) {
      feedback('No puc obrir la càmera. Dona permís a la càmera per a aquesta web.', 'bad');
      return;
    }
    const v = $('#pVideo');
    v.srcObject = ui.stream;
    await v.play().catch(() => {});
    $('#pMedia').style.transform = ui.facing === 'user' ? 'scaleX(-1)' : '';
    fitMedia();
    feedback('Col·loca\'t perquè et vegi i comença quan vulguis.');
    loop();
  }

  function stopCamera() {
    if (!ui) return;
    if (ui.raf) cancelAnimationFrame(ui.raf);
    ui.raf = null;
    if (ui.stream) ui.stream.getTracks().forEach(t => t.stop());
    ui.stream = null;
  }

  // Ajusta vídeo i canvas a l'espai disponible sense deformar la imatge
  function fitMedia() {
    const v = $('#pVideo'), stage = $('#pStage');
    if (!v || !stage || !v.videoWidth) return;
    const c = $('#pCanvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    const k = Math.min(stage.clientWidth / v.videoWidth, stage.clientHeight / v.videoHeight);
    const m = $('#pMedia');
    m.style.width = Math.floor(v.videoWidth * k) + 'px';
    m.style.height = Math.floor(v.videoHeight * k) + 'px';
  }

  function loop() {
    if (!ui || !ui.stream) return;
    ui.raf = requestAnimationFrame(loop);
    const v = $('#pVideo');
    if (v.readyState < 2 || !v.videoWidth || !v.videoHeight || v.currentTime === ui.lastTime) return;
    ui.lastTime = v.currentTime;
    if ($('#pCanvas').width !== v.videoWidth) fitMedia();
    const now = performance.now();
    let res;
    try { res = landmarker.detectForVideo(v, now); }
    catch (e) { console.warn('Detector aturat, es reinicia', e); restartLandmarker(); return; }
    const lm = res.landmarks && res.landmarks[0];
    const out = ui.tracker.step(lm, v.videoWidth, v.videoHeight, now / 1000);
    draw(out);
    if (out.status === 'nobody') feedback('No et veig. ' + ui.an.setup);
    else if (out.status === 'partial') feedback('No et veig sencer. ' + ui.an.setup);
    else if (ui.idleMsg) { feedback('Et veig! Comença quan vulguis.', 'ok'); ui.idleMsg = false; }
    if (out.status !== 'ok') ui.idleMsg = true;
    if (out.rep) onRep(out.rep);
  }

  // MediaPipe es pot quedar en error (p. ex. si surts del pla) i llavors falla a cada imatge: es torna a crear
  function restartLandmarker() {
    if (ui && ui.raf) cancelAnimationFrame(ui.raf);
    if (ui) ui.raf = null;
    if (ui && ++ui.restarts > 5) { feedback("El detector falla massa. Tanca i torna-ho a provar.", 'bad'); return; }
    try { landmarker.close(); } catch (e) { /* ja estava trencat */ }
    landmarker = null;
    loading = null;
    feedback('Un moment, reiniciant el detector…');
    loadLandmarker()
      .then(() => { if (ui && ui.stream) { ui.idleMsg = true; loop(); } })
      .catch(() => feedback("No s'ha pogut reiniciar el detector. Tanca i torna-ho a provar.", 'bad'));
  }

  function onRep(rep) {
    $('#pReps').textContent = rep.n;
    $('#pGood').textContent = ui.tracker.summary().good;
    if (rep.ok) {
      ui.color = '#3ecf6e';
      feedback(`${rep.n} · Bona! ✅`, 'ok');
      say(`${rep.n}, bona`);
      beep(880);
    } else {
      ui.color = '#ff9f43';
      feedback(`${rep.n} · ${rep.faults[0]}`, 'warn');
      say(`${rep.n}. ${rep.faults[0]}`);
      beep(440);
    }
  }

  function draw(out) {
    const c = $('#pCanvas'), ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    if (out.status !== 'ok') return;
    const sides = ui.an.view === 'front' ? [out.J.l, out.J.r] : [out.J];
    ctx.lineWidth = Math.max(4, c.width / 120);
    ctx.lineCap = 'round';
    ctx.strokeStyle = ui.color;
    ctx.fillStyle = ui.color;
    for (const S of sides) {
      for (const [a, b] of ui.an.bones) {
        if (!S[a] || !S[b] || S[a].v < MIN_VIS || S[b].v < MIN_VIS) continue;
        ctx.beginPath(); ctx.moveTo(S[a].x, S[a].y); ctx.lineTo(S[b].x, S[b].y); ctx.stroke();
      }
      for (const k in S) {
        if (S[k].v < MIN_VIS) continue;
        ctx.beginPath(); ctx.arc(S[k].x, S[k].y, ctx.lineWidth * 1.3, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  function feedback(text, kind) {
    const el = $('#pFeedback');
    if (!el) return;
    el.textContent = text;
    el.className = 'pose-feedback' + (kind ? ' ' + kind : '');
  }

  function say(text) {
    if (!ui || !ui.voice || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ca-ES';
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => /^ca/i.test(v.lang)) || voices.find(v => /^es/i.test(v.lang));
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }

  let audioCtx = null;
  function beep(freq) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) { /* sense so */ }
  }

  function finish() {
    const s = ui.tracker.summary();
    stopCamera();
    const canSave = ui.opts.onSave && s.reps > 0;
    const note = ui.opts.onResult ? ui.opts.onResult(s) : '';
    feedback(s.reps ? `${s.reps} reps · ${s.good} ben fetes` : 'No he comptat cap repetició.', s.reps && s.good === s.reps ? 'ok' : '');
    $('#pBottom').innerHTML = `<div class="stack" style="width:100%;margin:0">
      ${s.topFault ? `<p>Per millorar: <b>${esc(s.topFault)}</b></p>` : (s.reps ? '<p>Totes ben fetes. Així s\'hi fa 💪</p>' : '')}
      ${note ? `<p><b>${esc(note)}</b></p>` : ''}
      ${canSave ? `<button class="btn primary" id="pSave">✓ Apunta ${s.reps} reps ${esc(ui.opts.saveLabel || '')}</button>` : ''}
      <button class="btn" id="pClose2">Tancar</button>
    </div>`;
    if (canSave) $('#pSave').onclick = () => { const cb = ui.opts.onSave; close(); cb(s.reps); };
    $('#pClose2').onclick = close;
  }

  function close() {
    stopCamera();
    if (ui && ui.wakeLock) ui.wakeLock.release().catch(() => {});
    if (window.speechSynthesis) speechSynthesis.cancel();
    window.removeEventListener('resize', fitMedia);
    const onClose = ui && ui.opts.onClose;
    ui = null;
    const o = $('#overlay-pose');
    o.classList.add('hidden');
    o.innerHTML = '';
    if (onClose) onClose();
  }

  window.PoseCheck = { open, createTracker, types: Object.keys(ANALYZERS) };
})();
