# Gaby Norris: Portfolio

React 19 + Vite + Tailwind + DaisyUI, hosted on GitHub Pages, with Firebase (Firestore + Google sign-in) for the contact form and projects.

## Live URL (put this in the QR code)

`https://gabynor05.github.io/MyPortfolio/`

The address is `https://<account>.github.io/<repo-name>/`. **Do not rename the repo or the account**, or the QR code breaks.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds `frontend/` and publishes it. One-time setup: repo **Settings > Pages > Source: GitHub Actions**.

## Firebase (database)

1. https://console.firebase.google.com > Add project (free Spark plan).
2. Build > **Firestore Database** > Create database (production mode, pick a region such as `europe-west1` or `africa-south1` if offered).
3. Build > **Authentication** > Get started > enable the **Google** provider only. Under Settings > Authorized domains add `gabynor05.github.io`.
4. Firestore > **Rules** tab > paste the contents of `firestore.rules` > Publish. These rules have no expiry date.
5. Project settings > Your apps > Web (`</>`) > copy the config into `frontend/src/lib/firebaseConfig.js`, commit and push.
6. On the live site, click your name in the footer (or type `admin`), sign in with Google, press **Copy local projects to Firestore**.

Until step 5 the site runs on the local data in `frontend/src/data/portfolioData.js`, and the contact form opens the visitor's email app instead.
