/* Armour, from https://dwarffortresswiki.org/index.php/Armor

   Three tables in one file:

   `DF_BODY` is the figure on the Armor page — one entry per clickable region,
   carrying its own art on a 152×312 grid in the same stroked-SVG contract as
   data/workshops.js. The `id` is what a piece names in its `covers` list, so
   the diagram and the coverage data cannot drift apart: a region nothing covers
   simply never lights up. It is worn armour only — a shield is held rather than
   worn, so it covers nothing and the figure has nowhere to put it.

   `DF_ARMOR_MATS` maps the wiki's one-letter material codes to the workshop and
   labour that works them. A piece lists codes, so "where do I make leather
   leggings" is answered by the data rather than by a sentence someone has to
   remember to update.

   `DF_ARMOR` is every wearable in the game's clothing/armour tables. The numbers
   — material size, layer size, permit, layer, coverage, armour level — are the
   raw tokens, not a summary of them. `covers` is the wiki's UBSTEP / LBSTEP /
   UPSTEP tokens already resolved into body parts, because "LBSTEP:1" is not an
   answer to "does this protect my dwarf's legs".

   Metal bar cost is NOT stored: it is material size ÷ 3, rounded down, minimum
   one, and app.js computes it. Adamantine costs the material size in wafers. */

window.DF_BODY = [

{ id: 'head', label: 'Head',
  note: 'Face, ears, nose, lips and teeth are never covered — no headgear in the game protects them.',
  art: '<ellipse cx="110" cy="40" rx="27" ry="28"/>' },

{ id: 'neck', label: 'Neck',
  note: 'Only reached from the torso, by a piece that steps up: a mail shirt, a robe, a cloak.',
  art: '<path d="M97 69h26v13H97z"/>' },

{ id: 'upper-body', label: 'Upper body',
  note: 'The anchor for all torso armour, and where a breastplate stops.',
  art: '<path d="M72 96c0-9 7-14 16-14h44c9 0 16 5 16 14v52H72z"/>' },

{ id: 'lower-body', label: 'Lower body',
  note: 'Zero steps from the upper body, so every torso piece covers both — and leg armour starts here.',
  art: '<path d="M76 152h68v32c0 7-6 12-14 12H90c-8 0-14-5-14-12z"/>' },

{ id: 'upper-arms', label: 'Upper arms',
  note: 'One step up from the torso. A breastplate leaves them bare; a mail shirt does not.',
  art: '<path d="M40 96c0-9 5-14 12-14s12 5 12 14v44H40z"/>' +
       '<path d="M156 96c0-9 5-14 12-14s12 5 12 14v44h-24z"/>' },

{ id: 'lower-arms', label: 'Lower arms',
  note: 'No arm armour exists. The only way to cover these is gauntlets stepping up from the hands.',
  art: '<path d="M41 144h22v42H41z"/><path d="M157 144h22v42h-22z"/>' },

{ id: 'hands', label: 'Hands & fingers',
  note: 'Gauntlets are the only military handwear — and civilians will steal leather gloves.',
  art: '<ellipse cx="52" cy="200" rx="13" ry="12"/><ellipse cx="168" cy="200" rx="13" ry="12"/>' },

{ id: 'upper-legs', label: 'Upper legs',
  note: 'Reachable from above (mail shirt, robe) as well as from leg armour.',
  art: '<path d="M78 200h28v44H78z"/><path d="M114 200h28v44h-28z"/>' },

{ id: 'lower-legs', label: 'Lower legs',
  note: 'Greaves and leggings cover the whole leg; high boots reach up to here from the feet.',
  art: '<path d="M80 248h24v44H80z"/><path d="M116 248h24v44h-24z"/>' },

{ id: 'feet', label: 'Feet & toes',
  note: 'Boots are the anchor. Shoes are too big to fit inside boots — one or the other.',
  art: '<path d="M76 296h28v8c0 5-3 8-8 8H84c-5 0-8-3-8-8z"/>' +
       '<path d="M116 296h28v8c0 5-3 8-8 8h-12c-5 0-8-3-8-8z"/>' }

];

window.DF_ARMOR_MATS = {
  C: { name: 'Cloth',   workshop: "Clothier's Shop",       skill: 'Clothier' },
  L: { name: 'Leather', workshop: 'Leather Works',         skill: 'Leatherworker' },
  B: { name: 'Bone',    workshop: "Craftsdwarf's Workshop", skill: 'Bone carver' },
  S: { name: 'Shell',   workshop: "Craftsdwarf's Workshop", skill: 'Bone carver' },
  M: { name: 'Metal',   workshop: "Metalsmith's Forge",    skill: 'Armorsmith' },
  W: { name: 'Wood',    workshop: "Carpenter's Workshop",  skill: 'Carpenter' }
};

/* kind    — what the piece is for. The page filters on it, because a body part
              with thirty answers on it is not an answer.
   mats    — codes into DF_ARMOR_MATS.
   size    — material size: the bar cost and, with coverage, the thickness.
   ls/perm — layer size and permit: how much bulk it is, and how much bulk it
              will tolerate underneath it.
   level   — armour level. Blank is clothing, which also means it wears out.
   melt    — bars returned by melting a finished metal piece, where known.
   shaped  — only one shaped item per body part, ever.
   avail   — 'foreign' cannot be made by dwarves at all; 'uncommon' may or may
              not be, depending on the civilisation you rolled. */
window.DF_ARMOR = [

/* ── Headgear ─────────────────────────────────────────────────── */

{ id: 'helm', name: 'Helm', slot: 'Head', kind: 'Armor', shaped: true,
  covers: ['head'], mats: ['L', 'B', 'S', 'M'],
  size: 2, ls: 30, perm: 20, layer: 'Armor', cov: 100, level: '1+', melt: 0.6,
  note: 'The head armour. Civilians will not touch it, which is exactly why you make helms and not caps — a leather cap on a hauler is a helm your soldier is not wearing.' },

{ id: 'cap', name: 'Cap', slot: 'Head', kind: 'Clothing', shaped: true,
  covers: ['head'], mats: ['C', 'L', 'M'],
  size: 1, ls: 10, perm: 15, layer: 'Over', cov: 50, level: '+', melt: 0.3,
  note: 'Half the coverage of a helm, and shaped — so a dwarf already wearing a cap cannot put a helm on. The single most common reason a soldier stands there bare-headed.' },

{ id: 'hood', name: 'Hood', slot: 'Head', kind: 'Clothing',
  covers: ['head'], mats: ['C', 'L'],
  size: 2, ls: 10, perm: 100, layer: 'Cover', cov: 100,
  note: 'Cover layer, so it goes over a helm rather than fighting it. Cheap extra padding.' },

{ id: 'mask', name: 'Mask', slot: 'Head', kind: 'Clothing', shaped: true, avail: 'foreign',
  covers: ['head'], mats: ['C', 'L', 'B', 'S', 'M'],
  size: 2, ls: 20, perm: 10, layer: 'Under', cov: 50,
  note: 'Shaped, so it blocks a helm from the inside. Dwarves cannot make them — these arrive on visitors and corpses.' },

{ id: 'face-veil', name: 'Face veil', slot: 'Head', kind: 'Clothing', avail: 'foreign',
  covers: ['head'], mats: ['C', 'L'], size: 2, ls: 10, perm: 100, layer: 'Under', cov: 50 },

{ id: 'head-veil', name: 'Head veil', slot: 'Head', kind: 'Clothing', avail: 'foreign',
  covers: ['head'], mats: ['C', 'L'], size: 2, ls: 10, perm: 100, layer: 'Over', cov: 50 },

{ id: 'headscarf', name: 'Headscarf', slot: 'Head', kind: 'Clothing', avail: 'foreign',
  covers: ['head'], mats: ['C', 'L'], size: 2, ls: 10, perm: 100, layer: 'Over', cov: 50 },

{ id: 'turban', name: 'Turban', slot: 'Head', kind: 'Clothing', avail: 'foreign',
  covers: ['head'], mats: ['C', 'L'], size: 2, ls: 20, perm: 100, layer: 'Over', cov: 50 },

/* ── Torso ────────────────────────────────────────────────────── */

{ id: 'breastplate', name: 'Breastplate', slot: 'Upper body', kind: 'Armor', shaped: true,
  covers: ['upper-body', 'lower-body'], mats: ['M'],
  size: 9, ls: 20, perm: 50, layer: 'Armor', cov: 100, level: 3, elastic: 'Plate', melt: 2.7,
  note: 'The best protection in the game and the most metal: three bars, and it covers the torso and nothing else. Layer it over a mail shirt and the shirt takes the neck, arms and upper legs.' },

{ id: 'mail-shirt', name: 'Mail shirt', slot: 'Upper body', kind: 'Armor',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'upper-legs'], mats: ['M'],
  size: 6, ls: 15, perm: 50, layer: 'Over', cov: 100, level: 2, elastic: 'Chain', melt: 1.8,
  note: 'Flexible: it turns axes and swords and does almost nothing against maces and hammers. Its real value is reach — neck, upper arms and upper legs come free, which no plate piece gives you.' },

{ id: 'leather-armor', name: 'Leather armor', slot: 'Upper body', kind: 'Armor', shaped: true,
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'upper-legs'], mats: ['L'],
  size: 6, ls: 20, perm: 50, layer: 'Armor', cov: 100, level: 1,
  note: 'The first armour a fortress can field — no forge, no fuel, just a tanned hide. Shaped, so it and a breastplate are mutually exclusive. Not the same item as leather clothing: civilians will not wear it.' },

{ id: 'robe', name: 'Robe', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'lower-arms', 'hands',
           'upper-legs', 'lower-legs', 'feet'], mats: ['C', 'L'],
  size: 6, ls: 20, perm: 100, layer: 'Over', cov: 100,
  note: 'Steps to maximum both up and down, so one garment touches nearly the whole body. Weak, but free coverage over the top of real armour — worth putting on anyone walking into a danger room.' },

{ id: 'cloak', name: 'Cloak', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'lower-arms', 'hands', 'upper-legs'],
  mats: ['C', 'L'], size: 5, ls: 15, perm: 150, layer: 'Cover', cov: 100,
  note: 'Cover layer with a 150 permit: it sits over everything and complains about nothing.' },

{ id: 'coat', name: 'Coat', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'lower-arms', 'hands', 'upper-legs'],
  mats: ['C', 'L'], size: 5, ls: 20, perm: 50, layer: 'Over', cov: 100 },

{ id: 'dress', name: 'Dress', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'lower-arms', 'hands',
           'upper-legs', 'lower-legs', 'feet'], mats: ['C', 'L'],
  size: 5, ls: 10, perm: 50, layer: 'Under', cov: 100,
  note: 'Same maximum reach as a robe, but on the under layer. Dwarves are gender-blind about clothing — a male dwarf will happily wear one.' },

{ id: 'shirt', name: 'Shirt', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'lower-arms', 'hands'],
  mats: ['C', 'L'], size: 3, ls: 10, perm: 50, layer: 'Under', cov: 100 },

{ id: 'tunic', name: 'Tunic', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'upper-legs'], mats: ['C', 'L'],
  size: 3, ls: 10, perm: 50, layer: 'Under', cov: 100 },

{ id: 'vest', name: 'Vest', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body'], mats: ['C', 'L'],
  size: 2, ls: 10, perm: 50, layer: 'Over', cov: 50 },

{ id: 'toga', name: 'Toga', slot: 'Upper body', kind: 'Clothing', avail: 'uncommon',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'upper-legs'], mats: ['C', 'L'],
  size: 5, ls: 30, perm: 100, layer: 'Over', cov: 100 },

{ id: 'cape', name: 'Cape', slot: 'Upper body', kind: 'Clothing', avail: 'foreign',
  covers: ['upper-body', 'lower-body'], mats: ['C', 'L'],
  size: 3, ls: 10, perm: 300, layer: 'Cover', cov: 50 },

/* ── Hands ────────────────────────────────────────────────────── */

{ id: 'gauntlets', name: 'Gauntlets', slot: 'Hands', kind: 'Armor', shaped: true,
  covers: ['hands', 'lower-arms'], mats: ['B', 'S', 'M'],
  size: 2, ls: 20, perm: 15, layer: 'Armor', cov: 100, level: 2, melt: 1.2,
  note: 'One bar a pair, one or two units of weight, and the only thing in the game that covers the lower arms. There is no arm armour: gauntlets from below and a mail shirt from above are the whole answer.' },

{ id: 'gloves', name: 'Gloves', slot: 'Hands', kind: 'Clothing',
  covers: ['hands'], mats: ['C', 'L'], size: 1, ls: 10, perm: 10, layer: 'Under', cov: 100,
  note: 'Civilians will pick these up, so leather gloves left in a stockpile walk away on a hauler.' },

{ id: 'mittens', name: 'Mittens', slot: 'Hands', kind: 'Clothing',
  covers: ['hands'], mats: ['C', 'L'], size: 1, ls: 15, perm: 20, layer: 'Cover', cov: 150,
  note: 'The only item in the game with coverage above 100% — the surplus does nothing for defence but helps against contaminants and cold.' },

/* ── Legs ─────────────────────────────────────────────────────── */

{ id: 'greaves', name: 'Greaves', slot: 'Lower body', kind: 'Armor', shaped: true,
  covers: ['lower-body', 'upper-legs', 'lower-legs'], mats: ['B', 'M'],
  size: 6, ls: 15, perm: 30, layer: 'Armor', cov: 100, level: 3, elastic: 'Plate', melt: 1.8,
  note: 'Plate for the legs: two bars, rigid, and the only leg piece that stops a hammer. Shell cannot be carved into them; bone can.' },

{ id: 'leggings', name: 'Leggings', slot: 'Lower body', kind: 'Armor', shaped: true,
  covers: ['lower-body', 'upper-legs', 'lower-legs'], mats: ['L', 'B', 'S', 'M'],
  size: 5, ls: 15, perm: 30, layer: 'Armor', cov: 100, level: '1+', elastic: 'Chain (metal)', melt: 1.5,
  note: 'One bar for full leg coverage, and melting them back returns one and a half — the best metal deal on this page. Metal leggings are chain, so they share chain’s weakness to blunt weapons.' },

{ id: 'trousers', name: 'Trousers', slot: 'Lower body', kind: 'Clothing',
  covers: ['lower-body', 'upper-legs', 'lower-legs', 'feet'], mats: ['C', 'L'],
  size: 4, ls: 15, perm: 30, layer: 'Over', cov: 100 },

{ id: 'braies', name: 'Braies', slot: 'Lower body', kind: 'Clothing', avail: 'uncommon',
  covers: ['lower-body', 'upper-legs'], mats: ['C', 'L'],
  size: 3, ls: 10, perm: 30, layer: 'Under', cov: 100 },

{ id: 'loincloth', name: 'Loincloth', slot: 'Lower body', kind: 'Clothing',
  covers: ['lower-body'], mats: ['C', 'L'], size: 1, ls: 10, perm: 30, layer: 'Under', cov: 50 },

{ id: 'thong', name: 'Thong', slot: 'Lower body', kind: 'Clothing', avail: 'foreign',
  covers: ['lower-body'], mats: ['C', 'L'], size: 1, ls: 10, perm: 30, layer: 'Under', cov: 25 },

{ id: 'skirt-short', name: 'Skirt (short)', slot: 'Lower body', kind: 'Clothing', avail: 'foreign',
  covers: ['lower-body'], mats: ['C', 'L'], size: 2, ls: 10, perm: 100, layer: 'Over', cov: 100 },

{ id: 'skirt', name: 'Skirt', slot: 'Lower body', kind: 'Clothing', avail: 'foreign',
  covers: ['lower-body', 'upper-legs'], mats: ['C', 'L'],
  size: 2, ls: 10, perm: 100, layer: 'Over', cov: 100 },

{ id: 'skirt-long', name: 'Skirt (long)', slot: 'Lower body', kind: 'Clothing', avail: 'foreign',
  covers: ['lower-body', 'upper-legs', 'lower-legs'], mats: ['C', 'L'],
  size: 2, ls: 10, perm: 100, layer: 'Over', cov: 100 },

/* ── Feet ─────────────────────────────────────────────────────── */

{ id: 'high-boots', name: 'High boots', slot: 'Feet', kind: 'Armor',
  covers: ['feet', 'lower-legs'], mats: ['L', 'M'],
  size: 2, ls: 25, perm: 15, layer: 'Over', cov: 100, level: '1+', melt: 1.2,
  note: 'One bar, three units of weight, and they reach the lower legs. With a mail shirt taking the upper legs, a dwarf in high boots has a full chain layer on both legs before you forge a single greave.' },

{ id: 'low-boots', name: 'Low boots', slot: 'Feet', kind: 'Armor',
  covers: ['feet'], mats: ['L', 'M'],
  size: 1, ls: 25, perm: 15, layer: 'Over', cov: 100, level: '1+', melt: 0.6,
  note: 'The foot and nothing above it. Same bar cost as high boots, so there is little reason to prefer them.' },

{ id: 'shoes', name: 'Shoes', slot: 'Feet', kind: 'Clothing',
  covers: ['feet'], mats: ['C', 'L'], size: 1, ls: 20, perm: 15, layer: 'Over', cov: 100,
  note: 'A layer size of 20 against a boot’s permit of 15 — shoes do not fit inside boots. A soldier in a uniform set to "worn over clothes" keeps the shoes and never puts the boots on.' },

{ id: 'sandals', name: 'Sandals', slot: 'Feet', kind: 'Clothing', avail: 'foreign',
  covers: ['feet'], mats: ['C', 'L'], size: 1, ls: 25, perm: 15, layer: 'Over', cov: 100 },

{ id: 'socks', name: 'Socks', slot: 'Feet', kind: 'Clothing',
  covers: ['feet'], mats: ['C'], size: 1, ls: 10, perm: 15, layer: 'Under', cov: 100 },

{ id: 'chausses', name: 'Chausses', slot: 'Feet', kind: 'Clothing', avail: 'foreign',
  covers: ['feet', 'lower-legs', 'upper-legs'], mats: ['C', 'L'],
  size: 3, ls: 10, perm: 15, layer: 'Under', cov: 100,
  note: 'The only item with UPSTEP:MAX — full leg coverage at the size of a sock. The perfect undergarment, and dwarves cannot make them.' },

/* ── Shields ──────────────────────────────────────────────────── */

{ id: 'shield', name: 'Shield', slot: 'Shield', kind: 'Shield',
  covers: [], mats: ['L', 'M', 'W'],
  size: 4, layer: 'Held', block: 20, level: 2, melt: 1.2,
  note: 'Blocks the attack outright instead of absorbing it — deflection where armour would give you a broken bone. Material does not affect blocking at all, so wood is as good as steel and far lighter; it just wears out faster and makes a poor bludgeon.' },

{ id: 'buckler', name: 'Buckler', slot: 'Shield', kind: 'Shield',
  covers: [], mats: ['L', 'M', 'W'],
  size: 2, layer: 'Held', block: 10, level: 1, melt: 0.6,
  note: 'Half a shield’s block chance for half the bulk. Take the shield unless weight is the problem.' },

/* ── Uniform gear ─────────────────────────────────────────────── */

{ id: 'backpack', name: 'Backpack', slot: 'Upper body', kind: 'Gear',
  covers: ['upper-body'], mats: ['L'], size: 3, ls: 0, perm: 300, layer: 'Over',
  note: 'No coverage and no layer size, so it never conflicts with anything. Lets a soldier carry rations on campaign.' },

{ id: 'quiver', name: 'Quiver', slot: 'Upper body', kind: 'Gear',
  covers: ['upper-body'], mats: ['C', 'L'], size: 3, ls: 0, perm: 300, layer: 'Over',
  note: 'Holds ammunition. Assign the ranged weapon when the squad is created — added later, the squad may never pick bolts up at all.' },

{ id: 'flask', name: 'Flask / waterskin', slot: 'Upper body', kind: 'Gear',
  covers: ['upper-body'], mats: ['L', 'M'], size: 5, layer: 'Unique',
  note: 'Its own layer, so it fights with nothing. A soldier without one dies of thirst on a long patrol.' }

];

/* The prose that does not fit in a row: the tables under the picker. Same
   { id, title, icon, blurb, columns, rows } shape as data/reference.js, and
   rendered by the same code. */
window.DF_ARMOR_TABLES = [

{ id: 'suit', title: 'A complete suit', icon: 'armor',
  blurb: 'There is no "suit of armour" item — a covered dwarf is one piece from each row. ' +
         'The cheap column can be made before you own a forge; the full column is what a ' +
         'real militia wears.',
  columns: ['Where', 'Cheap or unskilled', 'The real thing'],
  rows: [
    ['Head', 'Cap', 'Helm'],
    ['Torso', 'Leather armor', 'Mail shirt, then a breastplate over it'],
    ['Hands', 'Gloves', 'Gauntlets'],
    ['Legs', 'Leather or bone leggings', 'Greaves'],
    ['Feet', 'Low boots', 'High boots'],
    ['Off hand', 'Buckler', 'Shield'],
    ['Over the top', '—', 'A cloak or robe: free coverage, almost no weight']
  ] },

{ id: 'grades', title: 'What to make it out of', icon: 'metal',
  blurb: 'Metal armour must be weapons-grade. Everything below copper is training kit — ' +
         'it turns a macaque bite, not a goblin.',
  columns: ['Material', 'Grade', 'Notes'],
  decorate: { 0: 'metal' },
  rows: [
    ['Leather · Bone · Wood', 'Poor', 'No forge needed. Enough for hunters and sparring accidents'],
    ['Copper', 'Acceptable', 'Nearly guaranteed on any embark. Outclassed by almost anything armed'],
    ['Bronze', 'Good', 'Copper + tin. Slightly stronger than iron, and heavier'],
    ['Bismuth bronze', 'Good', 'Identical combat stats to bronze, worth more, one extra smelting step'],
    ['Iron', 'Good', 'Comparable to bronze — slightly weaker, more rigid, much simpler to smelt'],
    ['Steel', 'Excellent', 'The goal for most fortresses. Needs iron, pig iron, flux and fuel'],
    ['Adamantine', 'Best', 'Unmatched, and costs wafers equal to the material size rather than a third of it'],
    ['Black bronze', 'Cannot be used', 'Valuable, but not an armour metal — the forge will refuse it']
  ] },

{ id: 'where', title: 'Where each material is worked', icon: 'shop',
  blurb: 'Which building turns which material into armour, and what only that material can make.',
  columns: ['Material', 'Workshop', 'Skill', 'Limited to'],
  rows: [
    ['Metal', "Metalsmith's Forge", 'Armorsmith', 'Everything — needs an anvil and fuel'],
    ['Leather', 'Leather Works', 'Leatherworker', 'Everything but gauntlets and greaves'],
    ['Bone', "Craftsdwarf's Workshop", 'Bone carver', 'Helms, gauntlets, leggings, greaves'],
    ['Shell', "Craftsdwarf's Workshop", 'Bone carver', 'Helms, gauntlets, leggings'],
    ['Cloth', "Clothier's Shop", 'Clothier', 'Clothing only — no military armour'],
    ['Wood', "Carpenter's Workshop", 'Carpenter', 'Shields and bucklers only']
  ] },

{ id: 'layering', title: 'Layers, size and permit', icon: 'layers',
  blurb: 'Every piece has a layer, a layer size (its own bulk) and a permit (how much bulk ' +
         'it tolerates beneath it). Break the arithmetic and the dwarf simply stands there ' +
         'holding the armour.',
  columns: ['Layer', 'Order', 'What lives there'],
  rows: [
    ['Under', '1 — innermost', 'Shirts, trousers, socks, gloves, masks'],
    ['Over', '2', 'Caps, mail shirts, boots, coats, robes'],
    ['Armor', '3', 'Helms, breastplates, leather armor, gauntlets, leggings, greaves'],
    ['Cover', '4 — outermost', 'Cloaks, hoods, capes'],
    ['Shaped', '—', 'Only one shaped item per body part, ever: a cap blocks a helm, a breastplate blocks leather armor'],
    ['Example', '—', 'A helm is 30 size / 20 permit: it fits over two head veils (10 each), and six hoods still fit over it']
  ] },

{ id: 'coverage', title: 'How far a piece reaches', icon: 'body',
  blurb: 'Armour is anchored at one body part and steps outward from there. Coverage % is ' +
         'the chance an attack on a covered part actually meets the armour — the rest lands ' +
         'on the dwarf.',
  columns: ['Token', 'Applies to', 'What it reaches'],
  rows: [
    ['UBSTEP', 'Torso armour, upward', 'Neck and arms. Breastplate 0 — torso only. Mail shirt 1 — neck and upper arms'],
    ['LBSTEP', 'Torso armour and legwear, downward', 'Legs. Mail shirt 1 — upper legs. Greaves and leggings MAX — the whole leg'],
    ['UPSTEP', 'Gloves and footwear, up the limb', 'Low boots 0 — the foot. High boots and gauntlets 1 — lower leg, lower arm'],
    ['Never covered', '—', 'Ears, nose, lips, teeth and eyes. No headgear in the game protects the face'],
    ['Quality', '—', 'Deflection scales with quality: masterwork 2×, artifact 3×']
  ] },

{ id: 'melting', title: 'Melting it back down', icon: 'flame',
  blurb: 'Metal armour goes back into the smelter. Some pieces return more than they cost — ' +
         'which is how a fortress turns captured goblin kit into steel.',
  columns: ['Piece', 'Bars to make', 'Bars returned', 'Efficiency'],
  rows: [
    ['Leggings', '1', '1.5', '150%'],
    ['Gauntlets (pair)', '1', '1.2', '120%'],
    ['High boots (pair)', '1', '1.2', '120%'],
    ['Shield', '1', '1.2', '120%'],
    ['Mail shirt', '2', '1.8', '90%'],
    ['Breastplate', '3', '2.7', '90%'],
    ['Greaves', '2', '1.8', '90%'],
    ['Helm', '1', '0.6', '60%'],
    ['Low boots (pair)', '1', '0.6', '60%'],
    ['Buckler', '1', '0.6', '60%'],
    ['Cap', '1', '0.3', '30%']
  ] },

{ id: 'armor-traps', title: 'Why the armour is not on the dwarf', icon: 'warn',
  blurb: 'Every one of these looks like a bug and is a rule.',
  columns: ['Symptom', 'Usually means'],
  rows: [
    ['Soldier will not wear the helm', 'They are wearing a cap — both are shaped, only one fits'],
    ['Boots stay in the stockpile', 'Shoes are size 20 against the boots’ 15 permit. Set the uniform to replace clothing, not wear over it'],
    ['Nobody equips anything', 'All four default uniforms are "worn over clothes". Edit the uniform, save it under a new name, reassign it'],
    ['Armour is on, dwarf is crawling', 'No armor user skill. Drop to helm, mail shirt, gauntlets and high boots until they train up'],
    ['Forge refuses the metal', 'Not weapons-grade. Only copper, bronze, bismuth bronze, iron, steel and rarer — never black bronze'],
    ['Forge does nothing at all', 'No anvil in the workshop, or no fuel'],
    ['Marksdwarves never take bolts', 'The ranged weapon must be in the uniform when the squad is created'],
    ['Destroyed armour will not repair', 'Armour is irreparable. Make or trade for a replacement'],
    ['Human armour will not fit', 'Armour is sized to its maker’s race. Dwarf, goblin and elf kit is interchangeable; human is not']
  ] }

];
