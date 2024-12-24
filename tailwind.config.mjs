/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        festiveRed: "#e63946",
        festiveGreen: "#2a9d8f",
        festiveGold: "#f4a261",
      },
      keyframes: {
        snowFall: {
          "0%": { transform: "translateY(-100px)", opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0.5" },
        },
        sway: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(20px)" },
        },
      },
      animation: {
        snowFall: "snowFall 5s linear infinite",
        sway: "sway 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
