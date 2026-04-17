/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sihua: {
          lu: '#10B981',
          quan: '#F59E0B',
          ke: '#3B82F6',
          ji: '#EF4444',
        }
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Noto Serif SC', 'Georgia', 'serif'],
        sans: ['Noto Sans SC', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(28, 25, 23, 0.05)',
        'DEFAULT': '0 1px 3px rgba(28, 25, 23, 0.04), 0 1px 2px rgba(28, 25, 23, 0.03)',
        'md': '0 4px 6px -1px rgba(28, 25, 23, 0.04), 0 2px 4px -1px rgba(28, 25, 23, 0.03)',
        'lg': '0 10px 15px -3px rgba(28, 25, 23, 0.04), 0 4px 6px -2px rgba(28, 25, 23, 0.02)',
      },
    },
  },
  plugins: [],
}