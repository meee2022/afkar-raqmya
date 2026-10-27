/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7A1630",
        "primary-light": "#96354C",
        gold: "#C9A35F",
        "gold-dark": "#80602D",
        surface: "#FCF9F3",
        "surface-dim": "#F6F0E6",
        charcoal: "#2A0913",
        outline: "#DFD2C4",
      },
      fontFamily: {
        sans: ["Tajawal", "sans-serif"],
      },
      borderRadius: {
        xl: "1.5rem",
        "2xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 30px rgba(74,14,30,0.07)",
        lift: "0 16px 50px rgba(74,14,30,0.12)",
      },
    },
  },
  plugins: [],
};
