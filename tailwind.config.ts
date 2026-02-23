/** @type {import('tailwindcss').Config} */
export default {
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