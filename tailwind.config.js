/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b1220",
        panel: "#0f1625",
        border: "#1c2740",
        limey: "#65a30d",
        limey2: "#84cc16"
      }
    }
  },
  plugins: [],
}
