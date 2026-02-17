/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Added from your HTML script
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Added from your HTML script
      },
      colors: {
        slate: {
          850: '#151e32', // Added from your HTML script
        },
      },
    },
  },
  plugins: [],
}