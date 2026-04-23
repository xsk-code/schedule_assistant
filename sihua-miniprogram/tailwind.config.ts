import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D97757',
          light: '#F5E6DE',
          dark: '#B85A3A'
        },
        bg: '#FAFAF9',
        surface: '#FFFFFF',
        border: 'rgba(0, 0, 0, 0.06)',
        text: {
          1: '#1C1917',
          2: '#78716C',
          3: '#A8A29E',
          4: '#D6D3D1'
        },
        sihua: {
          lu: '#6B9E7A',
          quan: '#C49A5C',
          ke: '#7BA3C4',
          ji: '#C47A7A'
        }
      },
      borderRadius: {
        '2xl': '24rpx',
        xl: '20rpx',
        card: '16rpx'
      },
      spacing: {
        xs: '8rpx',
        sm: '16rpx',
        md: '24rpx',
        lg: '40rpx',
        xl: '56rpx',
        '2xl': '80rpx'
      },
      fontFamily: {
        sans: ['ui-sans-serif', '-apple-system', 'PingFang SC', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'PingFang SC', 'Noto Serif SC', 'serif']
      }
    }
  },
  plugins: []
};

export default config;
