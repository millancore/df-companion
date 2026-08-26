/* Armour, from https://dwarffortresswiki.org/index.php/Armor

   Three tables in one file:

   `DF_BODY` is the clickable half of the figure on the Armor page — see the
   comment above it. The `id` is what a piece names in its `covers` list, so
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
   one, and app.js computes it. Adamantine costs the material size in wafers.

   `sprite` is a [column, row] cell in assets/img/item_equipment.png, a 256×832
   sheet of 32×32 pixel-art items. Column 1 is the clothing, column 4 the
   armour. Each has a twin the sheet never uses here: column 0 is the same
   clothing without the gold trim, column 5 a straight copy of column 4. It is a cell rather than a file because 43
   pieces would otherwise be 43 requests, and only the picker's list draws it —
   the sprite is a label for the row, not a second illustration of the piece.
   Not every piece has one: the sheet has no cell for most of the foreign
   clothing, and those rows show the name alone rather than a wrong picture.
   `sprite2` is a second cell for an entry that is two items — "Flask /
   waterskin" is one row in the game's tables and two things on the shelf. */

/* The figure is two layers. The dwarf underneath is one traced outline, kept in
   data/dwarf.js because it is 13k of path data and has no business making this
   file unreadable. `DF_BODY` is the layer on top: ten plain rectangles, one per
   region, and they are what the reader actually clicks. Squares rather than
   body-shaped outlines so the regions read as a set of choices laid over the
   dwarf rather than a diagram someone has to aim at.

   Both layers share a 200×355 grid. The rectangles were measured off the traced
   drawing, which stands with its left boot forward — so the two feet, and the
   two lower legs, do not sit at the same height. Re-trace the dwarf and these
   all need measuring again. */

window.DF_BODY = [

{ id: 'head', label: 'Head',
  note: 'Face, ears, nose, lips and teeth are never covered — no headgear in the game protects them.',
  art: '<rect x="58" y="4" width="62" height="44"/>' },

{ id: 'neck', label: 'Neck',
  note: 'Only reached from the torso, by a piece that steps up: a mail shirt, a robe, a cloak.',
  art: '<rect x="74" y="50" width="40" height="12"/>' },

{ id: 'upper-body', label: 'Upper body',
  note: 'The anchor for all torso armour, and where a breastplate stops.',
  art: '<rect x="58" y="64" width="92" height="72"/>' },

{ id: 'lower-body', label: 'Lower body',
  note: 'Zero steps from the upper body, so every torso piece covers both — and leg armour starts here.',
  art: '<rect x="56" y="140" width="96" height="74"/>' },

{ id: 'upper-arms', label: 'Upper arms',
  note: 'One step up from the torso. A breastplate leaves them bare; a mail shirt does not.',
  art: '<rect x="16" y="64" width="38" height="72"/><rect x="154" y="64" width="40" height="72"/>' },

{ id: 'lower-arms', label: 'Lower arms',
  note: 'No arm armour exists. The only way to cover these is gauntlets stepping up from the hands.',
  art: '<rect x="14" y="140" width="38" height="42"/><rect x="152" y="140" width="42" height="42"/>' },

{ id: 'hands', label: 'Hands & fingers',
  note: 'Gauntlets are the only military handwear — and civilians will steal leather gloves.',
  art: '<rect x="14" y="186" width="38" height="30"/><rect x="154" y="186" width="40" height="30"/>' },

{ id: 'upper-legs', label: 'Upper legs',
  note: 'Reachable from above (mail shirt, robe) as well as from leg armour.',
  art: '<rect x="58" y="218" width="44" height="48"/><rect x="106" y="218" width="48" height="48"/>' },

{ id: 'lower-legs', label: 'Lower legs',
  note: 'Greaves and leggings cover the whole leg; high boots reach up to here from the feet.',
  art: '<rect x="58" y="270" width="44" height="26"/><rect x="106" y="270" width="50" height="42"/>' },

{ id: 'feet', label: 'Feet & toes',
  note: 'Boots are the anchor. Shoes are too big to fit inside boots — one or the other.',
  art: '<rect x="18" y="298" width="86" height="44"/><rect x="108" y="314" width="58" height="40"/>' }

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
   base    — the item type's own value, before material and quality. Unlike the
              bar cost this is *not* computable from what is stored here: the
              game derives it from the UBSTEP / LBSTEP / UPSTEP tokens, and this
              file has already resolved those into `covers`. So it is written
              down, the same way data/textiles.js writes down a garment's.
   ls/perm — layer size and permit: how much bulk it is, and how much bulk it
              will tolerate underneath it.
   level   — armour level. Blank is clothing, which also means it wears out.
   melt    — bars returned by melting a finished metal piece, where known. For a
              pair, it is what the pair returns — which is why gauntlets and high
              boots come back at 120%.
   pair    — hand- and footwear is made two at a time from one unit of material.
   shaped  — only one shaped item per body part, ever.
   avail   — 'foreign' cannot be made by dwarves at all; 'uncommon' may or may
              not be, depending on the civilisation you rolled. */
window.DF_ARMOR = [

/* ── Headgear ─────────────────────────────────────────────────── */

{ id: 'helm', sprite: [4, 21], name: 'Helm', slot: 'Head', kind: 'Armor', shaped: true,
  covers: ['head'], mats: ['L', 'B', 'S', 'M'],
  size: 2, base: 12, ls: 30, perm: 20, layer: 'Armor', cov: 100, level: '1+', melt: 0.6,
  note: 'The head armour. Civilians will not touch it, which is exactly why you make helms and not caps — a leather cap on a hauler is a helm your soldier is not wearing.' },

{ id: 'cap', sprite: [4, 22], name: 'Cap', slot: 'Head', kind: 'Clothing', shaped: true,
  covers: ['head'], mats: ['C', 'L', 'M'],
  size: 1, base: 5, ls: 10, perm: 15, layer: 'Over', cov: 50, level: '+', melt: 0.3,
  note: 'Half the coverage of a helm, and shaped — so a dwarf already wearing a cap cannot put a helm on. The single most common reason a soldier stands there bare-headed.' },

{ id: 'hood', sprite: [1, 17], name: 'Hood', slot: 'Head', kind: 'Clothing',
  covers: ['head'], mats: ['C', 'L'],
  size: 2, base: 8, ls: 10, perm: 100, layer: 'Cover', cov: 100,
  note: 'Cover layer, so it goes over a helm rather than fighting it. Cheap extra padding.' },

{ id: 'mask', sprite: [1, 22], name: 'Mask', slot: 'Head', kind: 'Clothing', shaped: true, avail: 'foreign',
  covers: ['head'], mats: ['C', 'L', 'B', 'S', 'M'],
  size: 2, base: 7, ls: 20, perm: 10, layer: 'Under', cov: 50,
  note: 'Shaped, so it blocks a helm from the inside. Dwarves cannot make them — these arrive on visitors and corpses.' },

{ id: 'face-veil', sprite: [1, 20], name: 'Face veil', slot: 'Head', kind: 'Clothing', avail: 'foreign',
  covers: ['head'], mats: ['C', 'L'], size: 2, base: 5, ls: 10, perm: 100, layer: 'Under', cov: 50 },

{ id: 'head-veil', sprite: [1, 19], name: 'Head veil', slot: 'Head', kind: 'Clothing', avail: 'foreign',
  covers: ['head'], mats: ['C', 'L'], size: 2, base: 5, ls: 10, perm: 100, layer: 'Over', cov: 50 },

{ id: 'headscarf', sprite: [1, 21], name: 'Headscarf', slot: 'Head', kind: 'Clothing', avail: 'foreign',
  covers: ['head'], mats: ['C', 'L'], size: 2, base: 5, ls: 10, perm: 100, layer: 'Over', cov: 50 },

{ id: 'turban', sprite: [1, 18], name: 'Turban', slot: 'Head', kind: 'Clothing', avail: 'foreign',
  covers: ['head'], mats: ['C', 'L'], size: 2, base: 7, ls: 20, perm: 100, layer: 'Over', cov: 50 },

/* ── Torso ────────────────────────────────────────────────────── */

{ id: 'breastplate', sprite: [4, 6], name: 'Breastplate', slot: 'Upper body', kind: 'Armor', shaped: true,
  covers: ['upper-body', 'lower-body'], mats: ['M'],
  size: 9, base: 15, ls: 20, perm: 50, layer: 'Armor', cov: 100, level: 3, elastic: 'Plate', melt: 2.7,
  note: 'The best protection in the game and the most metal: three bars, and it covers the torso and nothing else. Layer it over a mail shirt and the shirt takes the neck, arms and upper legs.' },

{ id: 'mail-shirt', sprite: [4, 7], name: 'Mail shirt', slot: 'Upper body', kind: 'Armor',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'upper-legs'], mats: ['M'],
  size: 6, base: 20, ls: 15, perm: 50, layer: 'Over', cov: 100, level: 2, elastic: 'Chain', melt: 1.8,
  note: 'Flexible: it turns axes and swords and does almost nothing against maces and hammers. Its real value is reach — neck, upper arms and upper legs come free, which no plate piece gives you.' },

{ id: 'leather-armor', sprite: [4, 8], name: 'Leather armor', slot: 'Upper body', kind: 'Armor', shaped: true,
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'upper-legs'], mats: ['L'],
  size: 6, base: 21, ls: 20, perm: 50, layer: 'Armor', cov: 100, level: 1,
  note: 'The first armour a fortress can field — no forge, no fuel, just a tanned hide. Shaped, so it and a breastplate are mutually exclusive. Not the same item as leather clothing: civilians will not wear it.' },

{ id: 'robe', sprite: [1, 6], name: 'Robe', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'lower-arms', 'hands',
           'upper-legs', 'lower-legs', 'feet'], mats: ['C', 'L'],
  size: 6, base: 33, ls: 20, perm: 100, layer: 'Over', cov: 100,
  note: 'Steps to maximum both up and down, so one garment touches nearly the whole body. Weak, but free coverage over the top of real armour — worth putting on anyone walking into a danger room.' },

{ id: 'cloak', sprite: [1, 7], name: 'Cloak', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'lower-arms', 'hands', 'upper-legs'],
  mats: ['C', 'L'], size: 5, base: 26, ls: 15, perm: 150, layer: 'Cover', cov: 100,
  note: 'Cover layer with a 150 permit: it sits over everything and complains about nothing.' },

{ id: 'coat', sprite: [1, 5], name: 'Coat', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'lower-arms', 'hands', 'upper-legs'],
  mats: ['C', 'L'], size: 5, base: 27, ls: 20, perm: 50, layer: 'Over', cov: 100 },

{ id: 'dress', sprite: [1, 4], name: 'Dress', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'lower-arms', 'hands',
           'upper-legs', 'lower-legs', 'feet'], mats: ['C', 'L'],
  size: 5, base: 31, ls: 10, perm: 50, layer: 'Under', cov: 100,
  note: 'Same maximum reach as a robe, but on the under layer. Dwarves are gender-blind about clothing — a male dwarf will happily wear one.' },

{ id: 'shirt', sprite: [1, 0], name: 'Shirt', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'lower-arms', 'hands'],
  mats: ['C', 'L'], size: 3, base: 22, ls: 10, perm: 50, layer: 'Under', cov: 100 },

{ id: 'tunic', sprite: [1, 1], name: 'Tunic', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body', 'upper-legs'], mats: ['C', 'L'],
  size: 3, base: 16, ls: 10, perm: 50, layer: 'Under', cov: 100 },

{ id: 'vest', sprite: [1, 2], name: 'Vest', slot: 'Upper body', kind: 'Clothing',
  covers: ['upper-body', 'lower-body'], mats: ['C', 'L'],
  size: 2, base: 8, ls: 10, perm: 50, layer: 'Over', cov: 50 },

{ id: 'toga', sprite: [1, 3], name: 'Toga', slot: 'Upper body', kind: 'Clothing', avail: 'uncommon',
  covers: ['upper-body', 'lower-body', 'neck', 'upper-arms', 'upper-legs'], mats: ['C', 'L'],
  size: 5, base: 23, ls: 30, perm: 100, layer: 'Over', cov: 100 },

{ id: 'cape', sprite: [1, 8], name: 'Cape', slot: 'Upper body', kind: 'Clothing', avail: 'foreign',
  covers: ['upper-body', 'lower-body'], mats: ['C', 'L'],
  size: 3, base: 8, ls: 10, perm: 300, layer: 'Cover', cov: 50 },

/* ── Hands ────────────────────────────────────────────────────── */

{ id: 'gauntlets', sprite: [4, 9], name: 'Gauntlets', slot: 'Hands', kind: 'Armor', shaped: true,
  covers: ['hands', 'lower-arms'], mats: ['B', 'S', 'M'],
  size: 2, base: 11, ls: 20, perm: 15, layer: 'Armor', cov: 100, pair: true, level: 2, melt: 1.2,
  note: 'One bar a pair, one or two units of weight, and the only thing in the game that covers the lower arms. There is no arm armour: gauntlets from below and a mail shirt from above are the whole answer.' },

{ id: 'gloves', sprite: [4, 11], name: 'Gloves', slot: 'Hands', kind: 'Clothing',
  covers: ['hands'], mats: ['C', 'L'], size: 1, base: 6, ls: 10, perm: 10, layer: 'Under', cov: 100, pair: true,
  note: 'Civilians will pick these up, so leather gloves left in a stockpile walk away on a hauler.' },

{ id: 'mittens', sprite: [4, 13], name: 'Mittens', slot: 'Hands', kind: 'Clothing',
  covers: ['hands'], mats: ['C', 'L'], size: 1, base: 7, ls: 15, perm: 20, layer: 'Cover', cov: 150, pair: true,
  note: 'The only item in the game with coverage above 100% — the surplus does nothing for defence but helps against contaminants and cold.' },

/* ── Legs ─────────────────────────────────────────────────────── */

{ id: 'greaves', sprite: [4, 19], name: 'Greaves', slot: 'Lower body', kind: 'Armor', shaped: true,
  covers: ['lower-body', 'upper-legs', 'lower-legs', 'feet'], mats: ['B', 'M'],
  size: 6, base: 23, ls: 15, perm: 30, layer: 'Armor', cov: 100, level: 3, elastic: 'Plate', melt: 1.8,
  note: 'Plate for the legs: two bars, rigid, and the only leg piece that stops a hammer. Shell cannot be carved into them; bone can.' },

{ id: 'leggings', sprite: [4, 10], name: 'Leggings', slot: 'Lower body', kind: 'Armor', shaped: true,
  covers: ['lower-body', 'upper-legs', 'lower-legs'], mats: ['L', 'B', 'S', 'M'],
  size: 5, base: 23, ls: 15, perm: 30, layer: 'Armor', cov: 100, level: '1+', elastic: 'Chain (metal)', melt: 1.5,
  note: 'One bar for full leg coverage, and melting them back returns one and a half — the best metal deal on this page. Metal leggings are chain, so they share chain’s weakness to blunt weapons.' },

{ id: 'trousers', sprite: [1, 9], name: 'Trousers', slot: 'Lower body', kind: 'Clothing',
  covers: ['lower-body', 'upper-legs', 'lower-legs', 'feet'], mats: ['C', 'L'],
  size: 4, base: 23, ls: 15, perm: 30, layer: 'Over', cov: 100 },

{ id: 'braies', sprite: [1, 10], name: 'Braies', slot: 'Lower body', kind: 'Clothing', avail: 'uncommon',
  covers: ['lower-body', 'upper-legs'], mats: ['C', 'L'],
  size: 3, base: 16, ls: 10, perm: 30, layer: 'Under', cov: 100 },

{ id: 'loincloth', sprite: [1, 14], name: 'Loincloth', slot: 'Lower body', kind: 'Clothing',
  covers: ['lower-body'], mats: ['C', 'L'], size: 1, base: 8, ls: 10, perm: 30, layer: 'Under', cov: 50 },

{ id: 'thong', sprite: [1, 15], name: 'Thong', slot: 'Lower body', kind: 'Clothing', avail: 'foreign',
  covers: ['lower-body'], mats: ['C', 'L'], size: 1, base: 5, ls: 10, perm: 30, layer: 'Under', cov: 25 },

{ id: 'skirt-short', sprite: [1, 11], name: 'Skirt (short)', slot: 'Lower body', kind: 'Clothing', avail: 'foreign',
  covers: ['lower-body'], mats: ['C', 'L'], size: 2, base: 13, ls: 10, perm: 100, layer: 'Over', cov: 100 },

{ id: 'skirt', sprite: [1, 12], name: 'Skirt', slot: 'Lower body', kind: 'Clothing', avail: 'foreign',
  covers: ['lower-body', 'upper-legs'], mats: ['C', 'L'],
  size: 2, base: 16, ls: 10, perm: 100, layer: 'Over', cov: 100 },

{ id: 'skirt-long', sprite: [1, 13], name: 'Skirt (long)', slot: 'Lower body', kind: 'Clothing', avail: 'foreign',
  covers: ['lower-body', 'upper-legs', 'lower-legs'], mats: ['C', 'L'],
  size: 2, base: 22, ls: 10, perm: 100, layer: 'Over', cov: 100 },

/* ── Feet ─────────────────────────────────────────────────────── */

{ id: 'high-boots', sprite: [4, 17], name: 'High boots', slot: 'Feet', kind: 'Armor',
  covers: ['feet', 'lower-legs'], mats: ['L', 'M'],
  size: 2, base: 12, ls: 25, perm: 15, layer: 'Over', cov: 100, pair: true, level: '1+', melt: 1.2,
  note: 'One bar, three units of weight, and they reach the lower legs. With a mail shirt taking the upper legs, a dwarf in high boots has a full chain layer on both legs before you forge a single greave.' },

{ id: 'low-boots', sprite: [4, 16], name: 'Low boots', slot: 'Feet', kind: 'Armor',
  covers: ['feet'], mats: ['L', 'M'],
  size: 1, base: 9, ls: 25, perm: 15, layer: 'Over', cov: 100, pair: true, level: '1+', melt: 0.6,
  note: 'The foot and nothing above it. Same bar cost as high boots, so there is little reason to prefer them.' },

{ id: 'shoes', sprite: [4, 15], name: 'Shoes', slot: 'Feet', kind: 'Clothing',
  covers: ['feet'], mats: ['C', 'L'], size: 1, base: 8, ls: 20, perm: 15, layer: 'Over', cov: 100, pair: true,
  note: 'A layer size of 20 against a boot’s permit of 15 — shoes do not fit inside boots. A soldier in a uniform set to "worn over clothes" keeps the shoes and never puts the boots on.' },

{ id: 'sandals', sprite: [4, 14], name: 'Sandals', slot: 'Feet', kind: 'Clothing', avail: 'foreign',
  covers: ['feet'], mats: ['C', 'L'], size: 1, base: 9, ls: 25, perm: 15, layer: 'Over', cov: 100, pair: true },

{ id: 'socks', sprite: [1, 16], name: 'Socks', slot: 'Feet', kind: 'Clothing',
  covers: ['feet'], mats: ['C'], size: 1, base: 6, ls: 10, perm: 15, layer: 'Under', cov: 100, pair: true },

{ id: 'chausses', name: 'Chausses', slot: 'Feet', kind: 'Clothing', avail: 'foreign',
  covers: ['feet', 'lower-legs', 'upper-legs'], mats: ['C', 'L'],
  size: 3, base: 15, ls: 10, perm: 15, layer: 'Under', cov: 100,
  note: 'The only item with UPSTEP:MAX — full leg coverage at the size of a sock. The perfect undergarment, and dwarves cannot make them.' },

/* ── Shields ──────────────────────────────────────────────────── */

{ id: 'shield', sprite: [4, 0], name: 'Shield', slot: 'Shield', kind: 'Shield',
  covers: [], mats: ['L', 'M', 'W'],
  size: 4, base: 27, layer: 'Held', block: 20, level: 2, melt: 1.2,
  note: 'Blocks the attack outright instead of absorbing it — deflection where armour would give you a broken bone. Material does not affect blocking at all, so wood is as good as steel and far lighter; it just wears out faster and makes a poor bludgeon.' },

{ id: 'buckler', sprite: [4, 3], name: 'Buckler', slot: 'Shield', kind: 'Shield',
  covers: [], mats: ['L', 'M', 'W'],
  size: 2, base: 14, layer: 'Held', block: 10, level: 1, melt: 0.6,
  note: 'Half a shield’s block chance for half the bulk. Take the shield unless weight is the problem.' },

/* ── Uniform gear ─────────────────────────────────────────────── */

{ id: 'backpack', sprite: [4, 24], name: 'Backpack', slot: 'Upper body', kind: 'Gear',
  covers: ['upper-body'], mats: ['L'], size: 3, base: 10, ls: 0, perm: 300, layer: 'Over',
  note: 'No coverage and no layer size, so it never conflicts with anything. Lets a soldier carry rations on campaign.' },

{ id: 'quiver', sprite: [4, 23], name: 'Quiver', slot: 'Upper body', kind: 'Gear',
  covers: ['upper-body'], mats: ['C', 'L'], size: 3, base: 10, ls: 0, perm: 300, layer: 'Over',
  note: 'Holds ammunition. Assign the ranged weapon when the squad is created — added later, the squad may never pick bolts up at all.' },

{ id: 'flask', sprite: [1, 24], sprite2: [1, 23], name: 'Flask / waterskin', slot: 'Upper body', kind: 'Gear',
  covers: ['upper-body'], mats: ['L', 'M'], size: 5, base: 10, layer: 'Unique',
  note: 'Its own layer, so it fights with nothing. A soldier without one dies of thirst on a long patrol.' }

];
