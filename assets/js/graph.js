/* Layered DAG renderer for industry chains.
   Bipartite: item nodes feed job nodes feed item nodes. Cycles (fuel makes
   fuel, ash makes lye makes potash) are tolerated by capping the relaxation. */

(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const ITEM_H = 26, JOB_H = 36;
  const COL_GAP = 74, ROW_GAP = 14;
  const CHAR_W = 6.6, PAD_X = 26, MAX_W = 210;

  const el = (name, attrs, parent) => {
    const n = document.createElementNS(SVG_NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  const width = (text) => Math.min(MAX_W, Math.max(58, text.length * CHAR_W + PAD_X));
  // clip assumes a slightly narrower glyph than width() reserved, so a label that
  // was measured to fit always survives the round trip.
  const clip = (text, w) => {
    const max = Math.floor((w - PAD_X + 2) / (CHAR_W - 0.4));
    return text.length > max ? text.slice(0, Math.max(1, max - 1)) + '…' : text;
  };

  /* Build the node/edge model for a set of recipes. */
  function build(recipes) {
    const nodes = new Map();   // key -> node
    const edges = [];

    const itemKey = (name) => 'i:' + name;

    const addItem = (name) => {
      const k = itemKey(name);
      if (!nodes.has(k)) nodes.set(k, { key: k, kind: 'item', label: name, w: width(name), h: ITEM_H, layer: 0 });
      return nodes.get(k);
    };

    recipes.forEach((r) => {
      const k = 'j:' + r.id;
      const w = Math.max(width(r.name), width(r.workshop));
      const job = { key: k, kind: 'job', label: r.name, sub: r.workshop, recipe: r, w, h: JOB_H, layer: 0 };
      nodes.set(k, job);

      (r.in || []).forEach((x) => edges.push({ from: addItem(x.item).key, to: k }));
      (r.out || []).forEach((x) => edges.push({ from: k, to: addItem(x.item).key }));
      if ((r.needs || []).includes('fuel')) edges.push({ from: addItem('Fuel').key, to: k });
      if ((r.needs || []).includes('flux')) edges.push({ from: addItem('Flux stone').key, to: k });
    });

    return { nodes, edges };
  }

  /* Longest-path layering, relaxed iteratively so cycles simply settle. */
  function layer(nodes, edges) {
    const incoming = new Map();
    edges.forEach((e) => {
      if (!incoming.has(e.to)) incoming.set(e.to, []);
      incoming.get(e.to).push(e.from);
    });

    for (let pass = 0; pass < 24; pass++) {
      let moved = false;
      nodes.forEach((n) => {
        const froms = incoming.get(n.key);
        if (!froms || !froms.length) return;
        let want = 0;
        froms.forEach((f) => {
          const src = nodes.get(f);
          if (src && src.layer + 1 > want) want = src.layer + 1;
        });
        if (want > n.layer && want < 40) { n.layer = want; moved = true; }
      });
      if (!moved) break;
    }
  }

  /* Order nodes inside each column by the average position of their neighbours. */
  function order(nodes, edges) {
    const cols = [];
    nodes.forEach((n) => (cols[n.layer] = cols[n.layer] || []).push(n));
    cols.forEach((c) => c && c.forEach((n, i) => (n.pos = i)));

    const neighbours = new Map();
    const link = (a, b) => {
      if (!neighbours.has(a)) neighbours.set(a, []);
      neighbours.get(a).push(b);
    };
    edges.forEach((e) => { link(e.from, e.to); link(e.to, e.from); });

    for (let pass = 0; pass < 6; pass++) {
      cols.forEach((col) => {
        if (!col) return;
        col.forEach((n) => {
          const ns = (neighbours.get(n.key) || [])
            .map((k) => nodes.get(k)).filter((x) => x && x.layer !== n.layer);
          n.bary = ns.length ? ns.reduce((s, x) => s + x.pos, 0) / ns.length : n.pos;
        });
        col.sort((a, b) => a.bary - b.bary);
        col.forEach((n, i) => (n.pos = i));
      });
    }
    return cols;
  }

  function place(cols) {
    let x = 0, maxY = 0;
    cols.forEach((col) => {
      if (!col) return;
      const colW = Math.max(...col.map((n) => n.w));
      let y = 0;
      col.forEach((n) => {
        n.x = x + (colW - n.w) / 2;
        n.y = y;
        y += n.h + ROW_GAP;
      });
      // centre the column vertically once we know the tallest
      const height = y - ROW_GAP;
      col.forEach((n) => (n.colH = height));
      maxY = Math.max(maxY, height);
      x += colW + COL_GAP;
    });
    cols.forEach((col) => col && col.forEach((n) => (n.y += (maxY - n.colH) / 2)));
    return { w: Math.max(x - COL_GAP, 1), h: Math.max(maxY, 1) };
  }

  function curve(a, b) {
    const x1 = a.x + a.w, y1 = a.y + a.h / 2;
    const x2 = b.x, y2 = b.y + b.h / 2;
    const dx = Math.max(24, (x2 - x1) * 0.5);
    return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
  }

  function render(host, recipes, color, onItemClick, metalOf) {
    host.innerHTML = '';

    const { nodes, edges } = build(recipes);
    if (!nodes.size) { host.innerHTML = '<p class="none" style="padding:1rem">Nothing to draw.</p>'; return; }

    layer(nodes, edges);
    const cols = order(nodes, edges);
    const size = place(cols);

    const svg = el('svg', { xmlns: SVG_NS }, host);
    svg.style.setProperty('--c', color);
    const defs = el('defs', {}, svg);
    const marker = el('marker', {
      id: 'arrow', viewBox: '0 0 8 8', refX: 7, refY: 4,
      markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse'
    }, defs);
    el('path', { d: 'M0,1 L7,4 L0,7 z', fill: 'currentColor' }, marker);

    const root = el('g', {}, svg);
    const edgeLayer = el('g', { color: 'var(--line-2)' }, root);
    const nodeLayer = el('g', {}, root);

    const edgeEls = [];
    edges.forEach((e) => {
      const a = nodes.get(e.from), b = nodes.get(e.to);
      if (!a || !b) return;
      const p = el('path', { class: 'edge', d: curve(a, b), 'marker-end': 'url(#arrow)' }, edgeLayer);
      edgeEls.push({ el: p, from: e.from, to: e.to });
    });

    const nodeEls = new Map();
    nodes.forEach((n) => {
      const g = el('g', {
        class: 'node ' + (n.kind === 'item' ? 'n-item' : 'n-job'),
        transform: `translate(${n.x},${n.y})`
      }, nodeLayer);

      const rect = el('rect', { width: n.w, height: n.h }, g);

      if (n.kind === 'item') {
        // a metal bar gets its DF tile colour on the border, so the alloy
        // columns are scannable without reading every label
        const metal = metalOf && metalOf(n.label);
        if (metal) {
          rect.setAttribute('stroke', metal);
          rect.setAttribute('stroke-width', 1.8);
          g.classList.add('is-metal');
        }
        const t = el('text', { x: n.w / 2, y: n.h / 2 + 4, 'text-anchor': 'middle' }, g);
        t.textContent = clip(n.label, n.w);
        g.addEventListener('click', () => onItemClick && onItemClick(n.label));
      } else {
        const t1 = el('text', { x: n.w / 2, y: 15, 'text-anchor': 'middle' }, g);
        t1.textContent = clip(n.label, n.w);
        const t2 = el('text', { x: n.w / 2, y: 27, 'text-anchor': 'middle', class: 'sub' }, g);
        t2.textContent = clip(n.sub, n.w);
      }

      const title = el('title', {}, g);
      title.textContent = n.kind === 'job'
        ? `${n.label}\n${n.sub}${n.recipe.skill ? ' · ' + n.recipe.skill : ''}`
        : n.label;

      g.addEventListener('mouseenter', () => highlight(n.key));
      g.addEventListener('mouseleave', () => highlight(null));
      nodeEls.set(n.key, g);
    });

    function highlight(key) {
      if (!key) {
        edgeEls.forEach((e) => e.el.classList.remove('hot'));
        nodeEls.forEach((g) => g.classList.remove('dim'));
        return;
      }
      const keep = new Set([key]);
      edgeEls.forEach((e) => {
        const hot = e.from === key || e.to === key;
        e.el.classList.toggle('hot', hot);
        if (hot) { keep.add(e.from); keep.add(e.to); }
      });
      nodeEls.forEach((g, k) => g.classList.toggle('dim', !keep.has(k)));
    }

    /* ── pan & zoom ── */
    const M = 30;                                   // breathing room around the diagram
    let scale = 1, tx = 0, ty = 0;

    const apply = () => root.setAttribute('transform', `translate(${tx},${ty}) scale(${scale})`);

    function fit() {
      const box = host.getBoundingClientRect();
      if (!box.width || !box.height) return;
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      scale = Math.min(box.width / (size.w + M * 2), box.height / (size.h + M * 2), 1.4);
      tx = (box.width - size.w * scale) / 2;
      ty = (box.height - size.h * scale) / 2;
      apply();
    }

    svg.addEventListener('wheel', (ev) => {
      ev.preventDefault();
      const box = svg.getBoundingClientRect();
      const mx = ev.clientX - box.left, my = ev.clientY - box.top;
      const k = Math.exp(-ev.deltaY * 0.0015);
      const next = Math.min(3, Math.max(0.15, scale * k));
      tx = mx - (mx - tx) * (next / scale);
      ty = my - (my - ty) * (next / scale);
      scale = next;
      apply();
    }, { passive: false });

    let drag = null;
    svg.addEventListener('pointerdown', (ev) => {
      drag = { x: ev.clientX - tx, y: ev.clientY - ty };
      svg.classList.add('drag');
      svg.setPointerCapture(ev.pointerId);
    });
    svg.addEventListener('pointermove', (ev) => {
      if (!drag) return;
      tx = ev.clientX - drag.x; ty = ev.clientY - drag.y; apply();
    });
    const stop = () => { drag = null; svg.classList.remove('drag'); };
    svg.addEventListener('pointerup', stop);
    svg.addEventListener('pointercancel', stop);

    const tools = document.createElement('div');
    tools.className = 'graph-tools';
    tools.innerHTML = '<button data-z="in" title="Zoom in">+</button>' +
                      '<button data-z="out" title="Zoom out">−</button>' +
                      '<button data-z="fit" title="Fit to view">⤢</button>';
    tools.addEventListener('click', (ev) => {
      const b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.z === 'fit') return fit();
      const box = svg.getBoundingClientRect();
      const mx = box.width / 2, my = box.height / 2;
      const next = Math.min(3, Math.max(0.15, scale * (b.dataset.z === 'in' ? 1.25 : 0.8)));
      tx = mx - (mx - tx) * (next / scale);
      ty = my - (my - ty) * (next / scale);
      scale = next; apply();
    });
    host.appendChild(tools);

    const hint = document.createElement('div');
    hint.className = 'graph-hint';
    hint.textContent = 'drag to pan · scroll to zoom · click an item for its chain';
    host.appendChild(hint);

    requestAnimationFrame(fit);
    const ro = new ResizeObserver(() => fit());
    ro.observe(host);
  }

  window.DFGraph = { render };
})();
