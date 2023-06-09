/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter"', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        laptop: "1450px",
      },
      aspectRatio: {
        '1/4' : '1.4',
      }
    },
  },
  plugins: [require("@tailwindcss/forms"),require("@tailwindcss/line-clamp")],
};

