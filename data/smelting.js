/* What the smelter turns into what.

   Two tables, because the smelter runs two jobs of this shape: Smelt Ore
   against 17 ores, and the alloy reactions against 14 recipes. Both collapse to
   one generic step each in data/recipes.js, and the smelter's own page turns
   them into pickers.

   Ores: https://dwarffortresswiki.org/index.php/Ore
   Alloys and metal values: https://dwarffortresswiki.org/index.php/Metal

   `found` is the wiki's own list of where an ore turns up and is the datum.
   `rocks` groups it so the picker can be filtered, reading the words
   sedimentary / igneous / metamorphic / alluvial straight out of `found` and
   mapping the named stones the usual way — granite and gabbro are igneous,
   sandstone and limestone sedimentary, marble and gneiss metamorphic. Horn
   silver and native platinum sit inside other veins rather than in a layer.

   Aluminium is spelled the way the rest of this project spells it; the wiki
   writes Aluminum.

   Every job here burns a unit of fuel unless the smelter is built over magma,
   and pig iron and steel want a flux stone on top of that.

   An alloy's ingredients are `parts` rather than `in`, which is the field the
   picker builds for itself: it writes the recipe into the left column and the
   alloy into the right, so both of the smelter's tables read the same way
   round — what goes in, then what comes out. */

window.DF_ORES = [
  { ore: 'Raw adamantine',   metal: 'Adamantine', bars: 4,
    rocks: ['Deep'],
    found: 'The depths' },
  { ore: 'Native aluminium', metal: 'Aluminium',  bars: 4,
    rocks: ['Igneous'],
    found: 'All igneous extrusive' },
  { ore: 'Bismuthinite',     metal: 'Bismuth',    bars: 4,
    rocks: ['Igneous'],
    found: 'Granite' },
  { ore: 'Cassiterite',      metal: 'Tin',        bars: 4,
    rocks: ['Alluvial', 'Igneous'],
    found: 'All alluvial, granite' },
  { ore: 'Native copper',    metal: 'Copper',     bars: 4,
    rocks: ['Igneous', 'Sedimentary'],
    found: 'All igneous extrusive, sandstone' },
  { ore: 'Galena',           metal: 'Lead',       bars: 4, bonus: { metal: 'Silver', chance: 50, bars: '0–4' },
    rocks: ['Igneous', 'Metamorphic', 'Sedimentary'],
    found: 'All igneous extrusive, all metamorphic, granite, limestone' },
  { ore: 'Garnierite',       metal: 'Nickel',     bars: 4,
    rocks: ['Igneous'],
    found: 'Gabbro' },
  { ore: 'Native gold',      metal: 'Gold',       bars: 4,
    rocks: ['Igneous', 'Alluvial'],
    found: 'All igneous, all alluvial' },
  { ore: 'Hematite',         metal: 'Iron',       bars: 4,
    rocks: ['Sedimentary', 'Igneous', 'Metamorphic'],
    found: 'All sedimentary, all igneous, all metamorphic' },
  { ore: 'Horn silver',      metal: 'Silver',     bars: 4,
    rocks: ['In another vein'],
    found: 'Inside native silver veins' },
  { ore: 'Limonite',         metal: 'Iron',       bars: 4,
    rocks: ['Sedimentary'],
    found: 'All sedimentary' },
  { ore: 'Magnetite',        metal: 'Iron',       bars: 4,
    rocks: ['Sedimentary', 'Metamorphic', 'Igneous'],
    found: 'All sedimentary, all metamorphic, all igneous' },
  { ore: 'Malachite',        metal: 'Copper',     bars: 4,
    rocks: ['Sedimentary', 'Metamorphic'],
    found: 'Limestone, marble' },
  { ore: 'Native platinum',  metal: 'Platinum',   bars: 4,
    rocks: ['Alluvial', 'In another vein'],
    found: 'All alluvial, olivine, magnetite, chromite' },
  { ore: 'Native silver',    metal: 'Silver',     bars: 4,
    rocks: ['Igneous', 'Metamorphic'],
    found: 'Granite, gneiss' },
  { ore: 'Sphalerite',       metal: 'Zinc',       bars: 4,
    rocks: ['Metamorphic'],
    found: 'All metamorphic' },
  { ore: 'Tetrahedrite',     metal: 'Copper',     bars: 4, bonus: { metal: 'Silver', chance: 20, bars: '0–4' },
    rocks: ['Any stone'],
    found: 'All stone' }
];

window.DF_ALLOYS = [
  { alloy: 'Billon',          value:  6, bars: 2,
    parts: [{ metal: 'Silver', qty: 1 }, { metal: 'Copper', qty: 1 }] },
  { alloy: 'Bismuth bronze',  value:  6, bars: 4, weapon: true,
    parts: [{ metal: 'Copper', qty: 2 }, { metal: 'Tin', qty: 1 }, { metal: 'Bismuth', qty: 1 }] },
  { alloy: 'Black bronze',    value: 11, bars: 4,
    parts: [{ metal: 'Copper', qty: 2 }, { metal: 'Silver', qty: 1 }, { metal: 'Gold', qty: 1 }] },
  { alloy: 'Brass',           value:  7, bars: 2,
    parts: [{ metal: 'Copper', qty: 1 }, { metal: 'Zinc', qty: 1 }] },
  { alloy: 'Bronze',          value:  5, bars: 2, weapon: true,
    parts: [{ metal: 'Copper', qty: 1 }, { metal: 'Tin', qty: 1 }] },
  { alloy: 'Electrum',        value: 20, bars: 2,
    parts: [{ metal: 'Silver', qty: 1 }, { metal: 'Gold', qty: 1 }] },
  { alloy: 'Fine pewter',     value:  5, bars: 4,
    parts: [{ metal: 'Tin', qty: 3 }, { metal: 'Copper', qty: 1 }] },
  { alloy: 'Lay pewter',      value:  3, bars: 4,
    parts: [{ metal: 'Tin', qty: 2 }, { metal: 'Copper', qty: 1 }, { metal: 'Lead', qty: 1 }] },
  { alloy: 'Trifle pewter',   value:  4, bars: 3,
    parts: [{ metal: 'Tin', qty: 2 }, { metal: 'Copper', qty: 1 }] },
  { alloy: 'Nickel silver',   value:  3, bars: 4,
    parts: [{ metal: 'Nickel', qty: 2 }, { metal: 'Copper', qty: 1 }, { metal: 'Zinc', qty: 1 }] },
  { alloy: 'Rose gold',       value: 23, bars: 4,
    parts: [{ metal: 'Gold', qty: 3 }, { metal: 'Copper', qty: 1 }] },
  { alloy: 'Sterling silver', value:  8, bars: 4,
    parts: [{ metal: 'Silver', qty: 3 }, { metal: 'Copper', qty: 1 }] },
  { alloy: 'Pig iron',        value: 10, bars: 1, flux: true,
    parts: [{ metal: 'Iron' }] },
  { alloy: 'Steel',           value: 30, bars: 2, weapon: true, flux: true,
    parts: [{ metal: 'Iron' }, { metal: 'Pig iron' }] }
];

/* ── DF_SMELT_TABLES ───────────────────────────────────────────────
   The prose that does not fit in a row, in the shape refBlocks() renders
   and rendered by the same code as the forge's notes and the armour page's.

   Steel is the question this building gets asked most often and the one its two
   tables answer worst between them: the ores say hematite gives iron, the
   alloys say steel wants iron and pig iron, and neither says that pig iron is a
   step rather than a product, that the chain stops dead without a flux stone,
   or that a magma smelter does not get you out of the fuel. This is the chain
   in one table, in the order you run it.

   https://dwarffortresswiki.org/index.php/Steel

   The counts are the wiki's. One boulder of iron ore gives four iron bars; the
   pig iron reaction gives one bar; the steel reaction gives two, which is why
   two iron bars come back as two bars of steel rather than one. Each reaction
   burns a unit of fuel as carbon and a second one to heat the furnace — magma
   covers the heating and never the carbon, and that is the half people are
   surprised by after digging all the way down to it. */

window.DF_SMELT_TABLES = [

/* No blurb: the three rows in order are the answer, and a paragraph over them
   only says the same thing in prose. A table without one renders as its heading
   and its rows. */
{ id: 'steel', title: 'How steel is made', icon: 'flux',
  columns: ['Job', 'It eats', 'It gives', 'Bars'],
  decorate: { 2: 'metal' },
  rows: [
    ['Smelt Ore',     'Hematite, magnetite or limonite ×1',   'Iron',     '4'],
    ['Make pig iron', 'Iron ×1, flux stone ×1',               'Pig iron', '1'],
    ['Make steel',    'Iron ×1, pig iron ×1, flux stone ×1',  'Steel',    '2']
  ] }

];
