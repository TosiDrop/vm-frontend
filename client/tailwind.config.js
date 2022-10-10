/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xxs: "0.6rem",
      },
      minWidth: {
        40: "10rem",
        52: "13rem",
      },
      maxWidth: {
        64: "16rem",
        52: "13rem",
        ['8xl']: "88rem",
      },
    },
  },
  plugins: [],
};
