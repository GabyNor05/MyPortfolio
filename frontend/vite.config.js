import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' = relative asset paths, so the site works at ANY GitHub Pages
// address (https://<user>.github.io/<repo-name>/) without editing this file.
// The app uses HashRouter, so deep links never 404 on GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
})
