/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#003527",
        "primary-light": "#064e3b",
        gold: "#fed65b",
        "gold-dark": "#735c00",
        surface: "#fcf9f8",
        "surface-dim": "#eae7e7",
        charcoal: "#1b1c1c",
        outline: "#bfc9c3",
      },
      fontFamily: {
        sans: ["IBM Plex Sans Arabic", "sans-serif"],
      },
      borderRadius: {
        xl: "1.5rem",
        "2xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 40px 0 rgba(0,53,39,0.07)",
        lift: "0 16px 64px 0 rgba(0,53,39,0.12)",
      },
    },
  },
  plugins: [],
};
