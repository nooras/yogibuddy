/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        forest: "#264D3D",
        sage: "#789983",
        paper: "#F7F8F3",
        lavender: "#EAE8F5",
      },
      fontFamily: { sans: ["DM Sans", "sans-serif"], display: ["Fraunces", "serif"] },
    },
  },
  plugins: [],
};
