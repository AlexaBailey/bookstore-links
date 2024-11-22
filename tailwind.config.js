/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 15s linear infinite",
      },
      colors: {
        primary: "#93D50A",
        mint: "#87C948",
        secondary: "#B0B0B0",
        tertiary: "#7F7F7F",
        hero: "#b8e506",
        grey: "#999",
        myblack: "#121212",
      },
      fontFamily: {
        Murs: "Murs",
        Manrope: "Manrope",
        Akrobat: "Akrobat",
      },
    },
  },
  plugins: [],
};
