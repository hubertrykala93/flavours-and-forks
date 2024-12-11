/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'text-color': '#333333',
        'placeholder-text-color': '#464646',
        'button-hover': '#c91618',
        'primary-red': '#ea2a2c'
      },
    },
  },
  plugins: [],
}
