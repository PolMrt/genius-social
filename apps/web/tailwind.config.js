/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        sans2: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        facebook: { light: "#1877F2" },
        "dark-blue": {
          DEFAULT: "#3BA2DC",
          50: "#D7ECF8",
          100: "#C5E4F5",
          200: "#A3D3EF",
          300: "#80C3E8",
          400: "#5EB2E2",
          500: "#3BA2DC",
          600: "#248ECA",
          700: "#1C6D9A",
          800: "#134B6B",
          900: "#0B2A3B",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
