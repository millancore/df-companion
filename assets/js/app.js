(function () {
  const RECIPES    = window.DF_RECIPES;
  const INDUSTRIES = window.DF_INDUSTRIES;
  const REFERENCE  = window.DF_REFERENCE;
  const NOTES      = window.DF_ITEM_NOTES || {};
  const SHOPS      = window.DF_WORKSHOPS || {};
  const METALS     = window.DF_METAL_COLORS || {};
  const ICONS      = window.DF_ICONS || {};
  const BREWING    = window.DF_BREWING || [];
  const MILLING    = window.DF_MILLING || [];
  const COLOR_HEX  = window.DF_COLOR_HEX || {};
  const COLOR_FAM  = window.DF_COLOR_FAMILY || {};
  const FAMILY_HEX = window.DF_FAMILY_HEX || {};
  const DYES       = window.DF_DYES || [];
  const ORES       = window.DF_ORES || [];
  const ALLOYS     = window.DF_ALLOYS || [];
  const BODY       = window.DF_BODY || [];
  const DWARF      = window.DF_DWARF_PATH || '';
  const ARMOR_MATS = window.DF_ARMOR_MATS || {};
  const ARMOR      = window.DF_ARMOR || [];
  const ARMOR_TABLES = window.DF_ARMOR_TABLES || [];

  const main   = document.getElementById('main');
  const search = document.getElementById('search');
  const results= document.getElementById('results');

  /* A `needs` flag is a real input — it just isn't a material that gets consumed
     into the product. Mapping it to an item keeps "what is my Barrel used for?"
     answerable. The chain maps deliberately only draw fuel and flux, since drawing
     every container turns the food map into a hairball. */
  const NEED_ITEM = {
    fuel: 'Fuel', flux: 'Flux stone', bag: 'Bag',
    barrel: 'Barrel', jug: 'Jug', bucket: 'Bucket'
  };

  /* Split into a symbol and its words: the badge draws the symbol, the search
     index takes the words. A single string could not serve both once the icon
     stopped being a character. */
  const NEED_LABEL = {
    fuel:   { icon: 'flame',  text: 'consumes fuel' },
    flux:   { icon: 'flux',   text: 'flux stone' },
    bag:    { icon: 'bag',    text: 'needs a bag' },
    barrel: { icon: 'barrel', text: 'barrel or pot' },
    jug:    { icon: 'jug',    text: 'needs a jug' },
    bucket: { icon: 'bucket', text: 'needs a bucket' },
    shop:   { icon: 'shop',   text: 'shop & specialist' }
  };

  const needBadge = (n) => {
    const m = NEED_LABEL[n];
    return `<span class="need">${m ? sym(m.icon) + esc(m.text) : esc(n)}</span>`;
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Every icon on the site is inline SVG: workshop artwork from
     data/workshops.js, everything else from the shared set in data/icons.js.
     The wrapper carries the stroke settings, so an entry only has to describe
     its shapes and the whole site keeps one line weight. */
  const GENERIC = '<path d="M5 27V14l11-7 11 7v13z"/><path d="M12 27v-8h8v8"/>';
  function draw(m, cls) {
    return `<svg class="${cls}" viewBox="${m.box || '0 0 32 32'}"
      aria-hidden="true" fill="none" stroke="currentColor" stroke-width="${m.sw || 1.7}"
      stroke-linecap="round" stroke-linejoin="round">${m.art}</svg>`;
  }
  /* A workshop with no entry falls back to a generic building; an unknown
     symbol name draws nothing rather than a wrong picture. */
  const icon = (name, cls) => draw(SHOPS[name] || { art: GENERIC }, 'ws-icon ' + (cls || ''));
  const sym  = (name, cls) => (ICONS[name] ? draw(ICONS[name], 'sym ' + (cls || '')) : '');

  /* The pixel-art plate from assets/img. It only stands in for the SVG on the
     two places that give a building real estate — its card on the grid and its
     own page. At chip size 96×128 of pixel art is mush, and the places and
     zones have no plate at all, so those fall back to the icon. Either way it
     stands in the same frame, so a row of cards keeps one left edge instead of
     one card's text starting further in. `alt` is empty because the heading
     next to it already names the building. */
  const plate = (name, cls) => {
    const m = SHOPS[name] || {};
    const frame = (inner, extra) =>
      `<span class="ws-pic ${extra} ${cls || ''}">${inner}</span>`;
    if (!m.img) return frame(icon(name, cls), '');

    /* `img2` is a second building the entry covers, and only the workshop's own
       page has the width for both — the card shows the first and lets the note
       explain the other. */
    const files = [m.img].concat(m.img2 && cls === 'xxl' ? [m.img2] : []);
    return frame(files.map((f) =>
      `<img src="assets/img/${f}" alt="" loading="lazy" decoding="async">`).join(''),
      m.small ? 'small' : '');
  };

  /* A cell out of the equipment sheet. Only the armour picker's list draws
     these: they are there to make a row findable at a glance, not to illustrate
     the piece a second time — the card beside the list already does that. A
     piece the sheet has no cell for still gets the empty box, so the names stay
     in one column instead of stepping in and out. */
  const eqCell = (c) =>
    `<span class="eq" style="background-position:${-c[0] * 32}px ${-c[1] * 32}px"></span>`;
  const eqSprite = (p) => p.sprite
    ? eqCell(p.sprite) + (p.sprite2 ? eqCell(p.sprite2) : '')
    : '<span class="eq blank"></span>';

  /* The build-menu path, 'b-o-u-l' → four keycaps. Worth showing: it is the one
     fact about a workshop you need while you are actually looking at the game. */
  const keycaps = (keys) => keys
    ? `<span class="keys">${keys.split('-').map((k) => `<kbd>${esc(k)}</kbd>`).join('')}</span>` : '';

  /* The in → out connector. A filled glyph rather than the ↓ character, which rendered
     thin and inconsistently across fonts. Filled with currentColor so it follows the
     theme and picks up the accent on card hover. */
  const ARROW = `<svg class="arrow-svg" viewBox="0 0 256 256" aria-hidden="true" fill="currentColor"><path d="M231.39,132.94A8,8,0,0,0,224,128H184V72a8,8,0,0,0-8-8H80a8,8,0,0,0-8,8v56H32a8,8,0,0,0-5.66,13.66l96,96a8,8,0,0,0,11.32,0l96-96A8,8,0,0,0,231.39,132.94ZM128,220.69,51.31,144H80a8,8,0,0,0,8-8V80h80v56a8,8,0,0,0,8,8h28.69ZM72,40a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,40Z"/></svg>`;

  /* Metal ingot, tinted with the metal's own colour. The dark outline is what
     keeps a white or light-gray ingot visible on the light theme, and the white
     top face gives it enough form to read at chip size. */
  function metalColor(name) {
    if (!name) return null;
    if (METALS[name]) return METALS[name];
    const base = name.replace(/\s+(bars?|wafers?|strands?|ingots?)$/i, '');
    return METALS[base] || null;
  }

  /* Three stacked bars, the same shapes as the `metal` symbol in data/icons.js
     but filled with the metal's own colour instead of stroked. The thin
     dark outline is not a second tone — it is what keeps a white or light-gray
     metal visible against the light theme, and what separates the three bars
     from each other when they are all one colour. */
  const INGOT_BARS = 'M12.5 9h7l2.5 8H10z M5.5 19h7l2.5 8H3z M19.5 19h7l2.5 8H17z';
  function ingot(color, cls) {
    return `<svg class="ingot ${cls || ''}" viewBox="2.3 8.3 27.4 19.4" aria-hidden="true">
      <path d="${INGOT_BARS}" fill="${color}" stroke="#000" stroke-opacity=".45"
            stroke-width="1.4" stroke-linejoin="round"/>
    </svg>`;
  }


  /* A named colour with an approximate hex behind it. The name is the datum;
     the swatch is there so the table reads at a glance. */
  const swatch = (hex) => hex
    ? `<span class="swatch" style="--sw:${esc(hex)}" aria-hidden="true"></span>` : '';

  const KIND_NAME = { furnace: 'Furnace', workshop: 'Workshop', place: 'Place' };
  const shopKind = (name) => (SHOPS[name] || {}).kind || 'workshop';

  const industry = (id) => INDUSTRIES.find((i) => i.id === id);
  const recipesOf = (id) => RECIPES.filter((r) =>
    r.industry === id || (r.also || []).includes(id));

  /* ── brewing ──────────────────────────────────────────────────── */
  /* The Still's 77 ingredients are not recipes — they are one recipe's input
     list. Indexed both ways so an item page can answer "what does my sun berry
     brew into?" and "where does sunshine come from?". */
  const BREW_IN  = new Map(BREWING.map((b) => [b.in, b]));
  const BREW_OUT = new Map(BREWING.map((b) => [b.out, b]));
  const brewStep = () => RECIPES.find((r) => r.id === 'brew');

  /* ── milling ──────────────────────────────────────────────────── */
  /* Same shape as brewing: one Mill Plants job, 33 plants, three powders. */
  const MILL_IN  = new Map(MILLING.map((m) => [m.in, m]));
  const MILL_OUT = new Map(MILLING.map((m) => [m.out, m]));
  const millStep = () => RECIPES.find((r) => r.id === 'mill');

  /* ── smelting ─────────────────────────────────────────────────── */
  /* Ores and alloys both answer "what comes out", so both get a picker. The
     rows carry the flat fields the picker filters on; the tables keep the
     game's facts. The bars are tinted with the metal's own colour, straight out
     of data/metals.js. */
  const ORE_ROWS = ORES.map((o) => ({
    ...o,
    in: o.ore,
    out: o.metal + (o.bonus ? ' + ' + o.bonus.metal : ''),
    hay: [o.ore, o.metal, o.bonus ? o.bonus.metal : '', o.found, 'ore smelt'].join(' ').toLowerCase()
  }));
  const ALLOY_ROWS = ALLOYS.map((a) => ({
    ...a,
    in: a.alloy,
    out: a.parts.map((x) => x.metal).join(' + '),
    contains: a.parts.map((x) => x.metal),
    use: a.weapon ? 'Weapons-grade' : 'Decorative',
    hay: [a.alloy, ...a.parts.map((x) => x.metal), a.weapon ? 'weapon armour' : 'decorative']
      .join(' ').toLowerCase()
  }));
  const ORE_BY   = new Map(ORE_ROWS.map((o) => [o.ore, o]));
  const ALLOY_BY = new Map(ALLOY_ROWS.map((a) => [a.alloy, a]));
  const smeltStep = () => RECIPES.find((r) => r.id === 'smelt-ore');
  const alloyStep = () => RECIPES.find((r) => r.id === 'make-alloy');

  /* ── dyeing ───────────────────────────────────────────────────── */
  /* The picker wants an `in`/`out` pair and flat facet fields, so the display
     shape is derived here rather than stored: the data file keeps the game's
     facts, this adds the browsing aids. `hay` widens the text filter to the
     source plant, which the dye's own name does not always contain — wild
     carrot gives carrot dye. */
  const DYE_ROWS = DYES.map((d) => ({
    ...d,
    in: d.dye,
    out: d.color,
    family: COLOR_FAM[d.color] || 'Other',
    made: d.milled ? 'Milled at a quern' : 'Other job',
    hay: [d.dye, d.color, d.from, d.part].join(' ').toLowerCase()
  }));
  const DYE_BY = new Map(DYE_ROWS.map((d) => [d.dye, d]));
  const dyeStep = () => RECIPES.find((r) => r.id === 'dye-thread');

  /* ── armour ───────────────────────────────────────────────────── */
  /* Forty-odd wearables against eleven body parts is a lookup, not a list, so
     the page is the same picker as the Still's — with the body figure standing
     in for the chips of a facet nobody would want to read as words. `covers`
     is the join between the two: a region lights up because some piece names
     it, and clicking it filters to exactly those pieces. */
  const BODY_BY  = new Map(BODY.map((b) => [b.id, b]));
  const partName = (id) => (BODY_BY.get(id) || { label: id }).label;
  const matName  = (code) => (ARMOR_MATS[code] || { name: code }).name;

  /* Material size ÷ 3, rounded down, minimum one — the game's own formula, so
     a piece only ever states its size and this stays true if one changes.
     Adamantine is the exception: it costs the size itself, in wafers. */
  const armorBars = (p) => Math.max(1, Math.floor(p.size / 3));

  const ARMOR_ROWS = ARMOR.map((p) => ({
    ...p,
    in: p.name,
    out: p.mats.map(matName).join(' · '),
    material: p.mats.map(matName),
    hay: [p.name, p.slot, p.kind, p.layer, p.avail || '',
          p.shaped ? 'shaped' : '', ...p.mats.map(matName),
          ...p.covers.map(partName), 'armour armor'].join(' ').toLowerCase()
  }));
  const ARMOR_BY = new Map(ARMOR_ROWS.map((p) => [p.id, p]));

  /* The figure: the dwarf underneath, the ten regions as squares over the top.
     Every region is a button so the page works from the keyboard; the silhouette
     is decoration and takes no hits. Nothing is drawn on the dwarf itself — a
     face would be the one part no armour in the game covers, which is a strange
     thing to put in the middle of a coverage diagram. */
  function bodyFigure() {
    return `<div class="body-wrap">
      <svg class="body-fig" viewBox="0 0 200 355" role="group"
           aria-label="Dwarf body — choose a part to filter the armour">
        <g class="body-shape" aria-hidden="true"
           transform="translate(0 354.5) scale(.0332226 -.0332226)"><path d="${DWARF}"/></g>
        ${BODY.map((b) => `<g class="bp" data-part="${esc(b.id)}" role="button" tabindex="0"
            aria-label="${esc(b.label)}"><title>${esc(b.label)}</title>${b.art}</g>`).join('')}
      </svg>
      <div class="body-cap">
        <strong class="body-name"></strong>
        <button class="body-all fchip" type="button" hidden>Whole body</button>
      </div>
      <p class="body-note"></p>
    </div>`;
  }

  /* Two marks, because the figure answers two questions at once: `on` is the
     part being filtered by, `cov` is what the piece in the panel below actually
     protects. Seeing a breastplate leave the arms bare is the whole point. */
  function syncBody(host, sel, pick) {
    const cur = sel.covers;
    const covered = pick ? pick.covers : [];
    host.querySelectorAll('.bp').forEach((g) => {
      g.classList.toggle('on', g.dataset.part === cur);
      g.classList.toggle('cov', covered.includes(g.dataset.part));
    });
    const part = BODY_BY.get(cur);
    host.querySelector('.body-name').textContent = part ? part.label : 'Click a body part';
    host.querySelector('.body-note').textContent = part ? (part.note || '')
      : 'Every piece is listed. Pick a part of the dwarf to see only what covers it.';
    host.querySelector('.body-all').hidden = !part;
  }

  function armorResult(p) {
    const bars   = armorBars(p);
    const metal  = p.mats.includes('M');
    const shops  = [...new Set(p.mats.map((c) => (ARMOR_MATS[c] || {}).workshop))];
    const skills = [...new Set(p.mats.map((c) => (ARMOR_MATS[c] || {}).skill))];

    const mat  = (c) => `<span class="chip in flat">${esc(matName(c))}</span>`;
    const part = (id) => `<button class="chip bp-chip" type="button"
      data-part="${esc(id)}">${esc(partName(id))}</button>`;

    return `<div class="brew-out">
      <div class="brew-flow">
        ${p.mats.map(mat).join('<span class="plus">or</span>')}
        <span class="brew-arrow">${ARROW}</span>
        <span class="chip out flat">${esc(p.name)}</span>
      </div>
      <div class="brew-meta">
        <span class="need kind" data-kind="${esc(p.kind)}">${esc(p.kind)}</span>
        <span class="need">${esc(p.layer)} layer</span>
        ${p.cov != null ? `<span class="need">${p.cov}% coverage</span>` : ''}
        ${p.block ? `<span class="need">${p.block}% block chance</span>` : ''}
        ${p.level ? `<span class="need">armour level ${esc(String(p.level))}</span>` : ''}
        ${p.elastic ? `<span class="need">${esc(p.elastic)}</span>` : ''}
        ${p.shaped ? `<span class="need warnish">${sym('warn')}shaped</span>` : ''}
        ${p.avail === 'foreign' ? `<span class="need warnish">${sym('warn')}dwarves cannot make it</span>` : ''}
        ${p.avail === 'uncommon' ? `<span class="need warnish">${sym('warn')}not every civilisation</span>` : ''}
      </div>

      <div class="armor-covers">
        <span class="flow-label">covers</span>
        ${p.covers.length ? p.covers.map(part).join('')
          : '<span class="muted">Nothing — it is held, not worn, and blocks the attack instead.</span>'}
      </div>

      <dl class="armor-stats">
        <div><dt>Material size</dt><dd>${p.size}</dd></div>
        ${metal ? `<div><dt>Metal cost</dt><dd>${bars} bar${bars === 1 ? '' : 's'}</dd></div>
          <div><dt>In adamantine</dt><dd>${p.size} wafer${p.size === 1 ? '' : 's'}</dd></div>` : ''}
        ${p.ls != null ? `<div><dt>Layer size</dt><dd>${p.ls}</dd></div>` : ''}
        ${p.perm != null ? `<div><dt>Permit</dt><dd>${p.perm}</dd></div>` : ''}
        ${p.melt ? `<div><dt>Melts back to</dt><dd>${p.melt} bars
          <span class="muted">(${Math.round(p.melt / bars * 100)}%)</span></dd></div>` : ''}
      </dl>

      <p class="brew-job">Made at ${shops.map((w) =>
        `<a class="chip shop" href="#/w/${encodeURIComponent(w)}">${icon(w)}${esc(w)}</a>`).join(' ')}
        by ${esc(skills.join(' or '))}.${metal
          ? ` The metal version costs <strong>${bars} bar${bars === 1 ? '' : 's'}</strong> of a
              weapons-grade metal, plus an anvil and a unit of fuel.` : ''}</p>

      ${p.note ? `<p class="brew-job">${esc(p.note)}</p>` : ''}
    </div>`;
  }

  /* ── item index, derived from the recipe graph ────────────────── */
  const ITEMS = new Map();
  const touch = (name) => {
    if (!ITEMS.has(name)) ITEMS.set(name, { name, madeBy: [], usedIn: [] });
    return ITEMS.get(name);
  };
  RECIPES.forEach((r) => {
    (r.in  || []).forEach((x) => touch(x.item).usedIn.push(r));
    (r.out || []).forEach((x) => touch(x.item).madeBy.push(r));
    (r.needs || []).forEach((n) => {
      const item = NEED_ITEM[n];
      if (item && !touch(item).usedIn.includes(r)) touch(item).usedIn.push(r);
    });
  });
  Object.values(NEED_ITEM).forEach(touch);

  /* Collapsing the brew recipes would otherwise strand 77 plants and 77 drinks
     outside the index, so register each pair against the one generic step. */
  const bridge = (rows, findStep) => rows.forEach((r) => {
    const step = findStep();
    if (!step) return;
    if (!touch(r.in).usedIn.includes(step)) touch(r.in).usedIn.push(step);
    if (!touch(r.out).madeBy.includes(step)) touch(r.out).madeBy.push(step);
  });
  bridge(BREWING, brewStep);
  bridge(MILLING, millStep);
  /* Only the input side here: a dye is a real item, but "Rust" is a colour, not
     something the fortress can hold. */
  ORE_ROWS.forEach((o) => {
    const step = smeltStep();
    if (!step) return;
    if (!touch(o.ore).usedIn.includes(step)) touch(o.ore).usedIn.push(step);
    [o.metal, o.bonus && o.bonus.metal].filter(Boolean).forEach((m) => {
      if (!touch(m + ' bar').madeBy.includes(step)) touch(m + ' bar').madeBy.push(step);
    });
  });
  ALLOY_ROWS.forEach((a) => {
    const step = alloyStep();
    if (!step) return;
    a.parts.forEach((x) => {
      if (!touch(x.metal + ' bar').usedIn.includes(step)) touch(x.metal + ' bar').usedIn.push(step);
    });
    if (!touch(a.alloy + ' bar').madeBy.includes(step)) touch(a.alloy + ' bar').madeBy.push(step);
  });
  DYE_ROWS.forEach((d) => {
    const step = dyeStep();
    if (!step) return;
    if (!touch(d.dye).usedIn.includes(step)) touch(d.dye).usedIn.push(step);
  });

  /* ── components ───────────────────────────────────────────────── */
  function chip(entry, kind) {
    const item = typeof entry === 'string' ? { item: entry } : entry;
    const qty = item.qty ? `<span class="qty">×${item.qty}</span>` : '';
    const col = metalColor(item.item);
    return `<a class="chip ${kind} ${col ? 'is-metal' : ''}"
      href="#/item/${encodeURIComponent(item.item)}">${col ? ingot(col) : ''}${esc(item.item)}${qty}</a>`;
  }

  function recipeCard(r, opts) {
    opts = opts || {};
    // the card's identity ingot: the first output that is a metal
    const metalOut = (r.out || []).map((x) => metalColor(x.item)).find(Boolean);
    const ins  = (r.in  || []).map((x) => chip(x, 'in')).join('');
    const outs = (r.out || []).map((x) => chip(x, 'out')).join('');
    const needs = (r.needs || []).map(needBadge).join('');

    const where = opts.showWorkshop
      ? `<div class="flow-row"><span class="flow-label">at</span>
           <a class="chip shop" href="#/w/${encodeURIComponent(r.workshop)}">
             ${icon(r.workshop)}${esc(r.workshop)}</a>
           ${r.skill && r.skill !== '—' ? `<span class="need">${esc(r.skill)}</span>` : ''}</div>`
      : '';

    return `<article class="rec" id="r-${esc(r.id)}">
      <h3>${metalOut ? ingot(metalOut, 'title') : ''}${esc(r.name)}</h3>
      <div class="flow">
        ${ins ? `<div class="flow-row"><span class="flow-label">in</span>${ins}</div>` : ''}
        ${where}
        <div class="arrow">${ARROW}</div>
        ${outs ? `<div class="flow-row"><span class="flow-label">out</span>${outs}</div>` : ''}
      </div>
      ${needs ? `<div class="needs">${needs}</div>` : ''}
      ${r.note ? `<p class="note">${esc(r.note)}</p>` : ''}
    </article>`;
  }

  /* ── the Still's brewing picker ───────────────────────────────── */
  /* Seven cards that differed only in one noun told you nothing seven times.
     This is the same information as a lookup: pick the plant you actually have,
     read what it turns into. The list is the source of truth for the filters,
     so adding a row to data/brewing.js needs no change here. */
  const valueTag = (v) =>
    `<span class="val" title="Drink value">${v}☼</span>`;

  /* The still at work: the plant drops in, the vessel fills in the drink's own
     colour, it bubbles, and the barrel below catches it. Drawn rather than
     described because the answer to "what do I get" is a picture. The clip ids
     are per-render — two of these can share a page. */
  let animSeq = 0;
  function brewAnim(b) {
    const id = 'brew-clip-' + (++animSeq);
    return `<svg class="brew-anim" data-kind="${esc(b.kind)}" viewBox="90 6 118 86" role="img"
      aria-label="${esc(b.in)} brewing into ${esc(b.out)} at the still">
      <defs>
        <clipPath id="${id}-v"><path d="M100 36h40c6 12 6 34 0 46H100c-6-12-6-34 0-46z"/></clipPath>
        <clipPath id="${id}-b"><path d="M172 62h28c3 7 3 19 0 26h-28c-3-7-3-19 0-26z"/></clipPath>
      </defs>

      <g clip-path="url(#${id}-v)">
        <rect class="liq" x="94" y="42" width="52" height="46"/>
        <circle class="bub b1" cx="112" cy="76" r="3"/>
        <circle class="bub b2" cx="127" cy="79" r="2.2"/>
        <circle class="bub b3" cx="119" cy="81" r="1.7"/>
      </g>
      <g clip-path="url(#${id}-b)"><rect class="liq keg" x="170" y="70" width="32" height="20"/></g>

      <g class="ink" fill="none" stroke="currentColor" stroke-width="2.2"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M112 36V26h16v10"/><path d="M116 26V22h8v4"/>
        <path d="M100 36h40c6 12 6 34 0 46H100c-6-12-6-34 0-46z"/>
        <path d="M96.5 50h47M96.5 68h47"/>
        <path d="M146 58h12v14"/>
        <path d="M172 62h28c3 7 3 19 0 26h-28c-3-7-3-19 0-26z"/>
        <path d="M169.5 71h33M169.5 79h33"/>
      </g>

      <g class="seed" fill="none" stroke="currentColor" stroke-width="2.2"
         stroke-linecap="round" stroke-linejoin="round">
        <circle cx="120" cy="17" r="4.5"/>
        <path d="M123 13c2-4 7-4.5 7-4.5s-.4 5-4 6.2"/>
      </g>
      <circle class="drip" cx="158" cy="76" r="2.6"/>
    </svg>`;
  }

  /* The quern at work: the plant drops into the eye of the stone, the handle
     goes round, and the powder pours off the rim into a bag. The powder takes
     the colour of what it is — flour, sugar or dye. */
  function millAnim(m) {
    const id = 'mill-clip-' + (++animSeq);
    return `<svg class="brew-anim mill-anim" data-kind="${esc(m.kind)}"
      ${m.hex ? `style="--brew:${esc(m.hex)}"` : ''} viewBox="8 4 116 88" role="img"
      aria-label="${esc(m.in)} milled into ${esc(m.out)} at the quern">
      <defs>
        <clipPath id="${id}-b"><path d="M100.5 56C95 60.8 89 67.4 89 71.6c0 3.3 2.4 4.8 5.7 4.8h18.6c3.3 0 5.7-1.5 5.7-4.8 0-4.2-6-10.8-11.5-15.6z"/></clipPath>
      </defs>

      <g clip-path="url(#${id}-b)"><rect class="pow keg" x="87" y="58" width="34" height="20"/></g>

      <g class="ink" fill="none" stroke="currentColor" stroke-width="2.4"
         stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="48" cy="42" rx="33" ry="12"/>
        <path d="M15 42v14c0 6.6 14.8 12 33 12s33-5.4 33-12V42"/>
        <rect x="96.25" y="47" width="15.5" height="4.2" rx="2"/>
        <path d="M97.4 51.2 100.5 56h7l3.1-4.8"/>
        <path d="M100.5 56C95 60.8 89 67.4 89 71.6c0 3.3 2.4 4.8 5.7 4.8h18.6c3.3 0 5.7-1.5 5.7-4.8 0-4.2-6-10.8-11.5-15.6"/>
      </g>

      <ellipse class="eye" cx="48" cy="42" rx="5.4" ry="2.4"/>
      <g class="handle" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
        <path d="M72 36V14"/><path d="M68 14h8"/>
      </g>

      <g class="grain" fill="none" stroke="currentColor" stroke-width="2.4"
         stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="48" cy="16" rx="3.4" ry="5"/><path d="M48 12v8"/>
      </g>
      <circle class="dust d1" cx="82" cy="52" r="2.6"/>
      <circle class="dust d2" cx="86" cy="55" r="2"/>
    </svg>`;
  }

  /* The furnace: ore drops in, the fire takes it, a bar comes out in the
     metal's own colour. */
  function smeltAnim(metal, label) {
    const col = metalColor(metal);
    return `<svg class="brew-anim smelt-anim" ${col ? `style="--brew:${esc(col)}"` : ''}
      viewBox="10 6 118 84" role="img" aria-label="${esc(label)}">
      <g class="ore" fill="none" stroke="currentColor" stroke-width="2.4"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M36 16l8-5 9 5-2 9-11 2-6-6z"/>
      </g>

      <g class="ink" fill="none" stroke="currentColor" stroke-width="2.4"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 84V38h54v46z"/>
        <path d="M69 38V20h12v18"/>
        <path d="M30 84V63a12 12 0 0 1 24 0v21"/>
      </g>

      <path class="fire" d="M42 79c-7.5-6-1.5-13.5 0-18 4.5 7.5 12 9 0 18z"/>
      <path class="spark s1" d="M74 30c-2-1.6-.4-3.6 0-4.8 1.2 2 3.2 2.4 0 4.8z"/>
      <path class="spark s2" d="M77 26c-1.5-1.2-.3-2.7 0-3.6.9 1.5 2.4 1.8 0 3.6z"/>

      <!-- The cast bar is the same three shapes as the ingot glyph, placed by a
           nested transform so the outer group is free for the CSS animation. -->
      <g class="bar">
        <g transform="translate(84.1 42.2) scale(1.31)">
          <path d="${INGOT_BARS}"/>
        </g>
      </g>
    </svg>`;
  }

  function oreResult(o, opts) {
    const step = smeltStep();
    const bar = (m) => {
      const c = metalColor(m);
      return `<a class="chip out" href="#/item/${encodeURIComponent(m + ' bar')}">${
        c ? ingot(c) : ''}${esc(m)}</a>`;
    };
    return `<div class="brew-out${(opts && opts.compact) ? ' beside' : ''}">
      ${smeltAnim(o.metal, o.ore + ' smelted into ' + o.metal)}
      <div class="brew-flow">
        <a class="chip in" href="#/item/${encodeURIComponent(o.ore)}">${esc(o.ore)}</a>
        <span class="brew-arrow">${ARROW}</span>
        ${bar(o.metal)}${o.bonus ? `<span class="plus">+</span>${bar(o.bonus.metal)}` : ''}
      </div>
      <div class="brew-meta">
        <span class="need kind">${o.bars} bars</span>
        ${o.bonus ? `<span class="need">${o.bonus.chance}% chance of ${o.bonus.bars} ${esc(o.bonus.metal.toLowerCase())}</span>` : ''}
        ${needBadge('fuel')}
      </div>
      <p class="brew-job">One <strong>Smelt Ore</strong> job at the smelter: a
        ${step && step.skill ? esc(step.skill) : 'Furnace operator'} and a unit of fuel —
        none at all if the smelter is built over magma.</p>
      <p class="brew-where"><span class="col-head">Found in</span> ${esc(o.found)}.</p>
    </div>`;
  }

  function alloyResult(a, opts) {
    const step = alloyStep();
    const part = (x) => {
      const c = metalColor(x.metal);
      return `<a class="chip in" href="#/item/${encodeURIComponent(x.metal + ' bar')}">${
        c ? ingot(c) : ''}${esc(x.metal)}${x.qty ? `<span class="qty">×${x.qty}</span>` : ''}</a>`;
    };
    const col = metalColor(a.alloy);
    return `<div class="brew-out${(opts && opts.compact) ? ' beside' : ''}">
      ${smeltAnim(a.alloy, a.parts.map((x) => x.metal).join(' and ') + ' alloyed into ' + a.alloy)}
      <div class="brew-flow">
        ${a.parts.map(part).join('<span class="plus">+</span>')}
        <span class="brew-arrow">${ARROW}</span>
        <a class="chip out" href="#/item/${encodeURIComponent(a.alloy + ' bar')}">${
          col ? ingot(col) : ''}${esc(a.alloy)}${a.bars ? `<span class="qty">×${a.bars}</span>` : ''}</a>
      </div>
      <div class="brew-meta">
        <span class="need kind" data-use="${esc(a.use)}">${esc(a.use)}</span>
        ${valueTag(a.value)}
        ${needBadge('fuel')}
        ${a.flux ? needBadge('flux') : ''}
      </div>
      <p class="brew-job">One <strong>${esc(a.alloy)}</strong> reaction at the smelter: a
        ${step && step.skill ? esc(step.skill) : 'Furnace operator'}, the bars above and a unit
        of fuel.${a.flux ? ' It also eats a flux stone — no flux on the map means no steel, ' +
        'no matter how much iron you dig.' : ''}${a.weapon
          ? ' Good enough to arm a militia with.' : ' Value, not weapons — it will not hold an edge.'}</p>
    </div>`;
  }

  /* The dyer's shop: cloth on a rod dips into the vat and comes back out in the
     dye's colour. Two cloths cross-faded at the bottom of the dip — one plain
     going down, one filled coming up — because that swap is the whole job. */
  function dyeAnim(d) {
    const id = 'dye-clip-' + (++animSeq);
    const hex = COLOR_HEX[d.color];
    return `<svg class="brew-anim dye-anim" ${hex ? `style="--brew:${esc(hex)}"` : ''}
      viewBox="18 8 96 84" role="img"
      aria-label="Cloth dyed ${esc(d.color)} with ${esc(d.dye)} at the dyer's shop">
      <defs>
        <clipPath id="${id}-v"><path d="M34 54h60v20c0 6.6-13.4 12-30 12s-30-5.4-30-12z"/></clipPath>
      </defs>

      <g clip-path="url(#${id}-v)">
        <rect class="bath" x="32" y="56" width="64" height="34"/>
        <ellipse class="ripple r1" cx="64" cy="60" rx="10" ry="3"/>
        <ellipse class="ripple r2" cx="64" cy="60" rx="10" ry="3"/>
      </g>

      <g class="cloth raw" fill="none" stroke="currentColor" stroke-width="2.4"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M54 20h20v22l-5 4-5-4-5 4-5-4z"/>
      </g>
      <path class="cloth dyed" d="M54 20h20v22l-5 4-5-4-5 4-5-4z"
            stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>

      <g class="ink" fill="none" stroke="currentColor" stroke-width="2.4"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M30 16h68"/><path d="M64 16v4"/>
        <ellipse cx="64" cy="54" rx="30" ry="9"/>
        <path d="M34 54v20c0 6.6 13.4 12 30 12s30-5.4 30-12V54"/>
      </g>
    </svg>`;
  }

  function dyeResult(d, opts) {
    const step = dyeStep();
    const known = (name) => ITEMS.has(name);
    const side = (name, kind) => known(name)
      ? `<a class="chip ${kind}" href="#/item/${encodeURIComponent(name)}">${esc(name)}</a>`
      : `<span class="chip ${kind} flat">${esc(name)}</span>`;
    const other = (opts && opts.compact) ? [] : RECIPES.filter((r) => r !== step &&
      (r.in || []).some((x) => x.item === d.dye));

    return `<div class="brew-out${(opts && opts.compact) ? ' beside' : ''}">
      ${dyeAnim(d)}
      <div class="brew-flow">
        ${side(d.dye, 'in')}
        <span class="brew-arrow">${ARROW}</span>
        <span class="chip out flat">${swatch(COLOR_HEX[d.color])}cloth in ${esc(d.color.toLowerCase())}</span>
      </div>
      <div class="brew-meta">
        <span class="need kind" data-fam="${esc(COLOR_FAM[d.color] || '')}">${esc(COLOR_FAM[d.color] || 'Colour')}</span>
        ${valueTag(d.value)}
        <span class="need">${d.part === 'Whole plant'
          ? 'from ' + esc(d.from.toLowerCase())
          : esc(d.part.toLowerCase()) + ' of ' + esc(d.from.toLowerCase())}</span>
        <span class="need">${d.milled ? 'Milled at a quern' : 'Other job'}</span>
      </div>
      <p class="brew-job">One <strong>Dye</strong> job at the dyer's shop: a
        ${step && step.skill ? esc(step.skill) : 'Dyer'}, the dye, and the thread, cloth or
        leather to colour. Dyeing adds the dye's ${d.value}☼ to the item's value, multiplied
        by the quality of the work.${d.milled ? ' This one you can make yourself, by milling ' +
        esc(d.from) + ' at a quern.' : ''}</p>
      ${other.length ? `<div class="brew-else">
        <p class="col-head">${esc(d.dye)} is also</p>
        <div class="flow-row">${other.map((r) =>
          `<a class="chip" href="#/i/${r.industry}#r-${esc(r.id)}">${esc(r.name)}</a>`).join('')}</div>
      </div>` : ''}
    </div>`;
  }

  function millResult(m, opts) {
    const step = millStep();
    const other = (opts && opts.compact) ? [] : RECIPES.filter((r) => r !== step &&
      (r.in || []).some((x) => x.item === m.in));
    return `<div class="brew-out${(opts && opts.compact) ? ' beside' : ''}">
      ${millAnim(m)}
      <div class="brew-flow">
        <a class="chip in" href="#/item/${encodeURIComponent(m.in)}">${esc(m.in)}</a>
        <span class="brew-arrow">${ARROW}</span>
        <a class="chip out" href="#/item/${encodeURIComponent(m.out)}">${esc(m.out)}</a>
      </div>
      <div class="brew-meta">
        <span class="need kind" data-kind="${esc(m.kind)}">${esc(m.kind)}</span>
        ${m.color ? `<span class="need">${swatch(m.hex)}${esc(m.color)}</span>` : ''}
        ${m.value ? valueTag(m.value) : ''}
        <span class="need">${esc(m.source)}</span>
        ${(step && (step.needs || []).includes('bag')) ? needBadge('bag') : ''}
      </div>
      <p class="brew-job">One <strong>Mill Plants</strong> job at the quern or millstone: a
        ${step && step.skill ? esc(step.skill) : 'Miller'} and an empty bag. The seeds come
        back — milling never eats them. A millstone grinds the same thing faster, but wants
        power from a windmill or water wheel.</p>
      ${other.length ? `<div class="brew-else">
        <p class="col-head">${esc(m.in)} is also</p>
        <div class="flow-row">${other.map((r) =>
          `<a class="chip" href="#/i/${r.industry}#r-${esc(r.id)}">${esc(r.name)}</a>`).join('')}</div>
      </div>` : ''}
    </div>`;
  }

  function brewResult(b, opts) {
    const step = brewStep();
    /* Brewing is rarely the only thing a plant is for — plump helmets are also
       food, sweet pods are also sugar. Worth saying before someone brews their
       last one. */
    const other = (opts && opts.compact) ? [] : RECIPES.filter((r) => r !== step &&
      (r.in || []).some((x) => x.item === b.in));
    return `<div class="brew-out${(opts && opts.compact) ? ' beside' : ''}">
      ${brewAnim(b)}
      <div class="brew-flow">
        <a class="chip in" href="#/item/${encodeURIComponent(b.in)}">${esc(b.in)}</a>
        <span class="brew-arrow">${ARROW}</span>
        <a class="chip out" href="#/item/${encodeURIComponent(b.out)}">${esc(b.out)}</a>
      </div>
      <div class="brew-meta">
        <span class="need kind" data-kind="${esc(b.kind)}">${esc(b.kind)}</span>
        ${valueTag(b.value)}
        <span class="need">${esc(b.type)}-based</span>
        <span class="need">${esc(b.source)}</span>
      </div>
      <p class="brew-job">One <strong>Brew Drink</strong> job at the Still: a
        ${step && step.skill ? esc(step.skill) : 'Brewer'} and an empty barrel or rock pot.
        The seeds come back — brewing never eats them.</p>
      ${other.length ? `<div class="brew-else">
        <p class="col-head">${esc(b.in)} is also</p>
        <div class="flow-row">${other.map((r) =>
          `<a class="chip" href="#/i/${r.industry}#r-${esc(r.id)}">${esc(r.name)}</a>`).join('')}</div>
      </div>` : ''}
    </div>`;
  }

  /* One picker drives both the still and the quern: the same list, filters and
     search, with each workshop supplying only its own result panel. */
  function mountPicker(host, cfg) {
    const rows = cfg.rows;
    const facets = cfg.facets;   // [{ key, label }]
    const sel = {};
    facets.forEach((f) => (sel[f.key] = 'all'));
    let q = '', pick = rows[0], shown = null;

    /* A facet is normally one value per row, but some are a list — an ore turns
       up in several rock types, an alloy contains several metals — so a row can
       sit under more than one chip. */
    const has = (r, f, v) => (f.multi ? (r[f.key] || []).includes(v) : r[f.key] === v);
    const values = (f) => f.multi
      ? [...new Set(rows.flatMap((r) => r[f.key] || []))]
      : [...new Set(rows.map((r) => r[f.key]))];
    /* A facet can put something in front of its chips — a colour square, say —
       and the picker can do the same for the list's right-hand column. */
    const chips = (f) => [['all', 'All']].concat(values(f).map((v) => [v, v]))
      .map(([v, label]) => `<button class="fchip ${v === sel[f.key] ? 'on' : ''}"
        data-f="${esc(f.key)}" data-v="${esc(v)}">${
          v === 'all' || !f.chip ? '' : f.chip(v)}${
          esc(v !== 'all' && f.chipLabel ? f.chipLabel(label) : label)}</button>`).join('');
    const rowIn  = cfg.rowIn  || (() => '');
    const rowOut = cfg.rowOut || (() => '');

    /* A facet the caller drives itself draws no chips — the armour page filters
       by body part from the figure in the panel, and a row of eleven chips
       saying the same thing would only be a second, worse control. */
    const drawn = facets.filter((f) => !f.silent);

    host.innerHTML = `
      <div class="brew">
        <div class="brew-pick">
          ${drawn.length ? `<div class="brew-filters">
            ${drawn.map((f) =>
              `<div class="frow"><span class="flabel">${esc(f.label)}</span>${chips(f)}</div>`).join('')}
          </div>` : ''}
          <input class="brew-search" type="search" placeholder="${esc(cfg.placeholder)}"
                 autocomplete="off" spellcheck="false" aria-label="${esc(cfg.placeholder)}">
          <div class="brew-list" role="listbox" aria-label="${esc(cfg.listLabel)}"></div>
        </div>
        <div class="brew-panel">${cfg.aside || ''}<div class="panel-result"></div></div>
      </div>`;

    const list   = host.querySelector('.brew-list');
    const panel  = host.querySelector('.panel-result');
    const search = host.querySelector('.brew-search');
    const byIn   = new Map(rows.map((r) => [r.in, r]));

    const hay = (r) => r.hay || (r.in + ' ' + r.out).toLowerCase();
    const matches = () => rows.filter((r) =>
      facets.every((f) => sel[f.key] === 'all' || has(r, f, sel[f.key])) &&
      (!q || hay(r).includes(q)));

    function paint() {
      const hits = matches();
      /* Keep the selection if it survived the filter, otherwise follow the list
         — an empty panel next to a full list reads as a broken page. */
      if (!hits.includes(pick)) pick = hits[0];

      list.innerHTML = hits.length
        ? hits.map((r) => `<button data-in="${esc(r.in)}" role="option"
             aria-selected="${r === pick}" class="${r === pick ? 'on' : ''}">
             <span class="bi">${rowIn(r)}${esc(r.in)}</span>
             <span class="bo">${rowOut(r)}${esc(r.out)}</span></button>`).join('')
        : `<p class="none">${esc(cfg.empty)}</p>`;

      /* Only rebuild the panel when the choice really changed — otherwise every
         keystroke in the filter would restart the animation. */
      if (pick !== shown) {
        panel.innerHTML = pick ? cfg.result(pick) : '';
        shown = pick;
      }
      const on = list.querySelector('button.on');
      if (on) on.scrollIntoView({ block: 'nearest' });
      if (cfg.onPaint) cfg.onPaint(api, { pick, sel, hits });
    }

    /* What a caller needs to drive a filter from its own control and to know
       what the picker settled on afterwards. */
    const api = {
      get: (key) => sel[key],
      set(key, v) {
        sel[key] = v;
        host.querySelectorAll(`.fchip[data-f="${key}"]`).forEach((x) =>
          x.classList.toggle('on', x.dataset.v === v));
        paint();
      },
      select(row) { pick = row; paint(); }
    };

    const filters = host.querySelector('.brew-filters');
    if (filters) filters.addEventListener('click', (ev) => {
      const b = ev.target.closest('.fchip');
      if (b) api.set(b.dataset.f, b.dataset.v);
    });

    search.addEventListener('input', () => { q = search.value.trim().toLowerCase(); paint(); });

    list.addEventListener('click', (ev) => {
      const b = ev.target.closest('button');
      if (!b) return;
      api.select(byIn.get(b.dataset.in));
    });

    if (cfg.start) pick = rows.find((r) => r.id === cfg.start) || pick;
    paint();
    return api;
  }

  /* ── the pickers, and which workshops carry one ───────────────── */
  /* Each entry replaces the generic step it names: the step stays in the recipe
     graph so the chain map is honest, and its page shows this instead. The
     workshop list reads the same table to mark the buildings that are
     interactive, so the badge cannot drift from what the page actually does. */
  const PICKERS = [
    { step: 'brew', title: 'Brewing', noun: 'brewable ingredients',
      rows: BREWING, result: brewResult,
      facets: [{ key: 'kind', label: 'Drink' }, { key: 'source', label: 'Source' }],
      placeholder: 'Filter ingredients…', listLabel: 'Brewing ingredients',
      empty: 'No ingredient matches those filters.' },

    { step: 'mill', title: 'Milling', noun: 'millable plants',
      rows: MILLING, result: millResult,
      facets: [{ key: 'kind', label: 'Product' }, { key: 'source', label: 'Source' }],
      placeholder: 'Filter plants…', listLabel: 'Millable plants',
      empty: 'No plant matches those filters.' },

    { step: 'dye-thread', title: 'Dyes', noun: 'dyes',
      rows: DYE_ROWS, result: dyeResult,
      /* The chips read as "show me the blues", so they are plural; the value
         behind them stays the singular tone stored on the dye. */
      facets: [{ key: 'family', label: 'Tone',
                 chip: (v) => swatch(FAMILY_HEX[v]), chipLabel: (v) => v + 's' },
               { key: 'made', label: 'From' }],
      rowOut: (r) => swatch(COLOR_HEX[r.color]),
      placeholder: 'Filter dyes…', listLabel: 'Dyes',
      empty: 'No dye matches those filters.' },

    { step: 'smelt-ore', title: 'Ores', noun: 'ores',
      rows: ORE_ROWS, result: oreResult,
      facets: [{ key: 'metal', label: 'Metal' },
               { key: 'rocks', label: 'Found in', multi: true }],
      rowOut: (r) => { const c = metalColor(r.metal); return c ? ingot(c) : ''; },
      placeholder: 'Filter ores…', listLabel: 'Ores',
      empty: 'No ore matches those filters.' },

    { step: 'make-alloy', title: 'Alloys', noun: 'alloy recipes',
      rows: ALLOY_ROWS, result: alloyResult,
      facets: [{ key: 'use', label: 'Use' },
               { key: 'contains', label: 'Contains', multi: true }],
      rowIn: (r) => { const c = metalColor(r.alloy); return c ? ingot(c) : ''; },
      placeholder: 'Filter alloys…', listLabel: 'Alloys',
      empty: 'No alloy matches those filters.' }
  ];

  const pickersFor = (steps) => PICKERS.filter((p) =>
    p.rows.length && steps.some((r) => r.id === p.step));

  /* The marker on a workshop that answers questions rather than listing jobs.
     It belongs on the list, where the cards are otherwise indistinguishable —
     the workshop's own page has the picker right there on it and needs no
     label. It carries no words, so the tooltip does the explaining, and names
     the tables since a mark alone cannot say whether that means two rows or
     seventy-seven. */
  function liveMark(picks) {
    const what = picks.map((p) => `${p.rows.length} ${p.noun}`).join(' and ');
    return `<span class="live-mark" title="Pick from ${esc(what)} and see what comes out"
      >${sym('spark')}</span>`;
  }

  /* ── views ────────────────────────────────────────────────────── */
  function viewHome() {
    const cards = INDUSTRIES.map((i) => {
      const n = recipesOf(i.id).length;
      return `<a class="ind-card" href="#/i/${i.id}" style="--c:${i.color}">
        <div class="ic">${sym(i.icon, 'ind')}</div>
        <h2>${esc(i.name)}</h2>
        <p>${esc(i.blurb)}</p>
        <div class="count">${n} step${n === 1 ? '' : 's'}</div>
      </a>`;
    }).join('');

    main.innerHTML = `
      <section class="hero">
        <h1>Every chain, from boulder to masterwork</h1>
        <p>An interactive map of the Dwarf Fortress industries: what turns into what, at which
        workshop, with which skill, and which empty barrel is stopping the whole thing.
        Click any item to see everything that makes it and everything it feeds.</p>
      </section>
      <div class="ind-grid">${cards}</div>`;
  }

  function viewIndustry(id, mode) {
    const ind = industry(id);
    if (!ind) return viewHome();
    const rs = recipesOf(id);

    const tabs = `<div class="view-tabs">
      <button data-mode="list" class="${mode !== 'map' ? 'on' : ''}">Steps</button>
      <button data-mode="map" class="${mode === 'map' ? 'on' : ''}">Chain map</button>
    </div>`;

    main.innerHTML = `
      <a class="back" href="#/">${sym('back')}All industries</a>
      <div class="page-head">
        <div>
          <h1>${sym(ind.icon)} ${esc(ind.name)}</h1>
          <p>${esc(ind.blurb)}</p>
        </div>
      </div>
      ${tabs}
      <div id="ind-body"></div>`;

    main.querySelector('.view-tabs').addEventListener('click', (ev) => {
      const b = ev.target.closest('button');
      if (b) location.hash = `#/i/${id}` + (b.dataset.mode === 'map' ? '/map' : '');
    });

    const body = document.getElementById('ind-body');

    if (mode === 'map') {
      body.innerHTML = '<div class="graph-shell" id="graph"></div>';
      window.DFGraph.render(
        document.getElementById('graph'), rs, ind.color,
        (item) => { location.hash = '#/item/' + encodeURIComponent(item); },
        metalColor
      );
      return;
    }

    const byShop = new Map();
    rs.forEach((r) => {
      if (!byShop.has(r.workshop)) byShop.set(r.workshop, []);
      byShop.get(r.workshop).push(r);
    });

    body.innerHTML = [...byShop].map(([shop, list]) => {
      const skills = [...new Set(list.map((r) => r.skill).filter((s) => s && s !== '—'))].join(' · ');
      return `<section class="shop-group">
        <div class="shop-head">
          <a class="shop-link" href="#/w/${encodeURIComponent(shop)}">
            ${icon(shop, 'lg')}<h2>${esc(shop)}</h2>
          </a>
          ${skills ? `<span class="skill">${esc(skills)}</span>` : ''}
        </div>
        <div class="rec-grid">${list.map((r) => recipeCard(r)).join('')}</div>
      </section>`;
    }).join('');
  }

  function viewItem(name) {
    const info = ITEMS.get(name);
    if (!info) {
      main.innerHTML = `<a class="back" href="#/">${sym('back')}All industries</a>
        <div class="page-head"><div><h1>${esc(name)}</h1>
        <p>Nothing in the data references this item.</p></div></div>`;
      return;
    }

    const note = NOTES[name];
    const brew = BREW_IN.get(name) || BREW_OUT.get(name);
    const mill = MILL_IN.get(name) || MILL_OUT.get(name);
    const dye  = DYE_BY.get(name);
    const ore  = ORE_BY.get(name);
    /* Bars are named "Steel bar" as items but "Steel" in the tables. */
    const asMetal = name.replace(/\s+bars?$/i, '');
    const alloy = ALLOY_BY.get(asMetal);
    const fromOre = ORE_ROWS.filter((o) =>
      o.metal === asMetal || (o.bonus && o.bonus.metal === asMetal));
    const list = (rs) => rs.length
      ? `<div class="stack">${rs.map((r) => recipeCard(r, { showWorkshop: true })).join('')}</div>`
      : '<p class="none">Nothing here — this is a raw input or a dead end.</p>';

    main.innerHTML = `
      <a class="back" href="#/">${sym('back')}All industries</a>
      <div class="item-head">
        <h1>${metalColor(name) ? ingot(metalColor(name), 'big') : ''}${esc(name)}</h1>
        ${note ? `<p class="item-note">${esc(note)}</p>` : ''}
      </div>
      ${brew ? `<p class="col-head">At the Still</p>${brewResult(brew, { compact: true })}` : ''}
      ${mill ? `<p class="col-head">At the quern</p>${millResult(mill, { compact: true })}` : ''}
      ${dye ? `<p class="col-head">At the dyer's shop</p>${dyeResult(dye, { compact: true })}` : ''}
      ${ore ? `<p class="col-head">At the smelter</p>${oreResult(ore, { compact: true })}` : ''}
      ${alloy ? `<p class="col-head">At the smelter</p>${alloyResult(alloy, { compact: true })}` : ''}
      ${(!ore && fromOre.length) ? `<p class="col-head">Smelted from <span class="n">${fromOre.length}</span></p>
        <div class="ore-list">${fromOre.map((o) =>
          `<a class="chip" href="#/item/${encodeURIComponent(o.ore)}">${esc(o.ore)}</a>`).join('')}</div>` : ''}
      <div class="two-col">
        <div>
          <p class="col-head">Made by <span class="n">${info.madeBy.length}</span></p>
          ${list(info.madeBy)}
        </div>
        <div>
          <p class="col-head">Used in <span class="n">${info.usedIn.length}</span></p>
          ${list(info.usedIn)}
        </div>
      </div>`;
  }

  function viewWorkshops() {
    const order = ['workshop', 'furnace', 'place'];
    const heading = {
      workshop: ['Workshops', 'Built from the workshop menu. No fuel, just a dwarf and the right skill.'],
      furnace:  ['Furnaces', 'Each job burns a unit of fuel — charcoal or coke — unless the furnace is built over magma.'],
      place:    ['Places & zones', 'Not buildings: jobs that happen out in the world, in a plot, or in a zone.']
    };

    const groups = new Map(order.map((k) => [k, []]));
    [...new Set(RECIPES.map((r) => r.workshop))].forEach((w) =>
      groups.get(shopKind(w)).push(w));

    const card = (w) => {
      const steps = RECIPES.filter((r) => r.workshop === w);
      const skills = [...new Set(steps.map((r) => r.skill).filter((x) => x && x !== '—'))];
      const meta = SHOPS[w] || {};
      const picks = pickersFor(steps);
      return `<a class="ws-card" href="#/w/${encodeURIComponent(w)}" data-tier="${meta.tier || ''}">
        ${picks.length ? liveMark(picks) : ''}
        <div class="ws-art">${plate(w, 'xl')}</div>
        <div class="ws-body">
          <h3>${esc(w)}</h3>
          ${meta.note ? `<p>${esc(meta.note)}</p>` : ''}
          <div class="ws-meta">
            <span class="count">${steps.length} step${steps.length === 1 ? '' : 's'}</span>
            ${meta.tier ? `<span class="need tier">Tier ${meta.tier}</span>` : ''}
            ${skills.map((sk) => `<span class="need">${esc(sk)}</span>`).join('')}
          </div>
        </div>
      </a>`;
    };

    main.innerHTML = `
      <div class="page-head"><div>
        <h1>Workshops</h1>
        <p>Every building and place a job can happen, and what comes out of it.
        Almost all of them are 3×3. The tier is how far the building sits from raw
        material: a tier 1 building eats what the map gives you, tier 2 eats tier 1’s
        output, tier 3 eats tier 2’s.</p>
      </div></div>
      <div class="ws-filters frow">
        <span class="flabel">Tier</span>
        ${[['all', 'All'], ['1', '1'], ['2', '2'], ['3', '3']].map(([v, label]) =>
          `<button class="fchip ${v === 'all' ? 'on' : ''}" data-tier="${v}">${label}</button>`).join('')}
      </div>
      ${order.map((k) => `
        <section class="shop-group">
          <div class="shop-head"><h2>${heading[k][0]}</h2></div>
          <p class="group-note">${heading[k][1]}</p>
          <div class="ws-grid">${groups.get(k).map(card).join('')}</div>
        </section>`).join('')}`;

    /* Hiding cards is only half of it: a section whose cards have all gone would
       otherwise leave its heading and note sitting over an empty grid. Places
       and zones have no tier at all, so that whole group drops out of every
       filter but All — which is the honest answer, they are not workshops. */
    const bar = main.querySelector('.ws-filters');
    bar.addEventListener('click', (ev) => {
      const chip = ev.target.closest('.fchip');
      if (!chip) return;
      const tier = chip.dataset.tier;
      bar.querySelectorAll('.fchip').forEach((c) => c.classList.toggle('on', c === chip));
      main.querySelectorAll('.ws-card').forEach((c) => {
        c.hidden = tier !== 'all' && c.dataset.tier !== tier;
      });
      main.querySelectorAll('.shop-group').forEach((s) => {
        s.hidden = !s.querySelector('.ws-card:not([hidden])');
      });
    });
  }

  function viewWorkshop(name) {
    const steps = RECIPES.filter((r) => r.workshop === name);
    if (!steps.length) return viewWorkshops();

    const meta = SHOPS[name] || {};
    const kind = shopKind(name);
    const skills = [...new Set(steps.map((r) => r.skill).filter((x) => x && x !== '—'))];
    const inds = [...new Set(steps.flatMap((r) => [r.industry, ...(r.also || [])]))]
      .map(industry).filter(Boolean);
    const burnsFuel = steps.some((r) => (r.needs || []).includes('fuel'));
    const picks = pickersFor(steps);
    /* A picker states its job, skill and container itself, so the generic card
       it stands in for would only say the same thing again. Any other job at
       the building still gets one. */
    const jobs = steps.filter((r) => !picks.some((p) => p.step === r.id));

    main.innerHTML = `
      <a class="back" href="#/w">${sym('back')}All workshops</a>
      <div class="ws-head">
        <div class="ws-art big">${plate(name, 'xxl')}</div>
        <div>
          <h1>${esc(name)}</h1>
          <div class="ws-meta">
            <span class="need">${KIND_NAME[kind]}</span>
            ${meta.tier ? `<span class="need tier">Tier ${meta.tier}</span>` : ''}
            ${burnsFuel ? `<span class="need">${sym('flame')}burns fuel</span>` : ''}
            ${skills.map((sk) => `<span class="need">${esc(sk)}</span>`).join('')}
          </div>
          ${meta.note ? `<p class="item-note">${esc(meta.note)}</p>` : ''}
          ${meta.keys ? `<p class="ws-build">Build ${keycaps(meta.keys)}
            <span class="dot">·</span> ${esc(meta.size || '3×3')}${meta.magma
              ? ` <span class="dot">·</span> the magma version burns no fuel` : ''}</p>` : ''}
          <p class="muted ws-inds">Feeds ${inds.map((i) =>
            `<a href="#/i/${i.id}">${sym(i.icon)} ${esc(i.name)}</a>`).join(', ')}</p>
        </div>
      </div>
      ${picks.map((p, i) => `
        <p class="col-head">${esc(p.title)} <span class="n">${p.rows.length}</span></p>
        <div id="pick-${i}"></div>`).join('')}
      ${jobs.length ? `<p class="col-head">Jobs <span class="n">${jobs.length}</span></p>
                       <div class="rec-grid">${jobs.map((r) => recipeCard(r)).join('')}</div>` : ''}`;

    picks.forEach((p, i) => mountPicker(document.getElementById('pick-' + i), p));
  }

  /* Tables opt in to decoration per column via `decorate: { 1: 'metal' }`.
     A cell may name more than one metal ("Copper + Silver"), so split on the plus. */
  function refCell(text, col, table) {
    const how = table.decorate && table.decorate[col];
    if (how === 'color') return swatch(COLOR_HEX[String(text).trim()]) + esc(text);
    if (how !== 'metal') return esc(text);
    return String(text).split('+').map((part) => {
      const name = part.trim();
      const col2 = metalColor(name);
      return (col2 ? ingot(col2) : '') + esc(name);
    }).join('<span class="plus">+</span>');
  }

  /* Two pages are made of these tables — the reference and the notes under the
     armour picker — so the markup lives in one place and a table only has to
     say which page anchors it. */
  const refToc = (tables, route) => `<div class="toc">${tables.map((t) =>
    `<a href="#/${route}#${t.id}">${sym(t.icon)} ${esc(t.title)}</a>`).join('')}</div>`;

  const refBlocks = (tables) => tables.map((t) => `
    <section class="ref-block" id="${t.id}">
      <h2>${sym(t.icon)} ${esc(t.title)}</h2>
      <p>${esc(t.blurb)}</p>
      <div class="table-wrap"><table>
        <thead><tr>${t.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>${t.rows.map((row) =>
          `<tr>${row.map((cell, ci) => `<td>${refCell(cell, ci, t)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>
    </section>`).join('');

  function viewReference() {
    main.innerHTML = `
      <div class="page-head"><div>
        <h1>Reference</h1>
        <p>The tables you keep alt-tabbing to look up.</p>
      </div></div>
      ${refToc(REFERENCE, 'reference')}
      ${refBlocks(REFERENCE)}`;
  }

  /* The armour page: pick a part of the dwarf, see what covers it. The picker
     is the one the Still uses, with the figure in place of a facet's chips and
     the chosen piece's card below it. */
  function viewArmor(id) {
    main.innerHTML = `
      <div class="page-head"><div>
        <h1>${sym('shield')} Armor</h1>
        <p>There is no suit of armour in this game, only pieces — and a dwarf is
        covered exactly where the pieces reach. Click the dwarf to see what protects
        that part; click a piece to see how far it reaches.</p>
      </div></div>
      <div id="armor-pick"></div>
      ${refToc(ARMOR_TABLES, 'armor')}
      ${refBlocks(ARMOR_TABLES)}`;

    const host = document.getElementById('armor-pick');

    const api = mountPicker(host, {
      rows: ARMOR_ROWS,
      start: id,
      aside: bodyFigure(),
      result: armorResult,
      rowIn: eqSprite,
      facets: [
        { key: 'covers', label: 'Body part', multi: true, silent: true },
        { key: 'kind', label: 'Type' },
        { key: 'material', label: 'Made of', multi: true },
        { key: 'layer', label: 'Layer' }
      ],
      placeholder: 'Filter armour…',
      listLabel: 'Armour and clothing',
      empty: 'Nothing covers that part with those filters. Try widening them.',
      onPaint: (a, state) => syncBody(host, state.sel, state.pick)
    });

    /* Clicking the same part twice clears it — otherwise the only way back to
       the whole list is a button somebody has to notice. The coverage chips on
       the card select a part too, so the card and the figure drive each other. */
    const choose = (part) => api.set('covers', part === api.get('covers') ? 'all' : part);

    host.addEventListener('click', (ev) => {
      if (ev.target.closest('.body-all')) return api.set('covers', 'all');
      const g = ev.target.closest('.bp, .bp-chip');
      if (g) choose(g.dataset.part);
    });

    host.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      const g = ev.target.closest('.bp');
      if (!g) return;
      ev.preventDefault();
      choose(g.dataset.part);
    });
  }

  function viewAbout() {
    main.innerHTML = `
      <div class="page-head"><div><h1>About</h1></div></div>
      <div class="prose">
        <p>DF Companion is a static, dependency-free reference for the industry chains in
        <a href="https://www.bay12games.com/dwarves/" target="_blank" rel="noopener">Dwarf Fortress</a>.
        Every page on this site is generated from ten data files, so extending it means editing
        JavaScript objects rather than HTML. Nothing is loaded from the network. Every icon
        here, down to the back arrow, is inline SVG; the only bitmaps are the pixel-art
        workshop plates and the equipment sheet the armour list reads its sprites from.</p>

        <h2>Adding a step</h2>
        <p>Open <code>data/recipes.js</code> and add an entry to <code>window.DF_RECIPES</code>:</p>
        <pre><code>{ id:'brew-sunshine', name:'Brew sunshine',
  industry:'food', workshop:'Still', skill:'Brewer',
  needs:['barrel'],
  in:  [{ item:'Sun berry' }],
  out: [{ item:'Sunshine' }, { item:'Seeds' }],
  note:'Optional flavour text.' }</code></pre>
        <p>Item pages, the search index and the chain maps all rebuild themselves from that —
        an item exists as soon as some recipe mentions it. Valid <code>needs</code> values are
        <code>fuel</code>, <code>flux</code>, <code>bag</code>, <code>barrel</code>,
        <code>jug</code>, <code>bucket</code> and <code>shop</code>.</p>

        <h2>Adding a workshop</h2>
        <p><code>data/workshops.js</code> holds the artwork and blurb for each building.
        Icons are inline SVG on a 32×32 grid, stroked in <code>currentColor</code>; shapes
        marked <code>class="ac"</code> take the accent colour. Each entry also carries a
        <code>box</code> (the art's measured bounding box, so the icon fills its frame) and
        a <code>sw</code> (stroke width scaled to that frame, so every icon keeps the same
        line weight). If you redraw one, re-measure it rather than guessing:</p>
        <pre><code>// in the browser console, on any page of this site
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('viewBox', '0 0 32 32');
document.body.append(svg);
svg.innerHTML = DF_WORKSHOPS['Still'].art;
svg.getBBox();   // pad by 1.4, then sw = 1.7 * max(w, h) / 32</code></pre>
        <p>A workshop with no entry still works — it falls back to a generic building icon.</p>

        <h2>One step, many ingredients</h2>
        <p>Four workshops do not get a list of job cards. The Still runs a single job —
        Brew Drink — against 77 ingredients, the quern runs Mill Plants against 33, the
        dyer's shop runs Dye against 72, and the smelter smelts 17 ores and alloys 14
        recipes. Cards that differ only in which thing went in say the same thing dozens of
        times, so each is one generic step in <code>data/recipes.js</code> plus a table of
        its own: <code>data/brewing.js</code>, <code>data/milling.js</code>,
        <code>data/dyes.js</code> and <code>data/smelting.js</code>.</p>
        <p>The <code>PICKERS</code> table lists them, keyed by the generic step each one
        replaces. The workshop list reads that same table to put a mark in the corner of
        those cards, so it cannot claim something the page does not do. Only the list is
        marked — on the workshop's own page the picker is right there.</p>
        <p>A picker facet can read a list instead of a single value, which is how one ore
        sits under three different rock types and one alloy under each metal it contains.
        The smelter's bars are tinted with the metal's own colour from
        <code>data/metals.js</code>.</p>
        <pre><code>{ in: 'Sun berry', out: 'Sunshine', kind: 'Other', value: 5,
  type: 'Plant', source: 'Surface crop' }

{ in: 'Dimple cup', out: 'Dimple dye', kind: 'Dye', source: 'Subterranean crop',
  color: 'Midnight blue', hex: '#191970', value: 20 }</code></pre>
        <p>Each workshop's page turns its table into a picker. <code>kind</code> and
        <code>source</code> generate the filter chips, so adding a row is the whole job —
        the filters, the search, the item pages and the site search all pick it up. A plant
        that both brews and mills gets both cards on its item page.</p>
        <p>Milling grinds flour for the food chain and dye for the textiles one, which is
        more than one industry per step. That is what <code>also: ['textiles']</code> on a
        recipe is for.</p>
        <p>The dye colours come from the wiki, which names a colour but publishes no value
        for it. <code>window.DF_COLOR_HEX</code> turns a name into an approximate hex for
        the swatch, <code>window.DF_COLOR_FAMILY</code> groups the names into tones so the
        dyer's shop can be filtered by tone, and <code>window.DF_FAMILY_HEX</code> gives each
        tone one representative colour for its filter chip. All three are reading aids taken
        off the name — the name is the real datum, and a colour missing from a map simply
        renders without a swatch or a tone. Only four of the game's seventy-two dyes come off a quern; the
        Reference page's dye table lists them all, built from the same array so the list
        exists in one place.</p>

        <h2>Symbols</h2>
        <p><code>data/icons.js</code> holds every icon that is not workshop artwork —
        industries, the <code>needs</code> flags, reference tables, the back link and the
        theme toggle. It follows the same contract as the workshop art: inline SVG on a
        32&times;32 grid, stroked in <code>currentColor</code>, with a measured
        <code>box</code> and a scaled <code>sw</code>. An industry or a table names a key
        in here rather than carrying a character, so a symbol inherits the colour and size
        of whatever it sits in — an industry symbol takes that industry's colour, a badge
        symbol shrinks with the badge — and an unknown name draws nothing rather than a
        wrong picture.</p>

        <h2>Metal colours</h2>
        <p><code>data/metals.js</code> tints the ingot icon — three stacked bars, the same
        shapes as the <code>metal</code> symbol but filled rather than stroked — on any bar,
        wafer or metal name.
        The colours are real metal tones, one hex per metal. They are not the game's: DF
        draws every metal from a 16-colour palette, which puts steel, tin, zinc, nickel,
        billon and pewter all on the same light gray and iron, lead and pig iron all on the
        same dark gray. That is fine in a game where you read the name, and no help at all
        in a reference whose swatch exists to tell one bar from another.</p>
        <p>An item finds its colour by name, with a trailing <code>bar</code>, <code>wafer</code>,
        <code>strands</code> or <code>ingot</code> stripped — so <code>Steel bar</code> and
        <code>Adamantine wafers</code> both resolve. Reference tables opt a column in with
        <code>decorate: { 1: 'metal' }</code>.</p>

        <h2>Adding a reference table</h2>
        <p><code>data/reference.js</code> holds plain <code>columns</code> / <code>rows</code>
        arrays. Add an object, and it appears on the
        <a href="#/reference">Reference page</a> with its own anchor. The notes under the
        armour picker are the same shape, in <code>DF_ARMOR_TABLES</code>, and go through
        the same renderer.</p>

        <h2>Adding a piece of armour</h2>
        <p><code>data/armor.js</code> holds the body figure, the material codes and every
        wearable. A piece names the body parts it covers, and those ids are the regions of
        the figure — so the diagram and the coverage data cannot disagree:</p>
        <pre><code>{ id:'mail-shirt', name:'Mail shirt', slot:'Upper body', kind:'Armor',
  covers:['upper-body','lower-body','neck','upper-arms','upper-legs'],
  mats:['M'], size:6, ls:15, perm:50, layer:'Over', cov:100,
  level:2, elastic:'Chain', melt:1.8 }</code></pre>
        <p>Metal cost is not stored: it is material size ÷ 3, rounded down, minimum one, and
        the page computes it. <code>mats</code> are one-letter codes into
        <code>DF_ARMOR_MATS</code>, which is what decides the workshop and the labour. Add a
        region to <code>DF_BODY</code> and it becomes clickable the moment some piece names it.</p>

        <h2>Accuracy</h2>
        <p>Chains and workshops follow current Dwarf Fortress. Exact bar and unit yields have
        shifted between versions, so only the ones that are stable (charcoal, coke) carry
        numbers here — check the
        <a href="https://dwarffortresswiki.org" target="_blank" rel="noopener">wiki</a>
        before betting a fortress on a quantity.</p>

        <h2>Credits</h2>
        <p>The structure is modelled on Max Cantor's excellent printable cheat sheet at
        <a href="https://thingsfittogether.com" target="_blank" rel="noopener">thingsfittogether.com</a>,
        which is worth having on the wall next to your monitor. That poster is not
        redistributed here.</p>
        <p>Dwarf Fortress is by Bay 12 Games, published by Kitfox Games. This is an unaffiliated
        fan project.</p>
      </div>`;
  }

  /* ── search ───────────────────────────────────────────────────── */
  /* Each entry carries a `hay` blob so that searching for "barrel" turns up
     every step that needs one, not just the item called Barrel. */
  const INDEX = [];

  ITEMS.forEach((v, name) => {
    /* A brewable plant or its drink says what it pairs with rather than
       counting steps — every one of them has the same single step. */
    const b = BREW_IN.get(name) || BREW_OUT.get(name);
    const m = MILL_IN.get(name) || MILL_OUT.get(name);
    const says = [];
    if (b) says.push(BREW_IN.has(name) ? `brews into ${b.out}` : `brewed from ${b.in}`);
    if (m) says.push(MILL_IN.has(name) ? `mills into ${m.out}` : `milled from ${m.in}`);
    const dy = DYE_BY.get(name);
    if (dy) says.push(`dyes ${dy.color.toLowerCase()}`);
    const or = ORE_BY.get(name);
    if (or) says.push(`smelts into ${or.metal.toLowerCase()}`);
    const al = ALLOY_BY.get(name.replace(/\s+bars?$/i, ''));
    if (al) says.push(al.parts.map((x) => x.metal.toLowerCase()).join(' + '));
    INDEX.push({
      kind: 'item', label: name,
      sub: says.length ? says.join(' · ')
                       : `made by ${v.madeBy.length} · used in ${v.usedIn.length}`,
      hay: [name,
            b ? [b.in, b.out, b.kind, b.type, b.source, 'brew still'].join(' ') : '',
            m ? [m.in, m.out, m.kind, m.source, m.color || '', 'mill quern millstone'].join(' ') : '',
            dy ? [dy.from, dy.color, dy.family, dy.part, 'dye dyer colour color'].join(' ') : '',
            or ? [or.metal, or.found, 'ore smelt smelter'].join(' ') : '',
            al ? [...al.parts.map((x) => x.metal), al.use, 'alloy smelt smelter'].join(' ') : ''
           ].join(' ').trim(),
      href: '#/item/' + encodeURIComponent(name)
    });
  });

  RECIPES.forEach((r) => INDEX.push({
    kind: 'step', label: r.name, sub: r.workshop,
    hay: [
      r.name, r.workshop, r.skill,
      ...(r.in  || []).map((x) => x.item),
      ...(r.out || []).map((x) => x.item),
      ...(r.needs || []).map((n) => (NEED_LABEL[n] || {}).text || n)
    ].join(' '),
    href: `#/i/${r.industry}#r-${r.id}`
  }));

  [...new Set(RECIPES.map((r) => r.workshop))].forEach((w) => {
    const steps = RECIPES.filter((x) => x.workshop === w);
    const skills = [...new Set(steps.map((x) => x.skill))].join(' · ');
    INDEX.push({
      kind: 'shop', label: w, sub: skills,
      hay: [w, skills, (SHOPS[w] || {}).note || ''].join(' '),
      href: '#/w/' + encodeURIComponent(w)
    });
  });

  INDUSTRIES.forEach((i) => INDEX.push({
    kind: 'industry', label: i.name, sub: i.blurb, hay: i.name + ' ' + i.blurb, href: '#/i/' + i.id
  }));

  REFERENCE.forEach((t) => INDEX.push({
    kind: 'table', label: t.title, sub: t.blurb,
    hay: [t.title, t.blurb, ...t.rows.flat()].join(' '),
    href: '#/reference#' + t.id
  }));

  ARMOR_TABLES.forEach((t) => INDEX.push({
    kind: 'table', label: t.title, sub: t.blurb,
    hay: [t.title, t.blurb, ...t.rows.flat()].join(' '),
    href: '#/armor#' + t.id
  }));

  /* A piece is a searchable thing in its own right — "greaves" should land on
     the greaves, not on a table that happens to mention them. */
  ARMOR_ROWS.forEach((p) => INDEX.push({
    kind: 'armor', label: p.name,
    sub: p.covers.map(partName).join(' · '),
    hay: p.hay,
    href: '#/armor/' + p.id
  }));

  INDEX.forEach((e) => (e.hay = e.hay.toLowerCase()));

  const KIND_RANK = { item: 0, armor: 1, industry: 2, shop: 3, table: 4, step: 5 };
  let cursor = -1, hits = [];

  function runSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) { results.hidden = true; return; }

    hits = INDEX
      .map((e) => {
        const l = e.label.toLowerCase();
        let score = -1;
        if (l === q) score = 0;
        else if (l.startsWith(q)) score = 1;
        else if (l.includes(q)) score = 2;
        else if (e.hay.includes(q)) score = 4;
        return score < 0 ? null : { ...e, score };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score || KIND_RANK[a.kind] - KIND_RANK[b.kind]
                                         || a.label.length - b.label.length)
      .slice(0, 14);

    cursor = -1;
    results.hidden = false;
    results.innerHTML = hits.length
      ? hits.map((h, i) =>
          `<button data-i="${i}"><span>${esc(h.label)}</span>
             <span class="r-sub">${esc(h.sub || '')}</span>
             <span class="r-kind">${h.kind}</span></button>`).join('')
      : '<div class="empty">Nothing matches. Try “steel”, “barrel” or “ash”.</div>';
  }

  function go(i) {
    const h = hits[i];
    if (!h) return;
    results.hidden = true;
    search.value = '';
    search.blur();
    location.hash = h.href;
  }

  search.addEventListener('input', () => runSearch(search.value));
  search.addEventListener('focus', () => { if (search.value) runSearch(search.value); });

  search.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { results.hidden = true; search.blur(); return; }
    if (!hits.length || results.hidden) return;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      cursor = (cursor + (ev.key === 'ArrowDown' ? 1 : hits.length - 1) + (cursor < 0 && ev.key === 'ArrowUp' ? 1 : 0)) % hits.length;
      [...results.querySelectorAll('button')].forEach((b, i) =>
        b.setAttribute('aria-selected', i === cursor));
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      go(cursor >= 0 ? cursor : 0);
    }
  });

  results.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (b) go(Number(b.dataset.i));
  });

  document.addEventListener('click', (ev) => {
    if (!ev.target.closest('.search-wrap')) results.hidden = true;
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === '/' && document.activeElement !== search) {
      ev.preventDefault(); search.focus();
    }
  });

  /* ── theme ────────────────────────────────────────────────────── */
  const root = document.documentElement;
  const saved = localStorage.getItem('df-theme');
  if (saved) root.dataset.theme = saved;
  else if (window.matchMedia('(prefers-color-scheme: light)').matches) root.dataset.theme = 'light';

  document.getElementById('theme').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('df-theme', root.dataset.theme);
  });

  document.getElementById('theme').innerHTML = sym('theme');

  /* ── router ───────────────────────────────────────────────────── */
  function route() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path, anchor] = raw.split('#');
    const parts = path.split('/').filter(Boolean);

    if (!parts.length)                  viewHome();
    else if (parts[0] === 'i')          viewIndustry(parts[1], parts[2]);
    else if (parts[0] === 'item')       viewItem(decodeURIComponent(parts.slice(1).join('/')));
    else if (parts[0] === 'w')          parts.length > 1
                                          ? viewWorkshop(decodeURIComponent(parts.slice(1).join('/')))
                                          : viewWorkshops();
    else if (parts[0] === 'armor')      viewArmor(parts[1]);
    else if (parts[0] === 'reference')  viewReference();
    else if (parts[0] === 'about')      viewAbout();
    else                                viewHome();

    const NAV = { i: 'industries', item: 'industries', w: 'workshops' };
    const key = !parts.length ? 'industries' : (NAV[parts[0]] || parts[0]);
    document.querySelectorAll('.topnav a').forEach((a) =>
      a.classList.toggle('on', a.dataset.nav === key));

    if (anchor) {
      const target = document.getElementById(anchor);
      if (target) return target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  route();
})();
