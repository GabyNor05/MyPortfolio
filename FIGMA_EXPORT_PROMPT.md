# PROMPT FOR THE NEW CHAT: Figma export for Gaby's portfolio

Paste everything below the line into a new Claude chat (desktop app, with the Figma connector on; Claude in Chrome / the built-in browser on if possible). Gaby will be away: do NOT ask questions, make the best choice, note any assumption in the final report, and keep going until everything is done.

---

## Who and why
I am Gaby Norris, a final-year Creative Technologies student (Interactive Development and UX Design, Open Window Institute, South Africa). My portfolio is a React site (repo GabyNor05/MyPortfolio, live at https://gabynor05.github.io/MyPortfolio/). I need every project image and brand asset exported from my Figma files so another Claude session can put them into the site. That session CANNOT download from Figma (its sandbox blocks Figma's image host), so your job is to get the files out in a form that can be handed over. Do not stop at "I can't download": work through the methods in section 4.

## 1. Figma files (all my own; edit access, use create_session first with each fileKey)
| Project | slug (use for filenames) | fileKey | node |
|---|---|---|---|
| ForageScan | forage-scan | NDu5zIjWSzORTB8lb0V9nm | 0:1 |
| Spoonful (design system) | spoonful | MFGQH2Qm0DhFOHmjGzZeB4 | 5498:15 |
| Amadea Safehouse | amadea-safehouse | mxub4SDMQx8DkFhLZH0tGo | 0:1 |
| StoryWeave | storyweave | JgGpE1CPDKr3nMxVIDEh52 | 310:101 |
| Nia | nia | X2TuJacy9HjFsjW0z4jMmh | 450:8 |
| MasterChef Broadway | masterchef-broadway | qFKRQ6PGmi5dpGjKfBgTiW | 58:469 |
| MakerSpace (service design) | makerspace | ZqO3qFy1fpA8sOxnYuBZKp | 1176:3597 |
| Uplifters | uplifters | v4z97EeOhVzp0bkVzubTHP | 62:169 |
| Creative Technologies Hackathon (SpaceDUCKED) | hackathon | u1Ieuy4qXE2EmqVi5XZgbE | 0:1 |
| StageVote | stagevote | 29YeBdzaJQGa9UBPIJXofO (file "DV Work") | 0:1 |
| Whelmer and Get Up & Go designs | whelmer, get-up-and-go | abDigYTVFUhQw7PPjyMaqO (file "Personal Projects") | 402:112 |
| Brand kit (logo, signatures, banners) | brand | abDigYTVFUhQw7PPjyMaqO, page "Portfolio" | 46:2, section 464:2 |
| CVs (3 one-page versions) | cv | abDigYTVFUhQw7PPjyMaqO, page "CV" | 399:1462 |

URLs follow https://www.figma.com/design/<fileKey>/<name>?node-id=<node with - instead of :>. Where the node above is 0:1 (whole first page) or a deep link, open the file, list the pages and top-level frames with get_metadata, and pick the best frames yourself.

## 2. What to export, per UX/design project (the ten above, not Whelmer/Get Up & Go)
Choose 4 to 6 frames/screens that tell the story, in this order:
1. cover.png: the hero/cover or the best-looking overview (landscape, ideally about 16:10)
2. 1.png, 2.png ...: key flow, research/service map, wireframes, then final high-fidelity screens (final screens last)
For phone apps (Nia, StoryWeave, Uplifters, ForageScan, Amadea, MasterChef, StageVote): also export ONE composite "phones.png": 3 to 4 final screens side by side on a transparent or dark (#15122a) background.
Sizes: export at 2x, but no image wider than 2400 px. Keep PNG for UI, JPG (quality 85) only for photographic covers.
Naming: <slug>/cover.png, <slug>/1.png ... Also write <slug>/info.json: {"slug","fileKey","nodeIds":[...],"caption per image":[...],"alt text per image":[...]}.

## 3. Brand and CV assets (editable where possible)
From the Portfolio page, section "Brand kit" (node 464:2): export each logo component (lilac, indigo, dark) as SVG, the light and dark email signatures as PNG (2x), and every Behance banner (v1, v2, and any new ones, including the dot/ombre ones and anything Gaby edited at the bottom) as PNG at 2x plus the dots-only group as SVG if it has no raster fills. From the CV page (399:1462): export each of the three CVs as PDF (one page each) and PNG preview, named cv-development, cv-hybrid, cv-ux. Name by what the frame is called in Figma; list frame names and node IDs in the report.
Also export Gaby's headshot/photo-shoot frames if any exist in the file (name them photo-1, photo-2...).
"Editable / recreate": if a thing cannot be exported as vector, rebuild it as simple SVG from its Figma properties (rectangles, ellipses with their opacity, text as paths or live text with font name noted). Flag anything recreated vs. exported.

## 4. How to actually get the files out (try in this order, do not give up after the first failure)
A. Figma connector: download_assets (if available) or get_design_context, which return asset URLs, then fetch them with your own tools and save to a folder. Use get_screenshot for any frame as a fallback (PNG).
B. use_figma: run plugin code such as `node.exportAsync({format:"PNG", constraint:{type:"SCALE", value:2}})` or format "SVG"/"PDF", convert the bytes to base64 and return them in chunks (about 700 KB each) to stay under result limits; reassemble the chunks into files on disk with a short script. For SVG, use `format:"SVG_STRING"` (returns text directly).
C. Browser (Claude in Chrome or the built-in browser, signed in as me): open each file in Figma, select the frame, use the right-hand Export panel (PNG 2x / SVG / PDF) and let it download; or open the node URL and save the screenshot.
D. Desktop folder (if the device bridge / a connected folder exists): write the exported files into a folder called "portfolio-export" and tell me where it is.
E. Last resort: build ONE HTML artifact "Portfolio export" where every image is embedded as a data URI, grouped by project, each with its filename shown and a Download button (use `<a download="<slug>/<name>.png">`), plus a "Download all (zip)" button using JSZip from cdnjs. Publish it with the Artifact tool and give me the link. Do this even if A to D worked, so I have a single place to download everything and can hand the link to my other Claude session.

## 5. Output I need at the end (short)
1. The link(s) to the artifact and/or the folder.
2. A table: project, slug, files exported, files missing and why, anything recreated.
3. A one-line list of the best frame IDs per project in case I want to re-export.
Also save the same report as a project doc if you have a Projects tool (path: claude/figma-export-report.md).

## 6. Rules
- Read-only on my Figma files: do not rename, move or delete anything, do not change designs. Creating NEW frames is allowed only if needed to compose a "phones.png" (put them on a new page called "Exports" and tell me).
- Load the Figma skills (figma-use) before use_figma; colours are 0 to 1 in the API.
- No asking me questions. If a file is not accessible, skip it, list it as missing, and carry on.
- Do not include photos of other people in my designs as separate exports; frames are fine as they are.
- Brand colours for any new backgrounds: #15122a (dark), #ba9fe1 (lilac accent), text #ede9ff.
