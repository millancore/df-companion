/* The shared symbol set: industries, the `needs` flags, reference tables and the
   two topbar toggles. Same contract as data/workshops.js — inline SVG on a 32×32
   grid, stroked in currentColor so every symbol inherits the colour of whatever
   it sits in, and nothing loaded from the network.

   `box` is the art's measured bounding box and `sw` the stroke width scaled to
   that box, so a symbol fills its frame instead of floating small inside a
   nominal 32×32 and the whole set still renders at one line weight. Both are
   derived from the art with getBBox() — the About page has the snippet. */

window.DF_ICONS = {

/* ── Industries ── */

'farming':  { box: '5.6 7.6 20.8 21.8', sw: 1.16,
  art: `<path d="M16 28v-11"/>
        <path d="M16 19c-.5-4.5-4.5-7-9-7 .3 4.6 4.2 7.4 9 7z"/>
        <path d="M16 16c.5-4.5 4.5-7 9-7-.3 4.6-4.2 7.4-9 7z"/>
        <path d="M7 28h18"/>` },

'food':     { box: '5.6 7.1 23.8 22.3', sw: 1.26,
  art: `<path d="M7 13h14v12a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3z"/>
        <path d="M21 16h3.5a3.5 3.5 0 0 1 0 7H21"/>
        <path d="M7 13c0-2.8 3.1-4.5 7-4.5s7 1.7 7 4.5"/>
        <path d="M11 18v6M15 18v6"/>` },

'textiles': { box: '4.6 5.6 22.8 21.8', sw: 1.21,
  art: `<path d="M11 7 6 11l3 4 2-1.5V26h10V13.5l2 1.5 3-4-5-4z"/>
        <path d="M11 7c3 3.5 7 3.5 10 0"/>` },

'metal':    { box: '1.6 -0.6 28.8 29', sw: 1.54,
  art: `<path d="M12.5 9h7l2.5 8H10z"/>
        <path d="M5.5 19h7l2.5 8H3z"/>
        <path d="M19.5 19h7l2.5 8H17z"/>
        <path d="M5 8C5 9.3 5.7 10 7 10 5.7 10 5 10.7 5 12 5 10.7 4.3 10 3 10 4.3 10 5 9.3 5 8z"
              fill="currentColor" stroke="none"/>
        <path d="M13 .8C13 2.23 13.77 3 15.2 3 13.77 3 13 3.77 13 5.2 13 3.77 12.23 3 10.8 3 12.23 3 13 2.23 13 .8z"
              fill="currentColor" stroke="none"/>
        <path d="M25.5 1.1c0 2.21 1.19 3.4 3.4 3.4-2.21 0-3.4 1.19-3.4 3.4 0-2.21-1.19-3.4-3.4-3.4 2.21 0 3.4-1.19 3.4-3.4z"
              fill="currentColor" stroke="none"/>` },

/* Supplied already drawn on a 256 grid and filled rather than stroked, so like
   `spark` it keeps its own viewBox and paints itself. `sw` goes unused. */
'fuel':     { box: '0 0 256 256', sw: 1.7,
  art: `<path fill="currentColor" stroke="none" d="M212,136a12,12,0,1,1-12-12A12,12,0,0,1,212,136Zm36,0c0,40.37-21.08,72-48,72H56c-26.92,0-48-31.63-48-72S29.08,64,56,64H92.69l37.65-37.66A8,8,0,0,1,136,24h32a8,8,0,0,1,0,16H139.31l-24,24H200C226.92,64,248,95.63,248,136ZM56,192H169.51a73.46,73.46,0,0,1-12.67-24H80a8,8,0,0,1,0-16h73.16A110.63,110.63,0,0,1,152,136c0-22.86,6.76-42.9,17.51-56H56c-12.47,0-23.55,13.26-28.8,32H104a8,8,0,0,1,0,16H24.35q-.34,3.93-.35,8C24,166.36,38.65,192,56,192Zm176-56c0-30.36-14.65-56-32-56s-32,25.64-32,56,14.65,56,32,56S232,166.36,232,136Z"/>` },

'soap':     { box: '2.6 4.6 29.6 21.8', sw: 1.57,
  art: `<rect x="4" y="14" width="18" height="11" rx="3"/>
        <path d="M4 18.5h18"/>
        <circle cx="24" cy="9" r="3"/><circle cx="29" cy="14" r="1.8"/>` },

'animal':   { box: '0.6 6.49 30.8 21.91', sw: 1.64,
  art: `<path d="M10 12.5C6.5 12.8 3.4 11.2 2 8c3.8-.6 7 1.2 8.8 4.2z"/>
        <path d="M22 12.5c3.5.3 6.6-1.3 8-4.5-3.8-.6-7 1.2-8.8 4.2z"/>
        <path d="M8 12h16v7c0 4.4-3.6 8-8 8s-8-3.6-8-8z"/>
        <path d="M12.5 21h7v2.5a3.5 3.5 0 0 1-7 0z"/>
        <circle cx="12.5" cy="16.5" r="1.1"/><circle cx="19.5" cy="16.5" r="1.1"/>` },

'stone':    { box: '2.6 4.6 26.8 23.8', sw: 1.42,
  art: `<path d="M10 6h12l6 8-12 13L4 14z"/>
        <path d="M4 14h24"/>
        <path d="M10 6 8 14l8 13 8-13-2-8"/>` },

'ceramics': { box: '5.6 3.6 20.8 25.4', sw: 1.35,
  art: `<path d="M10 5h12"/>
        <path d="M11.5 5 10.5 10.5"/><path d="M20.5 5 21.5 10.5"/>
        <ellipse cx="16" cy="19" rx="9" ry="8.6"/>
        <path d="M8 15.5h16"/>` },

'paper':    { box: '7.6 2.6 18.8 26.8', sw: 1.42,
  art: `<path d="M9 4h10l6 6v18H9z"/>
        <path d="M19 4v6h6"/>
        <path d="M13 16h8M13 21h8"/>` },

/* ── `needs` flags ── */

'glass':    { box: '7.6 3.6 16.8 24.8', sw: 1.32,
  art: `<path d="M9 5h14l-1.4 9.4A5.4 5.4 0 0 1 16 19a5.4 5.4 0 0 1-5.6-4.6z"/>
        <path d="M16 19v6"/><path d="M10.5 27h11"/>
        <path d="M9.6 9.6h12.8"/>` },

/* Like `fuel`: supplied already drawn on a 256 grid and filled rather than
   stroked, so it keeps its own viewBox and paints itself. `sw` goes unused. */
'flame':    { box: '0 0 256 256', sw: 1.7,
  art: `<path fill="currentColor" stroke="none" d="M183.89,153.34a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68ZM216,144a88,88,0,0,1-176,0c0-27.92,11-56.47,32.66-84.85a8,8,0,0,1,11.93-.89l24.12,23.41,22-60.41a8,8,0,0,1,12.63-3.41C165.21,36,216,84.55,216,144Zm-16,0c0-46.09-35.79-85.92-58.21-106.33L119.52,98.74a8,8,0,0,1-13.09,3L80.06,76.16C64.09,99.21,56,122,56,144a72,72,0,0,0,144,0Z"/>` },

'flux':     { box: '4.29 2.6 23.41 27.5', sw: 1.46,
  art: `<path d="M13 4v8L6 25a2.5 2.5 0 0 0 2.2 3.7h15.6A2.5 2.5 0 0 0 26 25l-7-13V4z"/>
        <path d="M11 4h10"/><path d="M9.5 20h13"/>` },

'bag':      { box: '2.6 3 26.8 26.6', sw: 1.42,
  art: `<rect x="9.75" y="4.4" width="12.5" height="3.6" rx="1.6"/>
        <path d="M10.6 8 13 11.8h6l2.4-3.8"/>
        <path d="M13 11.8C8.6 15.7 4 21 4 24.4c0 2.6 1.9 3.8 4.6 3.8h14.8c2.7 0 4.6-1.2 4.6-3.8
                 0-3.4-4.6-8.7-9-12.6"/>` },

'barrel':   { box: '7.1 3.6 17.8 24.8', sw: 1.32,
  art: `<path d="M10 5h12c2 5 2 17 0 22H10c-2-5-2-17 0-22z"/>
        <path d="M8.6 11h14.8M8.6 21h14.8"/>` },

/* Drawn on a 24 grid rather than 32, but stroked like the rest of the set. It
   came stroked at 2 on that grid; measured back against the 24-unit box that
   lands on the set's line weight. */
'jug':      { box: '0 0 24 24', sw: 1.5,
  art: `<path d="M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8"/>
        <path d="M10 5H8a2 2 0 0 0 0 4h.68"/>
        <path d="M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8"/>
        <path d="M14 5h2a2 2 0 0 1 0 4h-.68"/>
        <path d="M18 22H6"/><path d="M9 2h6"/>` },

/* A stoppered glass vial, not the metal flask or the leather waterskin — only
   the glass one can hold an extract. The accent line is the salve in it. */
'vial':     { box: '11 2.6 10.1 22.1', sw: 1.18,
  art: `<rect x="13" y="4" width="6" height="3.2" rx="1.2"/>
        <path d="M12.4 7.2v12.4a3.6 3.6 0 0 0 7.2 0V7.2"/>
        <path d="M12.4 16h7.2" class="ac"/>` },

'bucket':   { box: '5.6 9.6 20.8 19.8', sw: 1.11,
  art: `<path d="M7 11h18l-2.2 15.2A2 2 0 0 1 20.8 28h-9.6a2 2 0 0 1-2-1.8z"/>
        <path d="M9.5 11a6.5 6.5 0 0 0 13 0"/>` },

'shop':     { box: '3.6 4.6 24.8 23.8', sw: 1.32,
  art: `<path d="M5 15 16 6l11 9"/>
        <path d="M8 13.5V27h16V13.5"/>
        <path d="M13 27v-7h6v7"/>` },

/* ── Reference tables ── */

'pick':     { box: '2.6 5.1 26.8 24.3', sw: 1.42,
  art: `<path d="M4 11c7-6 17-6 24 0"/>
        <path d="M15 8.5 8.5 28"/>
        <path d="M12.6 10.8 18 12.6"/>` },

'quality':  { box: '1.6 1.6 28.8 28.8', sw: 1.53,
  art: `<circle cx="16" cy="16" r="6"/>
        <path d="M16 3v4M16 25v4M3 16h4M25 16h4"/>
        <path d="M6.8 6.8l2.9 2.9M22.3 22.3l2.9 2.9M25.2 6.8l-2.9 2.9M9.7 22.3l-2.9 2.9"/>` },

'people':   { box: '2.1 5.1 27.8 23.3', sw: 1.48,
  art: `<circle cx="11" cy="11" r="4.5"/>
        <path d="M3.5 27c0-4.5 3.4-8 7.5-8s7.5 3.5 7.5 8"/>
        <circle cx="22" cy="12.5" r="3.5"/>
        <path d="M20 20.2c.6-.2 1.3-.3 2-.3 3.6 0 6.5 3 6.5 7"/>` },

'calendar': { box: '2.6 2.6 26.8 26.8', sw: 1.42,
  art: `<rect x="4" y="7" width="24" height="21" rx="2"/>
        <path d="M4 13h24"/><path d="M11 4v6M21 4v6"/>
        <path d="M10 18h3M15 18h3M20 18h3M10 23h3M15 23h3"/>` },

'mushroom': { box: '2.6 2.6 26.8 25.8', sw: 1.42,
  art: `<path d="M4 15c0-6.1 5.4-11 12-11s12 4.9 12 11z"/>
        <path d="M12 15v8a4 4 0 0 0 8 0v-8"/>
        <circle cx="11" cy="10" r="1.5"/><circle cx="20.5" cy="9.5" r="1.9"/>` },

'layers':   { box: '1.6 4.6 28.8 22.8', sw: 1.53,
  art: `<path d="M3 6h26v20H3z"/>
        <path d="M3 12c5 1.6 8-1.6 13 0s8 1.6 13 0"/>
        <path d="M3 19c5 1.6 8-1.6 13 0s8 1.6 13 0"/>` },

'shield':   { box: '3.6 2.1 24.8 30.3', sw: 1.61,
  art: `<path d="M16 3.5 5 7.5V17c0 6.4 4.6 10.8 11 13.5 6.4-2.7 11-7.1 11-13.5V7.5z"/>
        <path d="M16 10.5 12 13v4c0 2.6 1.7 4.4 4 5.5 2.3-1.1 4-2.9 4-5.5v-4z"/>` },

'body':     { box: '4.6 0.6 22.8 30.8', sw: 1.64,
  art: `<circle cx="16" cy="6" r="4"/>
        <path d="M10 12h12v10h-3v8h-6v-8h-3z"/>
        <path d="M10 14 6 16v6M22 14l4 2v6"/>` },

'warn':     { box: '1.6 2.6 28.8 25.8', sw: 1.53,
  art: `<path d="M16 4 29 27H3z"/>
        <path d="M16 13v6.5"/><circle cx="16" cy="23.3" r="1.2"/>` },

/* ── Controls ── */

/* The odd one out: supplied already drawn on a 256 grid and filled rather than
   stroked, so it keeps its own viewBox and paints itself. `sw` goes unused. */
'spark':    { box: '0 0 256 256', sw: 1.7,
  art: `<path fill="currentColor" stroke="none" d="M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z"/>` },

/* Same as `spark`: supplied already drawn on a 256 grid and filled rather than
   stroked, so it keeps its own viewBox and paints itself. `sw` goes unused. */
'bug':      { box: '0 0 256 256', sw: 1.7,
  art: `<path fill="currentColor" stroke="none" d="M208,152h16a8,8,0,0,0,0-16H208V120h16a8,8,0,0,0,0-16H207.6a79.76,79.76,0,0,0-21.44-46.85l19.5-19.49a8,8,0,0,0-11.32-11.32l-20.29,20.3a79.74,79.74,0,0,0-92.1,0L61.66,26.34A8,8,0,0,0,50.34,37.66l19.5,19.49A79.76,79.76,0,0,0,48.4,104H32a8,8,0,0,0,0,16H48v16H32a8,8,0,0,0,0,16H48v8c0,2.7.14,5.37.4,8H32a8,8,0,0,0,0,16H51.68a80,80,0,0,0,152.64,0H224a8,8,0,0,0,0-16H207.6c.26-2.63.4-5.3.4-8ZM128,48a64.07,64.07,0,0,1,63.48,56h-127A64.07,64.07,0,0,1,128,48Zm8,175.48V144a8,8,0,0,0-16,0v79.48A64.07,64.07,0,0,1,64,160V120H192v40A64.07,64.07,0,0,1,136,223.48Z"/>` },

'pointer':  { box: '5.9 3.3 20.1 26.7', sw: 1.42,
  art: `<path d="M7.3 4.7v21.9l6-6 4 8 3.3-1.3-4-8h8z"/>` },

'back':     { box: '3.6 6.6 24.8 18.8', sw: 1.32,
  art: `<path d="M27 16H5"/><path d="M13 8 5 16l8 8"/>` },

/* The end of a branch, marked the way a transit map marks the end of a line.
   Drawn rather than written because it sits on a good half of the nodes, and a
   caps label that long doubles the width of the chip it is glued to. Only the
   end carries one: what you bring from elsewhere is already saying so with a
   dashed box. */
'terminus': { box: '4.9 4.9 22.2 22.2', sw: 1.8,
  art: `<circle cx="16" cy="16" r="10.2"/>
        <circle cx="16" cy="16" r="4.4" fill="currentColor" stroke="none"/>` },

/* The disclosure on a step card. It points down when the note is shut and is
   flipped in CSS when it opens, so one drawing does both states. */
'chevron':  { box: '7.2 11.2 17.6 9.6', sw: 1.7,
  art: `<path d="M8 12l8 8 8-8"/>` },


'theme':    { box: '3.6 3.6 24.8 24.8', sw: 1.32,
  art: `<circle cx="16" cy="16" r="11"/>
        <path d="M16 5a11 11 0 0 1 0 22z" fill="currentColor" stroke="none"/>` },

'hammer':   { box: '4.6 3.6 23.8 24.3', sw: 1.29,
  art: `<path d="M6 26.5 17 15.5"/>
        <path d="M14.5 8.5 23.5 17.5 27 14 18 5z"/>` }

};
