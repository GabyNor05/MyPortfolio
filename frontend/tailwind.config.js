/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Map your custom fonts
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      // 2. Map your custom border radii
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '20px',
        'pill': '99px',
      },
      // 3. Map custom transition timing functions
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [require("daisyui")],
  // 4. Configure daisyUI light and dark themes
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#5f5baf",          // --accent / --misty
          "secondary": "#568de4",        // --accent-2 / --rainy
          "accent": "#9a64c5",           // --purple
          "neutral": "#4a4470",          // --text-2
          
          // Background surfaces mapped safely to daisyUI base system
          "base-100": "#f5f4fc",         // --bg-base
          "base-200": "#ffffff",         // --bg-surface
          "base-300": "#edeaff",         // --bg-raised
          
          // Text styling mapping
          "--text-1": "#1a1630",     // --text-1
          "--text-3": "#8a85b0",   // --text-3

          // Custom variable injections for borders & glows to use in classes via style arbitrary values if needed
          "--border": "rgba(95,91,175,0.12)",
          "--border-mid": "rgba(95,91,175,0.22)",
          "--glow": "rgba(95,91,175,0.12)",
          "--glow-2": "rgba(86,141,228,0.10)",
        },
        dark: {
          "primary": "#9a64c5",          // --accent / --purple
          "secondary": "#568de4",        // --accent-2 / --rainy
          "accent": "#ba9fe1",           // --lilac
          "neutral": "#b8b0d8",          // --text-2
          
          // Background surfaces mapped safely to daisyUI base system
          "base-100": "#0e0c1a",         // --bg-base
          "base-200": "#15122a",         // --bg-surface
          "base-300": "#1d1935",         // --bg-raised
          
          // Text styling mapping
          "--text-1": "#ede9ff",     // --text-1
          "--text-3": "#7b739e",   // --text-3


          // Custom variable injections
          "--border": "rgba(186,159,225,0.12)",
          "--border-mid": "rgba(186,159,225,0.22)",
          "--glow": "rgba(154,100,197,0.20)",
          "--glow-2": "rgba(86,141,228,0.15)",
        },
      },
    ],
  },
}