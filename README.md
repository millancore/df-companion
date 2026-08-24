# DF Companion

An interactive, dependency-free reference for **Dwarf Fortress** industry workflows —
what turns into what, at which workshop, with which skill, and which missing barrel is
quietly stalling the whole chain.

Ten industries and 59 production steps across 31 workshops, each with hand-drawn
SVG artwork. Four of those workshops — the Still, the quern, the dyer's shop and
the smelter — run one job against a long list of ingredients, so instead of a
wall of near-identical cards they get a picker: 77 brewable plants, 33 millable
ones, 72 dyes, 17 ores and 14 alloy recipes, filtered and searched, each showing
what comes out and a small animation of the job. Plus a shared symbol set
covering every other icon on the site, colour-coded metal ingots, an
auto-laid-out chain map per industry, a cross-linked item index (“made by” /
“used in”) derived from the recipe graph, fuzzy search over items, workshops,
skills and tables, and ten reference tables.

An **Armor** page turns the same picker inside out: the panel holds a clickable
dwarf, and choosing a body part filters 43 wearables down to the ones that
actually reach it. Choose a piece instead and the figure lights up everything it
covers — which is the fastest way to see that a breastplate leaves the arms bare
and a mail shirt does not.

## Running it

There is no build step and no dependencies. Open `index.html` in a browser, or serve
the folder:

```sh
python3 -m http.server 8000    # then visit http://localhost:8000
```

## Publishing to GitHub Pages

```sh
git init -b main
git add -A
git commit -m "DF Companion: industry workflow explorer"
git remote add origin git@github.com:<you>/df-companion.git
git push -u origin main
```

Then in the repository: **Settings → Pages → Source: Deploy from a branch →
`main` / `(root)`**. The site is live at `https://<you>.github.io/df-companion/`
within a minute or so.

`.nojekyll` is committed so GitHub serves the files as-is instead of running them
through Jekyll.

## Editing the content

Everything on the site is generated from the data files.

**`data/recipes.js`** — `window.DF_INDUSTRIES` and `window.DF_RECIPES`. A step looks like:

```js
{ id:'brew-rum', name:'Brew dwarven rum',
  industry:'food', workshop:'Still', skill:'Brewer',
  needs:['barrel'],
  in:  [{ item:'Sweet pod' }],
  out: [{ item:'Dwarven rum' }, { item:'Seeds' }],
  note:'Optional flavour text shown on the card.' }
```

An item exists as soon as a recipe mentions it — item pages, the search index and the
chain maps all rebuild themselves. `qty` on an input or output is optional and renders
as `×n`. Valid `needs` values: `fuel`, `flux`, `bag`, `barrel`, `jug`, `bucket`, `shop`.

**`data/workshops.js`** — `window.DF_WORKSHOPS`, keyed by the exact `workshop` string
used in a recipe:

```js
"Still": { kind: 'workshop', box: '7.1 2.6 22.4 26.4', sw: 1.4,
  note: 'Plants into booze. Every job here needs an empty barrel or rock pot.',
  art: `<path d="M10 8h12c2 4 2 12 0 16H10c-2-4-2-12 0-16z"/>` }
```

`kind` is `workshop`, `furnace` or `place`, which groups the Workshops page. `art` is
inline SVG on a 32×32 grid, stroked in `currentColor`; shapes with `class="ac"` take the
accent colour. `box` is the artwork's measured bounding box so the icon fills its frame
rather than floating small inside a nominal 32×32, and `sw` is the stroke width scaled to
that frame so every icon keeps the same line weight. Both are derived from the art — if
you redraw an icon, re-measure with `getBBox()` instead of guessing (the About page in
the site has the snippet). A workshop with no entry falls back to a generic icon.

**`data/metals.js`** — metal colours for the ingot icon shown on bars, wafers and metal
names. One hex per metal:

```js
window.DF_METAL_COLORS = { 'Copper': '#a65835', 'Gold': '#D79B2D', 'Steel': '#8f9599' };
```

These are real metal tones, not DF's. The game draws every metal from a 16-colour
palette, which puts steel, tin, zinc, nickel, billon and pewter all on the same light
gray and iron, lead and pig iron all on the same dark gray — fine in a game where you
read the name, no help at all in a reference whose swatch exists to tell one bar from
another. The tile triples the file used to hold are still on the
[wiki's metal page](https://dwarffortresswiki.org/index.php/Metal) if you want them back.

The icon is three stacked bars — the same shapes as the `metal` symbol in
`data/icons.js`, but filled with the metal's colour instead of stroked, and the same
shapes the smelter's animation casts. The only other ink is a thin dark outline, which
is what keeps a white or light-gray metal visible on the light theme and what separates
the three bars when they are all one colour.

An item resolves by name with a trailing `bar` / `wafer` / `strands` / `ingot` stripped, so
`Steel bar` and `Adamantine wafers` both find their entry, and a metal with no entry simply
renders without an ingot. A reference table opts a column into ingot decoration with
`decorate: { 1: 'metal' }`.

**`data/brewing.js`** — `window.DF_BREWING`, the Still's ingredient table:

```js
{ in: 'Sun berry', out: 'Sunshine', kind: 'Other', value: 5,
  type: 'Plant', source: 'Surface crop' }
```

The Still runs *one* job — Brew Drink — against 77 different ingredients, so
`data/recipes.js` carries one generic `brew` step and the ingredient list lives
here. The Still's page turns it into a picker: filter by drink category or by
where the plant comes from, choose an ingredient, watch it brew. `kind` and
`source` drive the filter chips, so a new row needs no code change.

Every ingredient and drink is still indexed — search and item pages pick them up
from this table rather than from the recipe graph.

**`data/milling.js`** — `window.DF_MILLING`, the quern's plant table, in the same
shape as the brewing one:

```js
{ in: 'Dimple cup', out: 'Dimple dye', kind: 'Dye', source: 'Subterranean crop',
  color: 'Midnight blue', hex: '#191970', value: 20 }
```

Same reasoning: one Mill Plants job, 33 plants, three powders. The four dye
plants also carry the dye's colour and value. The game names colours but
publishes no hex, so `hex` is an approximation for the swatch — the name is the
real datum, and a row without a `hex` simply renders without a swatch.

**`data/smelting.js`** — `window.DF_ORES` and `window.DF_ALLOYS`, the two tables the
smelter works from:

```js
{ ore: 'Galena', metal: 'Lead', bars: 4,
  bonus: { metal: 'Silver', chance: 50, bars: '0–4' },
  rocks: ['Igneous', 'Metamorphic', 'Sedimentary'],
  found: 'All igneous extrusive, all metamorphic, granite, limestone' }

{ alloy: 'Bronze', value: 5, bars: 2, weapon: true,
  parts: [{ metal: 'Copper', qty: 1 }, { metal: 'Tin', qty: 1 }] }
```

`found` is the wiki's own wording and is the datum; `rocks` groups it so the
picker can filter, and an ore that turns up in several rock types sits under all
of them. An alloy's ingredients are `parts` rather than `in`, because the picker
already uses `in` for the name it shows. Both panels tint their bars with the
metal's own colour from `data/metals.js`.

**`data/dyes.js`** — `window.DF_DYES`, every dye in the game, plus the two lookup
maps the colours need:

```js
{ from: 'Dimple cup', dye: 'Dimple dye', color: 'Midnight blue',
  part: 'Whole plant', value: 20, milled: true }
```

`part` is read out of the dye's own name; `milled` marks the four you get from a
quern, which is why only those four appear in `data/milling.js`. The file also
defines `window.DF_COLOR_HEX` (a colour name to an approximate hex, for swatches
only) and `window.DF_COLOR_FAMILY` (a colour name to a tone — Blue / Green / Brown …
— so the dyer's shop can be filtered by tone), and `window.DF_FAMILY_HEX` (one
representative colour per tone, so a filter chip can show a square). Both are reading aids read off the
name — the name is the datum, and a colour missing from either map degrades
quietly to no swatch and no family chip. The Reference page's dye table is built
from this array, so the list lives in exactly one place.

**`data/icons.js`** — `window.DF_ICONS`, the shared symbol set: industries, the
`needs` flags, reference tables, the back link and the theme toggle. Same
contract as `data/workshops.js` — inline SVG on a 32×32 grid, stroked in
`currentColor`, with a measured `box` and a scaled `sw`:

```js
'barrel': { box: '7.1 3.6 17.8 24.8', sw: 1.32,
  art: `<path d="M10 5h12c2 5 2 17 0 22H10c-2-5-2-17 0-22z"/>
        <path d="M8.6 11h14.8M8.6 21h14.8"/>` }
```

Nothing on the site is an emoji or a bitmap: an industry, a table or a `needs`
flag names a key in here, and it renders as SVG that inherits the surrounding
text colour and size. An unknown name draws nothing rather than a wrong picture.
Re-measure with `getBBox()` if you redraw one, exactly as for workshop art.

**`data/reference.js`** — `window.DF_REFERENCE`, a list of `{ id, title, icon, blurb,
columns, rows }` tables, where `icon` is a key in `DF_ICONS`. Add an object and it
appears on the Reference page with its own anchor and table-of-contents entry.
A column opts into decoration with `decorate: { 1: 'metal' }` for an ingot chip or
`decorate: { 2: 'color' }` for a colour swatch; the swatch resolves its hex through
`window.DF_COLOR_HEX`, defined at the top of the same file.

**`data/armor.js`** — three tables that drive the Armor page. `window.DF_BODY` is
the figure: one entry per clickable region, carrying its own art on a 152×312 grid
under the same stroked-SVG contract as the workshops. It is worn armour only —
a shield is held rather than worn, so it covers nothing and the figure has nowhere
to put it — and nothing is drawn on the figure beyond the regions themselves, since
the one part of a dwarf no armour covers is the face. `window.DF_ARMOR_MATS`
maps the wiki's one-letter material codes to the workshop and labour that works
them, so "where do I make leather leggings" is answered by data rather than by a
sentence. `window.DF_ARMOR` is every wearable, holding the raw tokens — material
size, layer size, permit, layer, coverage, armour level — rather than a summary
of them:

```js
{ id:'mail-shirt', name:'Mail shirt', slot:'Upper body', kind:'Armor',
  covers:['upper-body','lower-body','neck','upper-arms','upper-legs'],
  mats:['M'], size:6, ls:15, perm:50, layer:'Over', cov:100,
  level:2, elastic:'Chain', melt:1.8, note:'…' }
```

`covers` names ids in `DF_BODY`, which is the join between the figure and the
data: a region lights up because some piece names it, so the diagram cannot drift
from the coverage table. It is also the game's UBSTEP / LBSTEP / UPSTEP tokens
already resolved, because "LBSTEP:1" is not an answer to "does this protect my
dwarf's legs". Bar cost is *not* stored — it is material size ÷ 3, rounded down,
minimum one, and `app.js` computes it, so a piece only ever states its size.
`window.DF_ARMOR_TABLES` holds the notes under the picker in exactly the
`data/reference.js` shape, and the two pages share one renderer.

## One step, many ingredients

Four workshops run a single job against a long list of ingredients — the
Still's Brew Drink, the quern's Mill Plants, the dyer's shop's Dye, and the
smelter's Smelt Ore and alloy reactions (two tables, two pickers on one page). Listing
those out as one card per ingredient says the same thing dozens of times and
clutters the chain map with parallel strands that carry no information, so each
is one generic step in `data/recipes.js` plus a table in its own data file.
The `PICKERS` table in `assets/js/app.js` lists them, keyed by the generic step
each one replaces, and `mountPicker()` turns one into the filter chips, search
and result panel. The Armor page uses the same function with two extras: a facet
marked `silent: true` draws no chips, because the body figure *is* that facet's
control, and `aside` puts the figure at the top of the panel. `mountPicker()`
hands back a small API — `get`, `set`, `select` — so the figure can drive the
filter, and calls `onPaint` afterwards so it can mark itself up with what the
picker settled on. The workshop list reads the same table to mark the buildings
whose page is a picker rather than a list of job cards, so the mark cannot drift
from what the page actually does. The mark is a corner glyph and nothing else —
the workshop's own page has the picker on it and needs no label. A picker supplies
only its own result renderer and,
optionally, a `hay` field to widen the text filter beyond the two visible
columns, a `rowIn` / `rowOut` to decorate either column of the list, and facets
carrying a `chip(value)` to put something in front of the chips or a
`chipLabel(value)` to word them differently from the value they filter on — the
dyer's tone chips read "Blues" but select `Blue`. A facet marked `multi: true`
reads a list rather than a single value, so one row can sit under several chips:
galena is igneous, metamorphic and sedimentary at once, and bronze contains both
copper and tin.

Collapsing them would otherwise strand the ingredients and products outside the
recipe graph, so the tables are bridged back into the item index and the search
index. Anything that appears in more than one — sweet pod brews and mills,
dimple dye is milled and then dyed with — gets a card for each on its item
page.

A step may name a second industry with `also: ['textiles']`. Milling needs it:
its flour belongs to the food chain and its dyes to the textiles one, and before
that field existed the textiles page lost its only dye source.

## Layout

```
index.html            page shell
assets/css/style.css  theme tokens, light + dark
assets/img/*.png      a pixel-art plate per workshop: 96x128, or 32x64 for a 1x1
assets/js/graph.js    layered DAG layout + SVG renderer with pan/zoom
assets/js/app.js      hash router, views, search, theme toggle
data/recipes.js       industries + production steps
data/brewing.js       the Still's 77 brewable ingredients
data/milling.js       the quern's 33 millable plants
data/dyes.js          all 72 dyes, plus the colour name lookups
data/smelting.js      17 ores and 14 alloy recipes
data/workshops.js     workshop artwork, kinds, tiers, build keys and blurbs
data/icons.js         the shared symbol set
data/metals.js        one colour per metal, for the ingot icon
data/reference.js     reference tables
data/armor.js         43 wearables, the body figure and the armour notes
```

## Credits

Structure modelled on Max Cantor's printable cheat sheet at
[thingsfittogether.com](https://thingsfittogether.com) — worth pinning next to your
monitor. That poster is *not* redistributed here.

Dwarf Fortress is by Bay 12 Games, published by Kitfox Games. This is an unaffiliated
fan project. Verify anything load-bearing against the
[wiki](https://dwarffortresswiki.org).
