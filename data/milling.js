/* The Quern's milling table: every plant the Mill Plants job will grind, and the
   powder it turns into.

   Same reasoning as data/brewing.js — the quern runs one milling job against 33
   plants, so data/recipes.js carries one generic step and the ingredient list
   lives here for the Quern's page to turn into a picker.

   `kind` is what comes out (Flour, Sugar, Dye) and `source` is where the plant
   comes from; both generate the picker's filter chips. Every one of these needs
   an empty bag and hands back 1–2 seeds. Data from the wiki's milling page —
   https://dwarffortresswiki.org/index.php/Milling

   The four dye plants also carry the dye's colour and value. The colour name
   resolves to a swatch through DF_COLOR_HEX in data/dyes.js, which is where the
   game's other sixty-eight dyes live — those come from jobs other than milling,
   which is why they are not in this table. */

window.DF_MILLING = [
  /* Dye — subterranean crop */
  { in: 'Dimple cup',        out: 'Dimple dye',              kind: 'Dye',   source: 'Subterranean crop', color: 'Midnight blue', value: 20 },

  /* Dye — surface crop */
  { in: 'Blade weed',        out: 'Emerald dye',             kind: 'Dye',   source: 'Surface crop', color: 'Emerald', value: 20 },
  { in: 'Hide root',         out: 'Redroot dye',             kind: 'Dye',   source: 'Surface crop', color: 'Red', value: 10 },
  { in: 'Sliver barb',       out: 'Sliver dye',              kind: 'Dye',   source: 'Surface crop', color: 'Black', value: 20 },

  /* Sugar — subterranean crop */
  { in: 'Sweet pod',         out: 'Dwarven sugar',           kind: 'Sugar', source: 'Subterranean crop' },

  /* Flour — subterranean crop */
  { in: 'Cave wheat',        out: 'Dwarven wheat flour',     kind: 'Flour', source: 'Subterranean crop' },

  /* Flour — surface crop */
  { in: 'Longland grass',    out: 'Longland flour',          kind: 'Flour', source: 'Surface crop' },
  { in: 'Whip vine',         out: 'Whip vine flour',         kind: 'Flour', source: 'Surface crop' },
  { in: 'Single-grain wheat', out: 'Single-grain wheat flour', kind: 'Flour', source: 'Surface crop' },
  { in: 'Two-grain wheat',   out: 'Two-grain wheat flour',   kind: 'Flour', source: 'Surface crop' },
  { in: 'Soft wheat',        out: 'Soft wheat flour',        kind: 'Flour', source: 'Surface crop' },
  { in: 'Hard wheat',        out: 'Hard wheat flour',        kind: 'Flour', source: 'Surface crop' },
  { in: 'Spelt',             out: 'Spelt flour',             kind: 'Flour', source: 'Surface crop' },
  { in: 'Barley',            out: 'Barley flour',            kind: 'Flour', source: 'Surface crop' },
  { in: 'Buckwheat',         out: 'Buckwheat flour',         kind: 'Flour', source: 'Surface crop' },
  { in: 'Oats',              out: 'Oat flour',               kind: 'Flour', source: 'Surface crop' },
  { in: 'Rye',               out: 'Rye flour',               kind: 'Flour', source: 'Surface crop' },
  { in: 'Sorghum',           out: 'Sorghum flour',           kind: 'Flour', source: 'Surface crop' },
  { in: 'Rice',              out: 'Rice flour',              kind: 'Flour', source: 'Surface crop' },
  { in: 'Maize',             out: 'Maize flour',             kind: 'Flour', source: 'Surface crop' },
  { in: 'Quinoa',            out: 'Quinoa flour',            kind: 'Flour', source: 'Surface crop' },
  { in: 'Kaniwa',            out: 'Kaniwa flour',            kind: 'Flour', source: 'Surface crop' },
  { in: 'Pendant amaranth',  out: 'Pendant amaranth flour',  kind: 'Flour', source: 'Surface crop' },
  { in: 'Blood amaranth',    out: 'Blood amaranth flour',    kind: 'Flour', source: 'Surface crop' },
  { in: 'Purple amaranth',   out: 'Purple amaranth flour',   kind: 'Flour', source: 'Surface crop' },
  { in: 'Pearl millet',      out: 'Pearl millet flour',      kind: 'Flour', source: 'Surface crop' },
  { in: 'White millet',      out: 'White millet flour',      kind: 'Flour', source: 'Surface crop' },
  { in: 'Finger millet',     out: 'Finger millet flour',     kind: 'Flour', source: 'Surface crop' },
  { in: 'Foxtail millet',    out: 'Foxtail millet flour',    kind: 'Flour', source: 'Surface crop' },
  { in: 'Fonio',             out: 'Fonio flour',             kind: 'Flour', source: 'Surface crop' },
  { in: 'Teff',              out: 'Teff flour',              kind: 'Flour', source: 'Surface crop' },
  { in: 'Flax',              out: 'Flax flour',              kind: 'Flour', source: 'Surface crop' },
  { in: 'Hemp',              out: 'Hemp flour',              kind: 'Flour', source: 'Surface crop' }
];
