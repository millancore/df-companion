/* The metalsmith's forge, from
   https://dwarffortresswiki.org/index.php/Metalsmith%27s_forge

   The forge is the widest workshop in the game: fourteen categories of product
   off one anvil, from a war hammer to five hundred coins. Listing that as one
   card per job would be a wall, and listing it as one generic card would say
   nothing, so — exactly like the Still, the quern, the dyer's shop and the
   loom — data/recipes.js carries one generic step and the real list lives here
   for the forge's own page to turn into a picker.

   Three tables:

   ── DF_FORGE_GOODS ─────────────────────────────────────────────────
   Everything the forge makes that is not a weapon or a piece of armour. Those
   two are not repeated here: the picker reads them out of data/weapons.js and
   data/armor.js, filtered to the metal versions, because a battle axe is one
   thing and the pages that list it must not be able to disagree about it.

   `cat` is the wiki's own production list, verbatim and in its order — Weapons,
   Armor, Chains, Crafts, Goblets, Toys, Instruments, Anvils, Flasks, Coins,
   Studding, Furniture, Animal traps, Mechanisms. It is what the picker's chips
   filter on. A few things the forge makes are not on that list — blocks, and
   the tools a metalcrafter turns out — and rather than invent a fifteenth chip
   they sit under Furniture, where the in-game menu puts them, with their own
   labour written on the row.

   Three numbers, and they mean the same thing on every row here and in
   data/weapons.js:

     `bars` — metal bars one job eats.
     `per`  — items one job produces. Absent means one.
     `melt` — bars the *whole output of one job* gives back at the smelter.

   So efficiency is always melt ÷ bars, and the reason a fortress forges
   leggings and menacing spikes for a living falls straight out of it. The
   game's own melt table is at
   https://dwarffortresswiki.org/index.php/Melt_item

   `labour` is which of the forge's six labours does the job, and it is the
   picker's second facet — the answer to "why is nobody working in there".

   `base` is the item type's own value out of the raws, before material and
   quality — the first term of the value formula the picker's calculator runs.
   `noQuality` marks the two things a smith cannot make well or badly: blocks,
   and coins, whose stamped image may have a quality but whose value never does.

   ── DF_FORGE_METALS ────────────────────────────────────────────────
   Every metal a fortress can hold, what it multiplies an item's value by, and
   what the forge will let you make out of it. The second half is the one that
   gets fortresses killed: black bronze is worth more than steel and the forge
   will not put it on a soldier, and silver makes a superb mace and no armour at
   all.

   ── DF_FORGE_TABLES ────────────────────────────────────────────────
   The prose that does not fit in a row, in exactly the data/reference.js shape,
   rendered by the same code as the armour page's notes. */

window.DF_FORGE_GOODS = [

/* ── Chains ───────────────────────────────────────────────────── */

{ name: 'Chain', cat: 'Chains', labour: 'Metal crafter', bars: 1, melt: 1, base: 10,
  note: 'One bar in, one bar back — the only piece of furniture at this forge that costs nothing to change your mind about. Chains hold restraints, wells, traction benches and rollers, and a rope does every one of those jobs for a unit of cloth instead.' },

/* ── Crafts ───────────────────────────────────────────────────── */
/* One bar becomes one, two or three pieces depending on the metalcrafter's
   skill, which is why the return is quoted as a range: 0.1 bars back per piece
   of jewellery means 10% from a bad job and 30% from a good one. */

{ name: 'Amulet',   cat: 'Crafts', labour: 'Metal crafter', bars: 1, upto: 3, melt: 0.1, base: 10 },
{ name: 'Bracelet', cat: 'Crafts', labour: 'Metal crafter', bars: 1, upto: 3, melt: 0.1, base: 10 },
{ name: 'Crown',    cat: 'Crafts', labour: 'Metal crafter', bars: 1, upto: 3, melt: 0.1, base: 10 },
{ name: 'Earring',  cat: 'Crafts', labour: 'Metal crafter', bars: 1, upto: 3, melt: 0.1, base: 10 },
{ name: 'Ring',     cat: 'Crafts', labour: 'Metal crafter', bars: 1, upto: 3, melt: 0.1, base: 10 },
{ name: 'Figurine', cat: 'Crafts', labour: 'Metal crafter', bars: 1, upto: 3, melt: 0.2, base: 10 },
{ name: 'Scepter',  cat: 'Crafts', labour: 'Metal crafter', bars: 1, upto: 3, melt: 0.2, base: 10,
  note: 'Metal crafts are the densest trade goods in the game per bar, and a caravan will take every one of them. Which of the seven comes out is the game’s choice, not yours.' },

/* ── Goblets, flasks and coins: the multiples ─────────────────── */

{ name: 'Goblet', cat: 'Goblets', labour: 'Metal crafter', bars: 1, per: 3, melt: 0.6, base: 10,
  note: 'Three from one bar, so a bar of any metal becomes thirty times that metal’s value before quality touches it. For every metal the forge will not put on a soldier — gold, silver, platinum, black bronze — goblets and flasks are the best thing to do with it.' },

{ name: 'Flask', cat: 'Flasks', labour: 'Metal crafter', bars: 1, per: 3, melt: 0.6, base: 10,
  note: 'Identical arithmetic to the goblet, and a soldier on a long patrol dies of thirst without one — this is the same flask the military uniform asks for, so make a set for the militia before trading the rest.' },

{ name: 'Coins', cat: 'Coins', labour: 'Metal crafter', bars: 1, per: 500, melt: 1.1, base: 0.02,
  noQuality: true,
  note: 'Five hundred coins from one bar, each worth a fiftieth of the metal — so the stack is worth ten bars’ face value and melts back to one and a tenth. Minted coins are always ordinary quality whatever the smith, so this is the one job at the forge a legendary metalcrafter adds nothing to. Dwarves do not need money; the caravan will still take it.' },

/* ── Toys and instruments ─────────────────────────────────────── */

{ name: 'Toy', cat: 'Toys', labour: 'Metal crafter', bars: 1, melt: 0.2, base: 10,
  note: 'A trade good with a child attached. Worth the same as a craft and gives back half as much metal, so make crafts unless a child has asked for one in a mood.' },

{ name: 'Instrument (main part)', cat: 'Instruments', labour: 'Metal crafter', bars: 1, melt: 1, base: 50,
  note: 'Fifty base value off one bar and the whole bar back if you melt it — the best value-per-bar of anything at this forge. Whether a metal part exists at all depends on the instruments your world generated, so the job may simply not be in the menu.' },

{ name: 'Instrument (component)', cat: 'Instruments', labour: 'Metal crafter', bars: 1, melt: 1, base: 10,
  note: 'A multi-part instrument is assembled from components at a craftsdwarf’s workshop; this forges one of them. Same worldgen caveat as the main part.' },

/* ── Anvils ───────────────────────────────────────────────────── */

{ name: 'Anvil', cat: 'Anvils', labour: 'Blacksmith', bars: 3, melt: 1, base: 10,
  note: 'Three bars, and you need one before you can make one — you brought an anvil on the wagon, or you buy the first from the dwarven caravan. It must be fire-safe, which in practice means iron or steel: a strange mood can produce a tin artifact anvil, and it is entirely unusable.' },

/* ── Studding ─────────────────────────────────────────────────── */

{ name: 'Studding', cat: 'Studding', labour: 'Metal crafter', bars: 1, base: 10,
  note: 'A decoration rather than an item: one bar goes onto something you already own, adding its own base value of 10 with its own quality on top. It is the one job at this forge that burns no fuel at all — which makes a fuel-starved fortress with a gold vein a decorating fortress.' },

/* ── Animal traps and mechanisms ──────────────────────────────── */

{ name: 'Animal trap', cat: 'Animal traps', labour: 'Trapper', bars: 1, melt: 1, base: 10,
  note: 'Baited with food, catches vermin, and the whole bar comes back if you change your mind. A wooden one does the same job for a log.' },

{ name: 'Mechanism', cat: 'Mechanisms', labour: 'Mechanic', bars: 1, melt: 0.5, base: 30,
  note: 'Base value 30 off one bar — for any weapons-grade metal, the best trade good the forge makes, and it arrives as one item rather than three separate hauling jobs. A mechanic’s workshop makes the same thing out of any stone for free, so forge these only when the metal is the point.' },

/* ── Furniture ────────────────────────────────────────────────── */
/* Blacksmith work unless the row says otherwise. Almost all of it is three bars
   for a base value of 10, which is a third of a bar's own value of 5 apiece —
   metal furniture is something you make because you want a metal door, not
   because it is a good use of the metal. */

{ name: 'Armor stand',  cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Barrel',       cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10,
  note: 'A metal barrel will not warp or burn, and a rock pot does the same job for one stone.' },
{ name: 'Bin',          cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Cabinet',      cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Cage',         cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10,
  note: 'Metal is the only cage a building destroyer cannot break out of, which is the argument for spending three bars on one.' },
{ name: 'Chair',        cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Chest',        cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Coffin',       cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Door',         cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Floodgate',    cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Grate',        cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Hatch cover',  cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Pipe section', cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10,
  note: 'One of the two parts of a screw pump. The other is an enormous corkscrew, which is filed under weapons because a weaponsmith makes it.' },
{ name: 'Table',        cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Weapon rack',  cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 10 },
{ name: 'Statue',       cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 1, base: 25,
  note: 'Two and a half times any other three-bar piece, and the only furniture worth forging for its value rather than for what it does.' },

{ name: 'Crutch', cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 0.5, base: 10,
  note: 'Three bars and half of one back. Hospital equipment, and wood does it just as well.' },
{ name: 'Splint', cat: 'Furniture', labour: 'Blacksmith', bars: 3, melt: 0.5, base: 10,
  note: 'Same arithmetic as the crutch, and the same answer: make it out of wood.' },

{ name: 'Bucket', cat: 'Furniture', labour: 'Blacksmith', bars: 1, melt: 1, base: 10,
  note: 'One bar, the whole bar back, and every well and every thirsty patient in the hospital wants one.' },

{ name: 'Blocks', cat: 'Furniture', labour: 'Blacksmith', bars: 1, melt: 0.5, base: 5,
  noQuality: true,
  note: 'One bar, one block — metal is the exception to the four-blocks-per-unit rule, and blocks have no quality level. A metal block cannot be forged into anything afterwards; it builds, or it melts back at half.' },

/* Filed as tools rather than furniture by the game, and made by a metalcrafter
   rather than a blacksmith — but they are furniture-shaped things you build a
   fortress out of, so the picker leaves them here rather than opening a
   fifteenth chip for seven rows. */
{ name: 'Minecart',    cat: 'Furniture', labour: 'Metal crafter', bars: 2, melt: 1.8, base: 50,
  note: 'Base value 50 for two bars, and a metal minecart is the one that survives being fired down a track at speed.' },
{ name: 'Wheelbarrow', cat: 'Furniture', labour: 'Metal crafter', bars: 2, melt: 1.8, base: 50 },
{ name: 'Stepladder',  cat: 'Furniture', labour: 'Metal crafter', bars: 2, melt: 1.8, base: 50,
  note: 'What a dwarf carries up to pick fruit off a tree. Same two bars and the same base value of 50 as the minecart, and a carpenter makes one out of a single log — so this is a job for a fortress with metal and no wood.' },
{ name: 'Nest box',    cat: 'Furniture', labour: 'Metal crafter', bars: 1, melt: 0.3, base: 10 },
{ name: 'Hive',        cat: 'Furniture', labour: 'Metal crafter', bars: 1, melt: 0.3, base: 10 },
{ name: 'Jug',         cat: 'Furniture', labour: 'Metal crafter', bars: 1, melt: 0.3, base: 10,
  note: 'What the screw press wants for oil and what honey waits in. A rock jug is free.' },
{ name: 'Large pot',   cat: 'Furniture', labour: 'Metal crafter', bars: 1, melt: 0.3, base: 10,
  note: 'Substitutes for a barrel. A rock pot does the same for one stone.' }

];

/* `value` is the material multiplier from
   https://dwarffortresswiki.org/index.php/Item_value — a bar's own value of 5
   times this is what the metal is worth as a bar, and it multiplies the base
   value of anything forged out of it.

   `grade` is what the forge will accept the metal for. "Weapons & armour" is
   the game's weapons-grade list and nothing else gets on a soldier; silver is
   its own case, allowed for melee weapons and ammunition but never for armour.
   `anvil` marks the three the game will let you cast an anvil from — an anvil
   has to be fire-safe, and a mood-made tin one is a decoration.

   Ordered by value, because that is the order the question is asked in. */
window.DF_FORGE_METALS = [
  { metal: 'Bismuth',         value: 2,  grade: 'Alloying only',
    note: 'Only useful mixed into bismuth bronze.' },
  { metal: 'Copper',          value: 2,  grade: 'Weapons & armour',
    note: 'On nearly every embark, and outclassed by almost anything armed. Still a real militia’s first kit.' },
  { metal: 'Lead',            value: 2,  grade: 'Decorative' },
  { metal: 'Nickel',          value: 2,  grade: 'Decorative' },
  { metal: 'Tin',             value: 2,  grade: 'Decorative',
    note: 'Also the only metal that will glaze a ceramic — though bronze goblets are usually the better use of it.' },
  { metal: 'Zinc',            value: 2,  grade: 'Decorative' },
  { metal: 'Lay pewter',      value: 3,  grade: 'Decorative' },
  { metal: 'Nickel silver',   value: 3,  grade: 'Decorative' },
  { metal: 'Trifle pewter',   value: 4,  grade: 'Decorative' },
  { metal: 'Bronze',          value: 5,  grade: 'Weapons & armour',
    note: 'Copper and tin. Marginally stronger than iron and heavier, and available long before it.' },
  { metal: 'Fine pewter',     value: 5,  grade: 'Decorative' },
  { metal: 'Billon',          value: 6,  grade: 'Decorative' },
  { metal: 'Bismuth bronze',  value: 6,  grade: 'Weapons & armour',
    note: 'Combat numbers identical to bronze, worth a fifth more, one extra smelting step.' },
  { metal: 'Brass',           value: 7,  grade: 'Decorative' },
  { metal: 'Sterling silver', value: 8,  grade: 'Decorative' },
  { metal: 'Iron',            value: 10, grade: 'Weapons & armour', anvil: true,
    note: 'One smelting step from three common ores, and the only route to steel.' },
  { metal: 'Pig iron',        value: 10, grade: 'Alloying only',
    note: 'An intermediate on the way to steel and nothing else.' },
  { metal: 'Silver',          value: 10, grade: 'Melee weapons & ammo',
    note: 'The worst metal in the game for an edge and one of the best for a blunt weapon — dense, and the forge will not make armour of it. Silver maces and war hammers are a real choice.' },
  { metal: 'Black bronze',    value: 11, grade: 'Decorative',
    note: 'Worth more than iron and refused for weapons and armour outright. The single most common reason a forge will not take the metal you picked.' },
  { metal: 'Electrum',        value: 20, grade: 'Decorative' },
  { metal: 'Rose gold',       value: 23, grade: 'Decorative' },
  { metal: 'Gold',            value: 30, grade: 'Decorative',
    note: 'Thirty times a base value, and useless on a soldier. Goblets, flasks and studding.' },
  { metal: 'Steel',           value: 30, grade: 'Weapons & armour', anvil: true,
    note: 'The goal of most fortresses: iron plus pig iron plus flux plus fuel, and far and away the best ordinary metal for both edge and armour.' },
  { metal: 'Aluminium',       value: 40, grade: 'Decorative' },
  { metal: 'Platinum',        value: 40, grade: 'Decorative',
    note: 'The best blunt-weapon material in the game, and only ever as an artifact — you cannot forge a platinum mace on purpose.' },
  { metal: 'Adamantine',      value: 300, grade: 'Weapons & armour', anvil: true,
    note: 'Costs wafers equal to the item’s material size rather than a third of it, so everything is three times the price. Blades ten times sharper than any other metal, and far too light to bludgeon with.' }
];

window.DF_FORGE_TABLES = [

{ id: 'forge-labours', title: 'Six labours, one anvil', icon: 'hammer',
  blurb: 'The forge is one building running six different jobs, and a dwarf with the wrong ' +
         'labour enabled will stand in it doing nothing. This is which one you need.',
  columns: ['Labour', 'Makes', 'Skill it trains'],
  rows: [
    ['Weaponsmithing', 'Weapons, trap components, bolts, ballista arrowheads', 'Weaponsmith'],
    ['Armoring', 'Every piece of armour, and both shields', 'Armorsmith'],
    ['Blacksmithing', 'Anvils, blocks, and all furniture except chains', 'Blacksmith'],
    ['Metalcrafting', 'Chains, crafts, coins, goblets, flasks, toys, instrument parts, studding', 'Metal crafter'],
    ['Trapping', 'Animal traps, and nothing else here', 'Trapper'],
    ['Mechanics', 'Mechanisms, and nothing else here', 'Mechanic']
  ] },

{ id: 'forge-metals', title: 'What the forge will accept', icon: 'metal',
  blurb: 'Value is the multiplier on every base value on this page. The grade is what the ' +
         'forge will let you make: a metal outside the weapons-grade list will not go on a ' +
         'soldier however much it is worth.',
  columns: ['Metal', 'Value ×', 'The forge allows'],
  decorate: { 0: 'metal' },
  rows: [
    ['Copper', '2', 'All weapons, armour, ammunition and picks'],
    ['Bronze', '5', 'All weapons, armour, ammunition and picks'],
    ['Bismuth bronze', '6', 'All weapons, armour, ammunition and picks'],
    ['Iron', '10', 'Everything, anvils included'],
    ['Silver', '10', 'Melee weapons and ammunition — never armour'],
    ['Steel', '30', 'Everything, anvils included'],
    ['Adamantine', '300', 'Everything, at three times the bar cost'],
    ['Black bronze', '11', 'Decoration only. Valuable, and refused for arms'],
    ['Gold · Platinum · Electrum · the rest', '2–40', 'Decoration, furniture, crafts and coins']
  ] },

{ id: 'forge-per-bar', title: 'What one bar is worth', icon: 'quality',
  blurb: 'Base value against bar cost, before material and quality. This is the whole answer ' +
         'to "I have a bar of gold, what do I do with it" — and to why nobody forges furniture.',
  columns: ['Make', 'Bars', 'Base value out', 'Per bar'],
  rows: [
    ['Coins (×500)', '1', '10', '10'],
    ['Goblets or flasks (×3)', '1', '30', '30'],
    ['Instrument, main part', '1', '50', '50'],
    ['Mechanism', '1', '30', '30'],
    ['Bolts (×25)', '1', '25', '25'],
    ['Minecart, wheelbarrow or stepladder', '2', '50', '25'],
    ['Battle axe', '1', '34', '34'],
    ['Crafts (×1–3)', '1', '10–30', '10–30'],
    ['Chain, bucket, animal trap, toy', '1', '10', '10'],
    ['Statue', '3', '25', '8.3'],
    ['A bar left as a bar', '1', '5', '5'],
    ['Most furniture', '3', '10', '3.3']
  ] },

{ id: 'forge-melting', title: 'Melting it back down', icon: 'flame',
  blurb: 'Bars back over bars in. Anything above 100% multiplies your metal, which the wiki ' +
         'files under exploits — and which is how a fortress turns one adamantine vein into ' +
         'a suit for everybody.',
  columns: ['Make this', 'Bars', 'Bars back', 'Return'],
  rows: [
    ['Giant axe blade · corkscrew · menacing spike', '1', '1.5', '150%'],
    ['Leggings', '1', '1.5', '150%'],
    ['Spiked ball · serrated disc', '1', '1.2', '120%'],
    ['Battle axe · pick · shield', '1', '1.2', '120%'],
    ['Gauntlets or high boots (a pair)', '1', '1.2', '120%'],
    ['Coins (a stack of 500)', '1', '1.1', '110%'],
    ['Chain · bucket · animal trap · instrument', '1', '1', '100%'],
    ['Most weapons', '1', '0.9', '90%'],
    ['Breastplate · mail shirt · greaves · minecart', '2–3', '1.8–2.7', '90%'],
    ['Goblets or flasks (a set of three)', '1', '0.6', '60%'],
    ['Mechanism · blocks', '1', '0.5', '50%'],
    ['Anvil and most furniture', '3', '1', '33%'],
    ['Toy · nest box · jug · pot · hive', '1', '0.2–0.3', '20–30%'],
    ['Ballista arrowhead', '3', '0.5', '17%']
  ] },

{ id: 'forge-adamantine', title: 'Adamantine is priced differently', icon: 'spark',
  blurb: 'Every other metal charges material size ÷ 3, rounded down, minimum one bar. ' +
         'Adamantine charges the material size itself, in wafers — so the ratios above stop ' +
         'holding the moment you switch to it.',
  columns: ['Piece', 'In any metal', 'In adamantine', 'Melts back to'],
  rows: [
    ['Battle axe', '1 bar', '4 wafers', '1.2 wafers — a 70% loss'],
    ['Breastplate', '3 bars', '9 wafers', '2.7 wafers'],
    ['Mail shirt', '2 bars', '6 wafers', '1.8 wafers'],
    ['Leggings', '1 bar', '5 wafers', '1.5 wafers'],
    ['Coins (×500)', '1 bar', '1 wafer', '1.1 wafers — still 110%'],
    ['Menacing spike', '1 bar', '5 wafers', '1.5 wafers']
  ] },

{ id: 'forge-value', title: 'How the value is worked out', icon: 'quality',
  blurb: 'The same formula for every item on this page, and the reason a masterwork stack ' +
         'of bolts beats a masterwork minecart four to one: the quality bonus is added to ' +
         'every item in the stack, not once to the job.',
  columns: ['Term', 'What it is'],
  rows: [
    ['Base value', 'The item type’s own number — 34 for a battle axe, 10 for a goblet, 1/50 for a coin'],
    ['× material', 'The metal’s multiplier: copper 2, iron 10, steel 30, adamantine 300'],
    ['× quality', '1 · 1.1 · 1.2 · 1.33 · 1.5 · 2 · 20 for artifact'],
    ['+ bonus', '+0 · +3 · +6 · +10 · +15 · +30 · +300, added after the multiply'],
    ['× stack', 'Applied per item, so a stack of 25 bolts counts the bonus 25 times'],
    ['Decorations', 'Studding, gems and images add their own base 10 with their own quality, on top']
  ] },

{ id: 'forge-traps', title: 'Why the forge is doing nothing', icon: 'warn',
  blurb: 'Every one of these looks like a bug and is a rule.',
  columns: ['Symptom', 'Usually means'],
  rows: [
    ['The whole workshop is idle', 'No anvil in it, or no fuel. Every job but studding burns one unit of coke or charcoal'],
    ['The job will not take the metal', 'Not weapons-grade. Only copper, bronze, bismuth bronze, iron, steel, silver (melee only) and adamantine'],
    ['It refuses black bronze', 'Correct, and it always will — black bronze is worth more than iron and is not an arms metal'],
    ['A dwarf stands in it doing nothing', 'Six different labours run this building. The one you need may not be enabled on anybody'],
    ['The build is refused', 'The building material or the anvil is not fire-safe'],
    ['The anvil is unusable', 'A strange mood made it out of tin. Only a fire-safe anvil will build a forge'],
    ['No instrument jobs in the menu', 'Your world generated no instruments with a metal part. It varies per world'],
    ['Fuel is gone overnight', 'The forge eats one per job. Build the magma version and it eats none'],
    ['Armour will not fit a visitor', 'Armour is sized to its maker’s race. Set the race on the job before it runs']
  ] }

];
