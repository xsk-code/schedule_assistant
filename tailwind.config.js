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
      }
    },
  },
  plugins: [],
}
