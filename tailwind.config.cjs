/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/publicPage/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate")
  ],
  corePlugins: {
    preflight: true,
  }
}
