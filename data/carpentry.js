/* The carpenter's workshop, from
   https://dwarffortresswiki.org/index.php/Carpenter%27s_workshop

   Thirty-six jobs off one log, and thirty-six job cards saying "1 log in, one
   thing out" would say nothing thirty-six times. So this follows the Still, the
   quern, the loom, the dyer's shop and the forge: data/recipes.js carries one
   generic Carpentry step and the real list lives here for the workshop's own
   page to turn into a picker.

   Like the forge, the picker assembles its rows from more than one file and
   this table is only the part nobody else owns. The three wooden trap
   components and the three training weapons belong to data/weapons.js, and the
   wooden shield and buckler to data/armor.js — every one of them already
   carries attack numbers or block chances that this file has no business
   repeating, so the picker reads them out of there: every weapon whose `made`
   list names this building, every wearable whose `mats` include W, and
   everything else from here.

   Every job in this building costs exactly one log and gives one item back.
   The single exception is blocks, four to the log, so `per` is written only
   where it is not one and app.js assumes one everywhere else. Nothing here
   burns fuel, needs a container, or wants a second material — which is the
   whole reason a fortress can run on wood before it can run on anything else.

   `cat` is what the thing is and `use` is where it ends up; they are the
   picker's two facets. `cat` follows the build menu's own shelves as far as the
   menu has them and this site's judgement after that — the game does not
   publish a production list for this workshop the way the wiki does for the
   forge, so the grouping is a reading aid rather than the game's own words.
   `use` is squarely this site talking: "what do I build for a bedroom" is the
   question people actually arrive with.

   `labour` is written only where it is not Carpentry. There is exactly one such
   job — the animal trap wants Trapping — and it is the answer to "why is
   nobody working in there with the job standing right in the queue".

   `magma` marks the jobs where wood being wood decides something: the plumbing
   and the constructions. Everything in this building burns, but it only costs
   you a fortress on the pieces that were supposed to hold magma back.

   `same` is the name the same item goes by elsewhere in the data, so the
   cross-link to the forge can find it: a wooden casket and a metal coffin are
   one item type under two names.

   `woodOnly` is the opposite fact — no other building makes this at all. It is
   true of exactly one thing here, and it is the reason the first carpenter you
   assign never gets a day off. */

window.DF_CARPENTRY = [

/* ── Furniture ────────────────────────────────────────────────── */

{ name: 'Bed', cat: 'Furniture', use: 'Bedroom', woodOnly: true,
  note: 'Wood and nothing else — a bed of metal, stone or bone exists only as an artifact out of a strange mood. A dwarf without one sleeps on the floor and takes an unhappy thought for it, which is why this job and the barrels are what a new fortress queues first.' },

{ name: 'Cabinet', cat: 'Furniture', use: 'Bedroom',
  note: 'A bed, a cabinet and a chest is what a dwarf asks a bedroom for. The cabinet is the half that holds their clothes.' },

{ name: 'Chest', cat: 'Furniture', use: 'Bedroom',
  note: 'The other half: where a dwarf keeps everything they own that is not clothing. Cheap enough that there is no reason to furnish a room without one.' },

{ name: 'Chair', cat: 'Furniture', use: 'Dining & offices',
  note: 'A chair next to a table is a dining spot, and a noble’s office needs one of each before they will stop complaining about the lack of it. Fifty dwarves eating standing up is fifty small unhappy thoughts a season.' },

{ name: 'Table', cat: 'Furniture', use: 'Dining & offices',
  note: 'Dining rooms, offices — and the hospital, where a table is what the surgeon operates on. That is the one place a table is doing something other than decorating the room.' },

{ name: 'Bookcase', cat: 'Furniture', use: 'Library & museum',
  note: 'Holds books and scrolls in a library. The quires come off a craftsdwarf’s workshop and the scribes fill them; this is where they end up, and where visiting scholars come to read them.' },

{ name: 'Display case', cat: 'Furniture', use: 'Library & museum',
  note: 'Puts an item on show in a museum location, where your own dwarves and every visitor will come to look at it. Artifacts sitting in a finished-goods stockpile impress nobody.' },

{ name: 'Pedestal', cat: 'Furniture', use: 'Library & museum',
  note: 'Displays a single item, usually an artifact. Some of the visitors admiring it are casing the place — a pedestal behind a locked door is the difference between a museum and a gift.' },

{ name: 'Altar', cat: 'Furniture', use: 'Temple & tomb',
  note: 'Temple furniture. Dedicate the location to a deity and the altar is what the worshippers come to; priests, prophets and the odd pilgrim follow from there.' },

{ name: 'Casket', cat: 'Furniture', use: 'Temple & tomb', same: 'Coffin',
  note: 'Build it, assign it as a burial receptacle, and a dead dwarf gets a grave instead of lying in the hallway upsetting everyone who walks past. The forge’s list calls the same item a coffin.' },

{ name: 'Armor stand', cat: 'Furniture', use: 'Barracks',
  note: 'Barracks furniture: a squad stationed there stores its kit on it rather than leaving it on the floor. Training itself needs the barracks, not the stand.' },

{ name: 'Weapon rack', cat: 'Furniture', use: 'Barracks',
  note: 'The other half of a furnished barracks, and the same story — it holds weapons, it does not train anybody.' },

/* ── Containers ───────────────────────────────────────────────── */

{ name: 'Barrel', cat: 'Containers', use: 'Stockpiles & hauling',
  note: 'Every brewing job needs an empty one standing by, and drink, food, dye and lye all live in them. A craftsdwarf’s rock pot does the same work out of stone, which is what you fall back on when the map has no trees.' },

{ name: 'Bin', cat: 'Containers', use: 'Stockpiles & hauling',
  note: 'The stockpile container for everything that is not food: bars, blocks, cloth, leather, crafts, ammunition. A trade depot loaded without bins takes several times as long, and the caravan does not wait forever.' },

{ name: 'Bucket', cat: 'Containers', use: 'Water & machinery',
  note: 'A well needs one, the ashery needs an empty one for every unit of lye it makes, and the hospital needs a pile of them to bring water to the injured. Cheap, and somehow always short.' },

{ name: 'Cage', cat: 'Containers', use: 'Animals & traps',
  note: 'A cage trap is a cage and a mechanism, and the cage is where whatever walked into it stays until you decide otherwise. Wood is fine for a goblin and a poor choice for anything that breathes fire.' },

/* ── Building parts ───────────────────────────────────────────── */

{ name: 'Door', cat: 'Building parts', use: 'Constructions', magma: true,
  note: 'Can be locked, forbidden, or left pet-passable. Building destroyers smash doors whatever they are made of, so the lock buys you time rather than safety — and a wooden one burns.' },

{ name: 'Hatch cover', cat: 'Building parts', use: 'Constructions', magma: true,
  note: 'A door for a hole in the floor. Locked over a stairwell it stops climbers coming up out of the caverns and flyers coming down from the sky.' },

{ name: 'Floodgate', cat: 'Building parts', use: 'Water & machinery', magma: true,
  note: 'Linked to a lever or a pressure plate, it holds water back until you want it somewhere else. A wooden one is for water only: magma wants every piece magma-safe, and wood is not.' },

{ name: 'Grate', cat: 'Building parts', use: 'Water & machinery', magma: true,
  note: 'Passes water and stops what is swimming in it — over a channel, across an intake, or set in a wall. Same rule as the floodgate: wood for water, stone or the right metal for magma.' },

{ name: 'Pipe section', cat: 'Building parts', use: 'Water & machinery', magma: true,
  note: 'One of the three pieces of a screw pump, with an enormous corkscrew and a block — and this workshop makes all three, so a water pump can be built without quarrying a single stone. A magma pump cannot: every piece of it has to be magma-safe.' },

{ name: 'Blocks', cat: 'Building parts', use: 'Constructions', per: 4, magma: true,
  note: 'Four blocks from one log, the best return in the building. Constructions of blocks go up faster and are worth more than the same wall raised from logs, and wells, screw pumps and asheries will not take anything else. They are still wood: they burn, and they will not hold magma.' },

/* ── Tools ────────────────────────────────────────────────────── */

{ name: 'Minecart', cat: 'Tools', use: 'Stockpiles & hauling',
  note: 'Holds 500,000 cm³ — ten logs, or five hundred prepared meals, five times what a wheelbarrow carries — and hauls a route on its own once the track is laid. The forge’s metal one costs two bars and carries exactly the same.' },

{ name: 'Wheelbarrow', cat: 'Tools', use: 'Stockpiles & hauling',
  note: 'A hauler carrying anything of 75 Γ or more crawls unless it goes in a wheelbarrow. Assign three to the stone stockpile and the fortress stops looking like it is wading.' },

{ name: 'Stepladder', cat: 'Tools', use: 'Gathering',
  note: 'A plant gatherer cannot reach fruit in a tree canopy without one. No stepladders, no picked fruit, however many trees the map gave you.' },

{ name: 'Animal trap', cat: 'Tools', use: 'Animals & traps', labour: 'Trapper',
  note: 'The one job in this building Carpentry will not do — it wants Trapping, which is why the workshop can sit idle with the job standing right there in the queue. Baited with meat or fish, it catches vermin.' },

{ name: 'Crutch', cat: 'Tools', use: 'Hospital',
  note: 'A dwarf whose leg never set straight walks on one instead of crawling. Stock the hospital before you need it, not after.' },

{ name: 'Splint', cat: 'Tools', use: 'Hospital',
  note: 'What a bone doctor puts on a fracture. A hospital with no splints leaves the break to set however it likes.' }

];
