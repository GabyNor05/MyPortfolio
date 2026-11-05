# Templates (design archive)

Kept as a record of every design direction explored. Nothing here is built into the site.

| File / folder | What it is |
| --- | --- |
| `portfolio.html`, `portfolioV2.html`, `portfolio.jsx` | Original minimal hydrangea portfolio designs (the earlier repo templates) |
| `dnd-sheet-mockup/` | D&D character-sheet portfolio mockup, last state before the React build: `Main` (sheet), `Project` (quest page), `Login` + `Admin` (Manage), `canvas.json` (artboard layout) |
| `dnd-sheet-mockup/borders-options/` | Six alternative panel borders (double rule, notched, brackets, glow, stat-block, stitched) |

The `.dc.html` files are Claude Design canvas artboards. They open as plain HTML for reference, but they use `{{holes}}`, `<sc-for>` and `<sc-if>` template syntax, so read them as design specs rather than runnable pages. Image placeholders point to `headshot-640.jpg` in the mockup folder.

The live site is built from `frontend/`.
