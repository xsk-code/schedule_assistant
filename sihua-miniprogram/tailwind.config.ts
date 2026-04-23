import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF9',
        surface: '#FFFFFF',
        border: '#E7E5E4',
        text: {
          1: '#1C1917',
          2: '#57534E',
          3: '#A8A29E',
          4: '#D6D3D1'
        },
        sihua: {
          lu: '#4A7C59',
          quan: '#92703A',
          ke: '#4A6B8A',
          ji: '#9B4A4A'
        }
      },
      borderRadius: {
        card: '16rpx'
      },
      spacing: {
        xs: '8rpx',
        sm: '16rpx',
        md: '24rpx',
        lg: '32rpx',
        xl: '48rpx',
        '2xl': '64rpx'
      }
    }
  },
  plugins: []
};

export default config;
