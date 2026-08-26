(function () {
  /* ── language ─────────────────────────────────────────────────
     The site is written in English and the game's own nomenclature stays
     that way in every language: an item is a "Plump helmet", a building a
     "Metalsmith's Forge" and a job on its menu "Brew Drink", because those
     are the words on the screen the reader is alt-tabbing away from. What
     translates is everything this site says *about* them — headings, labels,
     legends and every note.

     English literals stay in the source as the fallback, so a key missing
     from a pack renders in English rather than as a key. */
  const LANGS = ['en', 'es'];
  const PACKS = window.DF_I18N || {};
  const stored = localStorage.getItem('df-lang');
  const LANG = LANGS.includes(stored) ? stored
    : (String(navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en');
  document.documentElement.lang = LANG;

  const UI   = (PACKS[LANG] || {}).ui   || {};
  const DATA = (PACKS[LANG] || {}).data || {};

  /* {n}-style holes rather than string concatenation: Spanish does not put
     the number, the noun and the preposition in the order English does, so a
     translated string has to be free to move them. */
  const fmt = (s, vars) => vars
    ? String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : s;

  /* `en` is the English text, written out where it is used so the source
     still reads as English prose. */
  const t = (key, en, vars) => fmt(LANG === 'en' || UI[key] == null ? en : UI[key], vars);

  /* Prose that lives in the data files — an industry's blurb, a note on a
     recipe — translated by the id the data already carries. */
  const td = (group, key, en) => {
    const g = DATA[group];
    const v = g && key != null ? g[key] : null;
    return v == null ? en : v;
  };

  const RECIPES    = window.DF_RECIPES;
  const INDUSTRIES = window.DF_INDUSTRIES;
  const REFERENCE  = window.DF_REFERENCE;
  const NOTES      = window.DF_ITEM_NOTES || {};
  const SHOPS      = window.DF_WORKSHOPS || {};
  const METALS     = window.DF_METAL_COLORS || {};
  const ICONS      = window.DF_ICONS || {};
  const SPRITES    = window.DF_ITEM_SPRITES || {};
  const BREWING    = window.DF_BREWING || [];
  const MILLING    = window.DF_MILLING || [];
  const COLOR_HEX  = window.DF_COLOR_HEX || {};
  const COLOR_FAM  = window.DF_COLOR_FAMILY || {};
  const FAMILY_HEX = window.DF_FAMILY_HEX || {};
  const DYES       = window.DF_DYES || [];
  const FIBRES     = window.DF_FIBRES || [];
  const GOODS      = window.DF_CLOTH_GOODS || [];
  const ORES       = window.DF_ORES || [];
  const ALLOYS     = window.DF_ALLOYS || [];
  const BODY       = window.DF_BODY || [];
  const DWARF      = window.DF_DWARF_PATH || '';
  const ARMOR_MATS = window.DF_ARMOR_MATS || {};
  const ARMOR      = window.DF_ARMOR || [];
  const WEAPONS      = window.DF_WEAPONS || [];
  const FORGE_GOODS  = window.DF_FORGE_GOODS || [];
  const FORGE_METALS = window.DF_FORGE_METALS || [];
  const SMELT_TABLES = window.DF_SMELT_TABLES || [];
  const FLOWS        = window.DF_INDUSTRY_FLOWS || {};

  const main   = document.getElementById('main');

  /* A `needs` flag is a real input — it just isn't a material that gets consumed
     into the product. Mapping it to an item keeps "what is my Barrel used for?"
     answerable. The industry maps deliberately draw none of them: an empty
     barrel is a real constraint but it is not a stage of the chain, so it says
     so on the card that needs one rather than adding a node every second job
     would have a wire to. */
  const NEED_ITEM = {
    fuel: 'Fuel', flux: 'Flux stone', bag: 'Bag',
    barrel: 'Barrel', jug: 'Jug', bucket: 'Bucket', vial: 'Vial'
  };

  /* Split into a symbol and its words: the badge draws the symbol, the search
     index takes the words. A single string could not serve both once the icon
     stopped being a character. */
  /* `hint` is the badge with room to finish its sentence. The map draws these
     as the symbol alone — a step card is 258px wide and three spelled-out
     badges wrap it to three lines — so the words have to survive somewhere,
     and a tooltip can say more than the label ever fitted. */
  const NEED_LABEL = {
    fuel:   { icon: 'flame',  text: t('need.fuel', 'consumes fuel'),
              hint: t('need.fuel.hint', 'Burns a unit of fuel — free at a magma furnace') },
    flux:   { icon: 'flux',   text: t('need.flux', 'flux stone'),
              hint: t('need.flux.hint', 'Consumes a flux stone: limestone, dolomite, chalk, calcite or marble') },
    bag:    { icon: 'bag',    text: t('need.bag', 'needs a bag'),
              hint: t('need.bag.hint', 'The output goes into an empty bag') },
    barrel: { icon: 'barrel', text: t('need.barrel', 'barrel or pot'),
              hint: t('need.barrel.hint', 'The output goes into an empty barrel or large pot') },
    jug:    { icon: 'jug',    text: t('need.jug', 'needs a jug'),
              hint: t('need.jug.hint', 'The output goes into an empty jug') },
    bucket: { icon: 'bucket', text: t('need.bucket', 'needs a bucket'),
              hint: t('need.bucket.hint', 'Needs an empty bucket') },
    vial:   { icon: 'vial',   text: t('need.vial', 'needs a vial'),
              hint: t('need.vial.hint', 'The extract goes into an empty glass vial — a metal flask or a waterskin will not do') },
    shop:   { icon: 'shop',   text: t('need.shop', 'shop & specialist'),
              hint: t('need.shop.hint', 'Needs the workshop built and a dwarf with the labour enabled') }
  };

  const needBadge = (n, compact) => {
    const m = NEED_LABEL[n];
    if (!m) return `<span class="need">${esc(n)}</span>`;
    return compact
      ? `<span class="need only-sym" title="${esc(m.hint)}">${sym(m.icon)}</span>`
      : `<span class="need" title="${esc(m.hint)}">${sym(m.icon)}${esc(m.text)}</span>`;
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

  /* The item's own art from the game, drawn wherever a metal gets its ingot.
     The set in data/sprites.js is partial by nature — a fortress makes far more
     things than the wiki has sprites for — so a list where most rows carry art
     uses `spriteCell`, which keeps the empty box and with it a single left
     edge. Anywhere the art is incidental, `sprite` simply draws nothing. */
  const sprite = (name, cls) => SPRITES[name]
    ? `<img class="sprite ${cls || ''}" src="assets/img/${SPRITES[name]}"
         alt="" loading="lazy" decoding="async">`
    : '';
  const spriteCell = (name) => sprite(name) || '<span class="sprite blank"></span>';

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

  const KIND_NAME = {
    furnace:  t('kind.furnace', 'Furnace'),
    workshop: t('kind.workshop', 'Workshop'),
    place:    t('kind.place', 'Place')
  };
  const shopKind = (name) => (SHOPS[name] || {}).kind || 'workshop';

  const industry = (id) => INDUSTRIES.find((i) => i.id === id);
  const recipesOf = (id) => RECIPES.filter((r) =>
    r.industry === id || (r.also || []).includes(id));

  /* A job keeps the name the game's own menu gives it in every language; what
     this site says *about* the job is what translates. */
  const recipeNote = (r) => td('recipeNote', r.id, r.note || '');
  const indName    = (i) => td('industry', i.id, i.name);
  const indBlurb   = (i) => td('industryBlurb', i.id, i.blurb);

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
  /* Both tables read left to right, what goes in to what comes out: an ore and
     the metal it smelts to, the bars an alloy eats and the alloy they make. The
     alloy list used to run the other way — the alloy on the left, its recipe on
     the right — which read well enough on its own page and reads as backwards
     the moment the Job select puts it where the ore list was. The quantity is
     part of the name here, because two recipes can otherwise come out with the
     same one: fine and trifle pewter are both tin and copper, and so are billon
     and sterling silver. */
  const partsLabel = (parts) => parts
    .map((x) => x.metal + (x.qty > 1 ? ' ×' + x.qty : '')).join(' + ');
  const ALLOY_ROWS = ALLOYS.map((a) => ({
    ...a,
    in: partsLabel(a.parts),
    out: a.alloy,
    contains: a.parts.map((x) => x.metal),
    use: a.weapon ? t('alloy.use.weapon', 'Weapons-grade') : t('alloy.use.decor', 'Decorative'),
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
    made: d.milled ? t('dye.made.quern', 'Milled at a quern') : t('dye.made.other', 'Other job'),
    hay: [d.dye, d.color, d.from, d.part].join(' ').toLowerCase()
  }));
  const DYE_BY = new Map(DYE_ROWS.map((d) => [d.dye, d]));
  const dyeStep = () => RECIPES.find((r) => r.id === 'dye-thread');

  /* ── textiles ─────────────────────────────────────────────────── */
  /* Sixteen ways into one Weave Cloth job, and thirty-one things one unit of
     cloth can come out as. Same treatment as the dyes: the data files keep the
     game's facts and the browsing aids are derived here.

     Thread is a base-6 item and cloth a base-7 one, so a row's multiplier is
     the only number either value needs — which is what keeps the picker, the
     reference table and the value calculator from ever disagreeing. */
  const THREAD_VALUE = 6;
  const CLOTH_VALUE  = 7;

  const FIBRE_ROWS = FIBRES.map((f) => ({
    ...f,
    out: f.out,
    thread: THREAD_VALUE * f.mult,
    clothValue: CLOTH_VALUE * f.mult,
    hay: [f.in, f.out, f.cloth || '', f.kind, f.where, f.biome || '', f.ground || '',
          f.weave ? '' : 'hair no cloth', 'thread fibre fiber'].join(' ').toLowerCase()
  }));
  /* Keyed by all three names a fibre goes under, so the source, the thread and
     the cloth all land on the same panel — asking what pig tail fiber cloth is
     worth is the same question as asking what pig tails are for. */
  const FIBRE_BY = new Map();
  FIBRE_ROWS.forEach((f) => [f.in, f.out, f.cloth].forEach((n) => {
    if (n && !FIBRE_BY.has(n)) FIBRE_BY.set(n, f);
  }));
  const weaveStep = () => RECIPES.find((r) => r.id === 'weave');

  /* The clothier's list needs an `in`/`out` pair like every other picker. `in`
     is the garment, `out` is what it is worth bare — the one fact the list can
     usefully sort you towards before the calculator gets involved.

     The row's picture is the same cell of the same equipment sheet the armour
     picker draws, looked up by name out of DF_ARMOR rather than copied into
     data/textiles.js: a robe is one thing, and the two pages that list it
     should not be able to disagree about what it looks like. Where the two
     tables spell a garment differently the cloth row says so with `as`. A
     garment the sheet has no cell for — and the three things here that are not
     clothing at all — keeps the blank cell, so the names stay in one column. */
  const EQ_BY_NAME = new Map(ARMOR.map((p) => [p.name, p]));
  const GOODS_ROWS = GOODS.map((g) => ({
    ...g,
    sprite: (EQ_BY_NAME.get(g.as || g.name) || {}).sprite,
    in: g.name,
    out: g.base ? g.base + '\u263c ' + t('goods.base', 'base') : t('goods.notclothing', 'not clothing'),
    hay: [g.name, g.slot, g.kind, g.pair ? 'pair two' : '',
          g.avail === 'foreign' ? 'foreign elf goblin human' : ''].join(' ').toLowerCase()
  }));
  const clothierStep = () => RECIPES.find((r) => r.id === 'clothier');

  /* ── armour ───────────────────────────────────────────────────── */
  /* Forty-odd wearables against eleven body parts is a lookup, not a list, so
     the page is the same picker as the Still's — with the body figure standing
     in for a facet nobody would want to read as a list of words. `covers`
     is the join between the two: a region lights up because some piece names
     it, and clicking it filters to exactly those pieces. */
  const BODY_BY  = new Map(BODY.map((b) => [b.id, b]));
  /* The regions of the dwarf are anatomy rather than the game's item names, so
     they translate. The material codes behind `matName` do not: "Leather" is
     what the Made-of dropdown offers and what the game calls it. */
  const partName = (id) => td('body', id, (BODY_BY.get(id) || { label: id }).label);
  const partNote = (id) => td('bodyNote', id, (BODY_BY.get(id) || {}).note || '');
  const matName  = (code) => (ARMOR_MATS[code] || { name: code }).name;

  /* Material size ÷ 3, rounded down, minimum one — the game's own formula, so
     a piece only ever states its size and this stays true if one changes.
     Adamantine is the exception: it costs the size itself, in wafers.

     A handful of things the forge makes have no material size at all — an anvil
     is flatly three bars, a ballista arrowhead three — and those state `bars`
     instead. Armour never does, so this is the same function it always was. */
  const barCost = (r) => (r.bars != null ? r.bars : Math.max(1, Math.floor(r.size / 3)));

  /* Bars and wafers are counted often enough, and in enough different
     sentences, to be worth one place that knows how each language says them. */
  const barsLabel   = (n) => t(n === 1 ? 'unit.bar' : 'unit.bars',
    n === 1 ? '{n} bar' : '{n} bars', { n });
  const wafersLabel = (n) => t(n === 1 ? 'unit.wafer' : 'unit.wafers',
    n === 1 ? '{n} wafer' : '{n} wafers', { n });
  const unitsLabel  = (n, adam) => (adam ? wafersLabel(n) : barsLabel(n));

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
           aria-label="${esc(t('armor.figure.label', 'Dwarf body — choose a part to filter the armour'))}">
        <g class="body-shape" aria-hidden="true"
           transform="translate(0 354.5) scale(.0332226 -.0332226)"><path d="${DWARF}"/></g>
        ${BODY.map((b) => `<g class="bp" data-part="${esc(b.id)}" role="button" tabindex="0"
            aria-label="${esc(partName(b.id))}"><title>${esc(partName(b.id))}</title>${b.art}</g>`).join('')}
      </svg>
      <div class="body-cap">
        <strong class="body-name"></strong>
        <button class="body-all fchip" type="button" hidden>${esc(t('armor.wholebody', 'Whole body'))}</button>
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
    host.querySelector('.body-name').textContent = part
      ? partName(part.id) : t('armor.pickpart', 'Click a body part');
    host.querySelector('.body-note').textContent = part ? partNote(part.id)
      : t('armor.allpieces', 'Every piece is listed. Pick a part of the dwarf to see only what covers it.');
    host.querySelector('.body-all').hidden = !part;
  }

  function armorResult(p) {
    const bars   = barCost(p);
    const metal  = p.mats.includes('M');
    const shops  = [...new Set(p.mats.map((c) => (ARMOR_MATS[c] || {}).workshop))];
    const skills = [...new Set(p.mats.map((c) => (ARMOR_MATS[c] || {}).skill))];

    const mat  = (c) => `<span class="chip in flat">${esc(matName(c))}</span>`;
    const part = (id) => `<button class="chip bp-chip" type="button"
      data-part="${esc(id)}">${esc(partName(id))}</button>`;

    return `<div class="brew-out">
      <div class="brew-flow">
        ${p.mats.map(mat).join(`<span class="plus">${esc(t('word.or', 'or'))}</span>`)}
        <span class="brew-arrow">${ARROW}</span>
        <span class="chip out flat">${esc(p.name)}</span>
      </div>
      <div class="brew-meta">
        <span class="need kind" data-kind="${esc(p.kind)}">${esc(p.kind)}</span>
        <span class="need">${esc(t('armor.layer', '{layer} layer', { layer: p.layer }))}</span>
        ${p.cov != null ? `<span class="need">${esc(t('armor.coverage', '{n}% coverage', { n: p.cov }))}</span>` : ''}
        ${p.block ? `<span class="need">${esc(t('armor.block', '{n}% block chance', { n: p.block }))}</span>` : ''}
        ${p.level ? `<span class="need">${esc(t('armor.level', 'armour level {n}', { n: p.level }))}</span>` : ''}
        ${p.elastic ? `<span class="need">${esc(p.elastic)}</span>` : ''}
        ${p.shaped ? `<span class="need warnish">${sym('warn')}${esc(t('armor.shaped', 'shaped'))}</span>` : ''}
        ${p.avail === 'foreign' ? `<span class="need warnish">${sym('warn')}${esc(t('armor.foreign', 'dwarves cannot make it'))}</span>` : ''}
        ${p.avail === 'uncommon' ? `<span class="need warnish">${sym('warn')}${esc(t('armor.uncommon', 'not every civilisation'))}</span>` : ''}
      </div>

      <div class="armor-covers">
        <span class="flow-label">${esc(t('armor.covers', 'covers'))}</span>
        ${p.covers.length ? p.covers.map(part).join('')
          : `<span class="muted">${esc(t('armor.nocover',
              'Nothing — it is held, not worn, and blocks the attack instead.'))}</span>`}
      </div>

      <dl class="armor-stats">
        <div><dt>${esc(t('stat.matsize', 'Material size'))}</dt><dd>${p.size}</dd></div>
        ${metal ? `<div><dt>${esc(t('stat.metalcost', 'Metal cost'))}</dt><dd>${esc(barsLabel(bars))}</dd></div>
          <div><dt>${esc(t('stat.inadamantine', 'In adamantine'))}</dt><dd>${esc(wafersLabel(p.size))}</dd></div>` : ''}
        ${p.ls != null ? `<div><dt>${esc(t('stat.layersize', 'Layer size'))}</dt><dd>${p.ls}</dd></div>` : ''}
        ${p.perm != null ? `<div><dt>${esc(t('stat.permit', 'Permit'))}</dt><dd>${p.perm}</dd></div>` : ''}
        ${p.melt ? `<div><dt>${esc(t('stat.meltsback', 'Melts back to'))}</dt><dd>${esc(barsLabel(p.melt))}
          <span class="muted">(${Math.round(p.melt / bars * 100)}%)</span></dd></div>` : ''}
      </dl>

      <p class="brew-job">${t('armor.madeat', 'Made at {shops} by {skills}.', {
          shops: shops.map((w) =>
            `<a class="chip shop" href="#/w/${encodeURIComponent(w)}">${icon(w)}${esc(w)}</a>`).join(' '),
          skills: esc(skills.join(t('word.or.sep', ' or ')))
        })}${metal
          ? ' ' + t('armor.metalcost',
              'The metal version costs <strong>{bars}</strong> of a weapons-grade metal, plus an anvil and a unit of fuel.',
              { bars: esc(barsLabel(bars)) }) : ''}</p>

      ${p.note ? `<p class="brew-job">${esc(td('armorNote', p.id, p.note))}</p>` : ''}
    </div>`;
  }

  /* ── the forge ────────────────────────────────────────────────── */
  /* The widest workshop in the game: six labours, fourteen categories of
     product and something over ninety items off one anvil. Same treatment as
     the Still — one generic step in data/recipes.js and a picker here — with
     one difference. The other pickers read a single table; this one assembles
     its rows from three files, deliberately. A battle axe belongs to
     data/weapons.js and a breastplate to data/armor.js, and copying either into
     data/forge.js would let the forge's page and the Armor page disagree about
     the same object. So the picker takes every weapon whose `made` list names
     this building, every wearable that can be made of metal, and everything
     else out of DF_FORGE_GOODS.

     Three filters on the armour, and each of them is a fact rather than a
     tidy-up: gear is excluded because the flask is already a metalcrafter's job
     under its own heading, foreign pieces because dwarves cannot make them, and
     everything without an M in `mats` because this is a forge. */
  const FORGE_SHOP = "Metalsmith's Forge";

  /* The wiki's production list, in its own order — which is also the order the
     facet's options come out in, since mountPicker reads a facet's values off
     the rows and the rows below are sorted by this. */
  const FORGE_CATS = ['Weapons', 'Armor', 'Chains', 'Crafts', 'Goblets', 'Toys',
    'Instruments', 'Anvils', 'Flasks', 'Coins', 'Studding', 'Furniture',
    'Animal traps', 'Mechanisms'];

  const forgeMetal = (name) => FORGE_METALS.find((m) => m.metal === name);

  /* What the list's right-hand column says. In a ninety-row list the one fact
     worth scanning for is what the thing costs — and for the handful that come
     out in multiples, "×3 from one bar" is the entire point of them. */
  function forgeCost(r) {
    const bars = barsLabel(barCost(r));
    if (r.per)  return t('forge.cost.per',  '×{n} from {bars}', { n: r.per, bars });
    if (r.upto) return t('forge.cost.upto', '1–{n} from {bars}', { n: r.upto, bars });
    if (r.pair) return t('forge.cost.pair', 'a pair from {bars}', { bars });
    return bars;
  }

  const FORGE_ROWS = [].concat(
    WEAPONS.filter((w) => (w.made || []).some((m) => m.at === FORGE_SHOP))
      .map((w) => ({ ...w, cat: 'Weapons', labour: 'Weaponsmith', form: 'weapon',
        hay: [w.name, 'weapon', w.kind, w.skill, w.hands || '',
              ...(w.attacks || []).flatMap((a) => [a.name, a.type])].join(' ') })),
    ARMOR.filter((p) => p.mats.includes('M') && p.kind !== 'Gear' && p.avail !== 'foreign')
      .map((p) => ({ ...p, cat: 'Armor', labour: 'Armorsmith', form: 'armor',
        hay: [p.name, 'armour armor', p.kind, p.layer, p.shaped ? 'shaped' : '',
              ...p.covers.map(partName)].join(' ') })),
    FORGE_GOODS.map((g) => ({ ...g, form: 'goods',
      hay: [g.name, g.cat, g.labour, g.noQuality ? 'no quality level' : ''].join(' ') }))
  ).map((r) => ({
    ...r, in: r.name, out: forgeCost(r),
    hay: (r.hay + ' ' + r.labour + ' forge metal bar').toLowerCase()
  })).sort((a, b) => FORGE_CATS.indexOf(a.cat) - FORGE_CATS.indexOf(b.cat));

  /* Armour brings its cell of the equipment sheet, weapons and goods bring
     their own sprite file, and about half of the ninety rows have no art at
     all. One fixed box holds whichever it is, so the names keep a single left
     edge instead of stepping in and out down the list. */
  const forgeCell = (r) =>
    `<span class="fg-cell">${r.sprite ? eqSprite(r) : sprite(r.name)}</span>`;

  /* The game's general item value formula, which is *not* the one the
     clothier's shop runs — cloth folds its thread and weave in as decorations
     and uses an older quality ladder. Here it is:

       base value × material × quality multiplier + quality bonus

     and it is applied per item, so a stack counts the bonus once for every
     item in it. That is the whole reason a masterwork stack of 25 bolts is
     worth 800☼ and a masterwork minecart 130☼. */
  const QUALITY_STEPS = [
    { label: 'Ordinary',         mult: 1,     bonus: 0 },
    { label: '-well-crafted-',   mult: 1.1,   bonus: 3 },
    { label: '+finely-crafted+', mult: 1.2,   bonus: 6 },
    { label: '*superior*',       mult: 1.333, bonus: 10 },
    { label: '≡exceptional≡', mult: 1.5, bonus: 15 },
    { label: '☼masterwork☼',  mult: 2,   bonus: 30 },
    { label: 'Artifact',         mult: 20,    bonus: 300 }
  ];

  /* Shared by every panel on the page, so changing the metal once re-prices the
     whole list rather than one row of it. Opens on ordinary iron: the metal a
     fortress actually has, at the quality an untrained smith actually makes. */
  const FORGE_CALC = { metal: 'Iron', q: 0 };

  /* Which metals the forge will accept for this job. Not a nicety — it is the
     single most common reason a job will not run, and listing gold against a
     battle axe would be teaching the wrong thing. */
  function forgeMetalsFor(r) {
    if (r.cat === 'Anvils')  return FORGE_METALS.filter((m) => m.anvil);
    if (r.cat === 'Armor')   return FORGE_METALS.filter((m) => m.grade === 'Weapons & armour');
    if (r.cat === 'Weapons') return FORGE_METALS.filter((m) =>
      m.grade === 'Weapons & armour' || m.grade === 'Melee weapons & ammo');
    return FORGE_METALS.filter((m) => m.grade !== 'Alloying only');
  }

  const round2 = (n) => Math.round(n * 100) / 100;

  /* Two selects rather than two rows of chips, for the reason the clothier's
     calculator gives: these are settings, not filters. They do not change what
     is in the list, only what the row on screen is worth. */
  function forgeControls(r, allowed) {
    const row = (key, label, opts, off, why) => `<div class="calc-row${off ? ' off' : ''}">
      <label class="flabel" for="fcalc-${esc(key)}">${esc(label)}</label>
      <select class="calc-sel" id="fcalc-${esc(key)}" data-k="${esc(key)}"
              ${off ? `disabled title="${esc(why)}"` : ''}>
        ${opts.map((o) => `<option value="${esc(String(o.v))}" ${
          String(o.v) === String(o.now) ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}
      </select>
    </div>`;

    return `<div class="calc">
      ${row('metal', t('calc.metal', 'Metal'), allowed.map((m) => ({
        v: m.metal, now: FORGE_CALC.metal, label: `${m.metal} ×${m.value}` })))}
      ${row('q', t('calc.smith', 'Smith'), QUALITY_STEPS.map((q, i) => ({
        v: i, now: r.noQuality ? 0 : FORGE_CALC.q,
        label: `${q.label} ×${q.mult}${q.bonus ? ' +' + q.bonus : ''}` })),
        r.noQuality, t('calc.noquality', 'This item has no quality level, whoever makes it'))}
    </div>`;
  }

  /* A weapon is not one attack. Contact area and penetration together are what
     decide whether a hit cuts, punches through or merely bruises, and reading
     them side by side is the only way that lands — a war hammer's 10 against a
     battle axe's 40,000 says more than either page of prose about it. */
  function attackTable(atks) {
    return `<div class="table-wrap"><table class="atk">
      <thead><tr><th>${esc(t('atk.attack', 'Attack'))}</th><th>${esc(t('atk.type', 'Type'))}</th
        ><th>${esc(t('atk.contact', 'Contact'))}</th><th>${esc(t('atk.penetration', 'Penetration'))}</th
        ><th>${esc(t('atk.velocity', 'Velocity'))}</th></tr></thead>
      <tbody>${atks.map((a) => `<tr>
        <td>${esc(a.name)}</td>
        <td><span class="need atk-${a.type === 'Edge' ? 'edge' : 'blunt'}">${esc(a.type)}</span></td>
        <td class="num">${a.area.toLocaleString('en')}</td>
        <td class="num${a.type === 'Blunt' ? ' muted' : ''}">${a.type === 'Blunt'
          ? '(' + a.pen.toLocaleString('en') + ')' : a.pen.toLocaleString('en')}</td>
        <td class="num">${a.vel ? a.vel + '×' : '—'}</td>
      </tr>`).join('')}</tbody>
    </table></div>
    <p class="brew-job muted">${esc(t('atk.note',
      'Contact area is how wide the hit lands and penetration how deep it goes; a small area '
      + 'concentrates the same force and gets through armour a wide one bounces off. Penetration '
      + 'is bracketed on blunt attacks because the game ignores it there. Velocity multiplies the '
      + 'momentum outright.'))}</p>`;
  }

  /* One row of the forge's picker: what it costs in bars, what it gives back at
     the smelter, what it does when it lands on somebody, and what a caravan
     would pay for it. */
  function forgeResult(r) {
    const allowed = forgeMetalsFor(r);
    /* Switching from a goblet to a battle axe has to move the metal off gold,
       because the forge would refuse it. Written back rather than only
       displayed, so the select and the arithmetic cannot disagree. */
    if (!allowed.some((m) => m.metal === FORGE_CALC.metal))
      FORGE_CALC.metal = ((allowed.find((m) => m.metal === 'Iron') || allowed[0] || {}).metal);

    /* Adamantine is priced by material size in wafers rather than size ÷ 3 in
       bars, so switching the metal to it changes the cost, the unit and — since
       the melt return does not change — the return percentage with them. That
       is the whole reason nobody melts adamantine back. */
    const metal = forgeMetal(FORGE_CALC.metal) || { metal: '—', value: 1 };
    const adam  = metal.metal === 'Adamantine';
    const cost  = adam && r.size != null ? r.size : barCost(r);
    const unit  = adam ? 'wafer' : 'bar';
    const units = unitsLabel(cost, adam);

    const q     = r.noQuality ? QUALITY_STEPS[0] : QUALITY_STEPS[FORGE_CALC.q];
    const count = r.per || (r.pair ? 2 : 1);
    const each  = r.base == null ? null : r.base * metal.value * q.mult + q.bonus;
    const total = each == null ? null : each * count;

    const col   = metalColor(metal.metal);
    const line  = (what, sum, val) => `<div class="calc-line">
      <dt>${what}</dt><dd class="calc-sum">${sum}</dd><dd class="calc-val">${val}</dd></div>`;

    const covers = (r.covers || []).map((id) =>
      `<span class="chip flat">${esc(partName(id))}</span>`).join('');

    /* Where else the same thing is made, grouped by building rather than by
       material — wooden and bone bolts are both a craftsdwarf's job, and naming
       the workshop twice reads as two different answers. */
    const elsewhere = [...(r.made || []).filter((m) => m.at !== FORGE_SHOP)
      .reduce((acc, m) => acc.set(m.at, (acc.get(m.at) || []).concat(m.mat)), new Map())];

    return `<div class="brew-out">
      <div class="brew-flow">
        <span class="chip in is-metal">${col ? ingot(col) : ''}${esc(units)}</span>
        <span class="brew-arrow">${ARROW}</span>
        ${ITEMS.has(r.name) ? chip(r.name, 'out') : `<span class="chip out flat">${esc(r.name)}</span>`}
        ${count > 1 ? `<span class="need">× ${count}</span>` : ''}
        ${r.upto ? `<span class="need">1–${r.upto}</span>` : ''}
      </div>
      <div class="brew-meta">
        <span class="need kind" data-kind="${esc(r.cat)}">${esc(r.cat)}</span>
        <span class="need">${esc(r.labour)}</span>
        ${r.kind && r.kind !== r.cat ? `<span class="need">${esc(r.kind)}</span>` : ''}
        ${r.melt ? `<span class="need">${esc(t('forge.meltsto', 'melts to {units}',
            { units: unitsLabel(r.melt, adam) }))}
          <span class="muted">(${Math.round(r.melt / cost * 100)}%)</span></span>` : ''}
        ${r.noQuality ? `<span class="need">${esc(t('forge.noquality', 'no quality level'))}</span>` : ''}
        ${r.shaped ? `<span class="need warnish">${sym('warn')}${esc(t('armor.shaped', 'shaped'))}</span>` : ''}
        ${r.cat === 'Studding' ? `<span class="need">${sym('flame')}${esc(t('forge.nofuel', 'burns no fuel'))}</span>` : ''}
      </div>

      ${r.form === 'weapon' ? `
      <dl class="armor-stats forge-stats">
        ${r.skill && r.skill !== '—'
          ? `<div><dt>${esc(r.kind === 'Ammo' ? t('stat.firedwith', 'Fired with')
                                              : t('stat.wieldedwith', 'Wielded with'))}</dt>
               <dd>${esc(r.skill)}</dd></div>` : ''}
        ${r.hands && r.hands !== '—'
          ? `<div><dt>${esc(t('stat.hands', 'Hands'))}</dt><dd>${esc(r.hands)}</dd></div>` : ''}
        ${r.hits ? `<div><dt>${esc(t('stat.hits', 'Hits per trigger'))}</dt><dd>${r.hits}</dd></div>` : ''}
        ${r.vol ? `<div><dt>${esc(t('stat.volume', 'Volume'))}</dt><dd>${r.vol.toLocaleString('en')} cm³</dd></div>` : ''}
        ${r.size != null ? `<div><dt>${esc(t('stat.matsize', 'Material size'))}</dt><dd>${r.size}</dd></div>` : ''}
      </dl>
      ${r.attacks ? attackTable(r.attacks) : ''}` : ''}

      ${r.form === 'armor' ? `
      <div class="armor-covers">
        <span class="flow-label">${esc(t('armor.covers', 'covers'))}</span>
        ${covers || `<span class="muted">${esc(t('armor.nocover',
          'Nothing — it is held, not worn, and blocks the attack instead.'))}</span>`}
      </div>
      <dl class="armor-stats forge-stats">
        <div><dt>${esc(t('stat.matsize', 'Material size'))}</dt><dd>${r.size}</dd></div>
        ${r.ls != null ? `<div><dt>${esc(t('stat.layersize', 'Layer size'))}</dt><dd>${r.ls}</dd></div>` : ''}
        ${r.cov != null ? `<div><dt>${esc(t('stat.coverage', 'Coverage'))}</dt><dd>${r.cov}%</dd></div>` : ''}
        ${r.block ? `<div><dt>${esc(t('stat.blockchance', 'Block chance'))}</dt><dd>${r.block}%</dd></div>` : ''}
        ${r.level ? `<div><dt>${esc(t('stat.armourlevel', 'Armour level'))}</dt><dd>${esc(String(r.level))}</dd></div>` : ''}
      </dl>
      <p class="brew-job">${t('forge.seeonwarf',
        '<a class="chip" href="{href}">See {name} on the dwarf</a> for layers, permits and what it leaves bare.',
        { href: `#/armor/${esc(r.id)}`, name: esc(r.name.toLowerCase()) })}</p>` : ''}

      ${total == null ? '' : `
      <p class="col-head calc-head">${esc(t('calc.worth', 'Worth'))}</p>
      ${forgeControls(r, allowed)}
      <dl class="calc-out">
        ${line(esc(t('calc.base', 'Base')), esc(r.name.toLowerCase()), round2(r.base))}
        ${line(esc(t('calc.xmetal', '× metal')), `${round2(r.base)} × ${esc(metal.metal)} ${metal.value}`,
               round2(r.base * metal.value))}
        ${line(esc(t('calc.xquality', '× quality')), `${round2(r.base * metal.value)} × ${esc(q.label)} ${q.mult}`,
               round2(r.base * metal.value * q.mult))}
        ${line(esc(t('calc.plusbonus', '+ bonus')), q.bonus ? '+' + q.bonus : esc(t('calc.none', 'none')), round2(each))}
        ${count > 1 ? line(esc(t('calc.xstack', '× stack')), `${round2(each)} × ${count}`, round2(total)) : ''}
      </dl>
      <p class="calc-total">${round2(total)}☼
        <span class="muted">${count > 1 ? esc(t('calc.forthe', 'for the {n}', { n: count })) : ''}${
          count > 1 && cost > 1 ? ', ' : ''}${
          cost > 1 ? esc(t(adam ? 'calc.perwafer' : 'calc.perbar', '{v}☼ per ' + unit,
            { v: round2(total / cost) })) : ''}</span></p>`}

      ${elsewhere.length ? `<p class="brew-job">${t('forge.elsewhere', 'Also made {where}.', {
          where: elsewhere.map(([at, mats]) =>
            t('forge.elsewhere.one', 'in {mats} at {shop}', {
              mats: esc(mats.join(t('word.or.sep', ' or ')).toLowerCase()),
              shop: `<a class="chip shop" href="#/w/${encodeURIComponent(at)}">${icon(at)}${esc(at)}</a>` })
          ).join(t('word.and.sep', ', and ')) })}</p>` : ''}

      ${r.mats && r.mats.length > 1 ? `<p class="brew-job">${t('forge.alsomadeof',
        'Also made of {mats} — see the Armor page for which building works which.',
        { mats: r.mats.filter((c) => c !== 'M').map((c) => esc(matName(c).toLowerCase())).join(', ') })}</p>` : ''}

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

  /* The fibres register against two steps, not one: the job that makes the
     thread — which differs per source, so it is read off the row — and the
     weave that eats it. Without the first half, "where does wool come from?"
     has no answer; without the second, thirteen kinds of cloth do not exist. */
  const link = (list, step, item) => {
    if (step && item && !list(item).includes(step)) list(item).push(step);
  };
  FIBRE_ROWS.forEach((f) => {
    const src = RECIPES.find((r) => r.id === f.job);
    link((i) => touch(i).usedIn, src, f.in);
    link((i) => touch(i).madeBy, src, f.out);
    if (!f.weave) return;
    const step = weaveStep();
    link((i) => touch(i).usedIn, step, f.out);
    link((i) => touch(i).madeBy, step, f.cloth);
  });
  /* Every garment is a real item the fortress can hold, and the clothier's step
     only says "Clothing" — so without this a route's Robe chip leads nowhere. */
  GOODS_ROWS.forEach((g) => {
    const step = RECIPES.find((r) => r.id === (g.shop ? 'cloth-crafts' : 'clothier'));
    link((i) => touch(i).madeBy, step, g.name);
  });

  /* Same for the forge: its one step says "Weapons" and "Armour", so without
     this a search for a war hammer would find the wiki's word for it and no
     page. Studding is left out because it is a decoration applied to something
     else — there is no studding sitting in a stockpile. */
  FORGE_ROWS.forEach((r) => {
    if (r.cat === 'Studding') return;
    link((i) => touch(i).madeBy, RECIPES.find((x) => x.id === 'forge'), r.name);
  });

  /* ── components ───────────────────────────────────────────────── */
  function chip(entry, kind) {
    const item = typeof entry === 'string' ? { item: entry } : entry;
    const qty = item.qty ? `<span class="qty">×${item.qty}</span>` : '';
    const col = metalColor(item.item);
    const art = col ? ingot(col) : sprite(item.item);
    const mark = col ? 'is-metal' : (art ? 'has-sprite' : '');
    return `<a class="chip ${kind} ${mark}"
      href="#/item/${encodeURIComponent(item.item)}">${art}${esc(item.item)}${qty}</a>`;
  }

  function recipeCard(r, opts) {
    opts = opts || {};
    // the card's identity ingot: the first output that is a metal
    const metalOut = (r.out || []).map((x) => metalColor(x.item)).find(Boolean);
    const ins  = (r.in  || []).map((x) => chip(x, 'in')).join('');
    const outs = (r.out || []).map((x) => chip(x, 'out')).join('');
    const needs = (r.needs || []).map(needBadge).join('');

    const where = opts.showWorkshop
      ? `<div class="flow-row"><span class="flow-label">${esc(t('flow.at', 'at'))}</span>
           <a class="chip shop" href="#/w/${encodeURIComponent(r.workshop)}">
             ${icon(r.workshop)}${esc(r.workshop)}</a>
           ${r.skill && r.skill !== '—' ? `<span class="need">${esc(r.skill)}</span>` : ''}</div>`
      : '';

    return `<article class="rec" id="r-${esc(r.id)}">
      <h3>${metalOut ? ingot(metalOut, 'title') : ''}${esc(r.name)}</h3>
      <div class="flow">
        ${ins ? `<div class="flow-row"><span class="flow-label">${esc(t('flow.in', 'in'))}</span>${ins}</div>` : ''}
        ${where}
        <div class="arrow">${ARROW}</div>
        ${outs ? `<div class="flow-row"><span class="flow-label">${esc(t('flow.out', 'out'))}</span>${outs}</div>` : ''}
      </div>
      ${needs ? `<div class="needs">${needs}</div>` : ''}
      ${r.note ? `<p class="note">${esc(recipeNote(r))}</p>` : ''}
    </article>`;
  }

  /* ── the Still's brewing picker ───────────────────────────────── */
  /* Seven cards that differed only in one noun told you nothing seven times.
     This is the same information as a lookup: pick the plant you actually have,
     read what it turns into. The list is the source of truth for the filters,
     so adding a row to data/brewing.js needs no change here. */
  const valueTag = (v) =>
    `<span class="val" title="${esc(t('tag.value', 'Drink value'))}">${v}☼</span>`;

  /* The still at work: the plant drops in, the vessel fills in the drink's own
     colour, it bubbles, and the barrel below catches it. Drawn rather than
     described because the answer to "what do I get" is a picture. The clip ids
     are per-render — two of these can share a page. */
  let animSeq = 0;
  function brewAnim(b) {
    const id = 'brew-clip-' + (++animSeq);
    return `<svg class="brew-anim" data-kind="${esc(b.kind)}" viewBox="90 6 118 86" role="img"
      aria-label="${esc(t('anim.brew', '{in} brewing into {out} at the still',
        { in: b.in, out: b.out }))}">
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
      aria-label="${esc(t('anim.mill', '{in} milled into {out} at the quern',
        { in: m.in, out: m.out }))}">
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

  /* The furnace, from what goes in to what comes out. It draws both of the
     smelter's jobs because both are the same picture: something falls in the
     top, the fire takes it, the melt runs out of the tap and sets into a bar.
     What changes is the feed — one rough lump for an ore, one tinted ingot per
     metal for an alloy — and how many bars come back, since galena and
     tetrahedrite pay a second one out.

     `feed` and `bars` are lists of colours: a feed with no colour is drawn as a
     rock, one with a colour as a small bar of that metal. A `maybe` bar is the
     ore's silver — drawn dashed and half-filled, because it only turns up some
     of the time and a solid bar would promise more than the game does. */
  function smeltAnim(spec) {
    const id = 'smelt-' + (++animSeq);
    const bars = (spec.bars || []).filter(Boolean);
    const feed = (spec.feed || []).slice(0, 3);
    const col = bars.length ? bars[0].color : '';
    const LUMP = 'M36 16l8-5 9 5-2 9-11 2-6-6z';

    /* The feed is one animation with staggered starts, so three ingots go down
       the same chute one after another rather than as a single clump. */
    const feedArt = feed.map((f, i) => `<g class="feed f${i + 1}"${
      f.color ? ` style="--in:${esc(f.color)}"` : ''}>${f.color
        ? `<g transform="translate(33 8) scale(.62)"><path class="in-bar" d="${INGOT_BARS}"/></g>`
        : `<path d="${LUMP}" fill="none" stroke="currentColor" stroke-width="2.4"
             stroke-linecap="round" stroke-linejoin="round"/>`}</g>`).join('');

    /* Each bar is the ingot glyph placed by a nested transform, so the outer
       group is free for the CSS to animate. */
    const barArt = bars.map((b, i) => `<g class="bar${b.maybe ? ' maybe' : ''} b${i + 1}"${
      b.color ? ` style="--out:${esc(b.color)}"` : ''}>
        <g transform="${i ? 'translate(98 20) scale(.76)' : 'translate(84.1 42.2) scale(1.31)'}">
          <path d="${INGOT_BARS}"/>
        </g>
      </g>`).join('');

    return `<svg class="brew-anim smelt-anim" ${col ? `style="--brew:${esc(col)}"` : ''}
      viewBox="10 6 118 84" role="img" aria-label="${esc(spec.label)}">
      <defs>
        <clipPath id="${id}-m"><path d="M30 84V63a12 12 0 0 1 24 0v21z"/></clipPath>
      </defs>

      <!-- The melt, seen through the mouth of the furnace: the rectangle is
           cut to the arch, so the mouth lights up to its own shape. -->
      <g clip-path="url(#${id}-m)"><rect class="glow" x="28" y="48" width="28" height="38"/></g>

      ${feedArt}

      <g class="ink" fill="none" stroke="currentColor" stroke-width="2.4"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 84V38h54v46z"/>
        <path d="M69 38V20h12v18"/>
        <path d="M30 84V63a12 12 0 0 1 24 0v21"/>
        <path d="M69 54h8v5h-8"/>
        <path d="M84 79h42"/>
      </g>

      <path class="fire" d="M42 79c-7.5-6-1.5-13.5 0-18 4.5 7.5 12 9 0 18z"/>
      <path class="pour" d="M77 59c5 3 8 8 10 13" fill="none"
            stroke-width="2.6" stroke-linecap="round"/>
      <circle class="puff u1" cx="75" cy="17" r="3"/>
      <circle class="puff u2" cx="78" cy="17" r="2.2"/>
      <path class="spark s1" d="M74 30c-2-1.6-.4-3.6 0-4.8 1.2 2 3.2 2.4 0 4.8z"/>
      <path class="spark s2" d="M77 26c-1.5-1.2-.3-2.7 0-3.6.9 1.5 2.4 1.8 0 3.6z"/>

      ${barArt}
    </svg>`;
  }

  function oreResult(o, opts) {
    const bar = (m) => {
      const c = metalColor(m);
      return `<a class="chip out" href="#/item/${encodeURIComponent(m + ' bar')}">${
        c ? ingot(c) : ''}${esc(m)}</a>`;
    };
    return `<div class="brew-out${(opts && opts.compact) ? ' beside' : ''}">
      ${smeltAnim({
        label: t('anim.smelt', '{ore} smelted into {metal}', { ore: o.ore, metal: o.metal }),
        feed: [{}],
        bars: [{ color: metalColor(o.metal) },
               o.bonus && { color: metalColor(o.bonus.metal), maybe: true }]
      })}
      <div class="brew-flow">
        <a class="chip in" href="#/item/${encodeURIComponent(o.ore)}">${esc(o.ore)}</a>
        <span class="brew-arrow">${ARROW}</span>
        ${bar(o.metal)}${o.bonus ? `<span class="plus">+</span>${bar(o.bonus.metal)}` : ''}
      </div>
      <div class="brew-meta">
        <span class="need kind">${esc(barsLabel(o.bars))}</span>
        ${o.bonus ? `<span class="need">${esc(t('ore.bonus', '{chance}% chance of {bars} {metal}', {
          chance: o.bonus.chance, bars: o.bonus.bars, metal: o.bonus.metal.toLowerCase() }))}</span>` : ''}
        ${needBadge('fuel')}
      </div>
      <p class="brew-where"><span class="col-head">${esc(t('ore.foundin', 'Found in'))}</span> ${esc(o.found)}.</p>
    </div>`;
  }

  function alloyResult(a, opts) {
    const part = (x) => {
      const c = metalColor(x.metal);
      return `<a class="chip in" href="#/item/${encodeURIComponent(x.metal + ' bar')}">${
        c ? ingot(c) : ''}${esc(x.metal)}${x.qty ? `<span class="qty">×${x.qty}</span>` : ''}</a>`;
    };
    const col = metalColor(a.alloy);
    return `<div class="brew-out${(opts && opts.compact) ? ' beside' : ''}">
      ${smeltAnim({
        label: t('anim.alloy', '{parts} alloyed into {alloy}', {
          parts: a.parts.map((x) => x.metal).join(t('word.and.plain', ' and ')), alloy: a.alloy }),
        feed: a.parts.map((x) => ({ color: metalColor(x.metal) })),
        bars: [{ color: metalColor(a.alloy) }]
      })}
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
      aria-label="${esc(t('anim.dye', "Cloth dyed {color} with {dye} at the dyer's shop",
        { color: d.color, dye: d.dye }))}">
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
        <span class="chip out flat">${swatch(COLOR_HEX[d.color])}${esc(t('dye.clothin',
          'cloth in {color}', { color: d.color.toLowerCase() }))}</span>
      </div>
      <div class="brew-meta">
        <span class="need kind" data-fam="${esc(COLOR_FAM[d.color] || '')}">${esc(COLOR_FAM[d.color] || t('dye.colour', 'Colour'))}</span>
        ${valueTag(d.value)}
        <span class="need">${sprite(d.from)}${d.part === 'Whole plant'
          ? esc(t('dye.fromplant', 'from {plant}', { plant: d.from.toLowerCase() }))
          : esc(t('dye.frompart', '{part} of {plant}',
              { part: d.part.toLowerCase(), plant: d.from.toLowerCase() }))}</span>
        <span class="need">${esc(d.milled ? t('dye.made.quern', 'Milled at a quern')
                                          : t('dye.made.other', 'Other job'))}</span>
      </div>
      ${other.length ? `<div class="brew-else">
        <p class="col-head">${esc(t('also.is', '{name} is also', { name: d.dye }))}</p>
        <div class="flow-row">${other.map((r) =>
          `<a class="chip" href="#/i/${r.industry}#r-${esc(r.id)}">${esc(r.name)}</a>`).join('')}</div>
      </div>` : ''}
    </div>`;
  }

  /* The loom at work: the warp is strung on the frame, the shuttle runs across
     it, and the cloth grows up from the beam in the fibre's own tone. Drawn
     rather than described for the same reason the still is — "what do I get"
     is a picture. The clip id is per-render, since two of these can share a
     page. */
  function weaveAnim(f) {
    const id = 'weave-clip-' + (++animSeq);
    /* Seven warp threads strung between the two beams, the woven bolt rising
       from the bottom one, and the shuttle running along the top of it. */
    const warp = [0, 1, 2, 3, 4, 5, 6].map((i) =>
      `<path d="M${11 + i * 3} 8.5v18"/>`).join('');
    return `<svg class="brew-anim weave-anim" data-kind="${esc(f.kind)}" viewBox="4 3 32 30"
      role="img" aria-label="${esc(t('anim.weave', '{out} woven into {cloth} at the loom',
        { out: f.out, cloth: f.cloth || t('word.cloth', 'cloth') }))}">
      <defs><clipPath id="${id}-c"><rect x="10" y="8.5" width="20" height="18"/></clipPath></defs>

      <g class="warp" fill="none" stroke="currentColor" stroke-width=".8"
         stroke-linecap="round">${warp}</g>
      <g clip-path="url(#${id}-c)">
        <g class="bolt-wrap"><rect class="bolt" x="10" y="15" width="20" height="12"/></g>
        <g class="shuttle"><rect x="4.5" y="13.4" width="8" height="3" rx="1.5"/></g>
      </g>

      <g class="ink" fill="none" stroke="currentColor" stroke-width="1.6"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 4.5v24M31 4.5v24"/>
        <path d="M7 8.5h26M7 26.5h26"/>
      </g>
    </svg>`;
  }

  /* ── the clothier's value calculator ──────────────────────────── */
  /* Thirty-one garments that differ only in one number would be a table. What
     nobody can do from a table is the arithmetic, and the arithmetic is the
     whole question the textile industry exists to answer: is a second robe
     worth more than a better dye, is giant cave spider silk worth the corpses.

     This is the wiki's own formula for a cloth item, minus the embroidery
     terms — those are left out because embroidering is almost always the wrong
     move and putting it in the calculator would suggest otherwise. Written the
     way the wiki simplifies it:

       material × (type × item quality + 10 × cloth quality + 10) + dye × dye quality

     Note where the material multiplier sits: outside the bracket, so it scales
     the garment, the weave and the thread all at once — and note that the dye
     sits outside it, so a good dye is worth the same on pig tail as on silk. */
  const clothValue = (g, c) => g.base == null ? null
    : c.mult * (g.base * c.itemQ + 10 * c.clothQ + 10) + c.dye * c.dyeQ;

  /* Quality modifiers, worst to best. The game's own ladder: an ordinary item
     multiplies by 1 and every grade after it by one more, until masterwork
     jumps to 12 and an artifact to 120. Cloth and dye stop at masterwork —
     only the finished garment can be an artifact. */
  const QUALITIES = [
    { v: 1,   label: 'Ordinary' },
    { v: 2,   label: '-well-crafted-' },
    { v: 3,   label: '+finely-crafted+' },
    { v: 4,   label: '*superior*' },
    { v: 5,   label: '≡exceptional≡' },
    { v: 12,  label: '☼masterwork☼' },
    { v: 120, label: 'Artifact', itemOnly: true }
  ];

  /* Every material a loom will actually produce cloth in, collapsed to the
     distinct multipliers — four chips rather than sixteen, because a garment
     cannot tell hemp from jute. Read off the fibre table so a new fibre with a
     new multiplier turns up here without being added twice.

     Naming a multiplier is the awkward part: "Silk" is worth ×1 as a vermin
     spider's and ×4 as a giant cave spider's, so the kind alone would put the
     same word on two chips with a fourfold gap between them. A kind names its
     chip only when it sits at exactly one multiplier; where it does not, the
     cloths name themselves and the ambiguity goes away. */
  const WEAVABLE = FIBRE_ROWS.filter((f) => f.weave);
  const kindMults = (kind) =>
    new Set(WEAVABLE.filter((f) => f.kind === kind).map((f) => f.mult)).size;

  const CLOTH_MATS = [...new Set(WEAVABLE.map((f) => f.mult))]
    .sort((a, b) => a - b)
    .map((mult) => {
      const here = WEAVABLE.filter((f) => f.mult === mult);
      const kinds = [...new Set(here.map((f) => f.kind))];
      const label = kinds.every((k) => kindMults(k) === 1)
        ? kinds.join(' / ')
        : [...new Set(here.map((f) => f.cloth.replace(/ cloth$/, '')))].join(' / ');
      return { mult, label };
    });

  /* Dye is a flat addition rather than a multiplier, so only its milled value
     matters and the seventy-two dyes collapse to two numbers. */
  const CLOTH_DYES = [
    { v: 0,  label: t('cloth.undyed', 'Undyed') },
    { v: 10, label: 'Redroot' },
    { v: 20, label: 'Dimple / emerald / sliver' }
  ];

  /* Shared by every garment panel on the page, so changing the material once
     re-prices the whole list rather than one row of it. Opens on plain cloth,
     undyed: the dye is the one term a fortress can leave out entirely, so it
     starts at nothing and the reader adds it and watches what it does. */
  const CALC = { mult: 2, itemQ: 12, clothQ: 12, dye: 0, dyeQ: 12 };

  /* Five choices, and four of them are the same seven-rung quality ladder — as
     rows of chips that came to twenty-six buttons wrapping over five lines,
     which is a lot of furniture around one number. A select states the current
     value in one line and hides the rest until asked, which is what these are:
     settings, not filters. The picker's own facets are selects for the same
     reason of room, but they sit above the list, where a filter belongs. */
  function calcControls() {
    /* The dyer's grade multiplies the dye's value, so with no dye there is
       nothing for it to multiply. Disabled rather than hidden: a row that
       vanishes takes with it the fact that a dyer matters at all, and moves
       everything below it while the reader is looking at the total. */
    const row = (key, label, opts, off) => `<div class="calc-row${off ? ' off' : ''}">
      <label class="flabel" for="calc-${esc(key)}">${esc(label)}</label>
      <select class="calc-sel" id="calc-${esc(key)}" data-k="${esc(key)}"
              ${off ? `disabled title="${esc(t('calc.nodye', 'Nothing to colour — pick a dye first'))}"` : ''}>
        ${opts.map((o) => `<option value="${o.v}" ${
          o.v === CALC[key] ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}
      </select>
    </div>`;

    const grades = (key) => QUALITIES
      .filter((q) => !q.itemOnly || key === 'itemQ')
      .map((q) => ({ v: q.v, label: q.label }));

    return `<div class="calc">
      ${row('mult', t('calc.cloth', 'Cloth'), CLOTH_MATS.map((m) => ({ v: m.mult, label: m.label + ' ×' + m.mult })))}
      ${row('itemQ', t('calc.clothier', 'Clothier'), grades('itemQ'))}
      ${row('clothQ', t('calc.weaver', 'Weaver'), grades('clothQ'))}
      ${row('dye', t('calc.dye', 'Dye'), CLOTH_DYES)}
      ${row('dyeQ', t('calc.dyer', 'Dyer'), grades('dyeQ'), !CALC.dye)}
    </div>`;
  }

  /* One row of the clothier's picker: what the garment is, and what the
     fortress you just described would get for it. The breakdown is shown term
     by term because the interesting answer is rarely the total — it is which
     of the four numbers is carrying it. */
  function garmentResult(g, opts) {
    const compact = !!(opts && opts.compact);
    const step  = clothierStep();
    const shop  = g.shop || (step && step.workshop) || "Clothier's Shop";
    const total = clothValue(g, CALC);
    const grade = (v) => (QUALITIES.find((q) => q.v === v) || {}).label || v;

    const line = (what, sum, val) => `<div class="calc-line">
      <dt>${what}</dt><dd class="calc-sum">${sum}</dd><dd class="calc-val">${val}</dd></div>`;

    const bracket = g.base == null ? null
      : g.base * CALC.itemQ + 10 * CALC.clothQ + 10;

    return `<div class="brew-out${compact ? ' beside' : ''}">
      <div class="brew-flow">
        <span class="chip in flat">${esc(t('cloth.onecloth', '1 × cloth'))}</span>
        <span class="brew-arrow">${ARROW}</span>
        ${ITEMS.has(g.name) ? chip(g.name, 'out') : `<span class="chip out flat">${esc(g.name)}</span>`}
        ${g.pair ? '<span class="need">× 2</span>' : ''}
      </div>
      <div class="brew-meta">
        <span class="need kind" data-kind="${esc(g.kind)}">${esc(g.kind)}</span>
        <span class="need">${esc(g.slot)}</span>
        ${g.base ? `<span class="need">${esc(t('cloth.basevalue', 'base {n}☼', { n: g.base }))}</span>` : ''}
        ${g.pair ? `<span class="need">${esc(t('cloth.pair', 'two from one cloth'))}</span>` : ''}
        ${g.avail === 'foreign'
          ? `<span class="need warnish">${sym('warn')}${esc(t('armor.foreign', 'dwarves cannot make it'))}</span>` : ''}
      </div>

      ${total == null ? '' : `
      <p class="col-head calc-head">${esc(t('calc.worth', 'Worth'))}</p>
      ${calcControls()}
      <dl class="calc-out">
        ${line(esc(t('calc.item', 'Item')), `${g.base} × ${esc(String(grade(CALC.itemQ)))}`, g.base * CALC.itemQ)}
        ${line(esc(t('calc.clothquality', 'Cloth quality')), `10 × ${esc(String(grade(CALC.clothQ)))}`, 10 * CALC.clothQ)}
        ${line(esc(t('calc.thread', 'Thread')), '10', 10)}
        ${line(esc(t('calc.subtotal', 'Subtotal × cloth')), `${bracket} × ${CALC.mult}`, CALC.mult * bracket)}
        ${line(esc(t('calc.dye', 'Dye')), CALC.dye
          ? `${CALC.dye} × ${esc(String(grade(CALC.dyeQ)))}`
          : esc(t('calc.undyed', 'undyed')), CALC.dye * CALC.dyeQ)}
      </dl>
      <p class="calc-total">${total}☼${g.pair
        ? ` <span class="muted">${esc(t('cloth.eachpair', 'each, {n}☼ for the pair',
            { n: total * 2 }))}</span>` : ''}</p>
      `}

    </div>`;
  }

  /* One row of the Loom's picker: where the thread comes from, what it is worth
     at each of the two stages, and — for hair — that it never reaches the second
     one at all. */
  function fibreResult(f, opts) {
    const compact = !!(opts && opts.compact);
    const step   = weaveStep();
    const source = RECIPES.find((r) => r.id === f.job);
    const known  = (n) => n && ITEMS.has(n);
    const link   = (name, kind) => known(name)
      ? chip(name, kind)
      : `<span class="chip ${kind} flat">${esc(name)}</span>`;
    const other  = compact ? [] : RECIPES.filter((r) => r !== step && r !== source &&
      (r.in || []).some((x) => x.item === f.in));

    const seasons = f.seasons
      ? (f.seasons.length === 4 ? t('fibre.allyear', 'Grows all year')
        : t('fibre.growsin', 'Grows in {seasons}',
            { seasons: f.seasons.join(t('word.and.plain', ' and ')) }))
      : null;

    return `<div class="brew-out${compact ? ' beside' : ''}">
      ${weaveAnim(f)}
      <div class="brew-flow">
        ${link(f.in, 'in')}
        <span class="brew-arrow">${ARROW}</span>
        ${link(f.out, 'in')}
        ${f.weave
          ? `<span class="brew-arrow">${ARROW}</span>${link(f.cloth, 'out')}`
          : `<span class="need warnish">${sym('warn')}${esc(t('fibre.noloom', 'no loom will take it'))}</span>`}
      </div>
      <div class="brew-meta">
        <span class="need kind" data-kind="${esc(f.kind)}">${esc(f.kind)}</span>
        <span class="need">${esc(f.where)}</span>
        ${f.ground ? `<span class="need">${esc(f.ground)}</span>` : ''}
        ${f.biome ? `<span class="need">${esc(f.biome)}</span>` : ''}
        ${seasons ? `<span class="need">${esc(seasons)}</span>` : ''}
      </div>

      <dl class="armor-stats fibre-stats">
        <div><dt>${esc(t('stat.material', 'Material'))}</dt><dd>×${f.mult}</dd></div>
        <div><dt>${esc(t('stat.thread', 'Thread'))}</dt><dd>${f.thread}☼</dd></div>
        <div><dt>${esc(t('stat.cloth', 'Cloth'))}</dt><dd>${f.weave ? f.clothValue + '☼' : '—'}</dd></div>
        <div title="${esc(t('stat.bestrobe.hint', 'A masterwork robe from masterwork cloth, masterfully dyed with a 20☼ dye — the best this fibre can do short of an artifact'))}"><dt>${esc(t('stat.bestrobe', 'Best robe'))}</dt><dd>${f.weave
          ? clothValue({ base: 33 }, { mult: f.mult, itemQ: 12, clothQ: 12, dye: 20, dyeQ: 12 }) + '☼'
          : '—'}</dd></div>
      </dl>


      ${other.length ? `<div class="brew-else">
        <p class="col-head">${esc(t('also.is', '{name} is also', { name: f.in }))}</p>
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
        ${chip(m.in, 'in')}
        <span class="brew-arrow">${ARROW}</span>
        ${chip(m.out, 'out')}
      </div>
      <div class="brew-meta">
        <span class="need kind" data-kind="${esc(m.kind)}">${esc(m.kind)}</span>
        ${m.color ? `<span class="need">${swatch(m.hex)}${esc(m.color)}</span>` : ''}
        ${m.value ? valueTag(m.value) : ''}
        <span class="need">${esc(m.source)}</span>
        ${(step && (step.needs || []).includes('bag')) ? needBadge('bag') : ''}
      </div>
      ${other.length ? `<div class="brew-else">
        <p class="col-head">${esc(t('also.is', '{name} is also', { name: m.in }))}</p>
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
        ${chip(b.in, 'in')}
        <span class="brew-arrow">${ARROW}</span>
        ${chip(b.out, 'out')}
      </div>
      <div class="brew-meta">
        <span class="need kind" data-kind="${esc(b.kind)}">${esc(b.kind)}</span>
        ${valueTag(b.value)}
        <span class="need">${esc(t('brew.based', '{type}-based', { type: b.type }))}</span>
        <span class="need">${esc(b.source)}</span>
      </div>
      ${other.length ? `<div class="brew-else">
        <p class="col-head">${esc(t('also.is', '{name} is also', { name: b.in }))}</p>
        <div class="flow-row">${other.map((r) =>
          `<a class="chip" href="#/i/${r.industry}#r-${esc(r.id)}">${esc(r.name)}</a>`).join('')}</div>
      </div>` : ''}
    </div>`;
  }

  /* One picker drives the still, the quern, the forge, the smelter and the
     armour page: the same list, filters and search, with each workshop
     supplying only its own result panel.

     A picker can carry more than one *mode*. The smelter does two jobs of the
     same shape — Smelt Ore against 17 ores, the alloy reactions against 14
     recipes — and they used to be two panels stacked down its page, each with
     its own list, its own filters and its own search box, one of them always
     scrolled past. They are one panel with a Job select on top instead: the two
     are never read at once, and a second copy of every control was the whole
     price of admitting they are different tables. Switching mode swaps the
     rows, the facets, the result panel and the wording together, so nothing
     from the ore side is left standing over the alloy list.

     A picker with no modes is a picker with one, and that mode is the config
     itself — which is why everything a mode owns is read through `opt`. */
  function mountPicker(host, cfg) {
    const modes = cfg.modes || [cfg];
    let mode = modes[0];
    let rows = [], facets = [], sel = {};
    let q = '', pick = null, shown = null;

    /* What the mode says, falling back to what the picker says: wording that
       does not change between modes is written once. */
    const opt = (key) => (mode[key] !== undefined ? mode[key] : cfg[key]);

    /* A facet is normally one value per row, but some are a list — an ore turns
       up in several rock types, an alloy contains several metals — so a row can
       sit under more than one of the facet's values. */
    const has = (r, f, v) => (f.multi ? (r[f.key] || []).includes(v) : r[f.key] === v);
    const values = (f) => f.multi
      ? [...new Set(rows.flatMap((r) => r[f.key] || []))]
      : [...new Set(rows.map((r) => r[f.key]))];
    /* Every facet is a select. They were rows of chips, which read well at four
       values and badly at fifteen: the forge's categories wrapped over three
       lines and made the loudest thing in the panel a control nobody is looking
       at, while the ores' rock types pushed the list itself below the fold. A
       select says what the current setting is in one line however long the list
       behind it is, and two of them stack where two chip rows sprawled — the
       same argument the clothier's calculator already makes about its five
       settings. */
    const dropdown = (f) => `<select class="fsel ${sel[f.key] === 'all' ? '' : 'on'}"
      data-f="${esc(f.key)}" aria-label="${esc(f.label)}">${
      [['all', t('filter.all', 'All')]].concat(values(f).map((v) => [v, v])).map(([v, label]) =>
        `<option value="${esc(v)}" ${v === sel[f.key] ? 'selected' : ''}>${
          esc(v !== 'all' && f.valueLabel ? f.valueLabel(label) : label)}</option>`).join('')}
    </select>`;

    /* A select cannot draw anything inside its options, so a facet that marks
       its values — the dyes' colour square — shows the mark for the one in
       force after the control instead. After, not before: an empty slot ahead
       of the select would either misalign this row against the ones with no
       mark, or shove the select sideways the moment a colour appeared. */
    const markOf = (f, v) => (v === 'all' ? '' : f.mark(v));
    const mark = (f) => (f.mark ? `<span class="fmark" data-f="${esc(f.key)}">${
      markOf(f, sel[f.key])}</span>` : '');

    /* The mode select is not a facet and does not sit among them: a facet
       narrows the list, this one replaces it, and everything below it — the
       other selects included — is read in its terms. */
    const modeLabel = cfg.modeLabel || t('facet.job', 'Job');
    const modeSel = () => (modes.length < 2 ? '' : `<div class="frow mode-row">
      <span class="flabel">${esc(modeLabel)}</span>
      <select class="fsel msel" aria-label="${esc(modeLabel)}">${modes.map((m) =>
        `<option value="${esc(m.key)}" ${m === mode ? 'selected' : ''}>${esc(m.label)}</option>`)
        .join('')}</select>
    </div>`);

    host.innerHTML = `
      <div class="brew">
        <div class="brew-pick">
          <div class="brew-filters"></div>
          <input class="brew-search" type="search" autocomplete="off" spellcheck="false">
          <div class="brew-list" role="listbox"></div>
        </div>
        <div class="brew-panel">${cfg.aside || ''}<div class="panel-result"></div></div>
      </div>`;

    const filters = host.querySelector('.brew-filters');
    const list    = host.querySelector('.brew-list');
    const panel   = host.querySelector('.panel-result');
    const search  = host.querySelector('.brew-search');

    /* A facet the caller drives itself draws no control — the armour page
       filters by body part from the figure in the panel, and a select listing
       the same eleven parts would only be a second, worse control. */
    function paintFilters() {
      filters.innerHTML = modeSel() + facets.filter((f) => !f.silent).map((f) =>
        `<div class="frow"><span class="flabel">${esc(f.label)}</span>${dropdown(f)}${mark(f)}</div>`)
        .join('');
      filters.hidden = !filters.innerHTML.trim();
    }

    /* Everything a mode owns, swapped in one go. The filters go back to All
       rather than carrying over: the ores' rock types mean nothing to an alloy,
       and a setting that cannot apply is worse than no setting. The search box
       does carry over, because unlike a facet it is still on screen saying so. */
    function useMode(m) {
      mode = m;
      rows = opt('rows') || [];
      facets = opt('facets') || [];
      sel = {};
      facets.forEach((f) => (sel[f.key] = 'all'));
      pick = rows[0];
      shown = null;
      search.placeholder = opt('placeholder') || '';
      search.setAttribute('aria-label', opt('placeholder') || '');
      list.setAttribute('aria-label', opt('listLabel') || '');
      paintFilters();
      if (cfg.onMode) cfg.onMode(mode);
    }

    /* A row is addressed by its place in the table rather than by the words in
       its left column: those are a recipe now, not a name, and two recipes can
       read alike. */
    const hay = (r) => r.hay || (r.in + ' ' + r.out).toLowerCase();
    const matches = () => rows.filter((r) =>
      facets.every((f) => sel[f.key] === 'all' || has(r, f, sel[f.key])) &&
      (!q || hay(r).includes(q)));

    function paint() {
      const hits = matches();
      /* Keep the selection if it survived the filter, otherwise follow the list
         — an empty panel next to a full list reads as a broken page. */
      if (!hits.includes(pick)) pick = hits[0];
      const rowIn  = opt('rowIn')  || (() => '');
      const rowOut = opt('rowOut') || (() => '');

      list.innerHTML = hits.length
        ? hits.map((r) => `<button data-row="${rows.indexOf(r)}" role="option"
             aria-selected="${r === pick}" class="${r === pick ? 'on' : ''}">
             <span class="bi">${rowIn(r)}${esc(r.in)}</span>
             <span class="bo">${rowOut(r)}${esc(r.out)}</span></button>`).join('')
        : `<p class="none">${esc(opt('empty'))}</p>`;

      /* Only rebuild the panel when the choice really changed — otherwise every
         keystroke in the filter would restart the animation. */
      if (pick !== shown) {
        panel.innerHTML = pick ? opt('result')(pick) : '';
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
        const drop = host.querySelector(`.fsel[data-f="${key}"]`);
        if (drop) { drop.value = v; drop.classList.toggle('on', v !== 'all'); }
        const spot = host.querySelector(`.fmark[data-f="${key}"]`);
        if (spot) spot.innerHTML = markOf(facets.find((f) => f.key === key), v);
        paint();
      },
      select(row) { pick = row; paint(); },
      /* Rebuild the panel even though the choice did not change. The panel is
         normally only redrawn on a new pick, so that a keystroke in the filter
         does not restart the animation — but a panel with a control of its own
         has a second reason to change, and this is it. */
      refresh() { shown = null; paint(); }
    };

    /* The filter block is rebuilt on every mode change, so the listener sits on
       the block rather than on the selects inside it. */
    filters.addEventListener('change', (ev) => {
      const m = ev.target.closest('.msel');
      if (m) {
        useMode(modes.find((x) => x.key === m.value) || modes[0]);
        return paint();
      }
      const d = ev.target.closest('.fsel');
      if (d) api.set(d.dataset.f, d.value);
    });

    search.addEventListener('input', () => { q = search.value.trim().toLowerCase(); paint(); });

    list.addEventListener('click', (ev) => {
      const b = ev.target.closest('button');
      if (!b) return;
      api.select(rows[Number(b.dataset.row)]);
    });

    useMode(modes.find((m) => m.key === cfg.startMode) || modes[0]);
    if (cfg.start) pick = rows.find((r) => r.id === cfg.start) || pick;
    paint();
    /* For a caller that has to wire up something inside the panel it drew. */
    if (cfg.onReady) cfg.onReady(api, host);
    return api;
  }

  /* ── the pickers, and which workshops carry one ───────────────── */
  /* Each entry replaces the generic step it names: the step stays in the recipe
     graph so the industry map is honest, and its page shows this instead. The
     workshop list reads the same table to mark the buildings that are
     interactive, so the badge cannot drift from what the page actually does. */
  const PICKERS = [
    { step: 'brew', title: t('pick.brew.title', 'Brewing'),
      noun: t('pick.brew.noun', 'brewable ingredients'),
      rows: BREWING, result: brewResult,
      facets: [{ key: 'kind', label: t('facet.drink', 'Drink') },
               { key: 'source', label: t('facet.source', 'Source') }],
      rowIn: (r) => spriteCell(r.in),
      placeholder: t('pick.brew.filter', 'Filter ingredients…'),
      listLabel: t('pick.brew.list', 'Brewing ingredients'),
      empty: t('pick.brew.empty', 'No ingredient matches those filters.') },

    { step: 'mill', title: t('pick.mill.title', 'Milling'),
      noun: t('pick.mill.noun', 'millable plants'),
      rows: MILLING, result: millResult,
      facets: [{ key: 'kind', label: t('facet.product', 'Product') },
               { key: 'source', label: t('facet.source', 'Source') }],
      rowIn: (r) => spriteCell(r.in),
      placeholder: t('pick.mill.filter', 'Filter plants…'),
      listLabel: t('pick.mill.list', 'Millable plants'),
      empty: t('pick.mill.empty', 'No plant matches those filters.') },

    { step: 'dye-thread', title: t('pick.dye.title', 'Dyes'),
      noun: t('pick.dye.noun', 'dyes'),
      rows: DYE_ROWS, result: dyeResult,
      /* The options read as "show me the blues", so they are plural; the value
         behind them stays the singular tone stored on the dye. */
      facets: [{ key: 'family', label: t('facet.tone', 'Tone'),
                 mark: (v) => swatch(FAMILY_HEX[v]),
                 valueLabel: (v) => t('facet.tone.plural', '{v}s', { v }) },
               { key: 'made', label: t('facet.from', 'From') }],
      rowOut: (r) => swatch(COLOR_HEX[r.color]),
      placeholder: t('pick.dye.filter', 'Filter dyes…'),
      listLabel: t('pick.dye.list', 'Dyes'),
      empty: t('pick.dye.empty', 'No dye matches those filters.') },

    { step: 'weave', title: t('pick.fibre.title', 'Thread sources'),
      noun: t('pick.fibre.noun', 'thread sources'),
      rows: FIBRE_ROWS, result: fibreResult,
      facets: [{ key: 'kind', label: t('facet.fibre', 'Fibre') },
               { key: 'where', label: t('facet.from', 'From') }],
      rowIn: (r) => spriteCell(r.in),
      placeholder: t('pick.fibre.filter', 'Filter thread sources…'),
      listLabel: t('pick.fibre.list', 'Thread sources'),
      empty: t('pick.fibre.empty', 'Nothing gives thread under those filters.') },

    /* The one picker whose panel is not just a lookup: the settings inside it
       are a fortress you are describing, and every row of the list is repriced
       when you change one. That is why it needs `refresh` — the choice has not
       changed, but the answer has. */
    { step: 'clothier', title: t('pick.cloth.title', 'Cloth goods'),
      noun: t('pick.cloth.noun', 'things made from cloth'),
      rows: GOODS_ROWS, result: garmentResult,
      rowIn: eqSprite,
      facets: [{ key: 'slot', label: t('facet.wornon', 'Worn on') },
               { key: 'kind', label: t('facet.kind', 'Kind') }],
      placeholder: t('pick.cloth.filter', 'Filter cloth goods…'),
      listLabel: t('pick.cloth.list', 'Things made from cloth'),
      empty: t('pick.cloth.empty', 'Nothing matches those filters.'),
      onReady: (api, host) => host.addEventListener('change', (ev) => {
        const sel = ev.target.closest('.calc-sel');
        if (!sel) return;
        CALC[sel.dataset.k] = Number(sel.value);
        api.refresh();
      }) },

    /* The forge's rows come from three data files rather than one, and its
       categories are the wiki's own production list. */
    { step: 'forge', title: t('pick.forge.title', 'What the forge makes'),
      noun: t('pick.forge.noun', 'things a forge makes'),
      rows: FORGE_ROWS, result: forgeResult,
      rowIn: forgeCell,
      facets: [{ key: 'cat', label: t('facet.makes', 'Makes') },
               { key: 'labour', label: t('facet.labour', 'Labour') }],
      placeholder: t('pick.forge.filter', 'Filter what the forge makes…'),
      listLabel: t('pick.forge.list', 'Things the forge makes'),
      empty: t('pick.forge.empty', 'The forge makes nothing matching those filters.'),
      onReady: (api, host) => host.addEventListener('change', (ev) => {
        const sel = ev.target.closest('.calc-sel');
        if (!sel) return;
        FORGE_CALC[sel.dataset.k] = sel.dataset.k === 'metal' ? sel.value : Number(sel.value);
        api.refresh();
      }) },

    /* The smelter's two jobs, in one panel. They are the same question asked
       twice — what comes out of the furnace, and what does it want going in —
       so the Job select swaps between them and everything else stays put. Both
       steps are named here, which is what keeps either of them from also
       showing up as a plain job card underneath. */
    /* The steel chain belongs to the building rather than to either of its
       tables — it runs across both — so it hangs under the picker the way the
       forge's notes do. */
    { steps: ['smelt-ore', 'make-alloy'],
      modeLabel: t('facet.job', 'Job'), tables: SMELT_TABLES,
      modes: [
        { key: 'ore', label: t('pick.ore.mode', 'Smelt ore'),
          title: t('pick.ore.title', 'Ores'), noun: t('pick.ore.noun', 'ores'),
          rows: ORE_ROWS, result: oreResult,
          facets: [{ key: 'metal', label: t('facet.metal', 'Metal') },
                   { key: 'rocks', label: t('facet.foundin', 'Found in'), multi: true }],
          rowOut: (r) => { const c = metalColor(r.metal); return c ? ingot(c) : ''; },
          placeholder: t('pick.ore.filter', 'Filter ores…'),
          listLabel: t('pick.ore.list', 'Ores'),
          empty: t('pick.ore.empty', 'No ore matches those filters.') },

        { key: 'alloy', label: t('pick.alloy.mode', 'Make alloy'),
          title: t('pick.alloy.title', 'Alloys'), noun: t('pick.alloy.noun', 'alloy recipes'),
          rows: ALLOY_ROWS, result: alloyResult,
          facets: [{ key: 'use', label: t('facet.use', 'Use') },
                   { key: 'contains', label: t('facet.contains', 'Contains'), multi: true }],
          rowOut: (r) => { const c = metalColor(r.alloy); return c ? ingot(c) : ''; },
          placeholder: t('pick.alloy.filter', 'Filter alloys…'),
          listLabel: t('pick.alloy.list', 'Alloys'),
          empty: t('pick.alloy.empty', 'No alloy matches those filters.') }
      ] }
  ];

  /* A picker states which steps it replaces and which modes it carries. Most
     carry one of each and say so in the singular; these read either shape. */
  const pickModes = (p) => p.modes || [p];
  const pickSteps = (p) => p.steps || [p.step];
  const pickersFor = (steps) => PICKERS.filter((p) =>
    pickModes(p).some((m) => m.rows.length) &&
    steps.some((r) => pickSteps(p).includes(r.id)));

  /* The marker on a workshop that answers questions rather than listing jobs.
     It belongs on the list, where the cards are otherwise indistinguishable —
     the workshop's own page has the picker right there on it and needs no
     label. It carries no words, so the tooltip does the explaining, and names
     the tables since a mark alone cannot say whether that means two rows or
     seventy-seven. */
  function liveMark(picks) {
    const what = picks.flatMap(pickModes).map((m) => `${m.rows.length} ${m.noun}`)
      .join(t('word.and.plain', ' and '));
    return `<span class="live-mark" title="${esc(t('ws.livemark',
      'Pick from {what} and see what comes out', { what }))}"
      >${sym('spark')}</span>`;
  }

  /* ── views ────────────────────────────────────────────────────── */
  const stepCount = (n) => t(n === 1 ? 'count.step' : 'count.steps',
    n === 1 ? '{n} step' : '{n} steps', { n });
  function viewHome() {
    const cards = INDUSTRIES.map((i) => {
      const n = recipesOf(i.id).length;
      return `<a class="ind-card" href="#/i/${i.id}" style="--c:${i.color}">
        <div class="ic">${sym(i.icon, 'ind')}</div>
        <h2>${esc(indName(i))}</h2>
        <p>${esc(indBlurb(i))}</p>
        <div class="count">${esc(stepCount(n))}</div>
      </a>`;
    }).join('');

    main.innerHTML = `
      <section class="hero">
        <h1>${esc(t('home.title', 'Every chain, from boulder to masterwork'))}</h1>
        <p>${esc(t('home.blurb',
          'An interactive map of the Dwarf Fortress industries: what turns into what, at which '
          + 'workshop, with which skill, and which empty barrel is stopping the whole thing. '
          + 'Click any item to see everything that makes it and everything it feeds.'))}</p>
      </section>
      <div class="ind-grid">${cards}</div>`;
  }

  /* An industry is one view. It used to be two tabs — Steps, which listed the
     jobs grouped by the building they happen in, and Chain map, which drew the
     same jobs as a graph — and each answered half a question. The map in
     `viewFlow` is both, so there is nothing left to switch between.

     `mode` is the third segment of the URL. It used to say which tab; it now
     names the path the map should open on, which is what makes a route
     linkable. An old `/map` bookmark matches no path and lands on the whole
     picture, which is what that tab drew anyway. */
  function viewIndustry(id, mode) {
    const ind = industry(id);
    if (!ind) return viewHome();
    const rs = recipesOf(id);

    main.innerHTML = `
      <a class="back" href="#/">${sym('back')}${esc(t('back.industries', 'All industries'))}</a>
      <div class="page-head">
        <div>
          <h1>${sym(ind.icon)} ${esc(indName(ind))}</h1>
          <p>${esc(indBlurb(ind))}</p>
        </div>
      </div>
      <div id="ind-body"></div>`;

    const body = document.getElementById('ind-body');

    if (FLOWS[id]) return viewFlow(body, FLOWS[id], ind, mode);

    /* Every industry has a map. An industry added without one still gets a
       page rather than a blank panel: the old grouped list, which needs no
       configuration beyond the steps themselves. */
    const steps = (list) => {
      const byShop = new Map();
      list.forEach((r) => {
        if (!byShop.has(r.workshop)) byShop.set(r.workshop, []);
        byShop.get(r.workshop).push(r);
      });
      return [...byShop].map(([shop, group]) => {
        const skills = [...new Set(group.map((r) => r.skill).filter((k) => k && k !== '—'))].join(' · ');
        return `<section class="shop-group">
          <div class="shop-head">
            <a class="shop-link" href="#/w/${encodeURIComponent(shop)}">
              ${icon(shop, 'lg')}<h2>${esc(shop)}</h2>
            </a>
            ${skills ? `<span class="skill">${esc(skills)}</span>` : ''}
          </div>
          <div class="rec-grid">${group.map((r) => recipeCard(r)).join('')}</div>
        </section>`;
      }).join('');
    };

    body.innerHTML = steps(rs);
  }

  const recipeById = (rid) => RECIPES.find((r) => r.id === rid);

  /* ── the industry map: the step list and the chain, in one view ─ */
  /* Steps and Chain map were two tabs answering half a question each: the list
     said what every job wants and where it happens but not what feeds what;
     the map said what feeds what but shrank the answer to fit a viewport and
     then asked to be dragged around. This is both at once — full step cards,
     wired together, running down the page instead of across it, so the only
     control it needs is the scrollbar.

     The layout is worked out from the recipes rather than drawn: a job lands on
     the row below the last of its inputs, so a job that eats what the row above
     made sits directly under it. Nothing in here knows what an ashery is, which
     is what stops the picture drifting away from data/recipes.js. */

  function flowModel(cfg) {
    const nodes = new Map();
    const edges = [];

    /* `joins` folds one item name into another for the length of this map.
       The recipes are written at the altitude each industry needs and the two
       do not always meet: the loom eats "Thread" while five jobs make a "…
       thread", the forge eats an "Iron bar" while the smelter makes "Metal
       bars". Renaming on the way in is what turns those into one node with
       wires into it, instead of a row of orphans above a row of things nobody
       supplies. It is a display join and nothing else — data/recipes.js keeps
       the names the game uses. */
    const joins = cfg.joins || {};
    const addItem = (raw) => {
      const name = joins[raw] || raw;
      const k = 'i:' + name;
      if (!nodes.has(k)) nodes.set(k, { key: k, kind: 'item', name, layer: 0 });
      return k;
    };

    const steps = cfg.steps.map(recipeById).filter(Boolean);
    steps.forEach((r) => {
      const k = 'j:' + r.id;
      nodes.set(k, { key: k, kind: 'job', r, layer: 0 });
      (r.in  || []).forEach((x) => edges.push({ from: addItem(x.item), to: k, job: k }));
      (r.out || []).forEach((x) => edges.push({ from: k, to: addItem(x.item), job: k }));
    });

    return collapseEnds(nodes, dedupe(edges), steps);
  }

  /* Two inputs that join to the same node — the forge's iron and copper bars —
     are one wire, not two drawn on top of each other. */
  function dedupe(edges) {
    const seen = new Set();
    return edges.filter((e) => {
      const k = e.from + '>' + e.to;
      return seen.has(k) ? false : (seen.add(k), true);
    });
  }

  /* A carpenter's workshop that ends in furniture, a barrel, a bin, a bucket
     and a cage is five nodes wide and says one thing. Where a job's outputs are
     the end of the line — nothing else on the map makes them, nothing on it
     eats them — they collapse into the one node they amount to: what this job
     gives you. Anything another job wants keeps its own node, because that is
     the node a wire has to leave from. */
  function collapseEnds(nodes, edges, steps) {
    const eaten = new Set(edges.filter((e) => e.to[0] === 'j').map((e) => e.from));
    const makers = new Map();
    edges.filter((e) => e.from[0] === 'j')
      .forEach((e) => makers.set(e.to, (makers.get(e.to) || 0) + 1));

    steps.forEach((r) => {
      const k = 'j:' + r.id;
      const ends = edges.filter((e) => e.from === k && !eaten.has(e.to) && makers.get(e.to) === 1);
      if (ends.length < 2) return;
      const mk = 'm:' + r.id;
      nodes.set(mk, {
        key: mk, kind: 'item', layer: 0,
        name: nodes.get(ends[0].to).name,
        names: ends.map((e) => nodes.get(e.to).name)
      });
      ends.forEach((e) => { nodes.delete(e.to); e.to = mk; });
    });

    return { nodes, edges: dedupe(edges) };
  }

  /* Some chains genuinely close. A crop grows from seeds and hands the seeds
     back; the wire that closes that loop cannot point downwards, and a layering
     pass that tries to honour it drags the whole industry out of order — the
     farm plot ends up below the job that recovers what it planted.

     So the loop is cut first. A depth-first walk from the jobs in the order the
     flow lists them marks any edge that reaches a node already on the stack:
     that is the one edge of the cycle a reader is least surprised to see drawn
     as a return, because everything before it read forwards. Layering ignores
     the marked edges entirely and the map draws them as loops. */
  function flowBreakCycles(nodes, edges) {
    const out = new Map();
    edges.forEach((e) => (out.get(e.from) || out.set(e.from, []).get(e.from)).push(e));

    const state = new Map();
    const visit = (k) => {
      state.set(k, 1);
      (out.get(k) || []).forEach((e) => {
        const s = state.get(e.to) || 0;
        if (s === 1) e.cycle = true;
        else if (s === 0) visit(e.to);
      });
      state.set(k, 2);
    };
    nodes.forEach((n, k) => { if (!state.get(k)) visit(k); });
  }

  /* Longest-path layering, relaxed rather than sorted — cheap, and it cannot
     hang now that the loops are cut. */
  function flowLayer(nodes, edges) {
    const inc = new Map(), out = new Map();
    const push = (m, k, v) => { (m.get(k) || m.set(k, []).get(k)).push(v); };
    edges.filter((e) => !e.cycle)
      .forEach((e) => { push(inc, e.to, e.from); push(out, e.from, e.to); });

    for (let pass = 0; pass < 24; pass++) {
      let moved = false;
      nodes.forEach((n) => {
        (inc.get(n.key) || []).forEach((f) => {
          const src = nodes.get(f);
          if (src && src.layer < 40 && src.layer + 1 > n.layer) { n.layer = src.layer + 1; moved = true; }
        });
      });
      if (!moved) break;
    }

    /* Something nothing on this map makes — a log, a tub of tallow — is what
       you bring to the chain, not a stage of it. Left up at the top it would
       trail a wire the length of the page, so it drops to just above the job
       that wants it. */
    nodes.forEach((n) => {
      if (inc.has(n.key)) return;
      const eaters = (out.get(n.key) || []).map((k) => nodes.get(k)).filter(Boolean);
      if (eaters.length) n.layer = Math.max(0, Math.min(...eaters.map((x) => x.layer)) - 1);
    });

    /* Pulling the sources down can empty a row. Close the gaps, or the map
       leaves a band of blank page where a row used to be. */
    const used = [...new Set([...nodes.values()].map((n) => n.layer))].sort((a, b) => a - b);
    const rank = new Map(used.map((L, i) => [L, i]));
    nodes.forEach((n) => (n.layer = rank.get(n.layer)));
  }

  /* A wire that skips a row — potash from ash jumps the whole lye stage — gets
     an invisible waypoint in each row it crosses. They are ordered along with
     everything else, so the long wire claims a lane of its own between the
     cards instead of disappearing under them. */
  function flowWires(nodes, edges) {
    let n = 0;
    return edges.map((e) => {
      const a = nodes.get(e.from), b = nodes.get(e.to);
      /* Some chains genuinely close: a crop grows from seeds and hands the
         seeds back, ash becomes lye becomes potash. There is no row order that
         makes that wire point downwards, so it is marked and drawn as what it
         is — a return, routed out to the side rather than pretending to be one
         more step forward. */
      const back = e.cycle || b.layer <= a.layer;
      const chain = [a.key];
      for (let L = a.layer + 1; L < b.layer; L++) {
        const k = 'w:' + (n++);
        nodes.set(k, { key: k, kind: 'way', layer: L });
        chain.push(k);
      }
      chain.push(b.key);
      return { ...e, chain, back };
    });
  }

  /* Order each row by where its neighbours sit in the rows above and below, so
     the branches stay on their own side and the wires mostly stop crossing. */
  function flowOrder(nodes, wires) {
    const rows = [];
    nodes.forEach((n) => (rows[n.layer] = rows[n.layer] || []).push(n));
    rows.forEach((row) => row.forEach((n, i) => (n.pos = i)));

    const near = new Map();
    const link = (a, b) => { (near.get(a) || near.set(a, []).get(a)).push(b); };
    wires.forEach((w) => w.chain.forEach((k, i) => {
      if (i) { link(k, w.chain[i - 1]); link(w.chain[i - 1], k); }
    }));

    /* Sweeping only downwards settles the top of the map and leaves the bottom
       to whatever order the recipes happened to be written in, which is how a
       branch ends up on the left in one row and the right in the next. Every
       other pass runs upwards, so each row is pulled into line with the rows on
       both sides of it. */
    for (let pass = 0; pass < 12; pass++) {
      const order = pass % 2 ? [...rows].reverse() : rows;
      order.forEach((row) => {
        row.forEach((n) => {
          const ns = (near.get(n.key) || []).map((k) => nodes.get(k))
            .filter((x) => x && x.layer !== n.layer);
          n.bary = ns.length ? ns.reduce((s, x) => s + x.pos, 0) / ns.length : n.pos;
        });
        row.sort((a, b) => a.bary - b.bary);
        row.forEach((n, i) => (n.pos = i));
      });
    }
    flowUncross(rows, wires, nodes);
    return rows;
  }

  /* Barycentres get the rows roughly right and then stop, because an average is
     blind to a swap that improves nothing but the crossing count — which is
     exactly the swap that decides whether the potash branch runs down one side
     of the map or wanders across it. This is the other half of the usual pass:
     try each neighbouring pair in a row and keep the swap if fewer wires cross. */
  function flowUncross(rows, wires, nodes) {
    const gaps = [];
    wires.filter((w) => !w.back).forEach((w) => w.chain.forEach((k, i) => {
      if (!i) return;
      const a = nodes.get(w.chain[i - 1]), b = nodes.get(k);
      (gaps[a.layer] = gaps[a.layer] || []).push([a, b]);
    }));

    /* Two wires across the same gap cross when their ends are in the opposite
       order to their starts. Every row here is a handful of nodes, so counting
       every pair is cheaper than being clever about it. */
    const crossings = (gap) => {
      const ls = gaps[gap] || [];
      let n = 0;
      for (let i = 0; i < ls.length; i++)
        for (let j = i + 1; j < ls.length; j++)
          if ((ls[i][0].pos - ls[j][0].pos) * (ls[i][1].pos - ls[j][1].pos) < 0) n++;
      return n;
    };

    for (let pass = 0; pass < 4; pass++) {
      let better = false;
      rows.forEach((row, L) => {
        for (let i = 0; i + 1 < row.length; i++) {
          const before = crossings(L - 1) + crossings(L);
          const a = row[i], b = row[i + 1];
          a.pos = i + 1; b.pos = i;
          if (crossings(L - 1) + crossings(L) < before) {
            row[i] = b; row[i + 1] = a; better = true;
          } else { a.pos = i; b.pos = i + 1; }
        }
      });
      if (!better) break;
    }
  }

  function viewFlow(body, cfg, ind, opening) {
    const { nodes, edges } = flowModel(cfg);
    flowBreakCycles(nodes, edges);
    flowLayer(nodes, edges);
    const wires = flowWires(nodes, edges);
    const rows  = flowOrder(nodes, wires);

    /* An item with nothing making it is an input to the whole map; one with
       nothing eating it is where a branch stops. Both are worth marking — they
       are the only two places a reader has to look outside this page. */
    const made = new Set(edges.map((e) => e.to));
    const used = new Set(edges.map((e) => e.from));
    const role = (n) => (!made.has(n.key) ? 'src' : !used.has(n.key) ? 'end' : '');

    const itemLink = (name) => {
      const art = metalColor(name) ? ingot(metalColor(name)) : sprite(name);
      return `<a class="fi-link" href="#/item/${encodeURIComponent(name)}"
        >${art}<span class="fi-name">${esc(name)}</span></a>`;
    };

    const itemNode = (n) => {
      const r = role(n);
      /* Only the end of a branch is marked. What you bring from elsewhere is
         already saying so with a dashed box, and a second circle at the head of
         every chain turned a mark that means "stop here" into wallpaper. */
      const tag = r === 'end'
        ? `<span class="fi-tag end" title="${esc(t('map.terminus', 'Nothing on this map uses this: the branch stops here'))}"
            >${sym('terminus')}</span>` : '';
      /* A collapsed node is a list, so it cannot be a link itself — each name
         inside it goes to its own item page. */
      return `<div class="fnode f-item ${r}${n.names ? ' f-many' : ''}"
        >${(n.names || [n.name]).map(itemLink).join('')}${tag}</div>`;
    };

    /* Some of these jobs belong to other industries — the ash chain starts at a
       wood furnace and ends at a kiln and a farm plot, and the forge would
       otherwise start with ore nobody dug. Dropping them would leave the map
       beginning and ending in mid-air, so they are here with the industry they
       came from named on them. */
    const badges = (r) => {
      const own = r.industry === ind.id || (r.also || []).includes(ind.id);
      const from = own ? null : industry(r.industry);
      return (r.skill && r.skill !== '—' ? `<span class="need">${esc(r.skill)}</span>` : '')
        + (r.needs || []).map((x) => needBadge(x, true)).join('')
        + (from ? `<a class="need borrowed" href="#/i/${from.id}"
            title="${esc(t('map.borrowed', 'This job belongs to {name}', { name: indName(from) }))}"
            >${sym(from.icon)}${esc(indName(from))}</a>` : '');
    };

    /* A card is 258px wide and every one on a row is stretched to the tallest,
       so a card carries the job, what it wants and nothing else. */
    const jobBody = (n, opts) => {
      const o = opts || {};
      const head = `<h3></h3>${o.hideBadges ? '' : `<div class="needs">${badges(n.r)}</div>`}`;
      return `<span class="fnum"></span>
        <div class="fjob-txt">${head}</div>`;
    };

    /* The building is named above its own picture, so the plate reads as a
       labelled thing rather than as decoration over the job title — and the eye
       can run down the map picking out buildings without stopping to work out
       which pixel-art hut is which. */
    const shopHead = (w) => `<a class="fjob-shop" href="#/w/${encodeURIComponent(w)}"
        >${esc(w)}</a>
      <div class="fjob-art">${plate(w, 'xl')}</div>`;

    const jobNode = (n) =>
      `<article class="fnode f-job">${shopHead(n.r.workshop)}${jobBody(n)}</article>`;

    /* All four glass jobs want a glassmaker and a unit of fuel. Repeating that
       on four lines says one thing four times and buries what actually differs
       between them, so where every job under a roof asks for the same skill and
       the same containers it is said once, on the building. */
    const sameBadges = (list) => {
      const drawn = list.map((n) => badges(n.r).replace(/\s+/g, ' ').trim());
      return drawn[0] && drawn.every((x) => x === drawn[0]) ? drawn[0] : null;
    };

    /* A glass furnace makes green glass, clear glass, crystal glass and glass
       goods, and drawing that as four cards is the same plate four times over
       for jobs that share one hearth. Where neighbouring jobs on a row run at
       the same building, the building gets one card and the jobs get another
       beside it. Every wire on that stretch of the chain lands on the building;
       the card next to it says what it can be told to do. Each job is still its
       own node with its own number — the tidying is to the picture, not to
       the chain. */
    const groupNode = (list) => {
      const shared = sameBadges(list);
      return `<div class="f-group">
        <article class="f-shopcard">${shopHead(list[0].r.workshop)}${
          shared ? `<div class="needs">${shared}</div>` : ''}</article>
        <ul class="f-types">${list.map((n) =>
          `<li><article class="fnode f-job in-list">${
            jobBody(n, { list: true, hideBadges: !!shared })}</article></li>`
        ).join('')}</ul>
      </div>`;
    };

    /* Emitting the row and recording what was emitted in the same walk: the
       elements come back out of the DOM in document order, so this array is
       what pairs a node with its box without a lookup key on either. */
    const order = [];
    const rowHtml = (row) => {
      let html = '', i = 0;
      while (i < row.length) {
        const n = row[i];
        if (n.kind !== 'job') {
          order.push(n.key);
          html += n.kind === 'way' ? '<span class="f-way"></span>' : itemNode(n);
          i++;
          continue;
        }
        let j = i + 1;
        while (j < row.length && row[j].kind === 'job'
               && row[j].r.workshop === n.r.workshop) j++;
        const run = row.slice(i, j);
        run.forEach((x) => order.push(x.key));
        html += run.length > 1 ? groupNode(run) : jobNode(n);
        i = j;
      }
      return html;
    };

    const shopCount = new Set([...nodes.values()]
      .filter((n) => n.kind === 'job').map((n) => n.r.workshop)).size;

    /* A path is part of this site's own furniture rather than the game's, so
       its label, its tag and its prose all translate — keyed by the industry
       and the path id the flow already carries. */
    const pathKey  = (p, field) => `${ind.id}.${p.id}.${field}`;
    const pathText = (p, field, en) => (en ? td('flowPath', pathKey(p, field), en) : en);

    body.innerHTML = `
      <p class="group-note">${esc(td('flowBlurb', ind.id, cfg.blurb))}</p>
      <div class="ind-filters">
        <div class="frow" data-facet="path">
          <span class="flabel">${esc(t('map.show', 'Show'))}</span>
          ${cfg.paths.map((p, i) => `<button class="fchip ${
            p.id === opening || (!cfg.paths.some((x) => x.id === opening) && !i) ? 'on' : ''}"
            data-v="${esc(p.id)}">${esc(pathText(p, 'label', p.label))}</button>`).join('')}
        </div>
      </div>
      <p class="fm-count"></p>
      <div class="fmap" style="--c:${esc(ind.color)}">
        <svg class="fmap-wires" aria-hidden="true"></svg>
        ${rows.map((row) => `<div class="fmap-row">${rowHtml(row)}</div>`).join('')}
      </div>
      <p class="fm-legend">${t('map.legend',
        'Every job on the map, in the order the fortress runs them. A dashed box is something you '
        + 'bring from elsewhere; a gold one marked {terminus} is where the branch stops. Click any '
        + 'item to see everything else that makes or eats it.',
        { terminus: sym('terminus') })}</p>`;

    const host = body.querySelector('.fmap');
    const svg  = host.querySelector('.fmap-wires');

    /* Keys never reach the DOM: `order` was filled by the walk that wrote the
       HTML and the browser hands the elements back in the same order, so a
       node's box is one map lookup rather than a query against an attribute
       that would have to be escaped. */
    const els = new Map();
    const cells = [...host.querySelectorAll('.fnode, .f-way')];
    order.forEach((k, n) => els.set(k, cells[n]));

    const wireEls = wires.map((w) => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('class', 'fm-wire' + (w.back ? ' back' : ''));
      svg.appendChild(p);
      return { w, el: p };
    });

    function drawWires() {
      const box = host.getBoundingClientRect();
      if (!box.width) return;
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);

      /* A job that shares a card with the rest of its building is entered and
         left at the card's edge rather than its own column's, or the wire would
         stop halfway down the workshop's picture. The column it lands above is
         still its own, which is what keeps four furnace jobs distinguishable
         under one plate. */
      /* Where several jobs share a building, the building's own card is what
         the wires attach to — all of them, in and out. Which of its jobs a wire
         belongs to is answered by the card of types standing next to it, not by
         where on an edge the wire happens to land. */
      const outer = (el) => {
        const g = el.closest('.f-group');
        return g ? g.querySelector('.f-shopcard') : el;
      };

      /* A card is entered at the top and left at the bottom; a waypoint is only
         a place the wire passes through, so it is entered and left at its
         middle.

         Jobs listed inside a shared card all stand at the same width, so they
         cannot each be entered above their own text. Instead they fan across
         the card's edge in the order they are listed — which is what keeps
         "sand" and "sand and pearlash" telling apart at a glass furnace that
         draws its plate once. */
      const port = (key, side) => {
        const el = els.get(key);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        /* A node a picked path has dropped out of the flow — which is what
           happens to everything it skipped at phone widths — has no box at all,
           and a wire still routed through it would be drawn to the corner of
           the map. Dropping the point instead lets the wire run from the step
           above straight to the step below, which is the line anyway. A
           waypoint has no width but does have height, so it keeps its lane. */
        if (!r.width && !r.height) return null;
        if (nodes.get(key).kind === 'way') {
          return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
        }
        const b = outer(el).getBoundingClientRect();
        return {
          x: b.left - box.left + b.width / 2,
          y: b.top - box.top + (side === 'out' ? b.height : 0)
        };
      };

      /* A return wire leaves and re-enters at the side rather than the top and
         bottom, and swings out past everything on the map to do it. The rows
         are centred, so the margin beside them is the one lane on the page with
         nothing in it — which is what keeps a wire that travels the height of
         the industry from crossing every card on the way. */
      let far = 0;
      els.forEach((el) => { far = Math.max(far, el.getBoundingClientRect().right - box.left); });
      far = Math.min(box.width - 4, far + 26);

      const loop = (a, b) => {
        const ra = outer(els.get(a)).getBoundingClientRect();
        const rb = outer(els.get(b)).getBoundingClientRect();
        const x1 = ra.right - box.left, y1 = ra.top - box.top + ra.height / 2;
        const x2 = rb.right - box.left, y2 = rb.top - box.top + rb.height / 2;
        const out = Math.max(far, x1 + 26, x2 + 26);
        return `M${x1},${y1} C${out},${y1} ${out},${y2} ${x2},${y2}`;
      };

      wireEls.forEach(({ w, el }) => {
        if (w.back) {
          if (!els.get(w.chain[0]) || !els.get(w.chain[1])) return el.removeAttribute('d');
          return el.setAttribute('d', loop(w.chain[0], w.chain[1]));
        }
        const pts = w.chain.map((k, j) =>
          port(k, j === 0 ? 'out' : 'in')).filter(Boolean);
        if (pts.length < 2) return el.removeAttribute('d');
        el.setAttribute('d', pts.map((p, j) => {
          if (!j) return `M${p.x},${p.y}`;
          const q = pts[j - 1];
          const k = Math.max(12, (p.y - q.y) * 0.42);
          return `C${q.x},${q.y + k} ${p.x},${p.y - k} ${p.x},${p.y}`;
        }).join(' '));
      });
    }

    /* ── the chips ── */
    /* A path is a main line through the map: the jobs you queue to end up
       holding one thing. Picking one numbers those rungs 1..n and fades the
       rest, which is the step list — without leaving the picture that shows
       what it skipped. */
    const byJob = new Map();
    edges.forEach((e) => {
      const other = e.job === e.to ? e.from : e.to;
      (byJob.get(e.job) || byJob.set(e.job, []).get(e.job)).push(other);
    });

    const count = body.querySelector('.fm-count');

    function paint(id) {
      const path = cfg.paths.find((p) => p.id === id) || cfg.paths[0];
      const line = path.steps ? path.steps.map((s) => 'j:' + s) : null;

      const keep = line && new Set(line.concat(
        line.flatMap((k) => byJob.get(k) || [])));

      host.classList.toggle('picked', !!line);
      let n = 0;
      rows.forEach((row) => row.forEach((node) => {
        const el = els.get(node.key);
        if (node.kind === 'way') return;
        const on = !keep || keep.has(node.key);
        el.classList.toggle('on', on);
        if (node.kind !== 'job') return;
        el.querySelector('.fnum').textContent =
          (!line || line.includes(node.key)) ? ++n : '';

        /* A step can read differently depending on the line it is standing in:
           "Grow a crop" is "Grow pig tails" on the pig tail route, and the
           season it wants is worth saying there and nowhere else. The card
           quotes the recipe by default and the path overrides it, so the two
           cannot drift apart. */
        const r = node.r;
        el.querySelector('h3').textContent = (path.titles && path.titles[r.id])
          ? td('flowTitle', `${ind.id}.${path.id}.${r.id}`, path.titles[r.id])
          : r.name;
      }));
      wireEls.forEach(({ w, el }) =>
        el.classList.toggle('hot', !!line && line.includes(w.job)));

      /* A shared card fades only when the path skips every job on it — the
         plate belongs to all of them, so one live job keeps the building lit. */
      host.querySelectorAll('.f-group').forEach((g) =>
        g.classList.toggle('dim', !!line && !g.querySelector('.f-job.on')));

      const jobs = line ? line.length : [...nodes.values()].filter((x) => x.kind === 'job').length;
      const shops = line
        ? new Set(line.map((k) => nodes.get(k).r.workshop)).size
        : shopCount;
      /* replaceState rather than a hash assignment: the chips are a control on
         this page, not navigation away from it, and letting the router run
         again would rebuild the map and throw the reader back to the top. The
         URL still ends up pointing at what is on screen, so a path can be
         linked to and lands with that path already picked. */
      history.replaceState(null, '', `#/i/${ind.id}` + (path.steps ? '/' + path.id : ''));
      count.textContent = t(jobs === 1 ? 'count.job' : 'count.jobs',
          jobs === 1 ? '{n} job' : '{n} jobs', { n: jobs })
        + ' · ' + t(shops === 1 ? 'count.building' : 'count.buildings',
          shops === 1 ? '{n} building' : '{n} buildings', { n: shops });

      /* Fading a card changes what is on the row and so how tall it is, which
         moves every card below it. The wires were measured against the old
         boxes, so they have to be measured again. */
      drawWires();
    }

    body.querySelector('.ind-filters').addEventListener('click', (ev) => {
      const b = ev.target.closest('.fchip');
      if (!b) return;
      b.parentNode.querySelectorAll('.fchip').forEach((c) => c.classList.toggle('on', c === b));
      paint(b.dataset.v);
    });

    /* Hovering a card lights the wires touching it. It only adds a colour — no
       dimming — so it can be read on top of whatever path is selected rather
       than fighting with it. */
    const touching = new Map();
    wireEls.forEach((we) => we.w.chain.forEach((k) =>
      (touching.get(k) || touching.set(k, []).get(k)).push(we.el)));
    els.forEach((el, key) => {
      if (nodes.get(key).kind === 'way') return;
      const mine = touching.get(key) || [];
      el.addEventListener('mouseenter', () => mine.forEach((p) => p.classList.add('lit')));
      el.addEventListener('mouseleave', () => mine.forEach((p) => p.classList.remove('lit')));
    });

    paint(cfg.paths.some((p) => p.id === opening) ? opening : cfg.paths[0].id);
    requestAnimationFrame(drawWires);
    new ResizeObserver(drawWires).observe(host);
  }

  function viewItem(name) {
    const info = ITEMS.get(name);
    if (!info) {
      main.innerHTML = `<a class="back" href="#/">${sym('back')}${esc(t('back.industries', 'All industries'))}</a>
        <div class="page-head"><div><h1>${esc(name)}</h1>
        <p>${esc(t('item.unknown', 'Nothing in the data references this item.'))}</p></div></div>`;
      return;
    }

    const note = NOTES[name];
    const brew = BREW_IN.get(name) || BREW_OUT.get(name);
    const mill = MILL_IN.get(name) || MILL_OUT.get(name);
    const dye  = DYE_BY.get(name);
    const fibre = FIBRE_BY.get(name);
    const ore  = ORE_BY.get(name);
    /* Bars are named "Steel bar" as items but "Steel" in the tables. */
    const asMetal = name.replace(/\s+bars?$/i, '');
    const alloy = ALLOY_BY.get(asMetal);
    const fromOre = ORE_ROWS.filter((o) =>
      o.metal === asMetal || (o.bonus && o.bonus.metal === asMetal));
    const list = (rs) => rs.length
      ? `<div class="stack">${rs.map((r) => recipeCard(r, { showWorkshop: true })).join('')}</div>`
      : `<p class="none">${esc(t('item.none', 'Nothing here — this is a raw input or a dead end.'))}</p>`;

    main.innerHTML = `
      <a class="back" href="#/">${sym('back')}${esc(t('back.industries', 'All industries'))}</a>
      <div class="item-head">
        <h1>${metalColor(name)
          ? ingot(metalColor(name), 'big')
          : sprite(name, 'big')}${esc(name)}</h1>
        ${note ? `<p class="item-note">${esc(td('itemNote', name, note))}</p>` : ''}
      </div>
      ${brew ? `<p class="col-head">${esc(t('item.atstill', 'At the Still'))}</p>${brewResult(brew, { compact: true })}` : ''}
      ${mill ? `<p class="col-head">${esc(t('item.atquern', 'At the quern'))}</p>${millResult(mill, { compact: true })}` : ''}
      ${dye ? `<p class="col-head">${esc(t('item.atdyer', "At the dyer's shop"))}</p>${dyeResult(dye, { compact: true })}` : ''}
      ${fibre ? `<p class="col-head">${esc(t('item.atloom', 'At the loom'))}</p>${fibreResult(fibre, { compact: true })}` : ''}
      ${ore ? `<p class="col-head">${esc(t('item.atsmelter', 'At the smelter'))}</p>${oreResult(ore, { compact: true })}` : ''}
      ${alloy ? `<p class="col-head">${esc(t('item.atsmelter', 'At the smelter'))}</p>${alloyResult(alloy, { compact: true })}` : ''}
      ${(!ore && fromOre.length) ? `<p class="col-head">${esc(t('item.smeltedfrom', 'Smelted from'))} <span class="n">${fromOre.length}</span></p>
        <div class="ore-list">${fromOre.map((o) =>
          `<a class="chip" href="#/item/${encodeURIComponent(o.ore)}">${esc(o.ore)}</a>`).join('')}</div>` : ''}
      <div class="two-col">
        <div>
          <p class="col-head">${esc(t('item.madeby', 'Made by'))} <span class="n">${info.madeBy.length}</span></p>
          ${list(info.madeBy)}
        </div>
        <div>
          <p class="col-head">${esc(t('item.usedin', 'Used in'))} <span class="n">${info.usedIn.length}</span></p>
          ${list(info.usedIn)}
        </div>
      </div>`;
  }

  function viewWorkshops() {
    const order = ['workshop', 'furnace', 'place'];
    const heading = {
      workshop: [t('ws.group.workshop', 'Workshops'),
                 t('ws.group.workshop.note', 'Built from the workshop menu. No fuel, just a dwarf and the right skill.')],
      furnace:  [t('ws.group.furnace', 'Furnaces'),
                 t('ws.group.furnace.note', 'Each job burns a unit of fuel — charcoal or coke — unless the furnace is built over magma.')],
      place:    [t('ws.group.place', 'Places & zones'),
                 t('ws.group.place.note', 'Not buildings: jobs that happen out in the world, in a plot, or in a zone.')]
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
          ${meta.note ? `<p>${esc(td('shopNote', w, meta.note))}</p>` : ''}
          <div class="ws-meta">
            <span class="count">${esc(stepCount(steps.length))}</span>
            ${meta.tier ? `<span class="need tier">${esc(t('ws.tier', 'Tier {n}', { n: meta.tier }))}</span>` : ''}
            ${skills.map((sk) => `<span class="need">${esc(sk)}</span>`).join('')}
          </div>
        </div>
      </a>`;
    };

    main.innerHTML = `
      <div class="page-head"><div>
        <h1>${esc(t('ws.title', 'Workshops'))}</h1>
        <p>${esc(t('ws.blurb',
          'Every building and place a job can happen, and what comes out of it. The tier is how '
          + 'far the building sits from raw material: a tier 1 building eats what the map gives '
          + 'you, tier 2 eats tier 1’s output, tier 3 eats tier 2’s.'))}</p>
      </div></div>
      <div class="ws-filters frow">
        <span class="flabel">${esc(t('ws.tierlabel', 'Tier'))}</span>
        ${[['all', t('filter.all', 'All')], ['1', '1'], ['2', '2'], ['3', '3']].map(([v, label]) =>
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

    /* A picker may bring reference tables of its own, and they anchor back to
       this page rather than to the Reference one. */
    const route = 'w/' + encodeURIComponent(name);

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
    const jobs = steps.filter((r) => !picks.some((p) => pickSteps(p).includes(r.id)));

    main.innerHTML = `
      <a class="back" href="#/w">${sym('back')}${esc(t('back.workshops', 'All workshops'))}</a>
      <div class="ws-head">
        <div class="ws-art big">${plate(name, 'xxl')}</div>
        <div>
          <h1>${esc(name)}</h1>
          <div class="ws-meta">
            <span class="need">${esc(KIND_NAME[kind])}</span>
            ${meta.tier ? `<span class="need tier">${esc(t('ws.tier', 'Tier {n}', { n: meta.tier }))}</span>` : ''}
            ${burnsFuel ? `<span class="need">${sym('flame')}${esc(t('ws.burnsfuel', 'burns fuel'))}</span>` : ''}
            ${skills.map((sk) => `<span class="need">${esc(sk)}</span>`).join('')}
          </div>
          ${meta.note ? `<p class="item-note">${esc(td('shopNote', name, meta.note))}</p>` : ''}
          ${meta.keys ? `<p class="ws-build">${t('ws.build', 'Build {keys}', { keys: keycaps(meta.keys) })}${meta.magma
              ? ` <span class="dot">·</span> ${esc(t('ws.magma', 'the magma version burns no fuel'))}` : ''}</p>` : ''}
          <p class="muted ws-inds">${t('ws.feeds', 'Feeds {inds}', { inds: inds.map((i) =>
            `<a href="#/i/${i.id}">${sym(i.icon)} ${esc(indName(i))}</a>`).join(', ') })}</p>
        </div>
      </div>
      ${picks.map((p, i) => { const m = pickModes(p)[0]; return `
        <p class="col-head" id="pick-head-${i}"><span class="pt">${esc(m.title)}</span>
          <span class="n">${m.rows.length}</span></p>
        <div id="pick-${i}"></div>
        ${p.tables ? (p.tables.length > 1 ? refToc(p.tables, route) : '') + refBlocks(p.tables) : ''}`; }).join('')}
      ${jobs.length ? `<p class="col-head">${esc(t('ws.jobs', 'Jobs'))} <span class="n">${jobs.length}</span></p>
                       <div class="rec-grid">${jobs.map((r) => recipeCard(r)).join('')}</div>` : ''}`;

    /* The heading above a picker names the table under it, so a picker that
       can change tables has to be able to change it. */
    picks.forEach((p, i) => {
      const head = document.getElementById('pick-head-' + i);
      mountPicker(document.getElementById('pick-' + i), Object.assign({}, p, {
        onMode: (m) => {
          if (!head) return;
          head.querySelector('.pt').textContent = m.title;
          head.querySelector('.n').textContent = m.rows.length;
        }
      }));
    });
  }

  /* Tables opt in to decoration per column via `decorate: { 1: 'metal' }`.
     A cell may name more than one metal ("Copper + Silver"), so split on the plus. */
  function refCell(text, col, table) {
    const how = table.decorate && table.decorate[col];
    if (how === 'color') return swatch(COLOR_HEX[String(text).trim()]) + esc(text);
    if (how === 'sprite') return spriteCell(String(text).trim()) + esc(text);
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
  /* A table's heading, its blurb and its column names are this site talking;
     the cells are the game's own words and stay as they are. */
  const tblTitle = (tb) => td('tableTitle', tb.id, tb.title);
  const tblBlurb = (tb) => td('tableBlurb', tb.id, tb.blurb);
  const tblCols  = (tb) => {
    const cols = (DATA.tableCols || {})[tb.id];
    return Array.isArray(cols) && cols.length === tb.columns.length ? cols : tb.columns;
  };

  const refToc = (tables, route) => `<div class="toc">${tables.map((tb) =>
    `<a href="#/${route}#${tb.id}">${sym(tb.icon)} ${esc(tblTitle(tb))}</a>`).join('')}</div>`;

  /* A table whose rows say it themselves carries no blurb, and an empty
     paragraph over them would only be a gap in the wrong place. */
  const refBlocks = (tables) => tables.map((tb) => `
    <section class="ref-block" id="${tb.id}">
      <h2>${sym(tb.icon)} ${esc(tblTitle(tb))}</h2>
      ${tblBlurb(tb) ? `<p>${esc(tblBlurb(tb))}</p>` : ''}
      <div class="table-wrap"><table>
        <thead><tr>${tblCols(tb).map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>${tb.rows.map((row) =>
          `<tr>${row.map((cell, ci) => `<td>${refCell(cell, ci, tb)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>
    </section>`).join('');

  function viewReference() {
    main.innerHTML = `
      <div class="page-head"><div>
        <h1>${esc(t('ref.title', 'Reference'))}</h1>
        <p>${esc(t('ref.blurb', 'The tables you keep alt-tabbing to look up.'))}</p>
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
        <h1>${sym('shield')} ${esc(t('armor.title', 'Armor'))}</h1>
        <p>${esc(t('armor.blurb',
          'There is no suit of armour in this game, only pieces — and a dwarf is covered exactly '
          + 'where the pieces reach. Click the dwarf to see what protects that part; click a piece '
          + 'to see how far it reaches.'))}</p>
      </div></div>
      <div id="armor-pick"></div>`;

    const host = document.getElementById('armor-pick');

    const api = mountPicker(host, {
      rows: ARMOR_ROWS,
      start: id,
      aside: bodyFigure(),
      result: armorResult,
      rowIn: eqSprite,
      facets: [
        { key: 'covers', label: t('facet.bodypart', 'Body part'), multi: true, silent: true },
        { key: 'kind', label: t('facet.type', 'Type') },
        { key: 'material', label: t('facet.madeof', 'Made of'), multi: true },
        { key: 'layer', label: t('facet.layer', 'Layer') }
      ],
      placeholder: t('pick.armor.filter', 'Filter armour…'),
      listLabel: t('pick.armor.list', 'Armour and clothing'),
      empty: t('pick.armor.empty', 'Nothing covers that part with those filters. Try widening them.'),
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
      <div class="page-head"><div><h1>${esc(t('about.title', 'About'))}</h1></div></div>
      <div class="prose">${t('about.body', `
        <p>DF Companion is a static, dependency-free reference for the industry chains in
        <a href="https://www.bay12games.com/dwarves/" target="_blank" rel="noopener">Dwarf Fortress</a>.
        Every page on this site is generated from sixteen data files, so extending it means
        editing JavaScript objects rather than HTML. Nothing is loaded from the network. Every
        icon here, down to the back arrow, is inline SVG; the only bitmaps are the game's own
        pixel art — the workshop plates, the equipment sheet the armour list reads its sprites
        from, and the item sprites <code>data/sprites.js</code> maps by name.</p>

        <h2>Adding a step</h2>
        <p>Open <code>data/recipes.js</code> and add an entry to <code>window.DF_RECIPES</code>:</p>
        <pre><code>{ id:'brew-sunshine', name:'Brew sunshine',
  industry:'food', workshop:'Still', skill:'Brewer',
  needs:['barrel'],
  in:  [{ item:'Sun berry' }],
  out: [{ item:'Sunshine' }, { item:'Seeds' }],
  note:'Optional flavour text.' }</code></pre>
        <p>Item pages and the industry maps all rebuild themselves from
        that — an item exists as soon as some recipe mentions it, and a new step joins its
        industry's map wherever what it eats and what it makes put it. Valid <code>needs</code> values are
        <code>fuel</code>, <code>flux</code>, <code>bag</code>, <code>barrel</code>,
        <code>jug</code>, <code>bucket</code>, <code>vial</code> and <code>shop</code>.</p>

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
        <p>Seven workshops do not get a list of job cards. The Still runs a single job —
        Brew Drink — against 77 ingredients, the quern runs Mill Plants against 33, the
        dyer's shop runs Dye against 72, the loom weaves 16 kinds of thread, the clothier's
        shop cuts 31 things out of one unit of cloth, the smelter smelts 17 ores and alloys
        14 recipes, and the forge turns a bar into any one of 69 things. Cards that differ
        only in which thing went in say the same thing dozens of times, so each is one
        generic step in <code>data/recipes.js</code> plus a table of its own:
        <code>data/brewing.js</code>, <code>data/milling.js</code>,
        <code>data/dyes.js</code>, <code>data/textiles.js</code>,
        <code>data/smelting.js</code>, <code>data/weapons.js</code> and
        <code>data/forge.js</code>.</p>
        <p>The <code>PICKERS</code> table lists them, keyed by the generic step each one
        replaces. The workshop list reads that same table to put a mark in the corner of
        those cards, so it cannot claim something the page does not do. Only the list is
        marked — on the workshop's own page the picker is right there.</p>
        <p>The forge's picker is the one that assembles its rows from more than one file. A
        battle axe belongs to <code>data/weapons.js</code> and a breastplate to
        <code>data/armor.js</code>; copying either into <code>data/forge.js</code> would let
        the forge's page and the Armor page disagree about the same object, so instead it
        takes every weapon whose <code>made</code> list names the forge, every wearable that
        can be made of metal, and everything else from <code>DF_FORGE_GOODS</code>. A picker
        may also carry <code>tables</code> — reference tables in the
        <code>data/reference.js</code> shape that belong under it rather than in any row of
        it, as the smelter's steel chain does, rendered by the same code as the Armor page's
        notes and anchored back to the workshop's own page.</p>
        <p>A picker facet can read a list instead of a single value, which is how one ore
        sits under three different rock types and one alloy under each metal it contains.
        The smelter's bars are tinted with the metal's own colour from
        <code>data/metals.js</code>. Every facet draws as a dropdown: as rows of chips
        the forge's fifteen categories and seven labours wrapped over three lines, which
        is a lot of furniture around a control nobody is looking at. A facet whose values
        carry a mark — the dyer's colour square — shows the mark for the one in force
        beside the dropdown, since a select cannot draw one inside an option.</p>
        <pre><code>{ in: 'Sun berry', out: 'Sunshine', kind: 'Other', value: 5,
  type: 'Plant', source: 'Surface crop' }

{ in: 'Dimple cup', out: 'Dimple dye', kind: 'Dye', source: 'Subterranean crop',
  color: 'Midnight blue', hex: '#191970', value: 20 }</code></pre>
        <p>Each workshop's page turns its table into a picker. <code>kind</code> and
        <code>source</code> generate the filter dropdowns, so adding a row is the whole job —
        the filters, the picker's own search and the item pages all pick it up. A plant
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
        <a href="#/reference">Reference page</a> with its own anchor. A picker can carry
        <code>tables</code> of the same shape — the smelter's does — rendered by the same
        code.</p>

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

        <h2>Adding a language</h2>
        <p><code>data/i18n.js</code> holds one pack per language. The game's own nomenclature is
        deliberately <em>not</em> in it: an item stays a Plump helmet, a building a Metalsmith's
        Forge and a job on its menu Brew Drink, because those are the words on the screen you are
        alt-tabbing away from, and a translated menu entry would be a worse answer than an
        untranslated one. What a pack carries is everything this site says <em>about</em> them —
        headings, labels, legends and every note.</p>
        <p>A pack has two halves. <code>ui</code> is keyed by a short string and holds the text
        written into the views; <code>data</code> is keyed by the id a data file already carries
        and holds the prose that lives beside the facts:</p>
        <pre><code>window.DF_I18N = {
  es: {
    ui: { 'item.madeby': 'Lo produce', 'count.steps': '{n} pasos' },
    data: {
      industry:   { food: 'Comida y bebida' },
      recipeNote: { 'make-ash': 'El origen del jabón, la potasa…' },
      shopNote:   { 'Smelter': 'De mena a bars, de carbón a coke…' }
    }
  }
};</code></pre>
        <p>The English text stays written out at the point it is used, as the second argument to
        <code>t()</code>, so the source still reads as English prose and a key missing from a pack
        renders in English rather than as a key. <code>{n}</code>-style holes rather than string
        concatenation, because Spanish does not put the number, the noun and the preposition in
        the order English does. The groups under <code>data</code> are
        <code>industry</code>, <code>industryBlurb</code>, <code>recipeNote</code>,
        <code>itemNote</code>, <code>shopNote</code>, <code>body</code>, <code>bodyNote</code>,
        <code>armorNote</code>, <code>weaponNote</code>, <code>forgeNote</code>,
        <code>fibreNote</code>, <code>fibreAlso</code>, <code>goodsNote</code>,
        <code>flowBlurb</code>, <code>flowPath</code>, <code>flowTitle</code>,
        <code>tableTitle</code>, <code>tableBlurb</code> and <code>tableCols</code>.</p>
        <p>Add a pack, add its code to <code>LANGS</code> in <code>assets/js/app.js</code>, and the
        button in the header cycles to it. The choice is kept in <code>localStorage</code> and
        defaults to the browser's own language; switching reloads the page, because the search
        index is built once at boot out of prose that has already been translated. Table
        <em>rows</em> are never translated — those are the game's words, and
        <code>tableCols</code> only replaces a header row that matches the original column for
        column.</p>

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
        fan project.</p>`)}</div>`;
  }

  /* ── the page's own furniture ─────────────────────────────────── */
  /* The header and footer are in index.html rather than rendered by a view, so
     they are painted once at boot instead of on every route. */
  function paintChrome() {
    const set = (sel, text) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = text;
    };
    document.title = t('site.title', 'DF Companion — Dwarf Fortress Industry Workflows');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('site.description',
      'An interactive map of Dwarf Fortress industry chains: what makes what, at which workshop, '
      + 'with which skill.'));

    set('.brand-text small', t('site.tagline', 'Industry workflows'));
    set('.skip', t('site.skip', 'Skip to content'));
    set('[data-nav="industries"]', t('nav.industries', 'Industries'));
    set('[data-nav="workshops"]',  t('nav.workshops', 'Workshops'));
    set('[data-nav="armor"]',      t('nav.armor', 'Armor'));
    set('[data-nav="about"]',      t('nav.about', 'About'));

    const foot = document.getElementById('foot-note');
    if (foot) foot.innerHTML = t('foot.note',
      'A fan-made reference for <a href="https://www.bay12games.com/dwarves/" target="_blank" '
      + 'rel="noopener">Dwarf Fortress</a>. Not affiliated with Bay 12 Games or Kitfox Games. '
      + 'Verify anything load-bearing against the <a href="https://dwarffortresswiki.org" '
      + 'target="_blank" rel="noopener">wiki</a>.');
    const credit = document.getElementById('foot-credit');
    if (credit) credit.innerHTML = t('foot.credit',
      'Layout inspired by Max Cantor’s printable cheat sheet at '
      + '<a href="https://thingsfittogether.com" target="_blank" rel="noopener">thingsfittogether.com</a>.');

    const themeBtn = document.getElementById('theme');
    if (themeBtn) {
      themeBtn.title = t('site.theme', 'Toggle light / dark');
      themeBtn.setAttribute('aria-label', t('site.theme.label', 'Toggle theme'));
    }
  }

  /* ── language ─────────────────────────────────────────────────── */
  /* The button names the language you would get by pressing it, not the one
     you are in — the same thing a light/dark toggle does, and the only reading
     that works for somebody who cannot read the current one.

     Switching reloads. Every view rebuilds itself from the data on each route,
     so a reload is the shortest path to a page that is wholly in the new
     language — and it is something the browser does correctly for free. */
  const langBtn = document.getElementById('lang');
  if (langBtn) {
    const next = LANG === 'es' ? 'en' : 'es';
    langBtn.textContent = next.toUpperCase();
    langBtn.title = t('site.lang', 'Read this in {lang}', {
      lang: next === 'es' ? 'español' : 'English' });
    langBtn.setAttribute('aria-label', langBtn.title);
    langBtn.addEventListener('click', () => {
      localStorage.setItem('df-lang', next);
      location.reload();
    });
  }

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
  paintChrome();
  route();
})();
