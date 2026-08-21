/* Metal colours for the ingot icon.

   These used to be DF's own tile colours, stored as `foreground:background:bright`
   triples out of the Tile Color column of
   https://dwarffortresswiki.org/index.php/Metal

   That was authentic and useless. The game draws every metal from a 16-colour
   palette, so steel, tin, zinc, nickel, billon and pewter were all the same light
   gray and iron, lead and pig iron were all the same dark gray — which is fine in
   a game where you read the name, and no help at all in a reference where the
   whole point of the swatch is to tell one bar from another at a glance. So the
   file now holds real metal tones instead.

   Add a metal by adding a line. An item resolves by name with a trailing bar,
   wafer, strands or ingot stripped, so `Steel bar` and `Adamantine wafers` both
   find their entry; a metal with no entry here simply renders without an ingot. */

window.DF_METAL_COLORS = {

  /* ── Pure metals ─────────────────────────────────────────────── */
  'Aluminium':       '#C0C0C0',
  'Bismuth':         '#A73CD5',
  'Copper':          '#a65835',
  'Gold':            '#D79B2D',
  'Iron':            '#C0C0C0',
  'Lead':            '#6b6058',
  'Nickel':          '#b8bcc3',
  'Platinum':        '#c8c9d0',
  'Silver':          '#dee3e1',
  'Tin':             '#b8bcc3',
  'Zinc':            '#b8bcc3',

  /* ── Alloys, and the iron that is on its way to being one ────── */
  'Pig iron':        '#8f8781',
  'Steel':           '#8f9599',
  'Bronze':          '#cd7f32',
  'Bismuth bronze':  '#b07a52',
  'Black bronze':    '#4a3f38',
  'Brass':           '#b5a642',
  'Electrum':        '#e6d38f',
  'Rose gold':       '#dba38c',
  'Sterling silver': '#d5dad8',
  'Nickel silver':   '#c6cac6',
  'Billon':          '#b2a08f',
  'Pewter':          '#97948e',
  'Fine pewter':     '#aaa7a1',
  'Trifle pewter':   '#9c9992',
  'Lay pewter':      '#8b8781',

  /* Adamantine is invented, so it has no real tone to borrow — it keeps the
     cyan the game gives it. */
  'Adamantine':      '#00ffff',
  'Raw adamantine':  '#00ffff'
};
