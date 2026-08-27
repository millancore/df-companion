/* Dwarf Fortress industry data — recipes, industries and item metadata.
   Loaded as a plain script so the site works over file:// as well as GitHub Pages. */

window.DF_INDUSTRIES = [
  { id: 'farming',  name: 'Farming & Plants',   icon: 'farming', color: '#7fb069', blurb: 'Seeds, farm plots and fertiliser — where almost every other chain starts.' },
  { id: 'food',     name: 'Food & Drink',       icon: 'food', color: '#d0993f', blurb: 'Brewing, milling, pressing and cooking. A thirsty dwarf is a useless dwarf.' },
  { id: 'textiles', name: 'Textiles & Dye',     icon: 'textiles', color: '#c06a9e', blurb: 'Sixteen ways to get a length of thread, one loom, and the dyes that decide what the cloth is worth.' },
  { id: 'metal',    name: 'Metal & Smelting',   icon: 'metal', color: '#8fa9c4', blurb: 'Ore to bars to weapons — and the flux and fuel the whole thing eats.' },
  { id: 'fuel',     name: 'Fuel & Wood',        icon: 'fuel', color: '#b0804f', blurb: 'Logs, charcoal and coke: what every non-magma furnace burns.' },
  { id: 'soap',     name: 'Ash, Lye & Soap',    icon: 'soap', color: '#79b6cf', blurb: 'Burn wood to ash, leach ash to lye, boil lye with fat to get clean.' },
  { id: 'animal',   name: 'Animals & Leather',  icon: 'animal', color: '#cf7a55', blurb: 'Butchery, tanning, milk, wool, bone and shell.' },
  { id: 'stone',    name: 'Stone & Gems',       icon: 'stone', color: '#a294cc', blurb: 'Mining output, blocks, mechanisms and cut gems.' },
  { id: 'ceramics', name: 'Ceramics',           icon: 'ceramics', color: '#b6674f', blurb: 'Clay off the floor of a soil layer, fired at a kiln, and the glaze that makes it hold water.' },
  { id: 'glass',    name: 'Glass',             icon: 'glass', color: '#5fae9e', blurb: 'Sand into green glass. Pearlash makes it clear, rock crystal makes it crystal.' },
  { id: 'paper',    name: 'Paper & Books',      icon: 'paper', color: '#c4b183', blurb: 'Three routes to a sheet — plant fibre, papyrus, parchment — then quires, scrolls and the written word.' }
];

/* needs[] strings map to the legend icons in the UI:
   'shop'   — requires a workshop & a specialist
   'bag'    — output goes into a cloth/leather bag
   'barrel' — output goes into a barrel or large pot
   'jug'    — output goes into a jug
   'bucket' — output goes into a bucket
   'vial'   — extract goes into a glass vial
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

/* Thirty-six jobs, one log each, one job shape. Same treatment as the Still and
   the forge: the item list lives in data/carpentry.js — with the wooden weapons
   and shields left in data/weapons.js and data/armor.js where they belong — and
   the workshop's own page turns the lot into a picker. */
{ id:'carpenter', name:'Carpentry', industry:'fuel', workshop:"Carpenter's Workshop", skill:'Carpenter',
  in:[{item:'Log'}], out:[{item:'Wooden furniture'},{item:'Barrel'},{item:'Bin'},{item:'Bucket'},{item:'Cage'}],
  note:'One log per job, thirty-six things it can be, and no fuel, no anvil and no second material anywhere in the building — which is why a fortress can run on wood before it can run on anything else. Barrels and buckets are the quiet bottleneck of half of it: build a lot of them early. Pick an item on the workshop page to see what it costs and what it is for.' },

{ id:'bowyer', name:'Make wooden bow / crossbow parts', industry:'fuel', workshop:"Bowyer's Workshop", skill:'Bowyer',
  in:[{item:'Log'}], out:[{item:'Wooden bow'},{item:'Wooden crossbow'}] },

/* ── FARMING ─────────────────────────────────────────────────── */
{ id:'farm-plot', name:'Grow a crop', industry:'farming', workshop:'Farm Plot', skill:'Grower',
  in:[{item:'Seeds'}], out:[{item:'Plump helmet'},{item:'Cave wheat'},{item:'Pig tail'},{item:'Sweet pod'},{item:'Dimple cup'},{item:'Quarry bush'}],
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
  in:[{item:'Fibre crop'}], out:[{item:'Plant fiber thread'},{item:'Seeds'}],
  note:'Eight crops run through this one job: pig tail underground, and rope reed, hemp, flax, cotton, kenaf, jute and ramie above it. Whichever goes in, the thread is worth the same — what differs is where the plant will grow and what else it is good for. The seeds come back. Pick a crop on the Loom page to see the whole route.' },

{ id:'process-leaves', name:'Process plant to leaves', industry:'food', workshop:"Farmer's Workshop", skill:'Thresher',
  needs:['bag'], in:[{item:'Quarry bush'}], out:[{item:'Quarry bush leaves'},{item:'Rock nut'}],
  note:'Quarry bushes are useless until threshed — the raw bush is not food, and even the leaves have to be cooked. Use the menu entry Process Plant to Bag: it gives five leaves and a rock nut per plant, where the plain Process Plants job will also take quarry bushes and give one leaf and nothing else. The rock nuts are the quarry bush’s seeds — mill them all and there is nothing left to replant.' },

{ id:'process-syrup', name:'Process plant to syrup', industry:'food', workshop:"Farmer's Workshop", skill:'Thresher',
  needs:['barrel'], in:[{item:'Sweet pod'}], out:[{item:'Dwarven syrup'},{item:'Seeds'}],
  note:'Sweet pods are the most flexible crop in the game: rum, sugar or syrup.' },

{ id:'process-salve', name:'Process plant to salve', industry:'food', workshop:"Farmer's Workshop", skill:'Thresher',
  needs:['vial'], in:[{item:'Valley herb'}], out:[{item:'Golden salve'}],
  note:'The menu calls it Process Plants (Vial), and it is the only job at this workshop that hands nothing back — valley herbs have no seeds. One herb fills a vial with five units of salve at 100☼ each; a stack of five bought off an elven or human caravan fills one vial with 2,500☼ of trade good for one job. That is the whole point of it: golden salve has no other use.' },

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
  in:[{item:'Shearable animal'}], out:[{item:'Wool'}],
  note:'Sheep, llamas and alpacas, once every 300 days each — and they are milkable in between. Renewable cloth that needs no farm plot, no seeds and no season, at half the value of plant fibre. Trolls are woolly too, but only their goblin masters can shear them.' },

{ id:'spin', name:'Spin thread', industry:'textiles', workshop:"Farmer's Workshop", skill:'Spinner',
  in:[{item:'Wool'},{item:'Animal hair'}], out:[{item:'Yarn thread'},{item:'Hair thread'}],
  note:'Wool spins into yarn, which weaves. Hair — off butchered horses, yaks and grizzly bears — spins into thread and stops there: no loom will take it. Hair thread is still fine for suturing in the hospital and for binding a codex, and it is free.' },

{ id:'milk', name:'Milk an animal', industry:'animal', workshop:"Farmer's Workshop", skill:'Milker',
  needs:['bucket'], in:[{item:'Milkable animal'}], out:[{item:'Milk'}] },

{ id:'cheese', name:'Make cheese', industry:'animal', workshop:"Farmer's Workshop", skill:'Cheese maker',
  in:[{item:'Milk'}], out:[{item:'Cheese'}] },

{ id:'geld', name:'Geld an animal', industry:'animal', workshop:"Farmer's Workshop", skill:'Gelder',
  in:[{item:'Animal'}], out:[{item:'Gelded animal'}],
  note:'The one job here with no menu entry: flag a male on the Pets/Livestock tab — the same button as butchery — and a Geld job queues itself at the next free farmer’s workshop, one at a time per workshop. It is the cure for a catsplosion, and unlike the butcher’s answer the animal walks away. An unskilled gelder is more likely to injure it.' },

{ id:'bonecarve', name:'Carve bone / shell', industry:'animal', workshop:"Craftsdwarf's Workshop", skill:'Bone carver',
  in:[{item:'Bone'},{item:'Shell'}], out:[{item:'Bone bolts'},{item:'Bone crafts'},{item:'Shell crafts'}],
  note:'Bone bolts are the cheapest way to keep marksdwarves in ammunition.' },

/* ── TEXTILES ────────────────────────────────────────────────── */
/* One Weave Cloth job against every thread in the fortress, so this is one
   step. The source table lives in data/textiles.js and the Loom's own page
   turns it into a picker. */
{ id:'weave', name:'Weave cloth', industry:'textiles', workshop:'Loom', skill:'Weaver',
  in:[{item:'Thread'}], out:[{item:'Cloth'}],
  note:'One thread in, one cloth out, and the material carries through: pig tail thread makes pig tail cloth, giant cave spider silk makes giant cave spider silk cloth. Non-hair thread queues itself for weaving automatically — turn that off under standing orders if you would rather dye the thread first, or keep giant cave spider silk back for something better. Pick a thread source on the Loom page to see what it is worth.' },

{ id:'collect-webs', name:'Collect webs', industry:'textiles', workshop:'Out in the world', skill:'Weaver',
  in:[{item:'Spider web'}], out:[{item:'Silk thread'}],
  note:'An idle loom queues this by itself, and the web becomes thread the moment it is picked up — no spinning step. Vermin spiders web the fortress for free, but cats kill them on sight. Giant cave spider webs are the good silk and are collected at real risk: set standing orders to ignore webs until the cavern is clear or the gatherer has an escort.' },

/* One Dye job against 72 dyes, so this is one step. The dye table lives in
   data/dyes.js and the shop's own page turns it into a picker. */
{ id:'dye-thread', name:'Dye thread or cloth', industry:'textiles', workshop:"Dyer's Shop", skill:'Dyer',
  in:[{item:'Dye'},{item:'Cloth'}], out:[{item:'Dyed cloth'}],
  note:'Any of 72 dyes — which one you use only changes the colour. Dyeing adds the dye\u2019s value to the item, multiplied by the quality of the work, and gives your clothes some colour other than plant-brown. Pick a dye on the shop page to see what it gives.' },

/* One Clothier job against thirty-odd garments, and the value of what comes out
   is the whole reason anybody runs this industry. The item table lives in
   data/textiles.js and the shop's own page turns it into a value calculator. */
{ id:'clothier', name:'Sew clothing', industry:'textiles', workshop:"Clothier's Shop", skill:'Clothier',
  in:[{item:'Cloth'}], out:[{item:'Clothing'},{item:'Bag'},{item:'Rope'}],
  note:'Every job eats one whole unit of cloth whatever it makes, so a robe and a thong cost the same and are worth 33 and 5. Shoes, socks, gloves and mittens come out two at a time from that one unit. Dwarves need replacements as clothing wears — XXtatteredXX clothes make them miserable — and worn clothes still trade for half to three quarters of their value. Pick a garment on the shop page to work out what yours will be worth.' },

{ id:'cloth-crafts', name:'Make cloth crafts', industry:'textiles', workshop:"Craftsdwarf's Workshop", skill:'Clothier',
  in:[{item:'Cloth'}], out:[{item:'Cloth crafts'}],
  note:'A trade good, and rarely the best use of the cloth — the same unit sewn into a robe is worth several times as much.' },

{ id:'embroider', name:'Sew image onto an item', industry:'textiles', workshop:"Clothier's Shop", skill:'Clothier',
  in:[{item:'Cloth'},{item:'Clothing'}], out:[{item:'«Decorated» item'}],
  note:'Adds the image\u2019s value to a finished piece — but throws away the quality of the cloth it is embroidered with, so a second robe is almost always worth more than a decoration on the first.' },

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

{ id:'make-pearlash', name:'Make pearlash', industry:'glass', workshop:'Kiln', skill:'Potash maker',
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

/* The head of the adamantine chain, and the fork in it: strands go to the
   smelter to become wafers, or to the loom to become cloth. */
{ id:'extract-strands', name:'Extract adamantine strands', industry:'metal', also:['textiles'],
  workshop:"Craftsdwarf's Workshop", skill:'Stone crafter',
  in:[{item:'Raw adamantine'}], out:[{item:'Adamantine strands'}],
  note:'Raw adamantine is useless as mined. Extracting gives strands, which are thread — a loom will weave them into the most valuable cloth in the game, and a smelter will melt them into wafers instead. Almost everybody picks the wafers.' },

{ id:'adamantine-wafer', name:'Smelt adamantine wafers', industry:'metal', workshop:'Smelter', skill:'Furnace operator',
  needs:['fuel'], in:[{item:'Adamantine strands'}], out:[{item:'Adamantine wafer'}] },

/* Six labours, fourteen categories of product and something over ninety items,
   all from one bar and one anvil. Same treatment as the Still and the smelter:
   one generic step here, the real list in data/forge.js, data/weapons.js and
   data/armor.js, and a picker on the forge's page. Weaponsmithing, armoring,
   blacksmithing, metalcrafting, trapping and mechanics are one building, so
   they are one step — splitting them would put the same bar on six cards. */
{ id:'forge', name:'Forge metal goods', industry:'metal', workshop:"Metalsmith's Forge",
  skill:'Weaponsmith / Armorsmith / Blacksmith / Metalcrafter',
  needs:['fuel'],
  in:[{item:'Iron bar'},{item:'Steel bar'},{item:'Bronze bar'},{item:'Copper bar'},
      {item:'Gold bar'},{item:'Silver bar'},{item:'Adamantine wafer'}],
  out:[{item:'Weapons'},{item:'Armour'},{item:'Metal furniture'},{item:'Metal crafts'}],
  note:'Needs an anvil in the workshop and a unit of fuel per job — every job but studding. You brought an anvil on the wagon; if you did not, buy one from the dwarven caravan. Which metals the job will accept depends on what you are making: only weapons-grade metal goes on a soldier, and the forge refuses black bronze outright however much it is worth. Pick an item on the forge page to see what it costs, what it melts back to and what it is worth.' },

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

/* ── CERAMICS ────────────────────────────────────────────────── */
/* Three wares out of one building, and which one you get is settled before the
   kiln is ever lit: ordinary clay soil fires to earthenware, the rarer fire
   clay to stoneware, and mined kaolinite to porcelain. The glaze is the only
   decision left afterwards. */

{ id:'collect-clay', name:'Collect clay', industry:'ceramics', workshop:'Clay soil', skill:'—',
  in:[{item:'Clay soil'}], out:[{item:'Clay'},{item:'Fire clay'}],
  note:'Ordered at the kiln but done out in the fortress by any hauler — no labour, no skill and no fuel. The dwarf walks to the nearest clay floor tile and back, so put the kiln near one. The tile is never used up: clay is renewable the way sand is.' },

{ id:'fire-earthenware', name:'Make earthenware goods', industry:'ceramics', workshop:'Kiln', skill:'Potter',
  needs:['fuel'], in:[{item:'Clay'}], out:[{item:'Earthenware'}],
  note:'Any generic clay soil — clay, silty clay, sandy clay or clay loam, all of which fire to the same ware. Worth 3, and porous: an earthenware jug or pot holds nothing at all until a glazer has been at it.' },

{ id:'fire-stoneware', name:'Make stoneware goods', industry:'ceramics', workshop:'Kiln', skill:'Potter',
  needs:['fuel'], in:[{item:'Fire clay'}], out:[{item:'Stoneware'}],
  note:'Fire clay is a soil type of its own and a fairly rare one. Same job, same kiln, same fuel — worth 4 rather than 3 if the embark happens to have it.' },

{ id:'fire-porcelain', name:'Make porcelain goods', industry:'ceramics', workshop:'Kiln', skill:'Potter',
  needs:['fuel'], in:[{item:'Kaolinite'}], out:[{item:'Porcelain'}],
  note:'Worth 10 — the same as iron, silver and crystal glass, off a job that needs no smelter and no ore. Kaolinite is mined rather than gathered, so this is the one ware a fortress can run out of.' },

{ id:'glaze', name:'Glaze a ceramic', industry:'ceramics', workshop:'Kiln', skill:'Glazer',
  needs:['fuel'], in:[{item:'Earthenware'},{item:'Stoneware'},{item:'Porcelain'},{item:'Ash'},{item:'Cassiterite'}],
  out:[{item:'Glazed ceramics'}],
  note:'One ceramic plus one glaze material: ash for 50☼, a cassiterite boulder for a tin glaze worth 100☼, both multiplied by the glazer’s quality. It also seals the pot, which is what makes earthenware fit to store booze. Stone containers, statues and crafts can be glazed too.' },

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

{ id:'quicklime', name:'Burn stone to quicklime', industry:'paper', workshop:'Kiln', skill:'Furnace operator',
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

/* ── Industry maps ───────────────────────────────────────────────
   Every industry is one view: the step list and the chain map drawn as the same
   picture. A flow names the jobs and nothing else — the layout works the order
   out from what each job eats and makes, so the map cannot drift away from the
   steps above it the way a hand-drawn diagram would.

   `wiki` is where the industry is written up on the official wiki, printed as
   the bare URL under the heading. This site says what makes what; anything it
   does not cover — exact yields, version differences, every edge case — lives
   there, so the page points at the source instead of paraphrasing it.

   `steps` may borrow a job from another industry, and most of them have to. An
   ash chain that stopped at the ashery's own jobs would begin and end in
   mid-air; a forge with no mine above it starts with ore nobody dug. A borrowed
   job carries the name of the industry it came from.

   `joins` folds one item name into another for the length of one map. The
   recipes are written at the altitude each industry needs and the two do not
   always meet: the loom eats "Thread" while five different jobs make a "…
   thread", the forge eats an "Iron bar" while the smelter makes "Metal bars".
   Renaming on the way in is what turns those into one node with wires into it
   rather than a row of orphans above a row of things nobody supplies. It is a
   display join and nothing else — the steps keep the names the game uses, and
   the joined name has to be an item the data already knows, or its node leads
   nowhere.

   `paths` are the chips over the map. Each is a main line through it — the jobs
   you queue to end up holding one thing — and picking it numbers those rungs
   1..n and fades the rest. The first path is what the page opens on and is
   normally the whole picture, which carries no step list of its own. A path may
   also override a step's `titles` and `notes`: "Grow a crop" is "Grow pig
   tails" on the pig tail line, and the season it wants is worth saying there
   and nowhere else. */
window.DF_INDUSTRY_FLOWS = {

  fuel: {
    wiki: ['https://dwarffortresswiki.org/index.php/Wood_industry',
           'https://dwarffortresswiki.org/index.php/Fuel_industry'],
    steps: ['fell-tree', 'make-charcoal', 'make-ash', 'coke-bituminous', 'coke-lignite',
            'carpenter', 'bowyer'],
    paths: [
      { id: 'all', label: 'Everything',
        blurb: 'Two ways to fuel a furnace and three other things to do with a log. Nothing here needs fuel to run except the coke jobs, which is the whole reason the wood furnace exists.' },

      { id: 'charcoal', label: 'Charcoal', tag: 'Fuel',
        steps: ['fell-tree', 'make-charcoal'],
        blurb: 'One log, one charcoal, and the wood furnace burns nothing to do it. Slow and wasteful of trees, but it is the only fuel a fortress with no coal and no magma can start from.' },

      { id: 'coke', label: 'Coke', tag: 'Fuel',
        steps: ['coke-bituminous'],
        blurb: 'Nine coke from one bituminous coal, less the one unit the smelter burns running the job — a net eight, or all nine at a magma smelter. Lignite gives five for the same work, so use it only if that is the coal your map has.' },

      { id: 'ash', label: 'Ash', tag: 'Soap & glass',
        steps: ['fell-tree', 'make-ash'],
        blurb: 'The other thing a wood furnace does with a log, and the head of the soap, potash, fertiliser and pearlash chains. Ash is worth burning trees for long after you have stopped needing charcoal.' },

      { id: 'wood', label: 'Barrels & buckets', tag: 'Containers',
        steps: ['fell-tree', 'carpenter'],
        blurb: 'The quiet bottleneck of half the fortress: no barrel, no booze; no bucket, no lye and no well. Put a standing order on the carpenter early and forget about it.' }
    ]
  },

  farming: {
    wiki: ['https://dwarffortresswiki.org/index.php/Farming'],
    steps: ['gather-plants', 'farm-plot', 'seeds-recovery', 'make-ash', 'make-potash-ash', 'fertilise'],
    paths: [
      { id: 'all', label: 'Everything',
        blurb: 'The dashed wire is the point of the whole industry: brewing, milling, threshing and eating raw all hand the seeds back, so a plot that started with five seeds keeps running forever. Cooking is the exception, and it is a permanent one.' },

      { id: 'grow', label: 'Grow a crop', tag: 'Start here',
        steps: ['gather-plants', 'farm-plot'],
        blurb: 'Seeds come off a caravan, out of a gatherer’s bag, or back from anything that processes a plant. After that a plot on muddy ground runs on its own.',
        notes: {
          'farm-plot': 'Underground plots need a muddy floor, and a soil layer already counts — dig into one and no irrigation is needed. Plump helmets grow in all four seasons and can be eaten raw, which makes them the crop to start with.'
        } },

      { id: 'seeds', label: 'Keep your seeds', tag: 'The loop',
        steps: ['farm-plot', 'seeds-recovery'],
        blurb: 'Eating raw, brewing, milling and threshing all return the seed. Cooking does not — a plant cooked into a meal takes its seeds with it, permanently. Never let a cook near the last of anything.' },

      { id: 'fertiliser', label: 'Fertiliser',
        steps: ['make-ash', 'make-potash-ash', 'fertilise'],
        blurb: 'Two jobs away from a log. Fertilising raises yields and is entirely optional, so it is for surface crops and for fields you are pushing rather than for the plump helmets that grow fine in plain mud.' }
    ]
  },

  food: {
    wiki: ['https://dwarffortresswiki.org/index.php/Food',
           'https://dwarffortresswiki.org/index.php/Alcohol'],
    steps: ['butcher', 'brew', 'mill', 'mill-paste', 'process-leaves', 'process-syrup',
            'process-salve', 'clean-fish', 'render-fat', 'press-oil', 'cook-meals'],
    /* The quern's output is written generically because one job grinds
       thirty-three plants; the kitchen names the two powders it cooks with.
       Joining them is what puts a wire between the two. */
    joins: { 'Cave wheat flour': 'Powder', 'Dwarven sugar': 'Powder' },
    paths: [
      { id: 'all', label: 'Everything',
        blurb: 'Almost every job here hands the seeds back, and almost every one wants an empty container first. The kitchen is the only building that consumes seeds outright.' },

      { id: 'booze', label: 'Booze', tag: 'Build this first',
        steps: ['brew'],
        blurb: 'One job, seventy-seven ingredients, one empty barrel each time. Dwarves work slower and get miserable without drink, and this is the shortest chain on the whole site — one plant, one Still, done.' },

      { id: 'flour', label: 'Flour & sugar',
        steps: ['mill'],
        blurb: 'The same job that grinds dyes for the loom. Every run needs an empty bag, and what comes out depends entirely on the plant that went in — cave wheat gives flour, sweet pods give sugar, dimple cups give dye.' },

      { id: 'oil', label: 'Oil', tag: 'Soap & cooking',
        steps: ['mill-paste', 'press-oil'],
        blurb: 'The one milling job that does not want a bag, and the only reason to build a screw press outside the paper industry. Oil is the plant half of the soap recipe as well as a cooking ingredient.' },

      { id: 'meals', label: 'Meals', tag: 'Kitchen',
        steps: ['butcher', 'render-fat', 'cook-meals'],
        blurb: 'Easy meals take two ingredients, fine three, lavish four, and the value follows both the ingredients and the cook. Variety matters more than quantity — dwarves tire of eating the same thing.' }
    ]
  },

  textiles: {
    wiki: ['https://dwarffortresswiki.org/index.php/Textile_industry'],
    steps: ['mill', 'process-thread', 'shear', 'spin', 'collect-webs', 'extract-strands',
            'weave', 'dye-thread', 'clothier', 'cloth-crafts', 'embroider'],
    /* The loom takes "Thread" whatever made it, so every job that makes one
       feeds the same node — which is the shape of the industry: six routes in,
       one building, one route out. Hair thread is deliberately left out of the
       join, because a loom will not take it. What the quern is here for is dye,
       not flour, so its generic Powder is named for the use this map has. */
    joins: {
      'Plant fiber thread': 'Thread', 'Yarn thread': 'Thread',
      'Silk thread': 'Thread', 'Adamantine strands': 'Thread',
      'Powder': 'Dye'
    },
    paths: [
      { id: 'all', label: 'Everything',
        blurb: 'Six jobs make thread and one weaves it, which is why the map narrows to a single node in the middle. Everything above that node is a choice about what you have; everything below it is a choice about what it is worth.' },

      { id: 'plant', label: 'Plant fibre',
        steps: ['process-thread', 'weave', 'clothier'],
        blurb: 'Pig tail underground, or rope reed, hemp, flax, cotton, kenaf, jute and ramie above it. One job threshes all eight and the thread is worth the same whichever it was — what differs is the season and the ground it needs.',
        notes: {
          'clothier': 'One unit of cloth, one garment, whatever its size — so make the expensive ones. A robe is worth 33 before anything else is counted and a thong 5. Shoes, socks, gloves and mittens come out two at a time from that same one unit.'
        } },

      { id: 'wool', label: 'Wool',
        steps: ['shear', 'spin', 'weave', 'clothier'],
        blurb: 'No farm plot, no seeds and no season — just sheep, llamas or alpacas, once every 300 days each. Wool is the one fibre that needs spinning before a loom will look at it.' },

      { id: 'silk', label: 'Silk',
        steps: ['collect-webs', 'weave', 'clothier'],
        blurb: 'Web is already thread by the time it reaches the loom, so this is the shortest route to cloth in the game. Vermin silk is free and worth little; giant cave spider silk is worth twenty-four a length and is collected in the caverns, at real risk.',
        notes: {
          'collect-webs': 'An idle loom queues this by itself. Cats hunt vermin spiders to extinction, so shut them away if you want the free silk — and set standing orders to ignore webs until the cavern is cleared, or a gatherer will walk into it alone.'
        } },

      { id: 'adamantine', label: 'Adamantine', tag: 'The expensive one',
        steps: ['extract-strands', 'weave', 'clothier'],
        blurb: 'The loom treats strands like any other thread. What comes off it is worth about 150 times pig tail cloth — and wears out just as fast, which is why almost everybody smelts the strands into wafers instead.' },

      { id: 'dye', label: 'Dye', tag: 'Where the value is',
        steps: ['mill', 'dye-thread'],
        blurb: 'The biggest single lever on what a garment is worth: a masterful dyer adds 240☼ where a poor one adds 20. Dye the thread before the loom or the cloth after — both work, and neither can be undone, because dyed things cannot be redyed.',
        notes: {
          'mill': 'Dimple cups grow underground in all four seasons and give the most valuable dye in the game, tied with emerald and sliver. One plant makes one unit of dye, which colours one unit of thread or cloth, and the whole stack lands in a single bag.'
        } }
    ]
  },

  metal: {
    wiki: ['https://dwarffortresswiki.org/index.php/Metal_industry'],
    steps: ['mine', 'smelt-ore', 'make-alloy', 'extract-strands', 'adamantine-wafer', 'forge'],
    /* The forge names the seven bars it will take; the smelter makes "Metal
       bars" and the alloy job "Alloy bars". Folding the named bars back into
       the two nodes that actually produce them is what closes the gap between
       the anvil and the furnace feeding it. */
    joins: {
      'Iron bar': 'Metal bars', 'Copper bar': 'Metal bars',
      'Gold bar': 'Metal bars', 'Silver bar': 'Metal bars',
      'Steel bar': 'Alloy bars', 'Bronze bar': 'Alloy bars'
    },
    paths: [
      { id: 'all', label: 'Everything',
        blurb: 'One mine, one smelter and one forge, with adamantine running down the side on its own track. The fuel every furnace here burns is not on this map — it comes off the wood and coal chain.' },

      { id: 'bars', label: 'Bars', tag: 'Start here',
        steps: ['mine', 'smelt-ore'],
        blurb: 'Seventeen ores, and several of them give a second metal as a bonus. Check what your map has before planning anything downstream — a fortress with no iron and no flux is not making steel however many smelters it builds.' },

      { id: 'steel', label: 'Steel', tag: 'Weapons-grade',
        steps: ['mine', 'smelt-ore', 'make-alloy'],
        blurb: 'Iron, pig iron, flux and fuel, twice over. It is the best armour material a fortress can mass-produce, and the flux stone it needs is limestone, dolomite, chalk, calcite or marble — the same stones the kiln wants for quicklime.' },

      { id: 'goods', label: 'Weapons & armour',
        steps: ['mine', 'smelt-ore', 'forge'],
        blurb: 'One anvil, six labours and fourteen categories of product. What a piece is worth follows the metal underneath it and the smith swinging the hammer, in that order.' },

      { id: 'adamantine', label: 'Adamantine', tag: 'If you find it',
        steps: ['extract-strands', 'adamantine-wafer', 'forge'],
        blurb: 'Raw adamantine is useless as mined. Strands are extracted at a craftsdwarf’s workshop and then melted into wafers at a smelter — the loom is the other option, and almost nobody takes it.' }
    ]
  },

  soap: {
    wiki: ['https://dwarffortresswiki.org/index.php/Soap',
           'https://dwarffortresswiki.org/index.php/Ash',
           'https://dwarffortresswiki.org/index.php/Lye'],
    steps: ['make-ash', 'make-lye', 'make-potash-ash', 'make-potash-lye',
            'make-soap', 'make-pearlash', 'fertilise'],
    paths: [
      { id: 'all', label: 'Everything',
        blurb: 'Every job the ash chain can run. Ash splits three ways at the ashery, and lye splits again at the soap maker’s — nothing below the wood furnace is compulsory.' },

      { id: 'soap', label: 'Soap', tag: 'Hospital',
        steps: ['make-ash', 'make-lye', 'make-soap'],
        blurb: 'The short line the industry is named for. Keep a bucket free for the ashery and any fat in reach of the soap maker — wounds washed with soap get infected far less often.' },

      { id: 'potash', label: 'Potash', tag: 'Fertiliser',
        steps: ['make-ash', 'make-potash-ash', 'fertilise'],
        blurb: 'Ash straight to potash, no bucket and no lye in the way. Fertilising is entirely optional — plump helmets grow perfectly well in plain mud — so this line is for surface crops and for fields you are pushing.' },

      { id: 'pearlash', label: 'Pearlash', tag: 'Clear glass',
        steps: ['make-ash', 'make-potash-ash', 'make-pearlash'],
        blurb: 'The same potash, fired again at a kiln. Pearlash exists almost entirely to turn green glass into clear, and the kiln burns a unit of fuel doing it unless it stands over magma.' }
    ]
  },

  animal: {
    wiki: ['https://dwarffortresswiki.org/index.php/Meat_industry'],
    steps: ['butcher', 'milk', 'tan', 'cheese', 'geld', 'bonecarve', 'leatherworks', 'parchment'],
    paths: [
      { id: 'all', label: 'Everything',
        blurb: 'The butcher’s shop is the head of five separate chains at once, which is why everything below it fans out. A raw hide rots if it is not tanned, so put the tanner’s shop next to the butcher and link them.' },

      { id: 'leather', label: 'Leather',
        steps: ['butcher', 'tan', 'leatherworks'],
        blurb: 'Tan the hide before it rots. Leather armour is the cheapest armour worth wearing and the leather works also makes the backpacks and waterskins a squad needs before it can leave the fortress.' },

      { id: 'meat', label: 'Meat & fat', tag: 'Kitchen',
        steps: ['butcher'],
        blurb: 'One job, and what comes off depends entirely on the animal. Fat is the half of this that matters longest — rendered into tallow it feeds both the kitchen and the soap maker.' },

      { id: 'bone', label: 'Bone & shell',
        steps: ['butcher', 'bonecarve'],
        blurb: 'Free crossbow ammunition and free trade goods out of what would otherwise rot. Bone bolts are as good as wooden ones and cost a job nobody else is queuing for.' },

      { id: 'dairy', label: 'Milk & cheese',
        steps: ['milk', 'cheese'],
        blurb: 'Renewable food from an animal you do not have to kill, at the cost of an empty bucket each time. Both jobs run at the farmer’s workshop.' },

      { id: 'geld', label: 'Gelding', tag: 'Catsplosion',
        steps: ['geld'],
        blurb: 'The other thing the farmer’s workshop does to an animal, and the only one that leaves it alive. Flag the males on the Pets/Livestock tab before the cats and the dogs have done the arithmetic for you — one geld job per workshop at a time, so a fortress that has already lost the race wants several.' },

      { id: 'parchment', label: 'Parchment', tag: 'Books',
        steps: ['butcher', 'parchment'],
        blurb: 'One hide, one sheet, whatever the animal’s size — so use the small ones. The milk of lime it needs comes off the quicklime chain in the paper industry.' }
    ]
  },

  stone: {
    wiki: ['https://dwarffortresswiki.org/index.php/Stone',
           'https://dwarffortresswiki.org/index.php/Gem_industry'],
    steps: ['mine', 'mason', 'stonecraft', 'mechanisms', 'cut-gem', 'encrust'],
    paths: [
      { id: 'all', label: 'Everything',
        blurb: 'One dwarf with a pick feeds four workshops. Nothing on this map burns fuel and nothing waits on a container, which is why stone is what a young fortress builds out of — the gems are the only part of it that needs something the map had to have put there.' },

      { id: 'blocks', label: 'Stone goods', tag: 'Furniture',
        steps: ['mine', 'mason'],
        blurb: 'Blocks build faster and prettier than raw boulders and one stone makes four of them. A mason’s workshop next to the stockpile is usually the second workshop a fortress builds.' },

      { id: 'mech', label: 'Mechanisms', tag: 'Levers & traps',
        steps: ['mine', 'mechanisms'],
        blurb: 'Any stone will do. Levers, bridges, traps and the screw press all want them, and every one of those is two mechanisms rather than one — keep a standing order running.' },

      { id: 'gems', label: 'Gems',
        steps: ['mine', 'cut-gem', 'encrust'],
        blurb: 'Rough gems come out of the walls wherever the map put them. Cutting multiplies what they are worth; encrusting moves that value onto something a noble will look at.' },
    ]
  },

  ceramics: {
    wiki: ['https://dwarffortresswiki.org/index.php/Ceramic_industry',
           'https://dwarffortresswiki.org/index.php/Clay',
           'https://dwarffortresswiki.org/index.php/Glazing'],
    steps: ['collect-clay', 'fire-earthenware', 'fire-stoneware', 'fire-porcelain', 'glaze'],
    paths: [
      { id: 'all', label: 'Everything',
        blurb: 'One building does all five jobs. The three firings are the same job over three different raw materials, so the whole industry is really one question — which clay does the map have — and one afterthought, which is whether to glaze what comes out.' },

      { id: 'earthenware', label: 'Earthenware', tag: 'Renewable',
        steps: ['collect-clay', 'fire-earthenware'],
        blurb: 'The route almost every fortress takes. Clay soil is renewable and the gathering job needs no skill and no fuel, so the only cost is the unit of fuel the firing burns — and none at all at a magma kiln. Worth 3 a unit, which is the same as most stone.' },

      { id: 'stoneware', label: 'Stoneware',
        steps: ['collect-clay', 'fire-stoneware'],
        blurb: 'Identical work for a third more value, and entirely out of your hands: fire clay is its own soil type and a rare one. Check the embark, take it if it is there, and do not plan a fortress around it.' },

      { id: 'porcelain', label: 'Porcelain', tag: 'Worth 10',
        steps: ['fire-porcelain'],
        blurb: 'Kaolinite comes out of the wall rather than off the floor, so this is the one ware that runs out. Worth 10 — iron, silver and crystal glass — from a job with no smelter, no ore and no flux anywhere behind it, which makes a kaolinite layer one of the better things an embark can be hiding.' },

      { id: 'glaze', label: 'Glazing', tag: 'Watertight',
        steps: ['collect-clay', 'fire-earthenware', 'glaze'],
        blurb: 'A second firing over a finished ceramic. Ash adds 50☼ and a cassiterite boulder adds 100☼, both multiplied by the glazer — but the reason to run it is that unglazed earthenware is porous, so until a glazer has been at them your jugs and large pots will not hold a drop.' }
    ]
  },

  glass: {
    wiki: ['https://dwarffortresswiki.org/index.php/Glass_industry'],
    steps: ['collect-sand', 'make-pearlash', 'green-glass', 'clear-glass',
            'crystal-glass', 'glass-goods'],
    paths: [
      { id: 'all', label: 'Everything',
        blurb: 'Every job at the glass furnace burns a unit of fuel unless the furnace stands over magma, and every bag of sand needs an empty bag first. Those two constraints are the whole difficulty of the industry.' },

      { id: 'green', label: 'Green glass', tag: 'Start here',
        steps: ['collect-sand', 'green-glass'],
        blurb: 'Sand and nothing else. Green glass is worth about as much as stone, but it is unlimited on a sandy map and it needs no mine, no ore and no flux.' },

      { id: 'clear', label: 'Clear glass',
        steps: ['make-pearlash', 'collect-sand', 'clear-glass'],
        blurb: 'The same sand plus a unit of pearlash, which the ash chain makes at a kiln. Ten times the value of green glass for one extra ingredient — this is what the whole potash chain exists to feed.' },

      { id: 'crystal', label: 'Crystal glass', tag: 'If you have the crystal',
        steps: ['make-pearlash', 'crystal-glass'],
        blurb: 'Pearlash and rough rock crystal, and no sand at all. Cut crystals bought from a caravan will not do. About the value of silver, if your map has the crystal in it.' },

      { id: 'goods', label: 'Furniture & blocks',
        steps: ['collect-sand', 'glass-goods'],
        blurb: 'Windows, blocks, furniture and the serrated discs a weapon trap wants. All of it from the same bag of sand, and none of it needing a single bar of metal.' }
    ]
  },

  paper: {
    wiki: ['https://dwarffortresswiki.org/index.php/Paper_industry'],
    steps: ['make-slurry', 'press-paper', 'papyrus-sheet', 'quicklime', 'milk-of-lime',
            'parchment', 'binding', 'quire', 'scroll', 'write', 'codex'],
    /* Slurry lists four cloth plants and threshing lists the crop generically,
       but all eight work at either job — so the map says so once. */
    joins: {
      'Pig tail': 'Fibre crop', 'Rope reed': 'Fibre crop',
      'Hemp': 'Fibre crop', 'Flax': 'Fibre crop'
    },
    paths: [
      { id: 'all', label: 'Everything',
        blurb: 'Three separate chains converge on a sheet, and from there the two forms a book can take split apart again. Paper and parchment are interchangeable from the sheet down, so pick the one whose materials you have.' },

      { id: 'fibre', label: 'Paper from plants',
        steps: ['make-slurry', 'press-paper', 'quire'],
        blurb: 'The long way to a sheet and the one most fortresses use, because it needs nothing but a cloth plant. The screw press costs two mechanisms to build and is the only other thing that wants one.',
        notes: {
          'make-slurry': 'Any cloth plant works — rope reed and pig tail underground, hemp, flax, cotton, ramie, jute and kenaf on the surface. The job wants an empty bucket, not a bag.'
        } },

      { id: 'papyrus', label: 'Papyrus', tag: 'One job',
        steps: ['papyrus-sheet', 'quire'],
        blurb: 'Papyrus sedge is a surface plant and the only material that becomes a sheet in a single job — no quern, no press and no bucket in the way. Get the seeds off a caravan.' },

      { id: 'parchment', label: 'Parchment',
        steps: ['quicklime', 'milk-of-lime', 'parchment', 'quire'],
        blurb: 'Three jobs across three buildings before you have a sheet, and the only route that needs an animal. One hide makes one sheet whatever the animal’s size, so butcher the small ones for this.',
        notes: {
          'quicklime': 'Calcite, chalk, limestone or marble, one bag per unit — and every one of them is also flux. Steel is almost always the better thing to do with them.',
          'milk-of-lime': 'Quicklime slaked in a bucket at the ashery. Its sole use is turning a hide into parchment.'
        } },

      { id: 'scroll', label: 'Scroll', tag: 'Finished at the bench',
        steps: ['papyrus-sheet', 'binding', 'scroll', 'write'],
        blurb: 'A sheet wound onto a roller. The simpler of the two forms and the only one finished the moment it leaves the workshop — but a scroll can never become a codex.',
        titles: { 'binding': 'Make a scroll roller' },
        notes: {
          'binding': 'Wood or stone here, metal at the forge, glass at the glass furnace. One roller per scroll, so make it before you queue the scroll.',
          'write': 'The scroll is a finished item without this. Writing on it is what makes it worth reading — and worth a visiting scholar’s trip.'
        } },

      { id: 'codex', label: 'Codex', tag: 'Bound book',
        steps: ['make-slurry', 'press-paper', 'quire', 'write', 'binding', 'codex'],
        blurb: 'The long way round: a sheet, a quire, a scholar to fill it, and then a binding and a length of thread to hold the whole thing shut. Two of those feed the last step sideways, so start them early.',
        titles: { 'binding': 'Make a book binding' },
        notes: {
          'write': 'Not a job you queue: assign a scholar or a scribe to a library and the quire fills itself. An empty quire will not take a binding.',
          'binding': 'Wood or stone here, metal at the forge, glass at the glass furnace. One binding per codex.',
          'codex': 'The thread can be any unused length — plant thread, spun yarn, silk off a web, even animal hair, which is good for nothing else. Binding currently throws away part of what the quire was worth, so a fortress chasing wealth stops at the quire.'
        } }
    ]
  }
};

/* Extra colour for individual items shown in the detail panel. */
window.DF_ITEM_NOTES = {
  'Thread': 'One item of thread, one item of cloth at the loom — except hair thread, which a loom will not take at all. Thread can be dyed before weaving, and the colour carries through into the cloth. A codex takes one length of any thread, animal hair included.',
  'Cloth': 'One thread woven, one cloth. It is also the only thing a hospital will accept as a wound dressing, so keep a few units out of the clothier’s reach.',
  'Plant fiber thread': 'The output of Process Plants, whichever of the eight fibre crops went in. Worth 12☼ — twice wool, twice ordinary silk, half giant cave spider silk.',
  'Wool': 'Sheared off sheep, llamas and alpacas once every 300 days, or taken from butchering them. It has to be spun into yarn before a loom will look at it.',
  'Yarn thread': 'Spun wool. Worth half what plant fibre is, but it costs no farm plot, no seeds and no season.',
  'Hair thread': 'Spun from the hair of butchered horses, yaks and grizzly bears. No loom will weave it, so it never becomes cloth — its uses are suturing in the hospital and binding a codex.',
  'Animal hair': 'A butchery by-product. It spins into thread and no further; rarer animals give more valuable hair.',
  'Silk thread': 'Web picked up off the floor, already thread by the time it reaches the loom. Vermin spider silk is worth 6☼; giant cave spider silk is worth 24☼ and costs rather more to collect.',
  'Spider web': 'Left around the fortress by vermin spiders, or in the caverns by the giant sort. An idle loom queues Collect Webs by itself. Cats hunt the vermin spiders to extinction, so shut them away if you want the silk.',
  'Adamantine strands': 'Extracted from raw adamantine at a craftsdwarf’s workshop. Thread, technically — a loom will weave it — but almost everybody smelts it into wafers instead.',
  'Dye': 'One unit colours one unit of thread or cloth. Four come off a quern; the other sixty-eight come from leaves, bark, husks and skins at other jobs. Dyed things cannot be redyed.',
  'Dyed cloth': 'Dyeing adds the dye’s own value multiplied by the dyer’s quality — 20☼ from a poor dyer, 240☼ from a masterful one. That is more than most upgrades in material are worth.',
  'Clothing': 'Wears out one level every ten years while worn. Dwarves replace their own if replacements exist; if they do not, XXtatteredXX clothes and bare feet stack unhappy thoughts until the fortress tantrums.',
  'Robe': 'The most valuable cloth garment in the game at a base 33, and it costs exactly one unit of cloth — the same as a thong at 5.',
  'Cloth crafts': 'Cloth at the craftsdwarf’s workshop. A trade good, and usually a waste of the cloth.',
  'Fibre crop': 'Pig tail, rope reed, hemp, flax, cotton, kenaf, jute or ramie. One job threshes all eight, and the thread is worth the same whichever it was.',
  'Shearable animal': 'Sheep, llamas and alpacas — once every 300 days each. Trolls are woolly too, but only goblins can shear them.',
  'Fuel': 'Any unit of charcoal or coke. Magma-powered furnaces (smelter, forge, glass furnace, kiln) need no fuel at all, which is why fortresses chase magma.',
  'Flux stone': 'Limestone, dolomite, chalk, calcite or marble. Required for pig iron and steel, and for nothing else.',
  'Charcoal': 'One log, one charcoal. Slow but always available.',
  'Coke': 'Made from coal at the smelter. Far more efficient than charcoal, and it saves your trees from elven complaints.',
  'Plump helmet': 'Grows quickly underground, can be eaten raw, brewed into wine or milled. The single most useful plant in the game.',
  'Gelded animal': 'Alive, still worth butchering later, and no longer capable of adding to the population. Gelding does not touch an animal’s milk, wool or meat — it only stops the breeding.',
  'Valley herb': 'A surface plant, gathered rather than grown — it has no seeds, so a farm plot will never give you one. It grows only in temperate grassland and only in spring, which is why the reliable supply is the elven and human caravans, who bring it in stacks of five.',
  'Golden salve': 'An extract, and a pure trade good — nothing in the fortress uses it. 100☼ a unit, five units per herb, and the whole stack processed goes into one vial, so a bought stack of five is 2,500☼. Look inside the vials when you are hauling to the depot: the container is what gets moved, and it does not say what is in it.',
  'Rock nut': 'The quarry bush’s seed, and the only one of the six cave crops whose seed is worth a job of its own: milled to paste, then pressed for oil and a press cake. Keep enough back to replant — ground rock nuts do not grow quarry bushes.',
  'Sweet pod': 'Brews into rum, mills into sugar, or presses into syrup at the farmer’s workshop.',
  'Ash': 'The root of soap, potash, fertiliser and pearlash. Made only from logs at a wood furnace.',
  'Soap': 'Stock the hospital with it. Wounds washed with soap get infected far less often.',
  'Steel bar': 'Iron + pig iron + flux + fuel. The best non-artefact armour material a fortress can mass-produce.',
  'Mechanism': 'Made from any stone. Needed for levers, traps, bridges, and to build a screw press.',
  'Rock pot': 'A stone substitute for a wooden barrel. Holds drinks, syrup and other liquids.',
  'Jug': 'Carved from stone at the craftsdwarf’s workshop. The screw press will not make oil without one.',
  'Clay soil': 'Clay, silty clay, sandy clay, clay loam or fire clay — a floor tile in a soil layer, not a boulder. Gathering never uses the tile up, so a fortress standing on clay has an endless supply of it.',
  'Clay': 'One gathered unit, and the input to one firing. Generic clay fires to earthenware; it is the fire clay variety that fires to stoneware.',
  'Fire clay': 'A soil type of its own and an uncommon one. It fires to stoneware — the same job and the same fuel as earthenware, for a third more value.',
  'Kaolinite': 'A stone, mined out of the wall rather than gathered off the floor, and the only thing porcelain can be made from. Finite, unlike the clays: when the layer is gone the porcelain stops.',
  'Earthenware': 'Worth 3, and porous. Jugs and large pots fired from it hold nothing until a glazer has sealed them — which is the one thing every fortress actually needs a glazer for.',
  'Stoneware': 'Worth 4 and watertight as fired. The only thing standing between you and it is whether the embark has fire clay.',
  'Porcelain': 'Worth 10 — iron, silver and crystal glass — out of a kiln with no ore, no flux and no smelter behind it. Fire-safe but not magma-safe.',
  'Glazed ceramics': 'Ash glaze adds 50☼, tin glaze from cassiterite adds 100☼, both multiplied by the glazer’s quality. The value is the smaller half of it: glazing is what makes an earthenware container hold liquid.',
  'Cassiterite': 'Tin ore at a smelter, tin glaze at a kiln. The kiln takes the boulder whole — no smelting first.',
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
  'Codex': 'A written quire, bound with thread and a binding. Binding currently discards part of what the quire was worth, so a fortress chasing wealth leaves the work in quire form.'
};
