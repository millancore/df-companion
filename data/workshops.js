/* Workshop metadata and artwork.
   Every icon is inline SVG on a 32×32 grid, drawn with currentColor strokes so it
   inherits the page theme. Shapes marked class="ac" get the accent fill (flames,
   grain, gems). Nothing is loaded from the network.

   `box` is the artwork's measured bounding box, so every icon fills its frame
   instead of floating small inside a nominal 32x32. `sw` is the stroke width
   scaled to that frame, which keeps the rendered line weight identical across
   the set. Both are derived from the art — if you redraw an icon, re-measure it
   with getBBox() rather than guessing. */

window.DF_WORKSHOPS = {

/* ── Furnaces: all of these burn a unit of fuel unless built over magma ── */

'Smelter': { kind: 'furnace', box: '3.6 4.6 24.8 23.8', sw: 1.32,
  note: 'Ore into bars, coal into coke, bars into alloys. The single busiest building in a metal fortress.',
  art: `<path d="M5 27V12h18v15z"/><path d="M23 12V6h4v6"/>
        <path d="M10 27v-7a4 4 0 0 1 8 0v7"/>
        <path d="M14 25c-2.5-2-.5-4.5 0-6 1.5 2.5 4 3 0 6z" class="ac"/>` },

'Wood Furnace': { kind: 'furnace', box: '3.6 4.6 24.8 23.8', sw: 1.32,
  note: 'Logs into charcoal or ash. Burns no fuel itself, which makes it the bootstrap for every other furnace.',
  art: `<path d="M5 27V12h18v15z"/><path d="M23 12V6h4v6"/>
        <path d="M10 27v-7a4 4 0 0 1 8 0v7"/>
        <circle cx="14" cy="22.5" r="2.6" class="ac"/><circle cx="14" cy="22.5" r="1"/>` },

'Glass Furnace': { kind: 'furnace', box: '2.6 7.6 28.9 20.8', sw: 1.54,
  note: 'Sand into green glass; add pearlash for clear. On a sandy map this replaces the whole metal industry.',
  art: `<path d="M4 27V14h14v13z"/><path d="M8 27v-5h6v5"/><path d="M14 14V9h3v5"/>
        <path d="M18.5 20.5 24 16.5"/><circle cx="26.5" cy="14" r="3.6" class="ac"/>` },

'Kiln': { kind: 'furnace', box: '2.6 5.6 26.8 22.8', sw: 1.42,
  note: 'Fires clay into ceramics and potash into pearlash.',
  art: `<path d="M4 27h24"/><path d="M6 27V17a10 10 0 0 1 20 0v10"/>
        <path d="M12 27v-5a4 4 0 0 1 8 0v5"/>
        <path d="M16 25c-2.2-1.8-.4-4 0-5.4 1.4 2.2 3.6 2.7 0 5.4z" class="ac"/>` },

/* ── Food & drink ── */

'Still': { kind: 'workshop', box: '7.1 2.6 22.4 26.4', sw: 1.4,
  note: 'Plants into booze. Every job here needs an empty barrel or rock pot standing by.',
  art: `<path d="M10 8h12c2 4 2 12 0 16H10c-2-4-2-12 0-16z"/>
        <path d="M9.2 13.5h13.6M9.2 18.5h13.6"/><path d="M16 8V4"/>
        <path d="M22.5 19h4v3"/><circle cx="26.5" cy="26" r="1.6" class="ac"/>` },

'Quern or Millstone': { kind: 'workshop', box: '3.6 2.6 24.8 19.8', sw: 1.32,
  note: 'Grinds plants into flour, sugar, dye, paste and paper slurry. A quern is one stone and a pair of hands; a millstone needs power.',
  art: `<ellipse cx="16" cy="12" rx="11" ry="4"/>
        <path d="M5 12v5c0 2.2 4.9 4 11 4s11-1.8 11-4v-5"/>
        <circle cx="16" cy="12" r="1.8" class="ac"/><path d="M24 9.5V4"/>` },

'Kitchen': { kind: 'workshop', box: '3.6 9.6 24.8 19.8', sw: 1.32,
  note: 'Cooks meals and renders fat into tallow. Cooking a seed-bearing plant destroys its seeds — keep it away from your only breeding stock.',
  art: `<path d="M5 11h22"/><path d="M7 11v4a9 8 0 0 0 18 0v-4"/>
        <path d="M16 28c-3-2-1-5 0-7 2 3 4 4 0 7z" class="ac"/>
        <path d="M11 28c-2-1.5-.5-3.5 0-5 1.5 2 2.5 3 0 5z" class="ac"/>
        <path d="M21 28c-2-1.5-.5-3.5 0-5 1.5 2 2.5 3 0 5z" class="ac"/>` },

'Screw Press': { kind: 'workshop', box: '4.6 2.6 22.8 26.8', sw: 1.42,
  note: 'Presses paste into oil and slurry into paper. Needs a mechanism to build — and an empty jug to catch the oil.',
  art: `<path d="M6 4h20M6 28h20"/><path d="M8 4v24M24 4v24"/>
        <path d="M16 4v10"/><path d="M13 7h6M13 10h6"/>
        <path d="M10 14h12v3H10z"/><circle cx="16" cy="24" r="1.6" class="ac"/>` },

'Fishery': { kind: 'workshop', box: '2.6 9.4 26.8 13.3', sw: 1.42,
  note: 'Cleans raw fish before it rots. Some species are lethal unless prepared properly.',
  art: `<path d="M4 16c5-7 13-7 18 0-5 7-13 7-18 0z"/>
        <path d="M22 16l6-4v8z"/><circle cx="10" cy="14" r="1.3" class="ac"/>` },

"Butcher's Shop": { kind: 'workshop', box: '1.6 2.6 28.8 26.8', sw: 1.53,
  note: 'Meat, fat, bone, skull, shell and a raw hide — which starts rotting immediately.',
  art: `<path d="M3 23h26v5H3z"/><path d="M7 4h13v14H7z"/>
        <path d="M20 8h6a2 2 0 0 1 0 4h-6"/><path d="M13 18v5" class="ac"/>` },

"Tanner's Shop": { kind: 'workshop', box: '3.6 3.6 24.8 24.8', sw: 1.32,
  note: 'Raw hide into leather. Do it the same day you butcher, or lose the hide.',
  art: `<path d="M5 5h22v22H5z"/>
        <path d="M11 9c-3 2-3 6-1 8-2 3 0 6 3 6h4c3 0 5-3 3-6 2-2 2-6-1-8z"/>` },

'Leather Works': { kind: 'workshop', box: '8.6 4.6 14.8 24.8', sw: 1.32,
  note: 'Armour, backpacks, waterskins and bags — including the bags that flour, dye and sand need.',
  art: `<path d="M10 12h12v14a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z"/>
        <path d="M13 12V9a3 3 0 0 1 6 0v3"/><path d="M10 20h12"/>` },

/* ── Farming, plants & textiles ── */

"Farmer's Workshop": { kind: 'workshop', box: '8.6 7.6 14.8 21.8', sw: 1.16,
  note: 'Threshing, shearing, spinning, milking and cheese. Half the fortress passes through this one building.',
  art: `<path d="M16 28V10"/>
        <path d="M16 14c-4 0-6-2-6-5 4 0 6 2 6 5z" class="ac"/>
        <path d="M16 14c4 0 6-2 6-5-4 0-6 2-6 5z" class="ac"/>
        <path d="M16 20c-4 0-6-2-6-5 4 0 6 2 6 5z" class="ac"/>
        <path d="M16 20c4 0 6-2 6-5-4 0-6 2-6 5z" class="ac"/>` },

'Loom': { kind: 'workshop', box: '2.6 3.6 26.8 24.8', sw: 1.42,
  note: 'Thread into cloth. Whatever went in comes out: pig tail thread makes pig tail cloth.',
  art: `<path d="M6 5v22M26 5v22"/><path d="M4 8h24M4 24h24"/>
        <path d="M10 8v16M14 8v16M18 8v16M22 8v16"/>
        <path d="M11 15h10l-1 2.5h-8z" class="ac"/>` },

"Dyer's Shop": { kind: 'workshop', box: '4.6 3.2 22.8 24.2', sw: 1.29,
  note: 'Colours thread and cloth, and raises their value nicely.',
  art: `<path d="M6 14h20"/><path d="M8 14v5a8 7 0 0 0 16 0v-5"/>
        <circle cx="13" cy="9" r="1.7" class="ac"/><circle cx="19" cy="6" r="1.4" class="ac"/>` },

"Clothier's Shop": { kind: 'workshop', box: '4.6 5.6 22.8 21.8', sw: 1.21,
  note: 'Clothing, bags and rope. Dwarves need replacements — XXtatteredXX clothes make them miserable.',
  art: `<path d="M11 7 6 11l3 4 2-1.5V26h10V13.5l2 1.5 3-4-5-4z"/>
        <path d="M11 7c3 3.5 7 3.5 10 0"/>` },

'Farm Plot': { kind: 'place', box: '1.6 3.6 26.8 27.8', sw: 1.48,
  note: 'Underground plots need mud; soil layers already qualify, so no irrigation. Fertilise with potash for better yields.',
  art: `<path d="M3 18q6-4 12 0t12 0"/><path d="M3 23q6-4 12 0t12 0"/><path d="M3 28q6-4 12 0t12 0"/>
        <path d="M9 18V8"/><path d="M9 12c-3 0-4-1.5-4-4 3 0 4 1.5 4 4z" class="ac"/>
        <path d="M17 18V5"/><path d="M17 10c3 0 4-1.5 4-4-3 0-4 1.5-4 4z" class="ac"/>
        <path d="M25 18V9"/><path d="M25 13c-2.5 0-3.5-1.5-3.5-3.5 2.5 0 3.5 1.5 3.5 3.5z" class="ac"/>` },

/* ── Ash, lye & soap ── */

'Ashery': { kind: 'workshop', box: '6.6 8.6 18.8 24.1', sw: 1.28,
  note: 'Ash into lye (bring a bucket) or straight into potash for the fields.',
  art: `<path d="M8 10h16l-2 16H10z"/><path d="M8.4 15h15.2"/>
        <circle cx="13" cy="12.5" r="1" class="ac"/><circle cx="18" cy="12.5" r="1" class="ac"/>
        <path d="M16 26v2.5"/><circle cx="16" cy="30" r="1.3" class="ac"/>` },

"Soap Maker's Workshop": { kind: 'workshop', box: '3.6 4 27.9 21.4', sw: 1.48,
  note: 'Lye plus any fat. Stock the hospital with soap and far fewer dwarves die of infection.',
  art: `<path d="M5 16h16v8H5z"/><path d="M5 16l3-3h16l-3 3"/><path d="M21 16l3-3v8l-3 3"/>
        <circle cx="24" cy="8" r="2.6" class="ac"/><circle cx="28.5" cy="12.5" r="1.6" class="ac"/>` },

/* ── Metal, stone & gems ── */

"Metalsmith's Forge": { kind: 'workshop', box: '1.6 1.6 28.8 26.8', sw: 1.53,
  note: 'Bars into weapons, armour and furniture. Needs an anvil in the workshop — and a unit of fuel per job.',
  art: `<path d="M3 11h26l-3 5H6z"/><path d="M13 16l1 6h4l1-6z"/>
        <path d="M8 22h16l2 5H6z"/>
        <circle cx="8" cy="7" r="1.4" class="ac"/><circle cx="13" cy="4" r="1" class="ac"/>` },

"Mason's Workshop": { kind: 'workshop', box: '2.6 4.6 26.8 22.8', sw: 1.42,
  note: 'Stone into furniture, doors and blocks. One boulder makes four blocks, and blocks build faster and prettier.',
  art: `<path d="M4 17h13v9H4z"/><path d="M4 21.5h13M10.5 17v4.5"/>
        <path d="M26 6l2 2-8 8-2-2z"/><path d="M18 14l-3 4 4-3z" class="ac"/>` },

"Mechanic's Workshop": { kind: 'workshop', box: '4.6 4.6 22.8 22.8', sw: 1.21,
  note: 'Any stone becomes a mechanism. Levers, traps, bridges and the screw press all want them.',
  art: `<circle cx="16" cy="16" r="6"/><circle cx="16" cy="16" r="2.4" class="ac"/>
        <path d="M16 6v3M16 23v3M6 16h3M23 16h3M9 9l2.1 2.1M20.9 20.9 23 23M23 9l-2.1 2.1M11.1 20.9 9 23"/>` },

"Jeweler's Workshop": { kind: 'workshop', box: '4.6 5.6 22.8 21.8', sw: 1.21,
  note: 'Cuts rough gems and encrusts finished goods — the cheapest way to make a fortress obscenely valuable.',
  art: `<path d="M11 7h10l5 6-10 13L6 13z"/><path d="M6 13h20"/>
        <path d="M11 7l5 6M21 7l-5 6M16 13v13"/>` },

"Craftsdwarf's Workshop": { kind: 'workshop', box: '7.6 3.9 16.8 25.5', sw: 1.35,
  note: 'Crafts, rock pots, jugs, bone bolts, quires — and adamantine strand extraction.',
  art: `<path d="M9 28h14v-3H9z"/><path d="M16 25V14"/><circle cx="16" cy="9.5" r="4.2"/>
        <path d="M16 19l-6-4.5M16 19l6-4.5"/>
        <circle cx="16" cy="21.5" r="1.2" class="ac"/>` },

/* ── Wood & paper ── */

"Carpenter's Workshop": { kind: 'workshop', box: '2.6 3.6 26.8 24.8', sw: 1.42,
  note: 'Furniture, beds, bins — and the barrels and buckets that every other chain is quietly waiting on.',
  art: `<path d="M4 21h24v6H4z"/><path d="M10 21v6M18 21v6"/>
        <path d="M8 5h12v6H8z"/>
        <path d="M8 11l2.4 2.8 2.4-2.8 2.4 2.8 2.4-2.8 2.4 2.8"/>
        <path d="M20 5h3a3 3 0 0 1 0 6h-3z" class="ac"/>` },

"Bowyer's Workshop": { kind: 'workshop', box: '6.3 3.6 21.1 24.8', sw: 1.32,
  note: 'Wooden bows and crossbows for the militia.',
  art: `<path d="M13 5a14 14 0 0 0 0 22"/><path d="M13 5v22"/>
        <path d="M11 16h15"/><path d="M22 12l4 4-4 4" class="ac"/>` },

'Library': { kind: 'place', box: '3.6 5.6 24.8 20.8', sw: 1.32,
  note: 'Where scribes fill quires and scholars argue. Attracts visitors, some of whom are not what they claim.',
  art: `<path d="M16 10C13 8 9 7 5 7v15c4 0 8 1 11 3 3-2 7-3 11-3V7c-4 0-8 1-11 3z"/>
        <path d="M16 10v15"/>` },

/* ── Places rather than buildings ── */

'Out in the world': { kind: 'place', box: '2.6 5.1 26.8 22.3', sw: 1.42,
  note: 'Chopping trees, gathering plants and collecting webs. Everything out here can also see your dwarves.',
  art: `<circle cx="12" cy="13" r="6.5"/><path d="M12 19.5V26"/><path d="M4 26h24"/>
        <path d="M22 26v-4"/><path d="M22 22l-2.6-1.6M22 22l2.6-1.6" class="ac"/>` },

'Underground': { kind: 'place', box: '1.6 4.6 28.8 24.8', sw: 1.53,
  note: 'Mining. Roughly a quarter of dug tiles drop a boulder, and everything else on this site depends on it.',
  art: `<path d="M3 12c8-8 18-8 26 0-8-4.5-18-4.5-26 0z"/>
        <path d="M16 10v18"/><path d="M12.5 28h7" class="ac"/>` },

'Sandy soil': { kind: 'place', box: '2.6 8.4 26.8 19', sw: 1.42,
  note: 'Collect sand into an empty bag. The tile never runs out, which makes glass infinitely renewable.',
  art: `<path d="M4 22q6-6 12 0t12 0"/><path d="M4 26h24"/>
        <circle cx="10" cy="14" r="1.2" class="ac"/><circle cx="16" cy="11" r="1.2" class="ac"/>
        <circle cx="22" cy="14" r="1.2" class="ac"/>` },

'Any of the below': { kind: 'place', box: '4.6 3.6 22.8 24.8', sw: 1.32,
  note: 'Not a building — several different jobs all have this effect.',
  art: `<path d="M16 5v13"/><path d="M11 13l5 5 5-5" class="ac"/><path d="M6 22v5h20v-5"/>` }

};
