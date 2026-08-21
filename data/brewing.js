/* The Still's brewing table: every ingredient the game will turn into a drink,
   what comes out, and what the drink is worth.

   This is deliberately not seven near-identical entries in data/recipes.js. The
   Still runs one job — Brew Drink — against 77 possible ingredients, so the
   recipe graph carries that single generic step and the ingredient list lives
   here, where the Still's own page turns it into a picker.

   `kind` is the drink category the game files use (Wine, Beer, Cider, Other),
   `value` is the drink's value in ☼, `type` is what the ingredient is
   (Plant, Fruit, Animal) and `source` is where you get it. Data from the
   wiki's brewing page — https://dwarffortresswiki.org/index.php/Alcohol */

window.DF_BREWING = [
  /* Plant-based — subterranean crop */
  { in: 'Plump helmet',      out: 'Dwarven wine',           kind: 'Wine',  value: 2, type: 'Plant',  source: 'Subterranean crop' },
  { in: 'Pig tail',          out: 'Dwarven ale',            kind: 'Beer',  value: 2, type: 'Plant',  source: 'Subterranean crop' },
  { in: 'Cave wheat',        out: 'Dwarven beer',           kind: 'Beer',  value: 2, type: 'Plant',  source: 'Subterranean crop' },
  { in: 'Sweet pod',         out: 'Dwarven rum',            kind: 'Other', value: 2, type: 'Plant',  source: 'Subterranean crop' },

  /* Plant-based — surface crop */
  { in: 'Muck root',         out: 'Swamp whiskey',          kind: 'Other', value: 1, type: 'Plant',  source: 'Surface crop' },
  { in: 'Bloated tuber',     out: 'Tuber beer',             kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Prickle berry',     out: 'Prickle berry wine',     kind: 'Wine',  value: 1, type: 'Plant',  source: 'Surface crop' },
  { in: 'Longland grass',    out: 'Longland beer',          kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Rat weed',          out: 'Sewer brew',             kind: 'Other', value: 1, type: 'Plant',  source: 'Surface crop' },
  { in: 'Fisher berry',      out: 'Fisher berry wine',      kind: 'Wine',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Rope reed',         out: 'River spirits',          kind: 'Other', value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Sliver barb',       out: 'Gutter cruor',           kind: 'Other', value: 1, type: 'Plant',  source: 'Surface crop' },
  { in: 'Sun berry',         out: 'Sunshine',               kind: 'Other', value: 5, type: 'Plant',  source: 'Surface crop' },
  { in: 'Whip vine',         out: 'Whip wine',              kind: 'Wine',  value: 3, type: 'Plant',  source: 'Surface crop' },
  { in: 'Beet',              out: 'Beetroot wine',          kind: 'Wine',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Wild carrot',       out: 'Carrot wine',            kind: 'Wine',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Cassava',           out: 'Cassava beer',           kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Parsnip',           out: 'Parsnip wine',           kind: 'Wine',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Potato',            out: 'Potato wine',            kind: 'Wine',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Radish',            out: 'Radish wine',            kind: 'Wine',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Sweet potato',      out: 'Sweet potato wine',      kind: 'Wine',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Turnip',            out: 'Turnip wine',            kind: 'Wine',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Single-grain wheat', out: 'Single-grain wheat beer', kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Two-grain wheat',   out: 'Two-grain wheat beer',   kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Soft wheat',        out: 'Soft wheat beer',        kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Hard wheat',        out: 'Hard wheat beer',        kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Spelt',             out: 'Spelt beer',             kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Barley',            out: 'Barley wine',            kind: 'Wine',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Buckwheat',         out: 'Buckwheat beer',         kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Rye',               out: 'Rye beer',               kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Sorghum',           out: 'Sorghum beer',           kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Rice',              out: 'Rice beer',              kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Maize',             out: 'Maize beer',             kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Quinoa',            out: 'Quinoa beer',            kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Kaniwa',            out: 'Kaniwa beer',            kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Pendant amaranth',  out: 'Pendant amaranth beer',  kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Blood amaranth',    out: 'Blood amaranth beer',    kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Purple amaranth',   out: 'Purple amaranth beer',   kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Pearl millet',      out: 'Pearl millet beer',      kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'White millet',      out: 'White millet beer',      kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Finger millet',     out: 'Finger millet beer',     kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Foxtail millet',    out: 'Foxtail millet beer',    kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Fonio',             out: 'Fonio beer',             kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },
  { in: 'Teff',              out: 'Teff beer',              kind: 'Beer',  value: 2, type: 'Plant',  source: 'Surface crop' },

  /* Fruit-based — surface tree */
  { in: 'Apple',             out: 'Apple cider',            kind: 'Cider', value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Apricot',           out: 'Apricot wine',           kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Banana',            out: 'Banana beer',            kind: 'Beer',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Bayberry',          out: 'Bayberry wine',          kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Carambola',         out: 'Carambola wine',         kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Cherry',            out: 'Cherry wine',            kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Custard-apple',     out: 'Custard-apple cider',    kind: 'Cider', value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Date',              out: 'Date wine',              kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Durian',            out: 'Durian wine',            kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Guava',             out: 'Guava wine',             kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Lychee',            out: 'Lychee wine',            kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Mango',             out: 'Mango wine',             kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Papaya',            out: 'Papaya wine',            kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Peach',             out: 'Peach cider',            kind: 'Cider', value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Pear',              out: 'Perry',                  kind: 'Other', value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Persimmon',         out: 'Persimmon wine',         kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Plum',              out: 'Plum wine',              kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Pomegranate',       out: 'Pomegranate wine',       kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Rambutan',          out: 'Rambutan wine',          kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface tree' },
  { in: 'Sand pear',         out: 'Sand pear cider',        kind: 'Cider', value: 2, type: 'Fruit',  source: 'Surface tree' },

  /* Fruit-based — surface crop */
  { in: 'Artichoke',         out: 'Artichoke wine',         kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },
  { in: 'Tomato',            out: 'Tomato wine',            kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },
  { in: 'Tomatillo',         out: 'Tomatillo wine',         kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },
  { in: 'Passion fruit',     out: 'Passion fruit wine',     kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },
  { in: 'Grape',             out: 'Wine',                   kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },
  { in: 'Cranberry',         out: 'Cranberry wine',         kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },
  { in: 'Bilberry',          out: 'Bilberry wine',          kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },
  { in: 'Blueberry',         out: 'Blueberry wine',         kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },
  { in: 'Blackberry',        out: 'Blackberry wine',        kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },
  { in: 'Raspberry',         out: 'Raspberry wine',         kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },
  { in: 'Pineapple',         out: 'Pineapple wine',         kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },
  { in: 'Strawberry',        out: 'Strawberry wine',        kind: 'Wine',  value: 2, type: 'Fruit',  source: 'Surface crop' },

  /* Animal-based — surface apiary */
  { in: 'Honey',             out: 'Mead',                   kind: 'Other', value: 2, type: 'Animal', source: 'Surface apiary' }
];
