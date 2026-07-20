/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable toggling dark mode via CSS class
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary-blue)',
          hover: 'var(--primary-blue-hover)',
        },
        accent: {
          DEFAULT: 'var(--accent-emerald)',
          hover: 'var(--accent-emerald-hover)',
        }
      },
      borderRadius: {
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      }
    },
  },
  plugins: [],
}