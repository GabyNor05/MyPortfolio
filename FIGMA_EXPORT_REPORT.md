# Figma export report (16 Nov 2026)

## Where the files are
- **Repo:** branch `figma-exports` of GabyNor05/MyPortfolio
  - `frontend/public/projects/<slug>/`: `cover.png` (Nia: `cover.jpg`), `1.png` … `n.png`, `phones.png` where relevant, and `info.json` (slug, fileKey, nodeIds, captions, alt text)
  - `frontend/public/brand/`: logos (SVG), email signatures, Behance and GitHub banners, dot groups (SVG)
  - `frontend/public/cv/`: `cv-development`, `cv-hybrid`, `cv-ux` (PDF + PNG preview)
- **Gaby's computer:** `D:\Downloads\portfolio-export\<slug>\` (same files)
- Existing `cover.jpg` and `g*.jpg` images in `whelmer/` and `get-up-and-go/` were left untouched. New files sit beside them.

## How they were exported
Figma's image host is blocked from Claude's sandbox and from the shell on the PC, so each export was rendered by the Figma connector and fetched through Claude in Chrome into `D:\Downloads`, then committed.
- Frames 2400 px wide or more: downscaled to 2400 px wide.
- Frames under 1600 px wide: exported at 2x, capped at 2400 px wide.
- Frames 1600–2400 px wide (most 1920 / 1600 / 1768 frames): exported at **native 1x** (1600–1920 px wide) to keep the export manageable. Re-export at a scale up to 1.25–1.5x if you need them sharper.
- Nothing was recreated by hand; every file is a direct Figma export.

## Per project
| Project | slug | Files | Missing / notes |
|---|---|---|---|
| ForageScan | forage-scan | cover, 1–4, phones | – |
| Spoonful | spoonful | cover, 1–6 | No phones.png (web design system) |
| Amadea Safehouse | amadea-safehouse | cover, 1–5 | No phones.png: it's a website; `5.png` is the mobile-designs mockup |
| StoryWeave | storyweave | cover, 1–5, phones | phones.png uses 3 **tablet** screens (it's a tablet app) |
| Nia | nia | cover.jpg, 1–4, phones | cover saved as JPG (3.5 MB photographic mockup) |
| MasterChef Broadway | masterchef-broadway | cover, 1–4, phones | phones.png shows the top of the Before / During / After mobile pages |
| MakerSpace | makerspace | cover, 1–5 | Not a phone app |
| Uplifters | uplifters | cover, 1–5 | No phones.png: web platform with no mobile screens |
| Hackathon (SpaceDUCKED) | hackathon | cover, 1–5 | Not a phone app |
| StageVote | stagevote | 1–5 | **No cover**: no landscape hero frame exists (use `5.png` cropped, or design one). No phones.png: desktop-only. The "Frame 9" quotes board was deliberately skipped |
| Whelmer | whelmer | cover, 1–5, phones | phones.png built from the real app screenshots (the Figma Tasks/Focus frames are empty) |
| Get Up & Go | get-up-and-go | cover, 1–4, phones | phones.png built from the real app screenshots (the DV page frames are greyscale wireframes) |
| Brand kit | brand | logo-lilac / indigo / dark.svg, logo-cross-inside / steeple-lilac.svg, logo-board.png, email-signature-light / dark.png, behance-banner-v1 / v2-dotted-fade / photo / v3a / v3b / v3c.png, github-banner.png, dots-group.svg, dotted-fade.svg | No headshot / photo-shoot frames exist in the file (the photo boxes are empty placeholders) |
| CVs | cv | cv-development, cv-hybrid, cv-ux (.pdf + .png) | PDFs are about 4 MB each (embedded images) |

## Figma changes
- A new page called **"Exports"** was added to 5 files to hold the phones composites: ForageScan (`336:3`), Nia (`494:3`), MasterChef (`320:3`), StoryWeave (`343:3`), Personal Projects (Whelmer `479:269`, Get Up & Go `479:278`). They contain copies only. Delete the page whenever you like.
- Nothing else was renamed, moved or edited.

## Frame IDs (for re-export)
- **forage-scan** (NDu5zIjWSzORTB8lb0V9nm): 328:3213, 144:26774, 144:27364, 35:15, 144:26775
- **spoonful** (MFGQH2Qm0DhFOHmjGzZeB4): 5737:3009, 5687:39202, 5687:39208, 5687:39303, 5687:39407, 1401:12, 5687:39522
- **amadea-safehouse** (mxub4SDMQx8DkFhLZH0tGo): 1145:4870, 407:763, 1045:9539, 1045:9187, 1045:10076, 1045:8622
- **storyweave** (JgGpE1CPDKr3nMxVIDEh52): 189:20, 113:4078, 132:1413, 132:2899, 132:3230, 191:476
- **nia** (X2TuJacy9HjFsjW0z4jMmh): 465:5933, 151:3114, 187:3723, 465:5947, 465:5961
- **masterchef-broadway** (qFKRQ6PGmi5dpGjKfBgTiW): 212:23464, 155:21, 215:23551, 215:23537, 86:1162
- **makerspace** (ZqO3qFy1fpA8sOxnYuBZKp): 1087:6353, 1027:7571, 1027:7836, 1027:7961, 646:2721, 1058:6331
- **uplifters** (v4z97EeOhVzp0bkVzubTHP): 264:402, 143:2833, 359:5815, 62:169, 266:18500, 266:18693
- **hackathon** (u1Ieuy4qXE2EmqVi5XZgbE): 459:79, 289:53818, 242:5, 207:16336, 319:2134, 207:32647
- **stagevote** (29YeBdzaJQGa9UBPIJXofO): 198:21, 14:372, 14:366, 14:368, 4:141
- **whelmer** (abDigYTVFUhQw7PPjyMaqO): 407:8, 315:84, 321:170, 407:41, 407:57, 407:85
- **get-up-and-go** (abDigYTVFUhQw7PPjyMaqO): 307:1297, 280:1276, 281:1293, 281:1299, 278:1262
- **brand** (abDigYTVFUhQw7PPjyMaqO): logos 464:4 / 464:14 / 464:24, cross logos 468:93 / 468:106, logo board 464:34, signatures 464:72 / 468:121, Behance banners 464:90 / 468:148 / 462:102 / 475:107 / 475:283 / 475:459, GitHub banner 465:1450, dots 465:1455 / 468:855
- **cv** (abDigYTVFUhQw7PPjyMaqO): development 402:95, hybrid 402:2, UX 468:874

## Heads-up for the site build
Some PNGs are heavy (MasterChef `4.png` 5.7 MB, Uplifters `3.png` 4.9 MB, StageVote `1.png` 3 MB, Nia `3/4.png` about 3.3 MB). Consider converting to WebP/JPG or lazy-loading them.
