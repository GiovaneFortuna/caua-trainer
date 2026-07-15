/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00897B',
          dark: '#00695C',
          light: '#4DB6AC',
        },
      },
    },
  },
  plugins: [],
}
