/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    minWidth: {
      '52': '208px',
    },
    maxWidth: {
      '64': '256px',
    }
  },
  plugins: [],
}
