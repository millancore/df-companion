window.DF_REFERENCE = [

{
  id: 'ores',
  title: 'Ore → Metal',
  icon: 'pick',
  blurb: 'What each ore smelts into. Anything not listed here is just a rock. Ingot colours are real metal tones, not the game\u2019s palette.',
  columns: ['Ore', 'Smelts into', 'Notes'],
  decorate: { 1: 'metal' },
  rows: [
    ['Hematite', 'Iron', 'Large clusters — the best iron find'],
    ['Magnetite', 'Iron', ''],
    ['Limonite', 'Iron', ''],
    ['Malachite', 'Copper', ''],
    ['Native copper', 'Copper', ''],
    ['Tetrahedrite', 'Copper + Silver', 'Common vein ore; the silver is a bonus'],
    ['Cassiterite', 'Tin', 'Copper + tin = bronze'],
    ['Sphalerite', 'Zinc', 'Copper + zinc = brass'],
    ['Galena', 'Lead + Silver', ''],
    ['Garnierite', 'Nickel', ''],
    ['Native gold', 'Gold', ''],
    ['Native silver', 'Silver', ''],
    ['Native platinum', 'Platinum', 'Extremely valuable'],
    ['Native aluminium', 'Aluminium', 'Rare, light, valuable'],
    ['Bismuthinite', 'Bismuth', 'Bismuth + copper = bismuth bronze'],
    ['Horn silver', 'Silver', ''],
    ['Raw adamantine', 'Adamantine wafers', 'Extract strands at a craftsdwarf’s workshop first']
  ]
},

{
  id: 'fuel',
  title: 'Fuel & Flux',
  icon: 'flame',
  blurb: 'Two consumables that gate the whole metal industry.',
  columns: ['Material', 'Gives', 'Where'],
  rows: [
    ['Log', 'Charcoal ×1', 'Wood Furnace — no fuel needed to run'],
    ['Log', 'Ash ×1', 'Wood Furnace'],
    ['Bituminous coal', 'Coke ×9', 'Smelter — costs 1 fuel, net +8'],
    ['Lignite', 'Coke ×5', 'Smelter — costs 1 fuel, net +4'],
    ['Magma', 'Unlimited', 'Magma smelter / forge / kiln / glass furnace burn nothing'],
    ['Limestone · Dolomite · Chalk · Calcite · Marble', 'Flux', 'Required for pig iron and steel']
  ]
},

{
  id: 'quality',
  title: 'Item Quality',
  icon: 'quality',
  blurb: 'How the game marks up an item’s name, worst to best.',
  columns: ['Mark', 'Meaning'],
  rows: [
    ['XXtatteredXX', 'Worn out — replace it before its owner gets miserable'],
    ['plain name', 'Ordinary quality'],
    ['-well-crafted-', 'Quality 1'],
    ['+finely-crafted+', 'Quality 2'],
    ['*superior quality*', 'Quality 3'],
    ['≡exceptional≡', 'Quality 4'],
    ['☼masterwork☼', 'Quality 5 — destroying one devastates its maker'],
    ['Artifact', 'Named, priceless, made in a strange mood'],
    ['«decorated»', 'Encrusted, studded or menaced with spikes'],
    ['(imported)', 'Made by another civilisation']
  ]
},

{
  id: 'population',
  title: 'Population Milestones',
  icon: 'people',
  blurb: 'What growing your fortress unlocks — and what it invites.',
  columns: ['Population', 'What happens'],
  rows: [
    ['7', 'Your embark party. The first two migrant waves arrive regardless of anything you do'],
    ['20', 'Nobles begin appearing — barons, counts, dukes, and their demands'],
    ['50', 'Snatchers come for your children'],
    ['80', '"A vile force of darkness has arrived!" — full goblin sieges'],
    ['200', 'Default population cap'],
    ['any', 'Undead attack at will from necromancer towers, regardless of size']
  ]
},

{
  id: 'calendar',
  title: 'Calendar & Caravans',
  icon: 'calendar',
  blurb: 'The dwarven year runs on twelve stone-named months.',
  columns: ['Season', 'Months', 'Caravan'],
  rows: [
    ['Spring', 'Granite · Slate · Felsite', 'Elven caravan'],
    ['Summer', 'Hematite · Malachite · Galena', 'Human caravan'],
    ['Autumn', 'Limestone · Sandstone · Timber', 'Dwarven caravan + liaison'],
    ['Winter', 'Moonstone · Opal · Obsidian', '— (goblins arrive whenever they please)']
  ]
},

{
  id: 'crops',
  title: 'Underground Crops',
  icon: 'mushroom',
  blurb: 'The seven cave plants and what each one is actually for.',
  columns: ['Crop', 'Brew', 'Mill', 'Process', 'Eat'],
  decorate: { 0: 'sprite' },
  rows: [
    ['Plump helmet', 'Dwarven wine', '—', '—', 'Raw or cooked'],
    ['Cave wheat', 'Dwarven beer', 'Flour', '—', 'Cooked'],
    ['Pig tail', 'Dwarven ale', 'Slurry (paper)', 'Thread', '—'],
    ['Sweet pod', 'Dwarven rum', 'Sugar', 'Syrup', 'Cooked'],
    ['Dimple cup', '—', 'Dimple dye', '—', '—'],
    ['Quarry bush', '—', '—', 'Leaves (bag)', 'Leaves, cooked'],
    ['Rock nut', '—', 'Paste → oil', '—', 'Cooked']
  ]
},

{
  id: 'layers',
  title: 'Rock & Soil Layers',
  icon: 'layers',
  blurb: 'What you are digging through, and what it means for you.',
  columns: ['Layer', 'Contains', 'Notes'],
  rows: [
    ['Surface', 'Trees, wild plants', 'Wood and gathered food — and everything that wants to eat you'],
    ['Soil', 'Clay, sand', 'Cannot be smoothed or engraved. Farms need no irrigation here'],
    ['Sedimentary', 'Lignite, bituminous coal, limestone, dolomite, chalk', 'The fuel-and-flux layer. Iron ores are common here too'],
    ['Igneous extrusive', 'Cassiterite, native gold, hematite', 'Thin bands, often near the surface'],
    ['Igneous intrusive', 'Garnierite, native gold, native platinum', 'Deep and dense'],
    ['Metamorphic', 'Native silver, marble (flux)', 'Marble here is your flux if there is no limestone']
  ]
},

{
  id: 'containers',
  title: 'Container Requirements',
  icon: 'barrel',
  blurb: 'Jobs that silently refuse to run because nothing is standing ready to catch the output.',
  columns: ['Container', 'Needed for', 'Made from'],
  rows: [
    ['Barrel or rock pot', 'All brewing, and dwarven syrup', 'Logs at the carpenter’s / stone at the craftsdwarf’s'],
    ['Cloth or leather bag', 'Flour, sugar, dye, quarry bush leaves, sand', 'Cloth at the clothier’s / leather at the leather works'],
    ['Jug', 'Rock nut oil from the screw press', 'Stone at the craftsdwarf’s workshop'],
    ['Bucket', 'Lye, milk, plant slurry', 'Logs at the carpenter’s workshop'],
    ['Anvil', 'Every job at the metalsmith’s forge', 'One bar at a forge, or bought from the dwarven caravan']
  ]
},

{
  id: 'traps',
  title: 'Common Ways to Stall',
  icon: 'warn',
  blurb: 'Chains that look broken but are only missing one thing.',
  columns: ['Symptom', 'Usually means'],
  rows: [
    ['"Brew drink" cancelled', 'No empty barrel or rock pot'],
    ['Screw press makes no oil', 'No empty jug'],
    ['Ashery makes no lye', 'No empty bucket'],
    ['No steel, plenty of iron', 'No flux stone on the map'],
    ['Forge does nothing', 'No anvil in the workshop'],
    ['Seeds ran out', 'Someone cooked the plants — cooking destroys seeds'],
    ['Quarry bushes are not food', 'They must be threshed into leaves first'],
    ['Smelter idle with ore in stock', 'Out of charcoal or coke'],
    ['Hides vanished', 'Raw hides rot — tan them immediately']
  ]
},

/* All three built from data/textiles.js, so the fibre and garment lists live in
   exactly one place. Thread is a base-6 item and cloth a base-7 one, so both
   columns are the row's own multiplier and neither number is stored twice. */
{ id: 'fibres', title: 'Thread Sources', icon: 'textiles',
  blurb: 'Every way a fortress gets a length of thread, and what that thread is worth. ' +
         'The multiplier is the number the whole industry turns on: it sets the thread, ' +
         'the cloth and the first term of the finished garment\u2019s value. Hair is the ' +
         'one thread no loom will take.',
  columns: ['Source', 'Gives', 'Where', 'Material', 'Thread', 'Cloth', 'Weaves?'],
  decorate: { 0: 'sprite' },
  rows: (window.DF_FIBRES || []).map((f) =>
    [f.in, f.out, f.where, '×' + f.mult, 6 * f.mult + '\u263c',
     f.weave ? 7 * f.mult + '\u263c' : '\u2014',
     f.weave ? 'Yes' : 'No — thread only']) },

{ id: 'fibre-crops', title: 'Fibre Crops', icon: 'mushroom',
  blurb: 'The eight crops one Process Plants job turns into thread. They are worth exactly ' +
         'the same as each other, so the only questions are where the plant will grow and ' +
         'what else it is good for. Rope reed and hemp are the only two that grow outside ' +
         'the tropics.',
  columns: ['Crop', 'Grows', 'Biome', 'Seasons', 'Also good for'],
  decorate: { 0: 'sprite' },
  rows: (window.DF_FIBRES || []).filter((f) => f.kind === 'Plant fibre').map((f) =>
    [f.in, f.ground, f.biome,
     f.seasons.length === 4 ? 'All year' : f.seasons.join(' · '),
     f.also || 'Thread only']) },

{ id: 'cloth-goods', title: 'Cloth Goods', icon: 'quality',
  blurb: 'What one unit of cloth becomes at the clothier\u2019s shop, and the item\u2019s own ' +
         'value before material, quality or dye are counted. Every job eats one whole unit ' +
         'whatever it makes \u2014 so a robe and a thong cost the same cloth and are worth 33 ' +
         'and 5. The pairs are the exception worth knowing: two items out of the one unit.',
  columns: ['Item', 'Worn on', 'Base value', 'Notes'],
  rows: (window.DF_CLOTH_GOODS || []).map((g) => [
    g.name, g.slot, g.base ? g.base + '\u263c' : '\u2014',
    g.note || [g.pair ? 'Made two at a time from one cloth' : '',
               g.avail === 'foreign' ? 'Dwarves cannot make it' : ''].filter(Boolean).join(' \u00b7 ')]) },

/* Built from data/dyes.js so the dye list lives in exactly one place. */
{ id: 'dyes', title: 'Dyes', icon: 'textiles',
  blurb: 'Every dye in the game, what it is made from and the colour it gives. Only the four ' +
         'marked as milled come off a quern — the rest come from leaves, bark, husks and skins ' +
         'at other jobs. Dyeing adds the dye\u2019s value to the item, multiplied by the quality ' +
         'of the work.',
  columns: ['Source', 'Dye', 'Colour', 'Value', 'From'],
  decorate: { 2: 'color' },
  rows: (window.DF_DYES || []).map((d) =>
    [d.from, d.dye, d.color, d.value + '☼', d.milled ? 'Milled at a quern' : 'Other job']) }

];
