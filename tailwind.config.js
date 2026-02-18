/** @type {import('tailwindcss').Config} */
export default {
  // BUG FIX 1: The original content array pointed to "./src/**/*" which doesn't
  // exist in this project (no src/ folder). Every class was being purged in
  // production builds, resulting in a completely unstyled / blank-looking app.
  darkMode: 'class',
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // BUG FIX 2: The "electric-*" color tokens (electric-400, electric-500,
        // electric-600) are used in App.tsx, ResultBox.tsx, and HistoryCards.tsx
        // but were completely absent from the config. Tailwind had no idea what
        // these classes meant and generated nothing for them.
        electric: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        slate: {
          // BUG FIX 3: slate-850 is used in ResultBox.tsx but wasn't registered.
          850: '#151e32',
        },
      },
      // BUG FIX 4: animate-fade-in-up is used in HistoryCards.tsx but was never
      // defined. Without this the animation class is silently dropped, and in
      // strict purge mode the class itself is also stripped from the output.
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}