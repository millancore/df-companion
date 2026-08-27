# DF Companion

An interactive, dependency-free reference for **Dwarf Fortress** industry workflows —
what turns into what, at which workshop, with which skill, and which missing barrel is
quietly stalling the whole chain. English and Spanish, with the game's own names for
things left in English in both.

**[millancore.github.io/df-companion](https://millancore.github.io/df-companion/)**

## Pages

| Page | Link |
| --- | --- |
| Industries | [#/](https://millancore.github.io/df-companion/#/) |
| Workshops | [#/w](https://millancore.github.io/df-companion/#/w) |
| Armor | [#/armor](https://millancore.github.io/df-companion/#/armor) |
| About | [#/about](https://millancore.github.io/df-companion/#/about) |
| How to collaborate | [#/contribute](https://millancore.github.io/df-companion/#/contribute) |

Each industry has its own chain map at `#/i/<id>`:
[farming](https://millancore.github.io/df-companion/#/i/farming) ·
[food](https://millancore.github.io/df-companion/#/i/food) ·
[textiles](https://millancore.github.io/df-companion/#/i/textiles) ·
[metal](https://millancore.github.io/df-companion/#/i/metal) ·
[fuel](https://millancore.github.io/df-companion/#/i/fuel) ·
[soap](https://millancore.github.io/df-companion/#/i/soap) ·
[animal](https://millancore.github.io/df-companion/#/i/animal) ·
[stone](https://millancore.github.io/df-companion/#/i/stone) ·
[ceramics](https://millancore.github.io/df-companion/#/i/ceramics) ·
[glass](https://millancore.github.io/df-companion/#/i/glass) ·
[paper](https://millancore.github.io/df-companion/#/i/paper)

A workshop is `#/w/<name>` and an item `#/item/<name>`, both reached by clicking through.

## Running it

No build step, no dependencies. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000    # then visit http://localhost:8000
```

`.nojekyll` is committed so GitHub Pages serves the files as-is.

## Contributing

Fork, branch, pull request — the steps are on the
[How to collaborate](https://millancore.github.io/df-companion/#/contribute) page, and
mistakes are worth [reporting](https://github.com/millancore/df-companion/issues) even
without a patch.

Every page is generated from the data files in `data/`; `assets/js/app.js` holds the
router and the views. The
[How to collaborate](https://millancore.github.io/df-companion/#/contribute) page
documents which file owns what and the shape of each one;
[About](https://millancore.github.io/df-companion/#/about) explains how the site is put
together.

## Credits

Structure modelled on Max Cantor's printable cheat sheet at
[thingsfittogether.com](https://thingsfittogether.com). That poster is *not*
redistributed here. Thanks to [Blind](https://www.youtube.com/@BlindiRL) on YouTube for
the wonderful content.

Every sprite belongs to the game and is shown only as a reference. Dwarf Fortress is by
Bay 12 Games, published by Kitfox Games. This is an unaffiliated fan project — verify
anything load-bearing against the [wiki](https://dwarffortresswiki.org).
