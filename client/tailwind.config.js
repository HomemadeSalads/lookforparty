/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#b02826",
        "surface": "#fff8f2",
        "surface-variant": "#f3e0c0",
        "on-surface": "#231a06",
        "on-background": "#231a06",
        "tertiary": "#735c00",
        "outline-variant": "#dbc2b2",
        // Add the rest of the colors from your script tag here...
      },
      fontFamily: {
        headline: ["Newsreader", "serif"],
        body: ["Noto Serif", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
};
