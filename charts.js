/* charts.js — gràfiques SVG sense llibreries.
   Una sèrie per gràfica: color = accent del tema. Tooltip tàctil/ratolí. */

(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // Escala Y amb valors rodons: retorna { max, ticks: [0, t1, t2, max] }
  function niceScale(maxValue, tickCount) {
    if (maxValue <= 0) maxValue = 1;
    const rough = maxValue / tickCount;
    const mag = Math.pow(10, Math.floor(Math.log10(rough)));
    let step = mag;
    for (const m of [1, 2, 2.5, 5, 10]) {
      if (mag * m >= rough) { step = mag * m; break; }
    }
    const top = Math.ceil(maxValue / step) * step;
    const ticks = [];
    for (let v = 0; v <= top + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);
    return { max: top, ticks };
  }

  function fmtNum(v) {
    return v.toLocaleString('ca-ES', { maximumFractionDigits: 1 });
  }

  // Camí de barra amb la part superior arrodonida (base quadrada)
  function roundedTopBar(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    if (h <= 0) return '';
    return `M ${x} ${y + h} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y}` +
      ` L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h} Z`;
  }

  function makeTooltip(wrap) {
    const tt = document.createElement('div');
    tt.className = 'chart-tooltip hidden';
    wrap.appendChild(tt);
    return tt;
  }

  function showTooltip(tt, wrap, px, py, title, sub) {
    tt.innerHTML = `<div class="tt-title"></div><div class="tt-sub"></div>`;
    tt.querySelector('.tt-title').textContent = title;
    tt.querySelector('.tt-sub').textContent = sub;
    tt.classList.remove('hidden');
    const w = wrap.clientWidth;
    const x = Math.max(50, Math.min(w - 50, px));
    tt.style.left = x + 'px';
    tt.style.top = Math.max(30, py) + 'px';
  }

  /* Gràfica de línia: points = [{date: Date, y, title, sub}] */
  function lineChart(container, points, unit) {
    container.innerHTML = '';
    if (points.length === 0) return;

    const W = container.clientWidth || 320;
    const H = 210;
    const pad = { top: 26, right: 14, bottom: 24, left: 38 };
    const iw = W - pad.left - pad.right;
    const ih = H - pad.top - pad.bottom;

    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H });
    const ys = points.map(p => p.y);
    const scale = niceScale(Math.max(...ys), 3);

    const t0 = points[0].date.getTime();
    const t1 = points[points.length - 1].date.getTime();
    const span = Math.max(t1 - t0, 1);
    const px = p => points.length === 1
      ? pad.left + iw / 2
      : pad.left + ((p.date.getTime() - t0) / span) * iw;
    const py = v => pad.top + ih - (v / scale.max) * ih;

    // Gridlines + etiquetes Y
    for (const t of scale.ticks) {
      const y = py(t);
      svg.appendChild(el('line', { x1: pad.left, x2: W - pad.right, y1: y, y2: y, class: 'c-grid' }));
      const lbl = el('text', { x: pad.left - 6, y: y + 3, 'text-anchor': 'end', class: 'c-tick' });
      lbl.textContent = fmtNum(t);
      svg.appendChild(lbl);
    }

    // Etiquetes X: primera i última data
    const fmtD = d => d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' });
    const xl = el('text', { x: pad.left, y: H - 6, 'text-anchor': 'start', class: 'c-tick' });
    xl.textContent = fmtD(points[0].date);
    svg.appendChild(xl);
    if (points.length > 1) {
      const xr = el('text', { x: W - pad.right, y: H - 6, 'text-anchor': 'end', class: 'c-tick' });
      xr.textContent = fmtD(points[points.length - 1].date);
      svg.appendChild(xr);
    }

    // Àrea (10%) + línia (2px) + punt final amb anella de superfície
    const coords = points.map(p => `${px(p)},${py(p.y)}`);
    if (points.length > 1) {
      const area = el('path', {
        d: `M ${coords.join(' L ')} L ${px(points[points.length - 1])},${py(0)} L ${px(points[0])},${py(0)} Z`,
        class: 'c-area'
      });
      svg.appendChild(area);
      svg.appendChild(el('path', { d: `M ${coords.join(' L ')}`, class: 'c-line' }));
    }
    const last = points[points.length - 1];
    svg.appendChild(el('circle', { cx: px(last), cy: py(last.y), r: 4.5, class: 'c-dot' }));

    // Etiqueta directa del darrer valor
    const endLbl = el('text', {
      x: Math.min(px(last), W - pad.right - 4),
      y: py(last.y) - 10,
      'text-anchor': 'end',
      class: 'c-endlabel'
    });
    endLbl.textContent = `${fmtNum(last.y)} ${unit}`;
    svg.appendChild(endLbl);

    // Capa interactiva: creueta + tooltip al punt més proper
    const cross = el('line', { y1: pad.top, y2: pad.top + ih, class: 'c-cross hidden' });
    const hoverDot = el('circle', { r: 4.5, class: 'c-dot hidden' });
    svg.appendChild(cross);
    svg.appendChild(hoverDot);

    const tt = makeTooltip(container);
    const hit = el('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' });
    svg.appendChild(hit);

    function onMove(ev) {
      const r = svg.getBoundingClientRect();
      const mx = (ev.clientX - r.left) * (W / r.width);
      let best = points[0], bd = Infinity;
      for (const p of points) {
        const d = Math.abs(px(p) - mx);
        if (d < bd) { bd = d; best = p; }
      }
      const bx = px(best), by = py(best.y);
      cross.setAttribute('x1', bx); cross.setAttribute('x2', bx);
      cross.classList.remove('hidden');
      hoverDot.setAttribute('cx', bx); hoverDot.setAttribute('cy', by);
      hoverDot.classList.remove('hidden');
      showTooltip(tt, container, bx * (r.width / W), by * (r.height / H), best.title, best.sub);
    }
    function onLeave() {
      cross.classList.add('hidden');
      hoverDot.classList.add('hidden');
      tt.classList.add('hidden');
    }
    hit.addEventListener('pointermove', onMove);
    hit.addEventListener('pointerdown', onMove);
    hit.addEventListener('pointerleave', onLeave);

    container.appendChild(svg);
  }

  /* Gràfica de barres: bars = [{label, value, title, sub}] */
  function barChart(container, bars, unit) {
    container.innerHTML = '';
    if (bars.length === 0) return;

    const W = container.clientWidth || 320;
    const H = 190;
    const pad = { top: 22, right: 10, bottom: 24, left: 30 };
    const iw = W - pad.left - pad.right;
    const ih = H - pad.top - pad.bottom;

    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H });
    const scale = niceScale(Math.max(...bars.map(b => b.value)), 3);
    const py = v => pad.top + ih - (v / scale.max) * ih;

    for (const t of scale.ticks) {
      const y = py(t);
      svg.appendChild(el('line', { x1: pad.left, x2: W - pad.right, y1: y, y2: y, class: 'c-grid' }));
      const lbl = el('text', { x: pad.left - 6, y: y + 3, 'text-anchor': 'end', class: 'c-tick' });
      lbl.textContent = fmtNum(t);
      svg.appendChild(lbl);
    }

    const band = iw / bars.length;
    const bw = Math.min(24, band * 0.55);
    const maxVal = Math.max(...bars.map(b => b.value));
    // Etiqueta directa només a l'última barra que assoleix el màxim
    const labelIdx = bars.map(b => b.value).lastIndexOf(maxVal);
    const tt = makeTooltip(container);

    bars.forEach((b, i) => {
      const x = pad.left + band * i + (band - bw) / 2;
      const y = py(b.value);
      const h = pad.top + ih - y;
      if (b.value > 0) {
        svg.appendChild(el('path', { d: roundedTopBar(x, y, bw, h, 4), class: 'c-bar' }));
      }
      if (i === labelIdx && b.value > 0) {
        const vl = el('text', { x: x + bw / 2, y: y - 5, 'text-anchor': 'middle', class: 'c-endlabel' });
        vl.textContent = fmtNum(b.value);
        svg.appendChild(vl);
      }
      const xl = el('text', { x: pad.left + band * i + band / 2, y: H - 6, 'text-anchor': 'middle', class: 'c-tick' });
      xl.textContent = b.label;
      svg.appendChild(xl);

      // Zona tàctil de tota la banda
      const hit = el('rect', { x: pad.left + band * i, y: pad.top, width: band, height: ih, fill: 'transparent' });
      hit.addEventListener('pointermove', ev => {
        const r = svg.getBoundingClientRect();
        showTooltip(tt, container, (x + bw / 2) * (r.width / W), y * (r.height / H), b.title, b.sub);
      });
      hit.addEventListener('pointerdown', ev => {
        const r = svg.getBoundingClientRect();
        showTooltip(tt, container, (x + bw / 2) * (r.width / W), y * (r.height / H), b.title, b.sub);
      });
      hit.addEventListener('pointerleave', () => tt.classList.add('hidden'));
      svg.appendChild(hit);
    });

    container.appendChild(svg);
  }

  // Estils de les marques (usen els tokens del tema)
  const style = document.createElement('style');
  style.textContent = `
    .c-grid { stroke: var(--grid); stroke-width: 1; }
    .c-tick { fill: var(--muted); font-size: 10px; font-family: inherit; font-variant-numeric: tabular-nums; }
    .c-line { fill: none; stroke: var(--accent); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
    .c-area { fill: var(--accent); fill-opacity: 0.1; }
    .c-dot { fill: var(--accent); stroke: var(--surface); stroke-width: 2; }
    .c-bar { fill: var(--accent); }
    .c-cross { stroke: var(--baseline); stroke-width: 1; }
    .c-endlabel { fill: var(--ink-2); font-size: 11px; font-weight: 600; font-family: inherit; }
  `;
  document.head.appendChild(style);

  window.Charts = { lineChart, barChart };
})();
