import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
      },
      animation: {
        shimmer: 'shimmer 5s linear infinite',
      },
      colors: {
        neutral: {
          100: '#f5f5f5',
          300: '#d4d4d4',
          500: '#737373',
          700: '#404040',
          900: '#0a0a0a',
        },
        accent: {
          500: '#0a84ff',
          700: '#0066cc',
        },
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.08)',
        lift: '0 20px 50px rgba(0,0,0,0.16)',
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
