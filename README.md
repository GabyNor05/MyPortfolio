# Gaby Norris: Portfolio

A single-page portfolio built as a **D&D character sheet**: ability scores, saving throws, skills and languages sit on the sheet, projects are "quests", and every click on a modifier rolls a real 3D d20. Built for internship applications in software development and UX design.

**Live:** https://gabynor05.github.io/MyPortfolio/ (this address is printed on my showcase poster QR code, so the repository name must never change.)

## What it does
- **Character sheet home page** with a hero, six ability scores, saving throws, skills, languages and tools. Everything with a number is clickable and rolls a d20 plus its bonus.
- **3D dice and game log.** A physically tumbling d20 (three.js) lands with the roll facing the camera; the d20 face is my logo. The game log records rolls and visitor chat, and "Roll for Insight" reveals a fun fact about me. Soft synthesized dice sounds with a mute button; reduced-motion users get no animation.
- **Projects ("quests")** with a gallery, optional muted looping video, links (Figma, GitHub, Behance), tools, wireframes strip, highlights and reflection. Layout: media on the left, "the adventure" (what the product is and the solution) and "the quest" (the brief) on the right.
- **About tab** with Developer / Designer / Tinkerer sections, experience, skills and a "Request my CV" form. CVs are not public: requests land in my admin dashboard and I send the right version (development, UX or hybrid) by email.
- **Contact tab** that emails me and shows in the admin.
- **Dark and light mode**, fully responsive, keyboard accessible, with a friendly "critical fail" page for unknown routes.

## Admin dashboard (`/#/admin`, owner only)
Sign in with email and password, then:
- **Overview:** counts, most viewed projects, latest messages, CV requests and chat.
- **Projects:** add, edit, hide, delete; image, video and wireframe uploads; live preview drawer.
- **Messages and chat**, with an unresolved counter that emails me a reminder at every 5th unresolved message.
- **CV requests:** pending, sent, denied and a permanent mailing list with CSV export.
- **Content editor:** About text, experience, skills, ability scores, saving throws, languages and tools.
- **Site settings:** name, role, links, campaign, voiceover audio, logo and upload settings.
Everything is saved to Firestore and shown live, so changing content never needs a code change.

## Stack and decisions
| Area | Choice | Why |
|---|---|---|
| UI | React 19, Vite 8, React Router (hash routing), hand-written CSS with variables | Hash routing works on GitHub Pages without server rules; CSS variables give light and dark themes |
| 3D | three.js (lazy loaded) | Only downloaded when the first d20 is rolled |
| Data | Firebase Firestore + email/password Auth | Free tier, live updates, security rules enforce owner-only access |
| Email | EmailJS (REST, no SDK) | Owner alerts and CV emails without a server |
| Media uploads | Cloudinary unsigned preset | Free, supports image, video and audio |
| Hosting | GitHub Pages via GitHub Actions | Free and deploys on every push to `main` |
| Palette | Indigo #5f5baf, blue #568de4, purple #9a64c5, lilac accent #ba9fe1, deep navy surfaces | Taken from my own Figma brand kit |
| Type | Roboto Condensed and Roboto | Readable, matches the sheet look |

Design choices: costs are shown in USD and ZAR, CVs are shared by request rather than posted publicly, and the site reads the same content defaults from code when the database is empty, so it never shows a blank page.

## Project structure
```
frontend/
  src/pages/home/       sheet panels and tabs
  src/pages/project/    project page
  src/pages/admin/      login and dashboard
  src/components/       logo, header, dice (3D), game log, admin upload fields
  src/lib/              Firebase, settings store, dice, sound, email
  src/data/             built-in defaults (projects.json, portfolioData.js)
  public/projects/      compressed project images
  public/brand/         logos, banners and the email signature
firestore.rules         security rules (paste into the Firebase console and Publish)
```

## Run locally
```bash
cd frontend
npm install
npm run dev
```

## Deploy
Every push to `main` runs `.github/workflows/deploy.yml`, which builds `frontend/` and publishes it. Settings, Pages, Source must be **GitHub Actions**.

## One-time setup
1. **Firebase:** create a Firestore database, enable Email/Password sign-in, create the owner account, then paste `firestore.rules` into Firestore, Rules and Publish. Put the web config in `frontend/src/lib/firebaseConfig.js`.
2. **EmailJS:** create a service and two templates (alert to me, send my CV). Paste the HTML from `EMAILJS_TEMPLATES.md` and the IDs into `frontend/src/lib/emailConfig.js`. Setup details are in `EMAILJS_SETUP.md`.
3. **Cloudinary (uploads):** create a free account, add an unsigned upload preset, and paste the cloud name and preset in the admin under Site settings, Uploads.

## Notes
The owner list lives in `firestore.rules` and `frontend/src/lib/firebaseConfig.js`. The repository is private; this README explains the project to anyone who is given access.
