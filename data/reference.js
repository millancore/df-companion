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
