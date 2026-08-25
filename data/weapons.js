/* Weapons, from https://dwarffortresswiki.org/index.php/Weapon

   `DF_WEAPONS` is every manufactured weapon in the game — the seven a dwarf can
   forge, the ammunition and trap components that come off the same anvil, the
   three wooden training weapons, and the fourteen foreign types that only ever
   arrive in somebody else's hands. The foreign ones are here for the same reason
   the foreign clothing is in data/textiles.js: you meet them, and "what is
   coming at me" is the same question with the numbers read backwards.

   Two different numbers are called "size" in this game and both matter, so they
   have separate fields:

     `vol`  — volume in cm³, the number the wiki's weapon table prints. It drives
              momentum, and it is the first term of the value formula: base value
              is (vol / 50) + 1, doubled if the weapon has any EDGE attack.
              Ranged weapons are a flat 10 instead. Every `base` below checks out
              against that, which is why the formula is worth stating.
     `size` — material size, which is what the forge charges for. Bar cost is
              material size ÷ 3 rounded down, minimum one — the same rule as
              armour, and app.js computes it, so a weapon only states its size.
              In adamantine it costs the material size itself, in wafers. A few
              items have no real material size and a fixed bar cost instead;
              those state `bars` and leave `size` out.

   `attacks` is the weapon's whole attack list, in the wiki's order and numbers.
   A weapon is not one attack: a short sword slashes, stabs, slaps and
   pommel-strikes, and the reason it is a jack of all trades is only visible when
   all four are on screen together. `pen` on a BLUNT attack is bracketed on the
   wiki because the game ignores it entirely; here it is a plain number and the
   attack's own `type` is what says to bracket it, so the two cannot disagree.
   The trap components carry no `vel`, because the wiki publishes none for them.

   `made` is where each material version is made — written out per weapon rather
   than looked up from a code, because the material does not determine the
   building. A wooden crossbow is a bowyer's job, a wooden corkscrew a
   carpenter's and a wooden bolt a wood crafter's, and a single "Wood" code
   would have to lie about two of the three. Foreign weapons carry no `made` at
   all: nothing you can build makes them.

   `skill` is the skill that swings it, not the one that made it — a weaponsmith
   forges the mace, a macedwarf uses it. */

/* Wrapped in a function only so the six workshop shorthands below stay out of
   the global scope; the file still exports one plain array. Naming them once is
   what stops a typo putting a weapon in a workshop that does not exist. */
(function () {

const FORGE  = { at: "Metalsmith's Forge",     by: 'Weaponsmith' };
const BOWYER = { at: "Bowyer's Workshop",      by: 'Bowyer' };
const CARP   = { at: "Carpenter's Workshop",   by: 'Carpenter' };
const CRAFT  = { at: "Craftsdwarf's Workshop", by: 'Wood crafter' };
const BONER  = { at: "Craftsdwarf's Workshop", by: 'Bone carver' };
const GLASS  = { at: 'Glass Furnace',          by: 'Glassmaker' };

/* kind    — Melee, Ranged, Ammo, Trap component or Training. The forge's picker
             groups the first four under one Weapons chip, because they are one
             labour: a weaponsmith makes the lot.
   skill   — the combat skill that wields it.
   hands   — 'one', 'two' or 'multi'. Multi-grasp means a dwarf needs both hands,
             and will fumble the weapon badly if you hand them a shield as well.
   hits    — attacks per trigger, for trap components only.
   melt    — bars returned by melting the metal version.
   per     — items produced per job, where that is not one.
   avail   — 'foreign': dwarves cannot make it. `used` says who does. */
window.DF_WEAPONS = [

/* ── The seven a dwarf can forge ──────────────────────────────── */

{ id: 'battle-axe', name: 'Battle axe', kind: 'Melee', skill: 'Axe', hands: 'one',
  vol: 800, size: 4, base: 34, melt: 1.2,
  made: [{ mat: 'Metal', ...FORGE }],
  attacks: [
    { name: 'Hack',          type: 'Edge',  area: 40000, pen: 6000, vel: 1.25 },
    { name: 'Flat slap',     type: 'Blunt', area: 40000, pen: 6000, vel: 1.25 },
    { name: 'Pommel strike', type: 'Blunt', area: 100,   pen: 1000, vel: 1.0 }],
  note: 'The fortress default. A huge contact area takes limbs off unarmoured targets faster than anything else in the game — and is exactly why it stops working against armour, which converts the cut into a much weaker bruise. One bar in, one and a fifth back out of the smelter.' },

{ id: 'short-sword', name: 'Short sword', kind: 'Melee', skill: 'Sword', hands: 'one',
  vol: 300, size: 3, base: 14, melt: 0.9,
  made: [{ mat: 'Metal', ...FORGE }, { mat: 'Obsidian', at: "Craftsdwarf's Workshop", by: 'Stone crafter' }],
  attacks: [
    { name: 'Slash',         type: 'Edge',  area: 20000, pen: 4000, vel: 1.25 },
    { name: 'Stab',          type: 'Edge',  area: 50,    pen: 2000, vel: 1.0 },
    { name: 'Flat slap',     type: 'Blunt', area: 20000, pen: 4000, vel: 1.25 },
    { name: 'Pommel strike', type: 'Blunt', area: 100,   pen: 1000, vel: 1.0 }],
  note: 'Four attacks and none of them the best of its kind — a jack of all trades whose one real advantage over an axe is the occasional stab that gets through plate. It is also the only weapon you can make without a forge at all: one obsidian boulder plus a log at the craftsdwarf’s workshop.' },

{ id: 'spear', name: 'Spear', kind: 'Melee', skill: 'Spear', hands: 'one',
  vol: 400, size: 3, base: 18, melt: 0.9,
  made: [{ mat: 'Metal', ...FORGE }],
  attacks: [
    { name: 'Stab',       type: 'Edge',  area: 20,    pen: 10000, vel: 1.0 },
    { name: 'Shaft bash', type: 'Blunt', area: 10000, pen: 6000,  vel: 1.25 }],
  note: 'Contact area 20 against an axe’s 40,000, and the deepest penetration of any weapon a dwarf can make. Armour a spear can just about pierce would need four hundred times the momentum for an axe to get through, which is the whole argument for spears against armoured enemies. They do get stuck in people.' },

{ id: 'mace', name: 'Mace', kind: 'Melee', skill: 'Mace', hands: 'one',
  vol: 800, size: 3, base: 17, melt: 0.9,
  made: [{ mat: 'Metal', ...FORGE }],
  attacks: [{ name: 'Bash', type: 'Blunt', area: 20, pen: 200, vel: 2.0 }],
  note: 'Twice the volume of a war hammer for the same one bar, with the same doubled velocity — so it hits harder, and is heavier to carry. Blunt goes straight through armour to break the bone underneath.' },

{ id: 'war-hammer', name: 'War hammer', kind: 'Melee', skill: 'Hammer', hands: 'one',
  vol: 400, size: 3, base: 9, melt: 0.9,
  made: [{ mat: 'Metal', ...FORGE }],
  attacks: [{ name: 'Bash', type: 'Blunt', area: 10, pen: 200, vel: 2.0 }],
  note: 'Half the contact area of a spear at double velocity: all of the force behind one small blunt point. Broken bones hurt enough that living things pass out, and an unconscious target takes perfectly square blows to the head. Nothing at all against something that feels no pain.' },

{ id: 'pick', name: 'Pick', kind: 'Melee', skill: 'Mining', hands: 'one',
  vol: 500, size: 4, base: 22, melt: 1.2,
  made: [{ mat: 'Metal', ...FORGE }],
  attacks: [{ name: 'Strike', type: 'Edge', area: 100, pen: 4000, vel: 2.0 }],
  note: 'A mining tool the game files as a foreign weapon and lets you forge anyway. Small contact area, deep penetration and double velocity make it quietly one of the nastier things to be hit with — but a dwarf on "individual choice" will never pick one up, so it has to be named in the uniform.' },

{ id: 'crossbow', name: 'Crossbow', kind: 'Ranged', skill: 'Crossbow', hands: 'two',
  vol: 400, size: 3, base: 10, melt: 0.9,
  made: [{ mat: 'Metal', ...FORGE }, { mat: 'Wood', ...BOWYER }, { mat: 'Bone', ...BOWYER }],
  attacks: [{ name: 'Bash', type: 'Blunt', area: 10000, pen: 4000, vel: 1.25 }],
  note: 'The material changes nothing about how it shoots — only how it hits once a goblin has closed the distance. What does matter is the bow’s own quality, so a legendary bowyer’s wooden crossbow beats a proficient weaponsmith’s steel one in the hands of a marksdwarf.' },

/* ── Ammunition and siege ammunition ──────────────────────────── */
/* One bar, twenty-five bolts, and the quality bonus is applied to every item in
   a stack — which is why a masterwork stack of bolts is worth more than almost
   anything else a single bar can become. */

{ id: 'bolts', name: 'Bolts', kind: 'Ammo', skill: 'Crossbow', hands: '—',
  size: 1, bars: 1, base: 1, melt: 0.3, per: 25,
  made: [{ mat: 'Metal', ...FORGE }, { mat: 'Wood', ...CRAFT }, { mat: 'Bone', ...BONER }],
  note: 'Twenty-five to a bar at the forge, twenty-five to a log at the craftsdwarf’s workshop, five to a bone. Metal bolts are a weapon, not a craft, so they need weaponsmithing rather than metalcrafting. Steel is the best; adamantine is too light and bounces off. Wood and bone are for hunting and training only.' },

{ id: 'ballista-arrowhead', name: 'Ballista arrowhead', kind: 'Ammo', skill: 'Siege operator', hands: '—',
  bars: 3, base: 10, melt: 0.5,
  made: [{ mat: 'Metal', ...FORGE }],
  note: 'Three bars for one head, which a carpenter then fits to a log to make the arrow. The worst return on metal anywhere at this forge — and the siege engine it feeds is worse still than a corridor of weapon traps.' },

/* ── Trap components ──────────────────────────────────────────── */
/* Nobody holds these: they go into a weapon trap, up to ten to a tile. One bar
   each, and three of the five give back one and a half, which is what makes
   them the metal industry's favourite exploit. They also break after about four
   invaders, where a copper pick would keep swinging for thousands of hits. */

{ id: 'giant-axe-blade', name: 'Giant axe blade', kind: 'Trap component', skill: '—', hands: '—',
  vol: 1600, size: 5, base: 10, melt: 1.5, hits: 1,
  made: [{ mat: 'Metal', ...FORGE }, { mat: 'Glass', ...GLASS }],
  attacks: [{ name: 'Slash', type: 'Edge', area: 100000, pen: 10000 }],
  note: 'The largest contact area in the game — it takes creatures apart, and does very little to armour. One hit per trigger.' },

{ id: 'serrated-disc', name: 'Large, serrated disc', kind: 'Trap component', skill: '—', hands: '—',
  vol: 1000, size: 4, base: 10, melt: 1.2, hits: 3,
  made: [{ mat: 'Metal', ...FORGE }, { mat: 'Glass', ...GLASS }],
  attacks: [{ name: 'Slash', type: 'Edge', area: 100000, pen: 10000 }],
  note: 'A giant axe blade’s numbers three times a trigger instead of once, and one less unit of material size. Against anything unarmoured it is the best trap component in the game — and it will scatter enough severed limbs to keep your haulers busy for a season.' },

{ id: 'menacing-spike', name: 'Menacing spike', kind: 'Trap component', skill: '—', hands: '—',
  vol: 1600, size: 5, base: 10, melt: 1.5, hits: 1,
  made: [{ mat: 'Metal', ...FORGE }, { mat: 'Wood', ...CARP }, { mat: 'Glass', ...GLASS }],
  attacks: [{ name: 'Stab', type: 'Edge', area: 10, pen: 6000 }],
  note: 'Small point, deep penetration — the trap component for armoured targets with organs worth impaling. Also the one you drop into a pit or drive up through the floor with an upright spike trap, where it takes almost no wear at all.' },

{ id: 'spiked-ball', name: 'Spiked ball', kind: 'Trap component', skill: '—', hands: '—',
  vol: 1000, size: 4, base: 10, melt: 1.2, hits: 3,
  made: [{ mat: 'Metal', ...FORGE }, { mat: 'Wood', ...CARP }, { mat: 'Glass', ...GLASS }],
  attacks: [{ name: 'Stab', type: 'Edge', area: 10, pen: 200 }],
  note: 'Three piercing attacks a trigger with almost no penetration behind them, which still breaks bones the way a blunt weapon does. The small contact area means it goes on working against better armour than the discs and blades do.' },

{ id: 'enormous-corkscrew', name: 'Enormous corkscrew', kind: 'Trap component', skill: '—', hands: '—',
  vol: 1600, size: 5, base: 10, melt: 1.5, hits: 1,
  made: [{ mat: 'Metal', ...FORGE }, { mat: 'Wood', ...CARP }, { mat: 'Glass', ...GLASS }],
  attacks: [{ name: 'Stab', type: 'Edge', area: 100, pen: 10000 }],
  note: 'Also the moving part of a screw pump, which is reason enough to keep a spare even if you never build a weapon trap. Screw pumps ignore quality, so your best corkscrews are free to go into traps instead.' },

/* ── Training weapons: wood, at the carpenter's ───────────────── */
/* Every attack is blunt and wood is a poor weapon material, so these bruise
   rather than maim. The point is that a fortress can start training its militia
   before it owns an anvil — and that a guard beating can stop short of a
   funeral. */

{ id: 'training-axe', name: 'Training axe', kind: 'Training', skill: 'Axe', hands: 'one',
  vol: 800, base: 17, made: [{ mat: 'Wood', ...CARP }],
  attacks: [
    { name: 'Hack',          type: 'Blunt', area: 30000, pen: 6000, vel: 1.25 },
    { name: 'Flat slap',     type: 'Blunt', area: 30000, pen: 6000, vel: 1.25 },
    { name: 'Pommel strike', type: 'Blunt', area: 100,   pen: 1000, vel: 1.0 }] },

{ id: 'training-sword', name: 'Training sword', kind: 'Training', skill: 'Sword', hands: 'one',
  vol: 300, base: 7, made: [{ mat: 'Wood', ...CARP }],
  attacks: [
    { name: 'Slash',         type: 'Blunt', area: 20000, pen: 4000, vel: 1.25 },
    { name: 'Stab',          type: 'Blunt', area: 50,    pen: 2000, vel: 1.0 },
    { name: 'Flat slap',     type: 'Blunt', area: 20000, pen: 4000, vel: 1.25 },
    { name: 'Pommel strike', type: 'Blunt', area: 100,   pen: 1000, vel: 1.0 }] },

{ id: 'training-spear', name: 'Training spear', kind: 'Training', skill: 'Spear', hands: 'one',
  vol: 400, base: 9, made: [{ mat: 'Wood', ...CARP }],
  attacks: [
    { name: 'Stab',       type: 'Blunt', area: 200,   pen: 10000, vel: 1.0 },
    { name: 'Shaft bash', type: 'Blunt', area: 10000, pen: 6000,  vel: 1.25 }] },

/* ── Foreign: looted, traded, or pointed at you ───────────────── */
/* No `made`, because nothing you can build makes any of these. Several are
   multi-grasp: a dwarf handed one along with a shield will use both badly, and
   the game will not stop you. `melt` is still worth knowing — captured goblin
   kit goes into the smelter like anything else. */

{ id: 'great-axe', name: 'Great axe', kind: 'Melee', skill: 'Axe', hands: 'multi', avail: 'foreign',
  vol: 1300, size: 5, base: 54, melt: 1.5, used: ['Goblin', 'Human'],
  attacks: [
    { name: 'Hack',          type: 'Edge',  area: 60000, pen: 8000, vel: 1.25 },
    { name: 'Flat slap',     type: 'Blunt', area: 60000, pen: 8000, vel: 1.25 },
    { name: 'Pommel strike', type: 'Blunt', area: 100,   pen: 1000, vel: 1.0 }],
  note: 'The most valuable weapon in the game, and one of the deadliest against anything unarmoured. Far too big for a dwarf to hold in one hand, so never pair it with a shield.' },

{ id: 'halberd', name: 'Halberd', kind: 'Melee', skill: 'Axe', hands: 'multi', avail: 'foreign',
  vol: 1200, size: 5, base: 50, melt: 1.5, used: ['Goblin', 'Human'],
  attacks: [
    { name: 'Slash',      type: 'Edge',  area: 20000, pen: 8000, vel: 1.25 },
    { name: 'Stab',       type: 'Edge',  area: 50,    pen: 2000, vel: 1.0 },
    { name: 'Shaft bash', type: 'Blunt', area: 20000, pen: 6000, vel: 1.25 }] },

{ id: 'two-handed-sword', name: 'Two-handed sword', kind: 'Melee', skill: 'Sword', hands: 'multi', avail: 'foreign',
  vol: 900, size: 5, base: 38, melt: 1.5, used: ['Goblin', 'Human'],
  attacks: [
    { name: 'Slash',         type: 'Edge',  area: 100000, pen: 8000, vel: 1.25 },
    { name: 'Stab',          type: 'Edge',  area: 50,     pen: 4000, vel: 1.0 },
    { name: 'Flat slap',     type: 'Blunt', area: 100000, pen: 8000, vel: 1.25 },
    { name: 'Pommel strike', type: 'Blunt', area: 100,    pen: 1000, vel: 1.0 }] },

{ id: 'long-sword', name: 'Long sword', kind: 'Melee', skill: 'Sword', hands: 'one', avail: 'foreign',
  vol: 700, size: 4, base: 30, melt: 1.2, used: ['Elf', 'Goblin', 'Human'],
  attacks: [
    { name: 'Slash',         type: 'Edge',  area: 60000, pen: 6000, vel: 1.25 },
    { name: 'Stab',          type: 'Edge',  area: 50,    pen: 3000, vel: 1.0 },
    { name: 'Flat slap',     type: 'Blunt', area: 60000, pen: 6000, vel: 1.25 },
    { name: 'Pommel strike', type: 'Blunt', area: 100,   pen: 1000, vel: 1.0 }],
  note: 'A short sword in every respect except three times the contact area, and one hand still holds it. If a good one comes off a caravan, take it.' },

{ id: 'scimitar', name: 'Scimitar', kind: 'Melee', skill: 'Sword', hands: 'one', avail: 'foreign',
  vol: 300, size: 3, base: 14, melt: 0.9, used: ['Goblin', 'Human'],
  attacks: [
    { name: 'Slash',         type: 'Edge',  area: 20000, pen: 4000, vel: 1.25 },
    { name: 'Stab',          type: 'Edge',  area: 50,    pen: 2000, vel: 1.0 },
    { name: 'Flat slap',     type: 'Blunt', area: 20000, pen: 4000, vel: 1.25 },
    { name: 'Pommel strike', type: 'Blunt', area: 50,    pen: 1000, vel: 1.0 }],
  note: 'A short sword under another name — identical numbers apart from a lighter pommel.' },

{ id: 'pike', name: 'Pike', kind: 'Melee', skill: 'Pike', hands: 'multi', avail: 'foreign',
  vol: 800, size: 4, base: 34, melt: 1.2, used: ['Goblin', 'Human'],
  attacks: [
    { name: 'Stab',       type: 'Edge',  area: 20,    pen: 12000, vel: 1.0 },
    { name: 'Shaft bash', type: 'Blunt', area: 10000, pen: 6000,  vel: 1.25 }],
  note: 'The deepest penetration of any weapon in the game, and its own skill that no dwarf of yours will ever have trained.' },

{ id: 'maul', name: 'Maul', kind: 'Melee', skill: 'Hammer', hands: 'multi', avail: 'foreign',
  vol: 1300, size: 5, base: 27, melt: 1.5, used: ['Goblin', 'Human'],
  attacks: [{ name: 'Bash', type: 'Blunt', area: 100, pen: 6000, vel: 2.0 }] },

{ id: 'flail', name: 'Flail', kind: 'Melee', skill: 'Mace', hands: 'one', avail: 'foreign',
  vol: 500, size: 4, base: 11, melt: 1.2, used: ['Goblin', 'Human'],
  attacks: [{ name: 'Bash', type: 'Blunt', area: 200, pen: 4000, vel: 2.5 }] },

{ id: 'morningstar', name: 'Morningstar', kind: 'Melee', skill: 'Mace', hands: 'one', avail: 'foreign',
  vol: 500, size: 4, base: 22, melt: 0.9, used: ['Goblin', 'Human'],
  attacks: [
    { name: 'Bash',          type: 'Edge',  area: 10, pen: 500,  vel: 2.0 },
    { name: 'Pommel strike', type: 'Blunt', area: 50, pen: 1000, vel: 1.0 }],
  note: 'The only mace-skill weapon with an edge attack: a tiny contact area at double velocity, punching through armour rather than bruising through it.' },

{ id: 'dagger', name: 'Large dagger', kind: 'Melee', skill: 'Dagger', hands: 'one', avail: 'foreign',
  vol: 200, size: 1, base: 10, melt: 0.3, used: ['Goblin', 'Kobold'],
  attacks: [
    { name: 'Slash',         type: 'Edge',  area: 1000, pen: 800,  vel: 1.25 },
    { name: 'Stab',          type: 'Edge',  area: 5,    pen: 1000, vel: 1.0 },
    { name: 'Pommel strike', type: 'Blunt', area: 20,   pen: 600,  vel: 1.0 }] },

{ id: 'scourge', name: 'Scourge', kind: 'Melee', skill: 'Whip', hands: 'one', avail: 'foreign',
  vol: 300, size: 2, base: 14, melt: 0.6, used: ['Goblin'],
  attacks: [{ name: 'Lash', type: 'Edge', area: 10, pen: 50, vel: 2.0 }] },

{ id: 'whip', name: 'Whip', kind: 'Melee', skill: 'Whip', hands: 'one', avail: 'foreign',
  vol: 100, size: 1, base: 3, melt: 0.3, used: ['Goblin', 'Human'],
  attacks: [{ name: 'Lash', type: 'Blunt', area: 1, pen: 10, vel: 5.0 }],
  note: 'Contact area 1 and a fivefold velocity multiplier — the highest force per square millimetre in the game, on the cheapest weapon in the game. A goblin with a whip is a real threat to an armoured dwarf.' },

{ id: 'bow', name: 'Bow', kind: 'Ranged', skill: 'Bow', hands: 'one', avail: 'foreign',
  vol: 300, size: 3, base: 10, melt: 0.9, used: ['Elf', 'Goblin', 'Human', 'Kobold'],
  attacks: [{ name: 'Bash', type: 'Blunt', area: 10000, pen: 4000, vel: 1.25 }] },

{ id: 'blowgun', name: 'Blowgun', kind: 'Ranged', skill: 'Blowgun', hands: 'one', avail: 'foreign',
  vol: 150, size: 2, base: 10, melt: 0.6, used: ['Subterranean animal people'],
  attacks: [{ name: 'Bash', type: 'Blunt', area: 10000, pen: 4000, vel: 1.25 }] }

];

})();
