/* Dwarf Fortress industry data — recipes, industries and item metadata.
   Loaded as a plain script so the site works over file:// as well as GitHub Pages. */

window.DF_INDUSTRIES = [
  { id: 'farming',  name: 'Farming & Plants',   icon: 'farming', color: '#7fb069', blurb: 'Seeds, farm plots and fertiliser — where almost every other chain starts.' },
  { id: 'food',     name: 'Food & Drink',       icon: 'food', color: '#d0993f', blurb: 'Brewing, milling, pressing and cooking. A thirsty dwarf is a useless dwarf.' },
  { id: 'textiles', name: 'Textiles & Dye',     icon: 'textiles', color: '#c06a9e', blurb: 'Thread to cloth to clothing, plus the dyes that colour it.' },
  { id: 'metal',    name: 'Metal & Smelting',   icon: 'metal', color: '#8fa9c4', blurb: 'Ore to bars to weapons — and the flux and fuel the whole thing eats.' },
  { id: 'fuel',     name: 'Fuel & Wood',        icon: 'fuel', color: '#b0804f', blurb: 'Logs, charcoal and coke: what every non-magma furnace burns.' },
  { id: 'soap',     name: 'Ash, Lye & Soap',    icon: 'soap', color: '#79b6cf', blurb: 'Burn wood to ash, leach ash to lye, boil lye with fat to get clean.' },
  { id: 'animal',   name: 'Animals & Leather',  icon: 'animal', color: '#cf7a55', blurb: 'Butchery, tanning, milk, wool, bone and shell.' },
  { id: 'stone',    name: 'Stone, Gems & Clay', icon: 'stone', color: '#a294cc', blurb: 'Mining output, mechanisms, cut gems and ceramics.' },
  { id: 'glass',    name: 'Glass',             icon: 'glass', color: '#5fae9e', blurb: 'Sand into green glass. Pearlash makes it clear, rock crystal makes it crystal.' },
  { id: 'paper',    name: 'Paper & Books',      icon: 'paper', color: '#c4b183', blurb: 'Three routes to a sheet — plant fibre, papyrus, parchment — then quires, scrolls and the written word.' }
];

/* needs[] strings map to the legend icons in the UI:
   'shop'   — requires a workshop & a specialist
   'bag'    — output goes into a cloth/leather bag
   'barrel' — output goes into a barrel or large pot
   'jug'    — output goes into a jug
   'flux'   — consumes a flux stone
   'fuel'   — consumes a unit of fuel (free at magma furnaces) */

window.DF_RECIPES = [

/* ── FUEL & WOOD ─────────────────────────────────────────────── */
{ id:'fell-tree', name:'Fell a tree', industry:'fuel', workshop:'Out in the world', skill:'Wood cutter',
  in:[{item:'Tree'}], out:[{item:'Log'}],
  note:'Designate trees for chopping. Larger trees drop several logs. Elves take violent offence at cut wood.' },

{ id:'make-charcoal', name:'Make charcoal', industry:'fuel', workshop:'Wood Furnace', skill:'Wood burner',
  in:[{item:'Log', qty:1}], out:[{item:'Charcoal', qty:1}],
  note:'One log in, one charcoal out. The wood furnace itself burns nothing, so this is how a woodless-fuel fortress bootstraps.' },

{ id:'make-ash', name:'Make ash', industry:'fuel', workshop:'Wood Furnace', skill:'Wood burner',
  in:[{item:'Log', qty:1}], out:[{item:'Ash', qty:1}],
  note:'The head of the soap, potash and glass chains.' },

{ id:'coke-bituminous', name:'Make coke from bituminous coal', industry:'fuel', workshop:'Smelter', skill:'Furnace operator',
  needs:['fuel'], in:[{item:'Bituminous coal', qty:1}], out:[{item:'Coke', qty:9}],
  note:'Costs one unit of fuel to run, so the net gain is +8. At a magma smelter you keep all 9.' },

{ id:'coke-lignite', name:'Make coke from lignite', industry:'fuel', workshop:'Smelter', skill:'Furnace operator',
  needs:['fuel'], in:[{item:'Lignite', qty:1}], out:[{item:'Coke', qty:5}],
  note:'Net gain of +4 after the fuel it burns. Lignite is the poorer cousin of bituminous coal.' },

{ id:'carpenter', name:'Carpentry', industry:'fuel', workshop:"Carpenter's Workshop", skill:'Carpenter',
  in:[{item:'Log'}], out:[{item:'Wooden furniture'},{item:'Barrel'},{item:'Bin'},{item:'Bucket'},{item:'Wooden cage'}],
  note:'Barrels and buckets are the quiet bottleneck of half the fortress. Build a lot of them early.' },

{ id:'bowyer', name:'Make wooden bow / crossbow parts', industry:'fuel', workshop:"Bowyer's Workshop", skill:'Bowyer',
  in:[{item:'Log'}], out:[{item:'Wooden bow'},{item:'Wooden crossbow'}] },

/* ── FARMING ─────────────────────────────────────────────────── */
{ id:'farm-plot', name:'Grow a crop', industry:'farming', workshop:'Farm Plot', skill:'Grower',
  in:[{item:'Seeds'}], out:[{item:'Plump helmet'},{item:'Cave wheat'},{item:'Pig tail'},{item:'Sweet pod'},{item:'Dimple cup'},{item:'Quarry bush'},{item:'Rock nut'}],
  note:'Underground plots need a muddy floor (soil layers already qualify, so no irrigation is needed there). Soil layers cannot be smoothed or engraved.' },

{ id:'gather-plants', name:'Gather plants above ground', industry:'farming', workshop:'Out in the world', skill:'Plant gatherer',
  in:[{item:'Wild plant'}], out:[{item:'Above-ground plant'},{item:'Seeds'}],
  note:'Free food and free seed stock, at the cost of sending a dwarf outside where the goblins live.' },

{ id:'fertilise', name:'Fertilise field', industry:'farming', workshop:'Farm Plot', skill:'Grower',
  in:[{item:'Potash', qty:1}], out:[{item:'Fertilised field'}],
  note:'Raises yields. Entirely optional — plump helmets grow perfectly well in plain mud.' },

{ id:'seeds-recovery', name:'Recover seeds', industry:'farming', workshop:'Any of the below', skill:'—',
  in:[{item:'Plump helmet'}], out:[{item:'Seeds'}],
  note:'Eating raw, brewing, milling and processing all return the seeds. COOKING DOES NOT — a plant cooked into a meal takes its seeds with it. Never let a cook near your only sweet pod.' },

/* ── FOOD & DRINK: brewing ───────────────────────────────────── */
/* The Still runs one job against 77 different plants, so this is one step, not
   77 near-identical ones. The ingredient table lives in data/brewing.js and the
   Still's own page turns it into a picker. */
{ id:'brew', name:'Brew drink', industry:'food', workshop:'Still', skill:'Brewer',
  needs:['barrel'], in:[{item:'Brewable plant'}], out:[{item:'Alcohol'},{item:'Seeds'}],
  note:'Any of 77 plants, fruits or honey. Which one you feed it only changes the drink that comes out — the job, the skill and the empty barrel are the same every time. Pick an ingredient on the Still page to see what it brews into.' },

/* ── FOOD & DRINK: milling ───────────────────────────────────── */
/* One Mill Plants job covers 33 plants and three different powders, so this is
   one step. The plant table lives in data/milling.js and the quern's own page
   turns it into a picker. `also` because the dyes it grinds belong to the
   textiles chain just as much as the flour belongs to food. */
{ id:'mill', name:'Mill plants', industry:'food', also:['textiles'],
  workshop:'Quern or Millstone', skill:'Miller',
  needs:['bag'], in:[{item:'Millable plant'}], out:[{item:'Powder'},{item:'Seeds'}],
  note:'Flour, sugar or dye depending on the plant — 33 of them. Every job needs an empty bag and hands the seeds back. A quern is hand-powered and buildable from one stone; a millstone is bigger and needs power from a windmill or water wheel. Pick a plant on the quern page to see what it grinds into.' },

{ id:'mill-paste', name:'Mill seeds/nuts to paste', industry:'food', workshop:'Quern or Millstone', skill:'Miller',
  in:[{item:'Rock nut'}], out:[{item:'Rock nut paste'},{item:'Seeds'}],
  note:'A separate job from Mill Plants, and the only one here that does not want a bag. Paste is only an intermediate — it wants a screw press next.' },

/* ── FOOD & DRINK: processing / pressing ─────────────────────── */
{ id:'process-thread', name:'Process plant to thread', industry:'textiles', workshop:"Farmer's Workshop", skill:'Thresher',
  in:[{item:'Pig tail'}], out:[{item:'Pig tail thread'},{item:'Seeds'}],
  note:'Rope reed works the same way. This is the entrance to the entire cloth industry.' },

{ id:'process-leaves', name:'Process plant to leaves', industry:'food', workshop:"Farmer's Workshop", skill:'Thresher',
  needs:['bag'], in:[{item:'Quarry bush'}], out:[{item:'Quarry bush leaves'},{item:'Seeds'}],
  note:'Quarry bushes are useless until threshed — the raw bush is not food. The leaves are a cooking ingredient.' },

{ id:'process-syrup', name:'Process plant to syrup', industry:'food', workshop:"Farmer's Workshop", skill:'Thresher',
  needs:['barrel'], in:[{item:'Sweet pod'}], out:[{item:'Dwarven syrup'},{item:'Seeds'}],
  note:'Sweet pods are the most flexible crop in the game: rum, sugar or syrup.' },

{ id:'press-oil', name:'Press paste to oil', industry:'food', workshop:'Screw Press', skill:'Presser',
  needs:['jug'], in:[{item:'Rock nut paste'}], out:[{item:'Rock nut oil'},{item:'Press cake'}],
  note:'Oil goes to the soap maker, or into the kitchen. The screw press costs two mechanisms to build.' },

{ id:'cook-meals', name:'Prepare meals', industry:'food', workshop:'Kitchen', skill:'Cook',
  in:[{item:'Meat'},{item:'Fish'},{item:'Quarry bush leaves'},{item:'Cave wheat flour'},{item:'Dwarven syrup'},{item:'Dwarven sugar'},{item:'Tallow'}],
  out:[{item:'Prepared meal'}],
  note:'Easy meals use 2 ingredients, fine 3, lavish 4. Value scales with the ingredients and the cook. Cooking a seed-bearing plant destroys its seeds forever.' },

{ id:'render-fat', name:'Render fat', industry:'food', workshop:'Kitchen', skill:'Cook',
  in:[{item:'Fat'}], out:[{item:'Tallow'}],
  note:'Tallow is both a cooking ingredient and the fat half of the soap recipe.' },

{ id:'clean-fish', name:'Prepare raw fish', industry:'food', workshop:"Fishery", skill:'Fish cleaner',
  in:[{item:'Raw fish'}], out:[{item:'Fish'}],
  note:'Unprocessed fish rots. Some species are poisonous unless correctly cleaned.' },

/* ── ANIMALS & LEATHER ───────────────────────────────────────── */
{ id:'butcher', name:'Butcher an animal', industry:'animal', workshop:"Butcher's Shop", skill:'Butcher',
  in:[{item:'Animal'}], out:[{item:'Meat'},{item:'Fat'},{item:'Raw hide'},{item:'Bone'},{item:'Skull'},{item:'Shell'}],
  note:'Yield scales with the animal size and the butcher. Sentient corpses will upset everybody.' },

{ id:'tan', name:'Tan a hide', industry:'animal', workshop:"Tanner's Shop", skill:'Tanner',
  in:[{item:'Raw hide'}], out:[{item:'Leather'}],
  note:'Raw hides rot if left alone. Tan them promptly or lose them.' },

{ id:'leatherworks', name:'Leatherwork', industry:'animal', workshop:'Leather Works', skill:'Leatherworker',
  in:[{item:'Leather'}], out:[{item:'Leather armour'},{item:'Backpack'},{item:'Waterskin'},{item:'Bag'},{item:'Leather crafts'}],
  note:'Bags made here can hold dye, flour, sugar and sand.' },

{ id:'shear', name:'Shear an animal', industry:'textiles', workshop:"Farmer's Workshop", skill:'Shearer',
  in:[{item:'Sheep or alpaca'}], out:[{item:'Wool'}],
  note:'Renewable cloth that needs no farm plot at all.' },

{ id:'spin', name:'Spin thread', industry:'textiles', workshop:"Farmer's Workshop", skill:'Spinner',
  in:[{item:'Wool'}], out:[{item:'Yarn thread'}] },

{ id:'milk', name:'Milk an animal', industry:'animal', workshop:"Farmer's Workshop", skill:'Milker',
  needs:['bucket'], in:[{item:'Milkable animal'}], out:[{item:'Milk'}] },

{ id:'cheese', name:'Make cheese', industry:'animal', workshop:"Farmer's Workshop", skill:'Cheese maker',
  in:[{item:'Milk'}], out:[{item:'Cheese'}] },

{ id:'bonecarve', name:'Carve bone / shell', industry:'animal', workshop:"Craftsdwarf's Workshop", skill:'Bone carver',
  in:[{item:'Bone'},{item:'Shell'}], out:[{item:'Bone bolts'},{item:'Bone crafts'},{item:'Shell crafts'}],
  note:'Bone bolts are the cheapest way to keep marksdwarves in ammunition.' },

/* ── TEXTILES ────────────────────────────────────────────────── */
{ id:'weave', name:'Weave cloth', industry:'textiles', workshop:'Loom', skill:'Weaver',
  in:[{item:'Pig tail thread'},{item:'Yarn thread'},{item:'Silk thread'}], out:[{item:'Cloth'}],
  note:'Thread type carries through: pig tail thread makes pig tail cloth, silk makes silk cloth.' },

{ id:'collect-webs', name:'Collect webs', industry:'textiles', workshop:'Out in the world', skill:'Weaver',
  in:[{item:'Spider web'}], out:[{item:'Silk thread'}],
  note:'Free silk, if you are brave enough to farm the thing that spun it.' },

/* One Dye job against 72 dyes, so this is one step. The dye table lives in
   data/dyes.js and the shop's own page turns it into a picker. */
{ id:'dye-thread', name:'Dye thread or cloth', industry:'textiles', workshop:"Dyer's Shop", skill:'Dyer',
  in:[{item:'Dye'},{item:'Cloth'}], out:[{item:'Dyed cloth'}],
  note:'Any of 72 dyes — which one you use only changes the colour. Dyeing adds the dye\u2019s value to the item, multiplied by the quality of the work, and gives your clothes some colour other than plant-brown. Pick a dye on the shop page to see what it gives.' },

{ id:'clothier', name:'Sew clothing', industry:'textiles', workshop:"Clothier's Shop", skill:'Clothier',
  in:[{item:'Cloth'}], out:[{item:'Clothing'},{item:'Bag'},{item:'Rope'}],
  note:'Dwarves need replacement clothing. Worn-out clothes (XXtatteredXX) make them unhappy.' },

/* ── ASH, LYE & SOAP ─────────────────────────────────────────── */
{ id:'make-lye', name:'Make lye', industry:'soap', workshop:'Ashery', skill:'Lye maker',
  needs:['bucket'], in:[{item:'Ash', qty:1}], out:[{item:'Lye'}],
  note:'Needs an empty bucket. Lye is a liquid and behaves like one — it will not sit in a stockpile without its container.' },

{ id:'make-potash-ash', name:'Make potash from ash', industry:'soap', workshop:'Ashery', skill:'Potash maker',
  in:[{item:'Ash', qty:1}], out:[{item:'Potash'}] },

{ id:'make-potash-lye', name:'Make potash from lye', industry:'soap', workshop:'Ashery', skill:'Potash maker',
  in:[{item:'Lye'}], out:[{item:'Potash'}],
  note:'Slower route, but useful if you already have lye in hand.' },

{ id:'make-soap', name:'Make soap', industry:'soap', workshop:"Soap Maker's Workshop", skill:'Soap maker',
  in:[{item:'Lye'},{item:'Tallow'},{item:'Rock nut oil'}], out:[{item:'Soap'}],
  note:'Lye plus any fat — tallow or plant oil. Soap in the hospital dramatically cuts infection deaths.' },

{ id:'make-pearlash', name:'Make pearlash', industry:'glass', also:['stone'], workshop:'Kiln', skill:'Potash maker',
  needs:['fuel'], in:[{item:'Potash', qty:1}], out:[{item:'Pearlash'}],
  note:'Pearlash exists almost entirely to turn green glass into clear glass. It is fired at a kiln from the potash the ash chain makes.' },

/* ── METAL: smelting ore ─────────────────────────────────────── */
/* One Smelt Ore job against 17 ores, so this is one step. The ore table lives
   in data/smelting.js and the smelter's own page turns it into a picker. */
{ id:'smelt-ore', name:'Smelt ore', industry:'metal', workshop:'Smelter', skill:'Furnace operator',
  needs:['fuel'], in:[{item:'Ore'}], out:[{item:'Metal bars'}],
  note:'Any of 17 ores, four bars a time. Which ore you feed it only changes the metal that comes out — galena and tetrahedrite also throw in some silver. Magma smelters skip the fuel entirely. Pick an ore on the smelter page to see what it yields.' },

/* Fourteen alloy reactions, one job shape. Same treatment: the recipe table is
   in data/smelting.js and the picker is on the smelter's page. */
{ id:'make-alloy', name:'Make alloy', industry:'metal', workshop:'Smelter', skill:'Furnace operator',
  needs:['fuel'], in:[{item:'Metal bars'}], out:[{item:'Alloy bars'}],
  note:'Fourteen recipes, from two-bar bronze up to steel. Bronze and bismuth bronze are the ones worth arming a militia with; the rest are for value. Pig iron and steel additionally eat a flux stone. Pick an alloy on the smelter page for its exact ratio.' },

{ id:'adamantine-wafer', name:'Smelt adamantine wafers', industry:'metal', workshop:'Smelter', skill:'Furnace operator',
  needs:['fuel'], in:[{item:'Adamantine strands'}], out:[{item:'Adamantine wafer'}] },

{ id:'forge', name:'Forge metal goods', industry:'metal', workshop:"Metalsmith's Forge", skill:'Blacksmith / Weaponsmith / Armorsmith',
  needs:['fuel'], in:[{item:'Iron bar'},{item:'Steel bar'},{item:'Bronze bar'},{item:'Copper bar'},{item:'Adamantine wafer'}],
  out:[{item:'Weapons'},{item:'Armour'},{item:'Metal furniture'},{item:'Anvil'}],
  note:'Needs an anvil in the workshop. You brought one on the wagon — if you did not, buy one from the dwarven caravan.' },

{ id:'metalcraft', name:'Make metal crafts & mechanisms', industry:'metal', workshop:"Metalsmith's Forge", skill:'Metalcrafter',
  needs:['fuel'], in:[{item:'Copper bar'},{item:'Gold bar'},{item:'Silver bar'}], out:[{item:'Metal crafts'},{item:'Goblet'},{item:'Chain'},{item:'Metal cage'}],
  note:'Metal crafts are the densest trade goods in the game per bar.' },

/* ── STONE, GEMS & GLASS ─────────────────────────────────────── */
{ id:'mine', name:'Mine', industry:'stone', workshop:'Underground', skill:'Miner',
  in:[{item:'Rock layer'}], out:[{item:'Stone'},{item:'Ore'},{item:'Rough gem'},{item:'Flux stone'}],
  note:'Roughly a quarter of mined tiles drop a boulder. Everything below depends on this dwarf.' },

{ id:'mason', name:'Masonry', industry:'stone', workshop:"Mason's Workshop", skill:'Mason',
  in:[{item:'Stone'}], out:[{item:'Stone furniture'},{item:'Stone blocks'},{item:'Door'},{item:'Coffin'}],
  note:'Blocks build faster and prettier than raw boulders, and one boulder makes four blocks.' },

{ id:'stonecraft', name:'Make stone crafts & vessels', industry:'stone', workshop:"Craftsdwarf's Workshop", skill:'Stone crafter',
  in:[{item:'Stone'}], out:[{item:'Stone crafts'},{item:'Rock pot'},{item:'Jug'}],
  note:'Rock pots substitute for barrels and rock jugs for the ones the screw press wants. Both are free if you have stone.' },

{ id:'mechanisms', name:'Make mechanisms', industry:'stone', workshop:"Mechanic's Workshop", skill:'Mechanic',
  in:[{item:'Stone'}], out:[{item:'Mechanism'}],
  note:'Levers, traps, bridges and the screw press all want mechanisms. Keep a stack around.' },

{ id:'cut-gem', name:'Cut a gem', industry:'stone', workshop:"Jeweler's Workshop", skill:'Gem cutter',
  in:[{item:'Rough gem'}], out:[{item:'Cut gem'}] },

{ id:'encrust', name:'Encrust with gems', industry:'stone', workshop:"Jeweler's Workshop", skill:'Gem setter',
  in:[{item:'Cut gem'},{item:'Finished goods'}], out:[{item:'«Decorated» item'}],
  note:'The cheapest way to inflate the value of furniture and crafts — and of your fortress, which attracts sieges.' },

{ id:'collect-sand', name:'Collect sand', industry:'glass', workshop:'Sandy soil', skill:'—',
  needs:['bag'], in:[{item:'Sandy soil'}], out:[{item:'Bag of sand'}],
  note:'Needs an empty bag and a sand-bearing soil layer. Renewable — the tile never runs out.' },

/* There is no "glass bar" — a glass object is made straight from the sand, so
   each of these produces the finished item rather than a material. */
{ id:'green-glass', name:'Make green glass', industry:'glass', workshop:'Glass Furnace', skill:'Glassmaker',
  needs:['fuel'], in:[{item:'Bag of sand'}], out:[{item:'Green glass items'}],
  note:'Sand plus fuel and nothing else, and worth about what copper is. On a sandy map with no ore, glass is your entire crafting industry.' },

{ id:'clear-glass', name:'Make clear glass', industry:'glass', workshop:'Glass Furnace', skill:'Glassmaker',
  needs:['fuel'], in:[{item:'Bag of sand'},{item:'Pearlash'}], out:[{item:'Clear glass items'}],
  note:'One bar of pearlash on top of the sand. Five times the value of stone — about bronze.' },

{ id:'crystal-glass', name:'Make crystal glass', industry:'glass', workshop:'Glass Furnace', skill:'Glassmaker',
  needs:['fuel'], in:[{item:'Pearlash'},{item:'Rock crystal'}], out:[{item:'Crystal glass items'}],
  note:'Pearlash and rough rock crystal, and no sand at all. Cut crystals bought from a caravan will not do. Ten times the value of stone — about silver, if your map has the crystal.' },

{ id:'glass-goods', name:'Make glass goods', industry:'glass', workshop:'Glass Furnace', skill:'Glassmaker',
  needs:['fuel'], in:[{item:'Bag of sand'}],
  out:[{item:'Glass furniture'},{item:'Glass blocks'},{item:'Glass trap components'},{item:'Rough glass gems'}],
  note:'Glass does nearly everything stone does — furniture, blocks, trap components, cut gems. It will not make a quern, a millstone, a slab or a stone short sword.' },

{ id:'clay', name:'Gather clay & fire ceramics', industry:'stone', workshop:'Kiln', skill:'Potter',
  needs:['fuel'], in:[{item:'Clay'}], out:[{item:'Earthenware'},{item:'Stoneware'},{item:'Porcelain'}],
  note:'Clay soil is renewable like sand. Porcelain additionally needs kaolinite.' },

/* ── PAPER & BOOKS ───────────────────────────────────────────── */
/* Three routes to a sheet, and they share nothing but the sheet: plant fibre
   through the quern and the press, papyrus straight off the farmer's workshop,
   and parchment out of a hide by way of the kiln and the ashery. Past the sheet
   the chain forks again into the two forms a book can take. */

{ id:'make-slurry', name:'Mash plant into slurry', industry:'paper', workshop:'Quern or Millstone', skill:'Papermaker',
  needs:['bucket'], in:[{item:'Pig tail'},{item:'Rope reed'},{item:'Hemp'},{item:'Flax'}], out:[{item:'Plant slurry'}],
  note:'Any cloth plant works — rope reed and pig tail underground, hemp, flax, cotton, ramie, jute and kenaf on the surface.' },

{ id:'press-paper', name:'Press plant paper', industry:'paper', workshop:'Screw Press', skill:'Papermaker',
  in:[{item:'Plant slurry'}], out:[{item:'Paper sheet'}],
  note:'The press’s other job wants a Presser; this one does not — both halves of the plant route to paper, the quern and the press, run on Papermaking.' },

{ id:'papyrus-sheet', name:'Make papyrus sheet', industry:'paper', workshop:"Farmer's Workshop", skill:'Papermaker',
  in:[{item:'Papyrus'}], out:[{item:'Paper sheet'}],
  note:'The short route: no quern, no press, no bucket. One job at a building you already have — if the map grows papyrus sedge.' },

{ id:'quicklime', name:'Burn stone to quicklime', industry:'paper', also:['stone'], workshop:'Kiln', skill:'Furnace operator',
  needs:['fuel','bag'], in:[{item:'Calcium carbonate stone'}], out:[{item:'Quicklime'}],
  note:'Calcite, chalk, limestone or marble. All four are also flux, and steel is usually the better use of them.' },

{ id:'milk-of-lime', name:'Make milk of lime', industry:'paper', workshop:'Ashery', skill:'Lye maker',
  needs:['bucket'], in:[{item:'Quicklime'}], out:[{item:'Milk of lime'}],
  note:'One bag of quicklime, one bucket, one unit of milk of lime. It is good for nothing else.' },

{ id:'parchment', name:'Make parchment sheet', industry:'paper', also:['animal'], workshop:"Tanner's Shop", skill:'Tanner',
  in:[{item:'Raw hide'},{item:'Milk of lime'}], out:[{item:'Parchment sheet'}],
  note:'One hide, one sheet, whatever the animal was — a cow gives vellum, everything else is named after the beast.' },

{ id:'binding', name:'Make binding or roller', industry:'paper', workshop:"Craftsdwarf's Workshop", skill:'Bone carver',
  in:[{item:'Log'},{item:'Stone'}], out:[{item:'Book binding'},{item:'Scroll roller'}],
  note:'Wood and stone here; metal at the forge, glass at the glass furnace. A codex needs a binding, a scroll needs a roller.' },

{ id:'quire', name:'Bind a quire', industry:'paper', workshop:"Craftsdwarf's Workshop", skill:'Bookbinder',
  in:[{item:'Paper sheet'},{item:'Parchment sheet'}], out:[{item:'Quire'}],
  note:'One sheet, one quire, and nothing else. A quire is a blank book: scholars and scribes fill it in a library.' },

{ id:'scroll', name:'Make a scroll', industry:'paper', workshop:"Craftsdwarf's Workshop", skill:'Bookbinder',
  in:[{item:'Paper sheet'},{item:'Parchment sheet'},{item:'Scroll roller'}], out:[{item:'Scroll'}],
  note:'The other form a book can take, and the simpler one — a scroll is finished the moment it is made. It can never become a codex.' },

{ id:'write', name:'Write a book', industry:'paper', workshop:'Library', skill:'Writer',
  in:[{item:'Quire'},{item:'Scroll'}], out:[{item:'Written work'}],
  note:'Books attract scholars and visitors — and occasionally the wrong sort of visitor.' },

{ id:'codex', name:'Bind a codex', industry:'paper', workshop:"Craftsdwarf's Workshop", skill:'Bookbinder',
  in:[{item:'Written work'},{item:'Book binding'},{item:'Thread'}], out:[{item:'Codex'}],
  note:'Only a quire that has already been written on. Binding currently throws away some of what the quire was worth, so a fortress chasing wealth leaves its scholars’ work in quire form.' }

];

/* Optional chip filters for an industry's step list. A facet names a set of
   options, and each option lists the step ids that belong to it. A facet only
   speaks for the steps it names: a step no facet claims stays visible whatever
   is selected, so adding a facet can never silently hide a chain.

   Paper is the one industry that needs this. It forks twice and the forks are
   independent — you pick a route to a sheet, and separately you pick which of
   the two forms the finished book takes. Steps that serve both sides of a fork
   (writing, and making the binding or roller) are listed under both. */
window.DF_INDUSTRY_FILTERS = {
  paper: [
    { key: 'sheet', label: 'Sheet from', options: [
      { id: 'fibre',     label: 'Plant fibre', steps: ['make-slurry', 'press-paper'] },
      { id: 'papyrus',   label: 'Papyrus',     steps: ['papyrus-sheet'] },
      { id: 'parchment', label: 'Parchment',   steps: ['quicklime', 'milk-of-lime', 'parchment'] }
    ] },
    { key: 'form', label: 'Finished form', options: [
      { id: 'codex',  label: 'Codex',  steps: ['quire', 'write', 'codex', 'binding'] },
      { id: 'scroll', label: 'Scroll', steps: ['scroll', 'write', 'binding'] }
    ] }
  ]
};

/* Extra colour for individual items shown in the detail panel. */
window.DF_ITEM_NOTES = {
  'Fuel': 'Any unit of charcoal or coke. Magma-powered furnaces (smelter, forge, glass furnace, kiln) need no fuel at all, which is why fortresses chase magma.',
  'Flux stone': 'Limestone, dolomite, chalk, calcite or marble. Required for pig iron and steel, and for nothing else.',
  'Charcoal': 'One log, one charcoal. Slow but always available.',
  'Coke': 'Made from coal at the smelter. Far more efficient than charcoal, and it saves your trees from elven complaints.',
  'Plump helmet': 'Grows quickly underground, can be eaten raw, brewed into wine or milled. The single most useful plant in the game.',
  'Sweet pod': 'Brews into rum, mills into sugar, or presses into syrup at the farmer’s workshop.',
  'Ash': 'The root of soap, potash, fertiliser and pearlash. Made only from logs at a wood furnace.',
  'Soap': 'Stock the hospital with it. Wounds washed with soap get infected far less often.',
  'Steel bar': 'Iron + pig iron + flux + fuel. The best non-artefact armour material a fortress can mass-produce.',
  'Mechanism': 'Made from any stone. Needed for levers, traps, bridges, and to build a screw press.',
  'Rock pot': 'A stone substitute for a wooden barrel. Holds drinks, syrup and other liquids.',
  'Jug': 'Carved from stone at the craftsdwarf’s workshop. The screw press will not make oil without one.',
  'Papyrus': 'Papyrus sedge, a surface plant. The only material that becomes a sheet in one job, with no quern, press or bucket in the way.',
  'Calcium carbonate stone': 'Calcite, chalk, limestone or marble. Every one of them is also flux — and steel is almost always the better thing to do with them.',
  'Quicklime': 'Burnt calcium carbonate, one bag per unit. It leads to parchment and to nothing else.',
  'Milk of lime': 'Quicklime slaked in a bucket at the ashery. Its sole use is turning a hide into parchment.',
  'Paper sheet': 'From plant slurry through the press, or from papyrus in a single job. Interchangeable with parchment from here on.',
  'Parchment sheet': 'One hide, one sheet, whatever the animal’s size. Cow hide is called vellum; everything else is named after the beast.',
  'Quire': 'A blank codex. Scholars and scribes fill it in a library, and only then can it be bound.',
  'Scroll': 'The other form of book: a sheet on a roller, finished the moment it is made. A scroll can never be turned into a codex.',
  'Book binding': 'Wood or stone at the craftsdwarf’s workshop, metal at the forge, glass at the glass furnace. One per codex.',
  'Scroll roller': 'Same four materials as a binding, made at the same three buildings. One per scroll.',
  'Codex': 'A written quire, bound with thread and a binding. Binding currently discards part of what the quire was worth, so a fortress chasing wealth leaves the work in quire form.',
  'Thread': 'Any unused thread will do, animal hair included — it is one of the three things a codex needs.'
};
