# DF Companion

An interactive, dependency-free reference for **Dwarf Fortress** industry workflows —
what turns into what, at which workshop, with which skill, and which missing barrel is
quietly stalling the whole chain. In English or Spanish, with the game's own names
for things left in English in both.

Ten industries and 68 production steps across 31 workshops, each with hand-drawn
SVG artwork. Seven of those workshops — the Still, the quern, the dyer's shop,
the loom, the clothier's shop, the smelter and the metalsmith's forge — run one
job against a long list of things, so instead of a wall of near-identical cards
they get a picker: 77 brewable plants, 33 millable ones, 72 dyes, 16 thread
sources, 31 cloth goods, 17 ores, 14 alloy recipes and the 69 things a bar of
metal can become, filtered and searched, each showing what comes out and — where
there is one — a small animation of the job. Plus a shared symbol set covering
every other icon on the site, colour-coded metal ingots, an auto-laid-out chain
map per industry, a cross-linked item index (“made by” / “used in”) derived from
the recipe graph, fuzzy search over items, workshops, skills and tables, and ten
reference tables.

An **Armor** page turns the same picker inside out: the panel holds a clickable
dwarf, and choosing a body part filters 43 wearables down to the ones that
actually reach it. Choose a piece instead and the figure lights up everything it
covers — which is the fastest way to see that a breastplate leaves the arms bare
and a mail shirt does not.

The **forge** gets the other kind of picker: filter by what you want to make —
weapons, armour, chains, crafts, goblets, toys, instruments, anvils, flasks,
coins, studding, furniture, animal traps, mechanisms — and every row prices
itself. Pick the metal and the smith's skill and it runs the game's own value
formula in front of you, term by term, alongside the bar cost, what melting it
back returns and, for a weapon, its whole attack table.

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
industry maps all rebuild themselves. `qty` on an input or output is optional and renders
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
`source` drive the filter dropdowns, so a new row needs no code change.

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
of them. An alloy's ingredients are `parts` rather than `in`, which is the
field the picker builds for itself: it writes the recipe into the left column
and the alloy into the right, so both of the smelter's tables read the same way
round — an ore and the metal it smelts to, the bars an alloy eats and the alloy
they make. The quantity is part of that recipe, because two of them otherwise
come out identical: fine and trifle pewter are both tin and copper, and so are
billon and sterling silver. Both panels tint their bars with the metal's own
colour from `data/metals.js`.

`window.DF_SMELT_TABLES` is the steel chain, in the `data/reference.js` shape
and hung under the smelter's picker the way the forge's notes are. It is there
because it runs across both of the smelter's tables and belongs to neither: the
ores say hematite gives iron, the alloys say steel wants iron and pig iron, and
only the chain in order says that pig iron is a step rather than a product, that
no flux stone means no steel, and that a magma smelter covers the heat but never
the unit of fuel each reaction burns as carbon.

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
representative colour per tone, so the tone filter can show a square). Both are reading aids read off the
name — the name is the datum, and a colour missing from either map degrades
quietly to no swatch and no tone. The Reference page's dye table is built
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
`base` *is* stored, because it cannot be computed from what is here: the game
derives an item's base value from the same UBSTEP / LBSTEP / UPSTEP tokens this
file has already resolved into `covers`. `pair` marks the hand- and footwear that
comes two at a time from one unit of material, which is why gauntlets and high
boots melt back at 120%.

**`data/weapons.js`** — `window.DF_WEAPONS`, every manufactured weapon in the
game: the seven a dwarf can forge, the ammunition and trap components off the
same anvil, the three wooden training weapons, and the fourteen foreign types
that only ever arrive in somebody else's hands. The foreign ones are here for the
same reason the foreign clothing is in `data/textiles.js` — you meet them, and
"what is coming at me" is the same question with the numbers read backwards.

```js
{ id:'war-hammer', name:'War hammer', kind:'Melee', skill:'Hammer', hands:'one',
  vol:400, size:3, base:9, melt:0.9,
  made:[{ mat:'Metal', at:"Metalsmith's Forge", by:'Weaponsmith' }],
  attacks:[{ name:'Bash', type:'Blunt', area:10, pen:200, vel:2.0 }],
  note:'…' }
```

Two different numbers are called "size" in this game and both matter, so they get
separate fields. `vol` is volume in cm³ — what drives momentum, and the first
term of the value formula: base value is `(vol / 50) + 1`, doubled if the weapon
has any EDGE attack, or a flat 10 for a ranged one. Every `base` in the file
checks out against that. `size` is material size, which is what the forge charges
for, under the same rule as armour. A few items have no real material size and a
fixed cost instead; those state `bars` and leave `size` out.

`attacks` is the whole attack list rather than a summary, because a weapon is not
one attack — a short sword slashes, stabs, slaps and pommel-strikes, and the
reason it is a jack of all trades is only visible when all four are on screen
together. `pen` on a blunt attack renders bracketed, since the game ignores it
there; the attack's own `type` is what says to bracket it, so the two cannot
disagree.

`made` is written out per weapon rather than looked up from a material code,
because the material does not determine the building: a wooden crossbow is a
bowyer's job, a wooden corkscrew a carpenter's and a wooden bolt a wood crafter's,
and one "Wood" code would have to lie about two of the three. Foreign weapons
carry no `made` at all — nothing you can build makes them.

**`data/forge.js`** — three tables behind the forge's picker.

`window.DF_FORGE_GOODS` is everything the forge makes that is not a weapon or a
piece of armour. Those two are deliberately not repeated here: the picker reads
them out of `data/weapons.js` and `data/armor.js`, filtered to the metal
versions, because a battle axe is one thing and the pages that list it must not
be able to disagree about it.

```js
{ name:'Goblet', cat:'Goblets', labour:'Metal crafter',
  bars:1, per:3, melt:0.6, base:10, note:'…' }
```

`cat` is the wiki's own production list, verbatim and in its order, and it is
what the Makes facet filters on. A few things the forge makes are not on that list —
blocks, and the tools a metalcrafter turns out — and rather than invent a
fifteenth category they sit under Furniture, where the in-game menu puts them, with
their own labour on the row. `labour` is which of the forge's six labours does
the job, which is the second facet and the answer to "why is nobody working in
there".

Three numbers mean the same thing here and in `data/weapons.js`: `bars` is what
one job eats, `per` is how many items it produces, and `melt` is what the whole
output of one job gives back at the smelter. So efficiency is always `melt ÷
bars`, and the reason a fortress forges leggings and menacing spikes for a living
falls straight out of it. `base` is the item type's own value before material and
quality; `noQuality` marks blocks and coins, the two things a smith cannot make
well or badly.

`window.DF_FORGE_METALS` is every metal a fortress can hold, its value
multiplier, and what the forge will accept it for. The second half is the one
that gets fortresses killed: black bronze is worth more than steel and will not
go on a soldier, and silver makes a superb mace and no armour at all. The picker
lists only the metals a given job allows, so it cannot price something the forge
would refuse.

`window.DF_FORGE_TABLES` holds the notes under the picker, in the
`data/reference.js` shape again.

The calculator runs the game's general item value formula — `base × material ×
quality multiplier + quality bonus`, applied per item so a stack counts the bonus
once for every item in it. That is *not* the formula the clothier's shop runs:
cloth folds its thread and weave in as decorations and the wiki states it with an
older quality ladder. Both are the wiki's, and the forge's "How the value is
worked out" table says which is which.

## One step, many ingredients

Seven workshops run a single job against a long list of things — the Still's
Brew Drink, the quern's Mill Plants, the dyer's shop's Dye, the loom's Weave
Cloth, the clothier's Sew Clothing, the smelter's Smelt Ore and alloy reactions
(two tables behind one Job select), and the forge, which is six labours and
fourteen categories of product on one anvil. Listing those out as one card per
ingredient says the same thing dozens of times and clutters the industry map with
parallel strands that carry no information, so each is one generic step in
`data/recipes.js` plus a table in its own data file.
The `PICKERS` table in `assets/js/app.js` lists them, keyed by the generic step
each one replaces — `steps` where one picker stands in for more than one, which
is what keeps a step it has swallowed from also appearing as a plain job card
underneath — and `mountPicker()` turns one into the filter row, search and
result panel.

A picker can carry more than one *mode*, and the smelter is the one that does.
Its two jobs are the same shape — Smelt Ore against 17 ores, the alloy reactions
against 14 recipes — and they used to be two panels stacked down its page, each
with its own list, its own filters and its own search box, one of them always
scrolled past. They are one panel with a Job select on top instead: the two are
never read at once, and a second copy of every control was the whole price of
admitting they are different tables. A mode owns the rows, the facets, the
result renderer and the wording, so switching swaps all of them together and
nothing from the ore side is left standing over the alloy list — the facets go
back to All with it, because the ores' rock types mean nothing to an alloy. The
search box is the one thing that carries over, since unlike a facet it is still
on screen saying what it holds. The heading above the panel names the table
under it, so it is repointed with the mode. A picker with no modes is a picker
with one, and that mode is the config itself. The Armor page uses the same function with two extras: a facet
marked `silent: true` draws no control, because the body figure *is* that facet's
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
carrying a `mark(value)` to draw something for the value in force or a
`valueLabel(value)` to word the options differently from the value they filter
on — the dyer's tone reads "Blues" but selects `Blue`. A facet marked
`multi: true` reads a list rather than a single value, so one row can sit under
several of a facet's values: galena is igneous, metamorphic and sedimentary at
once, and bronze contains both copper and tin. Every facet draws as a dropdown.
They were rows of chips, which read well at four values and badly at fifteen:
the forge's categories wrapped over three rows and made the loudest thing in the
panel a control nobody was looking at, while the ores' rock types pushed the
list itself below the fold. Because a select cannot draw anything inside an
option, a facet with a `mark` shows it after the dropdown instead — that is
where the dyer's colour square went. A picker may also carry `tables` — reference tables that belong
under it rather than in any row of it, rendered by the same code as the Armor
page's notes and anchored back to the workshop's own page.

The forge's is the one picker whose rows come from three files rather than one,
assembled in `app.js`: every weapon whose `made` list names the forge, every
wearable that can be made of metal and is neither gear nor foreign, and all of
`DF_FORGE_GOODS`. The rows are then sorted by `FORGE_CATS`, which is what makes
the options come out in the wiki's order — `mountPicker()` reads a facet's values
off the rows in the order it finds them.

Two of the pickers keep a shared settings object rather than a per-row one: the
clothier's `CALC` and the forge's `FORGE_CALC`. Changing the metal re-prices the
whole list, not one row of it, so a picker with settings in its panel also needs
`refresh()` — the panel is normally only redrawn on a new pick, so that a
keystroke in the filter does not restart an animation, and a panel with a control
of its own has a second reason to change.

Collapsing them would otherwise strand the ingredients and products outside the
recipe graph, so the tables are bridged back into the item index and the search
index. Anything that appears in more than one — sweet pod brews and mills,
dimple dye is milled and then dyed with — gets a card for each on its item
page.

A step may name a second industry with `also: ['textiles']`. Milling needs it:
its flour belongs to the food chain and its dyes to the textiles one, and before
that field existed the textiles page lost its only dye source.

## One industry, one view

Every industry is one page: the step list and the chain map drawn as the same
picture, by `viewFlow()` in `assets/js/app.js`. They used to be two tabs —
Steps, which listed the jobs grouped by the building they happen in, and Chain
map, which drew the same jobs as a graph — and each answered half a question.
The list said what a job wants, where it happens and which empty bucket will
stop it, but not what feeds what; the map said what feeds what, then shrank it
to fit a box and asked to be dragged around.

The map that replaced them runs down the page rather than across it, with the
step cards themselves as the nodes — workshop plate, building name, job, skill,
containers, fuel and note, all on the thing the wires connect. Running downwards
is what buys it out of pan and zoom entirely: the page already scrolls, so the
map has no viewport of its own to be trapped inside, and the only control on it
is a row of chips.

### What a card carries

Every card in a row stands the same height, because flexbox already knows which
is tallest and `align-self: stretch` asks it. What used to break that was the
note — three sentences on one card and none on the one beside it — so the note
lives behind a chevron pushed to the foot of the card, and the chevrons on a row
line up whatever is above them.

Two more things are drawn rather than written, for the same reason: at 258px a
card has no room to repeat itself. A step's containers and fuel are the symbol
alone with the words in the tooltip — `needBadge(n, true)` — while a workshop
page, which has the width, still spells them out. And the end of a branch is a
filled circle, the way a transit map marks the end of a line. Only the end
carries one; a dashed box is already saying that what is in it comes from
somewhere off the map.

Where neighbouring jobs on a row run at the same building, the building gets one
card and its jobs get a second beside it. A glass furnace makes green glass,
clear glass, crystal glass and glass goods, and drawing that as four cards is
the same plate four times over for jobs that share one hearth. Every wire on
that stretch of the chain lands on the building's card; the card next to it says
what the building can be told to do, and the chips light the one line of it that
is on the path. They are two cards rather than two halves of one because the
wires belong to the first and not to the second, and a single border around both
would claim otherwise. Where every job under that roof wants the same skill and
the same containers — all four glass jobs want a glassmaker and a unit of fuel —
the badges are hoisted onto the building and said once.

A job inside a card of types has that card's whole width, so it is a row rather
than a column and its note stands open beside it: what the job is on the left,
what the wiki says about it on the right. The chevron is for a card standing on
its own, where the note is what would otherwise leave one card twice the height
of the one next to it. Under the narrow breakpoint the two columns stack and the
note drops under the job it belongs to.

Grouping only ever merges jobs that are already neighbours — barycentre ordering
puts same-building jobs together on its own, because they tend to share inputs —
so nothing is reordered to make a group, and a building whose jobs land apart
simply draws two cards.

### What a flow declares

`DF_INDUSTRY_FLOWS` in `data/recipes.js` names the jobs and nothing else.

`steps` may borrow a job from another industry, and most of them do. An ash
chain that stopped at the ashery's own jobs would begin and end in mid-air; a
forge with no mine above it starts with ore nobody dug. A borrowed job carries
the name of the industry it came from.

`joins` folds one item name into another for the length of one map. The recipes
are written at the altitude each industry needs and the two do not always meet:
the loom eats "Thread" while five jobs make a "… thread", the forge eats an
"Iron bar" while the smelter makes "Metal bars". Renaming on the way in is what
turns those into one node with wires into it rather than a row of orphans above
a row of things nobody supplies. It is a display join and nothing else — the
steps keep the names the game uses. The joined name has to be an item the data
already knows, or its node leads nowhere.

`paths` are the chips. Each is a main line through the map — the jobs you queue
to end up holding one thing — and picking one numbers those rungs 1..n and fades
the rest, detail and all, so the line you asked for is not separated by a page of
greyed-out paragraphs. That is the step list, without leaving the picture that
shows what it skipped; hovering a faded card brings it back. A path may override
a step's `titles` and `notes`, because a job can read differently depending on
the line it stands in: "Grow a crop" is "Grow pig tails" on the pig tail route,
and the season it wants is worth saying there and nowhere else. The chips write
themselves into the URL with `replaceState` rather than a hash assignment — they
are a control on the page, not navigation away from it, and letting the router
run again would rebuild the map and throw the reader back to the top.

### How the picture is worked out

Nothing in the layout knows what an ashery is, which is what stops the picture
drifting away from the steps the way a hand-drawn diagram would.

`flowModel()` builds the nodes, applies the joins, and then collapses dead ends:
a carpenter's workshop that finishes in furniture, a barrel, a bin, a bucket and
a cage is five nodes wide and says one thing, so where a job's outputs are all
the end of the line they become the one node they amount to. Anything another
job wants keeps its own node, because that is the node a wire has to leave from.

`flowBreakCycles()` cuts the loops first. Some chains genuinely close — a crop
grows from seeds and hands the seeds back — and a layering pass that tries to
honour that wire drags the whole industry out of order, putting the farm plot
below the job that recovers what it planted. A depth-first walk marks the one
edge of each cycle that closes it; layering ignores those and the map draws them
as returns, routed out through the margin beside the rows.

`flowLayer()` then puts a job on the row below the last of its inputs, by
relaxation rather than a topological sort, and drops any item nothing on the map
makes — a log, a tub of tallow — to just above the job that wants it, rather
than leaving it at the top trailing a wire the length of the page.

`flowWires()` gives a wire that skips a row an invisible waypoint in each row it
crosses. Those are ordered along with everything else, so a long wire claims a
lane between the cards instead of disappearing under them. `flowOrder()` sweeps
barycentres up and down — downwards only settles the top of the map and leaves
the bottom in whatever order the recipes were written in — and `flowUncross()`
finishes with adjacent swaps, because an average is blind to the swap that
improves nothing but the crossing count.

The wires themselves are measured off the boxes the browser actually produced,
after layout, so nothing has to agree with flexbox about where anything is.
That is also what makes the responsive behaviour free: a row too wide for the
page wraps, a narrow screen collapses the whole map into one column, the boxes
move, and the wires are redrawn to wherever they landed.

An industry with no flow still gets a page — the old grouped step list, which
needs no configuration beyond the steps themselves.

## Languages

The site reads in English or Spanish, and the button beside the theme toggle
switches between them. The choice is kept in `localStorage` and starts from the
browser's own language, so a Spanish-speaking reader lands on the Spanish site
without touching anything.

**The game's own nomenclature is not translated, in any language.** An item stays
a Plump helmet, a building a Metalsmith's Forge, a job on its menu Brew Drink,
and a picker's options — the metals, the qualities, the drink kinds, the
materials, the labours — stay the words the game puts on screen. This is the
whole point of the rule rather than an omission: you are reading this *because*
you have the game open in the other window, and a translated menu entry is a
worse answer than an untranslated one. Table rows are left alone for the same
reason. What does translate is everything the site says *about* those things:
headings, labels, legends, filters, the calculators' terms, and every note and
blurb in the data files.

`data/i18n.js` holds one pack per language, in two halves:

```js
window.DF_I18N = {
  es: {
    ui: { 'item.madeby': 'Lo produce', 'count.steps': '{n} pasos' },
    data: {
      industry:   { food: 'Comida y bebida' },
      recipeNote: { 'make-ash': 'El origen del jabón, la potasa…' },
      shopNote:   { 'Smelter': 'De mena a bars, de carbón a coke…' }
    }
  }
};
```

`ui` is keyed by a short string and holds the text written into the views.
`data` is keyed by the id a data file already carries — a recipe's `id`, a
workshop's name, a table's `id`, an industry's `id` — and holds the prose that
lives beside the facts. The groups are `industry`, `industryBlurb`,
`recipeNote`, `itemNote`, `shopNote`, `body`, `bodyNote`, `armorNote`,
`weaponNote`, `forgeNote`, `fibreNote`, `fibreAlso`, `goodsNote`, `flowBlurb`,
`flowPath`, `flowTitle`, `flowNote`, `tableTitle`, `tableBlurb` and
`tableCols`.

English is not in the pack. It stays written out at the point it is used, as the
second argument to `t()`:

```js
`<p class="col-head">${esc(t('item.madeby', 'Made by'))}</p>`
t(n === 1 ? 'count.step' : 'count.steps', n === 1 ? '{n} step' : '{n} steps', { n })
```

so the source still reads as English prose, and a key missing from a pack renders
in English rather than as a key. Substitution uses `{n}`-style holes rather than
string concatenation, because Spanish does not put the number, the noun and the
preposition in the order English does — a translation has to be free to move
them. `tableCols` only replaces a header row that still matches the original
column for column, so a table that grows a column keeps its English headings
rather than silently mislabelling one.

To add a language: add a pack, add its code to `LANGS` at the top of
`assets/js/app.js`, and the header button cycles to it. Switching reloads the
page — every view rebuilds itself from the data on each route, but the search
index is built once at boot out of prose that has already been translated, and
letting the browser do that is one code path fewer than rebuilding it in place.

## Layout

```
index.html            page shell
assets/css/style.css  theme tokens, light + dark
assets/img/*.png      a pixel-art plate per workshop: 96x128, or 32x64 for a 1x1
assets/img/plants/    the game's own plant sprites, keyed by name in sprites.js
assets/img/forge/     the same, for what comes off the forge's anvil
assets/js/app.js      hash router, views, the industry map, search, theme toggle
data/recipes.js       industries, production steps, industry maps
data/brewing.js       the Still's 77 brewable ingredients
data/milling.js       the quern's 33 millable plants
data/dyes.js          all 72 dyes, plus the colour name lookups
data/smelting.js      17 ores and 14 alloy recipes
data/workshops.js     workshop artwork, kinds, tiers, build keys and blurbs
data/icons.js         the shared symbol set
data/metals.js        one colour per metal, for the ingot icon
data/reference.js     reference tables
data/armor.js         43 wearables, the body figure and the armour notes
data/weapons.js       31 weapons with their full attack tables
data/forge.js         44 forge goods, 26 metals and the forge's notes
data/i18n.js          one language pack per language: UI strings and data prose
```

## Credits

Structure modelled on Max Cantor's printable cheat sheet at
[thingsfittogether.com](https://thingsfittogether.com) — worth pinning next to your
monitor. That poster is *not* redistributed here.

Dwarf Fortress is by Bay 12 Games, published by Kitfox Games. This is an unaffiliated
fan project. Verify anything load-bearing against the
[wiki](https://dwarffortresswiki.org).
