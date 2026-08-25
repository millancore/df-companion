/* The textile industry's two lookup tables: everything that becomes thread, and
   everything a clothier makes out of the cloth. Data from the wiki's textile
   industry, item value and clothing pages —
   https://dwarffortresswiki.org/index.php/Textile_industry

   ── DF_FIBRES ──────────────────────────────────────────────────────
   Same reasoning as data/brewing.js and data/milling.js: the loom runs one
   Weave Cloth job against every thread in the fortress, so data/recipes.js
   carries one generic step and the source list lives here for the Loom's page
   to turn into a picker.

   `mult` is the material multiplier out of the raws, and it is the one number
   the whole industry turns on. Thread is a base-6 item and cloth a base-7 one,
   so a row states the multiplier once and the two values fall out of it — which
   is why pig tail thread is 12☼ and giant cave spider silk 24☼ without either
   number being written down anywhere. It carries through the weave and into the
   finished garment, so it is also the first term of the value formula below.

   `weave: false` marks hair, the one thread a loom will not take. That is not a
   footnote — it is the answer to why a stack of horse hair thread sits there
   doing nothing — so it is a field rather than a note.

   `seasons` is which of the four a farm plot will grow the crop in; the plants
   that grow all year say so with all four. `biome` and `ground` are where the
   thing is found, and only mean anything for the ones you have to go and get. */

window.DF_FIBRES = [

  /* ── Plant fibre: threshed at a farmer's workshop ─────────────── */
  /* All eight are the same job with a different crop in the hopper, and all
     eight weigh the same ×2. What separates them is where they will grow and
     what else the plant is good for. */
  { in: 'Pig tail', out: 'Pig tail fiber thread', kind: 'Plant fibre', where: 'Farm plot',
    mult: 2, job: 'process-thread', ground: 'Underground', biome: 'Subterranean water', cloth: 'Pig tail fiber cloth',
    seasons: ['Summer', 'Autumn'], weave: true,
    also: 'Brews into dwarven ale, and mills into slurry for paper.',
    note: 'The default. It grows underground with no irrigation past the mud that is already there, which is why nearly every fortress’s cloth industry is a pig tail industry.' },

  { in: 'Rope reed', out: 'Rope reed fiber thread', kind: 'Plant fibre', where: 'Farm plot',
    mult: 2, job: 'process-thread', ground: 'Above ground', biome: 'Not freezing', cloth: 'Rope reed fiber cloth',
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter'], weave: true,
    also: 'Brews into sunshine.',
    note: 'The surface counterpart to pig tail: grows all year, in almost any unfrozen biome, and brews as well. Elves bring rope reed cloth by the bin.' },

  { in: 'Hemp', out: 'Hemp fiber thread', kind: 'Plant fibre', where: 'Farm plot',
    mult: 2, job: 'process-thread', ground: 'Above ground', biome: 'Temperate', cloth: 'Hemp fiber cloth',
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter'], weave: true,
    also: 'Mills into flour and presses into oil.',
    note: 'Hemp and rope reed are the only fibre crops that grow outside the tropics, so on a temperate embark these two are the whole above-ground list.' },

  { in: 'Flax', out: 'Flax fiber thread', kind: 'Plant fibre', where: 'Farm plot',
    mult: 2, job: 'process-thread', ground: 'Above ground', biome: 'Grassland, savanna', cloth: 'Flax fiber cloth',
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter'], weave: true,
    also: 'Mills into flour and presses into oil.',
    note: 'Thread, bread and oil off one plot. If you have grassland, flax earns its space three times over.' },

  { in: 'Cotton', out: 'Cotton fiber thread', kind: 'Plant fibre', where: 'Farm plot',
    mult: 2, job: 'process-thread', ground: 'Above ground', biome: 'Tropical', cloth: 'Cotton fiber cloth',
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter'], weave: true,
    also: 'Presses into oil.', note: 'Tropical only. Worth exactly as much as pig tail.' },

  { in: 'Kenaf', out: 'Kenaf fiber thread', kind: 'Plant fibre', where: 'Farm plot',
    mult: 2, job: 'process-thread', ground: 'Above ground', biome: 'Tropical', cloth: 'Kenaf fiber cloth',
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter'], weave: true,
    also: 'Presses into oil.' },

  { in: 'Jute', out: 'Jute fiber thread', kind: 'Plant fibre', where: 'Farm plot',
    mult: 2, job: 'process-thread', ground: 'Above ground', biome: 'Tropical', cloth: 'Jute fiber cloth',
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter'], weave: true,
    note: 'Thread and nothing else — no drink, no flour, no oil.' },

  { in: 'Ramie', out: 'Ramie fiber thread', kind: 'Plant fibre', where: 'Farm plot',
    mult: 2, job: 'process-thread', ground: 'Above ground', biome: 'Tropical', cloth: 'Ramie fiber cloth',
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter'], weave: true,
    note: 'Thread and nothing else, same as jute.' },

  /* ── Wool: sheared, then spun ─────────────────────────────────── */
  /* Two jobs rather than one, and half the value of a plant for the trouble —
     but no plot, no seeds and no season. */
  { in: 'Sheep', out: 'Wool yarn thread', kind: 'Wool', where: 'Shearing',
    mult: 1, job: 'shear', spin: true, weave: true, cloth: 'Wool cloth',
    also: 'Also milkable, and butchers into wool as well.',
    note: 'Shearable once every 300 days. A flock is a cloth crop that needs no farm plot, no seeds and no season — at half the value of plant fibre.' },

  { in: 'Llama', out: 'Wool yarn thread', kind: 'Wool', where: 'Shearing',
    mult: 1, job: 'shear', spin: true, weave: true, cloth: 'Wool cloth',
    also: 'Also milkable.', note: 'Same 300-day cycle as sheep.' },

  { in: 'Alpaca', out: 'Wool yarn thread', kind: 'Wool', where: 'Shearing',
    mult: 1, job: 'shear', spin: true, weave: true, cloth: 'Wool cloth',
    also: 'Also milkable.', note: 'Same 300-day cycle as sheep.' },

  { in: 'Troll fur', out: 'Troll fur yarn thread', kind: 'Wool', where: 'Goblin raid',
    mult: 1, job: 'spin', spin: true, weave: true, cloth: 'Troll fur cloth',
    note: 'Goblins shear their trolls; you cannot. The only way to get troll fur is to raid a goblin site for it — which is also why so many besiegers turn up dressed in the stuff.' },

  /* ── Silk: gathered, and spun on the way in ───────────────────── */
  { in: 'Spider web', out: 'Silk thread', kind: 'Silk', where: 'Webs',
    mult: 1, job: 'collect-webs', weave: true, cloth: 'Silk cloth',
    note: 'Cave, phantom and brown recluse spiders are vermin: they leave webs around the fortress, an idle loom queues Collect Webs by itself, and the web becomes thread the moment it is picked up. Their bite will not kill a dwarf, but it will leave one woozy for a while — and cats kill spiders on sight, so a silk fortress is a fortress with its cats shut away.' },

  { in: 'Giant cave spider web', out: 'Giant cave spider silk thread', kind: 'Silk', where: 'Caverns',
    mult: 4, job: 'collect-webs', weave: true, cloth: 'Giant cave spider silk cloth',
    note: 'The best cloth in the game short of adamantine, guarded by a pain-immune animal the size of a grizzly bear that shoots webbing at whoever comes to collect. Set standing orders to ignore webs until the cavern is cleared or your web-gatherer has an escort.' },

  /* ── Hair: the thread that is already finished ────────────────── */
  { in: 'Animal hair', out: 'Hair thread', kind: 'Hair', where: 'Butchery',
    mult: 1, job: 'spin', spin: true, weave: false,
    note: 'A butchery by-product of horses, yaks and grizzly bears. It spins into thread and stops there — no loom will weave it, so no cloth and no clothing. What it is good for is suturing in the hospital and binding a codex, and for those it is free. Rarer beasts give more valuable hair; a grizzly is worth three of a horse.' },

  /* ── Adamantine: a metal that behaves like a fibre ─────────────── */
  { in: 'Raw adamantine', out: 'Adamantine thread', kind: 'Adamantine', where: 'Deep',
    mult: 300, job: 'extract-strands', weave: true, cloth: 'Adamantine cloth',
    note: 'Extract strands at a craftsdwarf’s workshop and the result is thread, which a loom will weave like any other. It makes the most valuable cloth in the game by two orders of magnitude — and clothing that wears out exactly as fast as pig tail. Almost everybody smelts it into wafers instead.' }
];

/* ── DF_CLOTH_GOODS ─────────────────────────────────────────────────
   What one unit of cloth turns into at the clothier's shop, and what the item
   is worth before any material, quality or dye is applied.

   `base` is the item type's own value out of the raws — the first term of the
   value formula, and the reason a robe is worth three times a vest made from
   the same cloth. The game derives it from how much of the body the piece
   covers and how many layers it sits over, which is why the numbers rank the
   way they do.

   `pair` marks the pieces that come out two at a time from one unit of cloth.
   Every clothier job eats a whole unit whatever the size of what it makes, so a
   pair is the same cloth for twice the item — and twice the dye and cloth-
   quality bonuses along with it.

   `as` is the name data/armor.js files the same garment under, and exists only
   where the two tables spell it differently — the picker draws its row picture
   out of the equipment sheet by name, so the join has to be written down
   somewhere rather than guessed at.

   `avail: 'foreign'` is a piece dwarven civilisations do not make. It is here
   because it turns up on the bodies of dead elves and goblins and the value
   question is the same.

   The last three rows are not clothing at all — they are the other things the
   shop and the craftsdwarf will do with a unit of cloth. The game gives them no
   published item-type value, so they carry none rather than an invented one. */

window.DF_CLOTH_GOODS = [
  /* Torso — "armor" in the game's own filing, which is why cloth shirts show up
     under an armour heading in a stockpile. */
  { name: 'Robe',        base: 33, slot: 'Torso', kind: 'Clothing' },
  { name: 'Dress',       base: 31, slot: 'Torso', kind: 'Clothing' },
  { name: 'Coat',        base: 27, slot: 'Torso', kind: 'Clothing' },
  { name: 'Cloak',       base: 26, slot: 'Torso', kind: 'Clothing' },
  { name: 'Toga',        base: 23, slot: 'Torso', kind: 'Clothing', avail: 'foreign' },
  { name: 'Shirt',       base: 22, slot: 'Torso', kind: 'Clothing' },
  { name: 'Tunic',       base: 16, slot: 'Torso', kind: 'Clothing' },
  { name: 'Vest',        base:  8, slot: 'Torso', kind: 'Clothing' },
  { name: 'Cape',        base:  8, slot: 'Torso', kind: 'Clothing' },

  /* Legs */
  { name: 'Trousers',    base: 23, slot: 'Legs', kind: 'Clothing' },
  { name: 'Long skirt',  base: 22, slot: 'Legs', kind: 'Clothing', as: 'Skirt (long)' },
  { name: 'Skirt',       base: 16, slot: 'Legs', kind: 'Clothing' },
  { name: 'Braies',      base: 16, slot: 'Legs', kind: 'Clothing' },
  { name: 'Short skirt', base: 13, slot: 'Legs', kind: 'Clothing', as: 'Skirt (short)' },
  { name: 'Loincloth',   base:  8, slot: 'Legs', kind: 'Clothing' },
  { name: 'Thong',       base:  5, slot: 'Legs', kind: 'Clothing' },

  /* Head */
  { name: 'Hood',        base:  8, slot: 'Head', kind: 'Clothing' },
  { name: 'Turban',      base:  7, slot: 'Head', kind: 'Clothing', avail: 'foreign' },
  { name: 'Mask',        base:  7, slot: 'Head', kind: 'Clothing', avail: 'foreign' },
  { name: 'Cap',         base:  5, slot: 'Head', kind: 'Clothing' },
  { name: 'Head veil',   base:  5, slot: 'Head', kind: 'Clothing', avail: 'foreign' },
  { name: 'Face veil',   base:  5, slot: 'Head', kind: 'Clothing', avail: 'foreign' },
  { name: 'Headscarf',   base:  5, slot: 'Head', kind: 'Clothing', avail: 'foreign' },

  /* Hands and feet — the pairs */
  { name: 'Mittens',     base:  7, slot: 'Hands', kind: 'Clothing', pair: true },
  { name: 'Gloves',      base:  6, slot: 'Hands', kind: 'Clothing', pair: true },
  { name: 'Shoes',       base:  8, slot: 'Feet',  kind: 'Clothing', pair: true },
  { name: 'Socks',       base:  6, slot: 'Feet',  kind: 'Clothing', pair: true },
  { name: 'Sandals',     base:  9, slot: 'Feet',  kind: 'Clothing', pair: true, avail: 'foreign' },

  /* Not clothing */
  { name: 'Bag',          slot: 'Not worn', kind: 'Goods',
    note: 'What flour, sugar, dye, quarry bush leaves and sand all wait on. Leather works makes them too.' },
  { name: 'Rope',         slot: 'Not worn', kind: 'Goods',
    note: 'For restraints, traction benches, rollers and wells. A metal chain does the same job.' },
  { name: 'Cloth crafts', slot: 'Not worn', kind: 'Goods', shop: "Craftsdwarf's Workshop",
    note: 'Made at the craftsdwarf’s workshop rather than here. A trade good and little else — a robe out of the same cloth is worth far more.' }
];
