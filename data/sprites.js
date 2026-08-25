/* Item sprites — the game's own art, keyed by the exact item name the rest of
   the data uses, and pathed from assets/img/. An item with an entry here is
   drawn the same everywhere it turns up: in a recipe chip, at the head of its
   item page, in the Still's and the quern's picker lists, and in the crop
   table on the reference page.

   Almost all of it is plants, which is why they are grouped and commented as
   such below; anything else the game gives us art for goes at the end.

   The set covers all but a handful of the Still's seventy-seven ingredients.
   What is left over is fonio, which has no sprite on the wiki, rock nut, and
   honey, which is a bee's work rather than a plant's. Every place that draws a
   sprite reserves the space
   whether or not there is one, so a list of names keeps a single left edge
   instead of stepping in and out. Dropping a file into the folder and adding a
   line here is all it takes to fill a gap.

   Four entries are not a plant's own portrait. `Quarry bush` is the game's
   quarry bush *seeds* sprite — the shrub has none of its own, and seed is what
   the farm plot is stocked with. `Date` is the date palm that bears it, the
   fruit having no sprite apart from the tree. `Prickle berry` is the plural
   file name the wiki ships. And `Generic wheat` is the shared sprite the game
   gives grain species that carry no art of their own, which is why the seven
   grains at the end all point at it. */

window.DF_ITEM_SPRITES = {
  /* Subterranean crops */
  'Cave wheat':   'plants/Cave_wheat_shrub_sprite.png',
  'Dimple cup':   'plants/Dimple_cup_shrub_sprite.png',
  'Pig tail':     'plants/Pig_tail_shrub_sprite.png',
  'Plump helmet': 'plants/Plump_helmet_shrub_sprite.png',
  'Quarry bush':  'plants/Quarry_bush_seeds_sprite.png',
  'Sweet pod':    'plants/Sweet_pod_shrub_sprite.png',

  /* Surface crops */
  'Artichoke':        'plants/Artichoke_shrub_sprite.png',
  'Beet':             'plants/Beet_shrub_sprite.png',
  'Bilberry':         'plants/Bilberry_shrub_sprite.png',
  'Blackberry':       'plants/Blackberry_shrub_sprite.png',
  'Blade weed':       'plants/Blade_weed_shrub_sprite.png',
  'Bloated tuber':    'plants/Bloated_tuber_shrub_sprite.png',
  'Blood amaranth':   'plants/Blood_amaranth_shrub_sprite.png',
  'Blueberry':        'plants/Blueberry_shrub_sprite.png',
  'Buckwheat':        'plants/Buckwheat_shrub_sprite.png',
  'Cassava':          'plants/Cassava_shrub_sprite.png',
  'Cranberry':        'plants/Cranberry_shrub_sprite.png',
  'Cotton':           'plants/Cotton_shrub_sprite.png',
  'Finger millet':    'plants/Finger_millet_shrub_sprite.png',
  'Fisher berry':     'plants/Fisher_berry_shrub_sprite.png',
  'Flax':             'plants/Flax_shrub_sprite.png',
  'Foxtail millet':   'plants/Foxtail_millet_shrub_sprite.png',
  'Grape':            'plants/Grape_shrub_sprite.png',
  'Hemp':             'plants/Hemp_shrub_sprite.png',
  'Hide root':        'plants/Hide_root_shrub_sprite.png',
  'Jute':             'plants/Jute_shrub_sprite.png',
  'Kenaf':            'plants/Kenaf_shrub_sprite.png',
  'Kaniwa':           'plants/Kaniwa_shrub_sprite.png',
  'Longland grass':   'plants/Longland_grass_shrub_sprite.png',
  'Maize':            'plants/Maize_shrub_sprite.png',
  'Muck root':        'plants/Muck_root_shrub_sprite.png',
  'Oats':             'plants/Oats_shrub_sprite.png',
  'Parsnip':          'plants/Parsnip_shrub_sprite.png',
  'Passion fruit':    'plants/Passion_fruit_shrub_sprite.png',
  'Pearl millet':     'plants/Pearl_millet_shrub_sprite.png',
  'Pendant amaranth': 'plants/Pendant_amaranth_shrub_sprite.png',
  'Pineapple':        'plants/Pineapple_shrub_sprite.png',
  'Potato':           'plants/Potato_shrub_sprite.png',
  'Prickle berry':    'plants/Prickle_berries_shrub_sprite.png',
  'Purple amaranth':  'plants/Purple_amaranth_shrub_sprite.png',
  'Quinoa':           'plants/Quinoa_shrub_sprite.png',
  'Radish':           'plants/Radish_shrub_sprite.png',
  'Ramie':            'plants/Ramie_shrub_sprite.png',
  'Raspberry':        'plants/Raspberry_shrub_sprite.png',
  'Rat weed':         'plants/Rat_weed_shrub_sprite.png',
  'Rice':             'plants/Rice_shrub_sprite.png',
  'Rope reed':        'plants/Rope_reed_shrub_sprite.png',
  'Sliver barb':      'plants/Sliver_barb_shrub_sprite.png',
  'Sorghum':          'plants/Sorghum_shrub_sprite.png',
  'Strawberry':       'plants/Strawberry_shrub_sprite.png',
  'Sun berry':        'plants/Sun_berry_shrub_sprite.png',
  'Sweet potato':     'plants/Sweet_potato_shrub_sprite.png',
  'Teff':             'plants/Teff_shrub_sprite.png',
  'Tomatillo':        'plants/Tomatillo_shrub_sprite.png',
  'Tomato':           'plants/Tomato_shrub_sprite.png',
  'Turnip':           'plants/Turnip_shrub_sprite.png',
  'Whip vine':        'plants/Whip_vine_shrub_sprite.png',
  'White millet':     'plants/White_millet_shrub_sprite.png',
  'Wild carrot':      'plants/Wild_carrot_shrub_sprite.png',

  /* Surface trees — the fruit the Still brews */
  'Apple':         'plants/Apple_sprite.png',
  'Apricot':       'plants/Apricot_sprite.png',
  'Banana':        'plants/Banana_sprite.png',
  'Bayberry':      'plants/Bayberry_sprite.png',
  'Carambola':     'plants/Carambola_sprite.png',
  'Cherry':        'plants/Cherry_sprite.png',
  'Custard-apple': 'plants/Custard_apple_sprite.png',
  'Date':          'plants/Date_palm_sprite.png',
  'Durian':        'plants/Durian_sprite.png',
  'Guava':         'plants/Guava_sprite.png',
  'Lychee':        'plants/Lychee_sprite.png',
  'Mango':         'plants/Mango_sprite.png',
  'Papaya':        'plants/Papaya_sprite.png',
  'Peach':         'plants/Peach_sprite.png',
  'Pear':          'plants/Pear_sprite.png',
  'Persimmon':     'plants/Persimmon_sprite.png',
  'Plum':          'plants/Plum_sprite.png',
  'Pomegranate':   'plants/Pomegranate_sprite.png',
  'Rambutan':      'plants/Rambutan_sprite.png',
  'Sand pear':     'plants/Sand_pear_sprite.png',

  /* The grains that share the one generic sprite — see the note above */
  'Barley':             'plants/Generic_wheat_shrub_sprite.png',
  'Hard wheat':         'plants/Generic_wheat_shrub_sprite.png',
  'Rye':                'plants/Generic_wheat_shrub_sprite.png',
  'Single-grain wheat': 'plants/Generic_wheat_shrub_sprite.png',
  'Soft wheat':         'plants/Generic_wheat_shrub_sprite.png',
  'Spelt':              'plants/Generic_wheat_shrub_sprite.png',
  'Two-grain wheat':    'plants/Generic_wheat_shrub_sprite.png',

  /* Thread — the game draws every kind the same, and so does the site: the
     generic thread a codex is bound with, and the three the loom will weave. */
  'Thread':           'Thread_sprite_preview.png',
  'Pig tail thread':  'Thread_sprite_preview.png',
  'Silk thread':      'Thread_sprite_preview.png',
  'Yarn thread':      'Thread_sprite_preview.png',

  /* ── What comes off the forge's anvil ───────────────────────────
     The forge's picker lists ninety-odd things, and with the folder filled in
     nearly everything the forge makes has its own art: what is left showing the
     blank box is the handful the game draws no item for — coins, toys, studding,
     instrument parts, bolts and ballista arrowheads — which is the same bargain
     the plants make above. Armour is the exception and does not appear in this
     map at all: it has its own cells in the equipment sheet, and data/armor.js
     keys them by coordinate.

     `Flask` is the wiki's flask *collection* sprite, which is the only art the
     game gives the item. `Hatch cover` is filed on the wiki under the shorter
     name the building goes by. */
  'Battle axe':          'forge/Battle_axe_sprite.png',
  'Crossbow':            'forge/Crossbow_sprite.png',
  'Mace':                'forge/Mace_sprite.png',
  'Pick':                'forge/Pick_sprite.png',
  'Short sword':         'forge/Short_sword_sprite.png',
  'Spear':               'forge/Spear_sprite.png',
  'War hammer':          'forge/War_hammer_sprite.png',

  'Giant axe blade':     'forge/Giant_axe_blade_sprite.png',
  'Enormous corkscrew':  'forge/Corkscrew_sprite.png',
  'Spiked ball':         'forge/Spiked_ball_sprite.png',
  'Large, serrated disc':'forge/Serrated_disc_sprite.png',
  'Menacing spike':      'forge/Menacing_spike_sprite.png',

  'Goblet':      'forge/Goblet_sprite.png',
  'Flask':       'forge/Flask_collection_sprite.png',
  'Amulet':      'forge/Amulet_sprite.png',
  'Bracelet':    'forge/Bracelet_sprite.png',
  'Crown':       'forge/Crown_sprite.png',
  'Earring':     'forge/Earring_sprite.png',
  'Ring':        'forge/Ring_sprite.png',
  'Figurine':    'forge/Figurine_sprite.png',
  'Scepter':     'forge/Scepter_sprite.png',
  'Chain':       'forge/Chain_sprite.png',
  'Anvil':       'forge/Anvil_sprite.png',
  'Mechanism':   'forge/Mechanism_sprite.png',
  'Animal trap': 'forge/Animal_trap_sprite.png',

  'Blocks':       'forge/Block_sprite.png',
  'Armor stand':  'forge/Armor_stand_sprite.png',
  'Barrel':       'forge/Barrel_sprite.png',
  'Bin':          'forge/Bin_sprite.png',
  'Bucket':       'forge/Bucket_sprite.png',
  'Cabinet':      'forge/Cabinet_sprite.png',
  'Cage':         'forge/Cage_sprite.png',
  'Chair':        'forge/Chair_sprite.png',
  'Chest':        'forge/Chest_sprite.png',
  'Coffin':       'forge/Coffin_sprite.png',
  'Crutch':       'forge/Crutch_sprite.png',
  'Door':         'forge/Door_sprite.png',
  'Floodgate':    'forge/Floodgate_sprite.png',
  'Grate':        'forge/Grate_sprite.png',
  'Hatch cover':  'forge/Hatch_sprite.png',
  'Hive':         'forge/Hive_sprite.png',
  'Jug':          'forge/Jug_sprite.png',
  'Large pot':    'forge/Large_pot_sprite.png',
  'Minecart':     'forge/Minecart_sprite.png',
  'Nest box':     'forge/Nest_box_sprite.png',
  'Pipe section': 'forge/Pipe_section_sprite.png',
  'Splint':       'forge/Splint_sprite.png',
  'Statue':       'forge/Statue_sprite.png',
  'Stepladder':   'forge/Stepladder_sprite.png',
  'Table':        'forge/Table_sprite.png',
  'Weapon rack':  'forge/Weapon_rack_sprite.png',
  'Wheelbarrow':  'forge/Wheelbarrow_sprite.png'
};
