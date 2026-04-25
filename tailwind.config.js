/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'bg-warm': 'var(--color-bg-warm)',
        ink: {
          1: 'var(--color-ink-1)',
          2: 'var(--color-ink-2)',
          3: 'var(--color-ink-3)',
          4: 'var(--color-ink-4)',
          5: 'var(--color-ink-5)',
        },
        vermilion: {
          DEFAULT: 'var(--color-vermilion)',
          light: 'var(--color-vermilion-light)',
          dark: 'var(--color-vermilion-dark)',
        },
        seal: 'var(--color-seal)',
        lu: 'var(--color-lu)',
        quan: 'var(--color-quan)',
        ke: 'var(--color-ke)',
        ji: 'var(--color-ji)',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', '"PingFang SC"', 'serif'],
        sans: ['"PingFang SC"', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
