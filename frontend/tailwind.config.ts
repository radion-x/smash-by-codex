import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
// Use Tailwind blue palette for brand to ensure all shades exist
// (50..900), avoiding missing class errors like text-brand-300.
import colors from 'tailwindcss/colors'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f5',
          100: '#ffe0e2',
          200: '#ffc7cc',
          300: '#ff9aa3',
          400: '#f86a78',
          500: '#e94657',
          600: '#cf1f2c',
          700: '#ad1a25',
          800: '#83151d',
          900: '#5a0f15',
        },
        ink: {
          50: '#f7f8fb',
          100: '#edf0f6',
          200: '#d9deea',
          300: '#b0b8ca',
          400: '#7f8aa8',
          500: '#53607f',
          600: '#313c5a',
          700: '#252f45',
          800: '#1a2233',
          900: '#121725',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 8px 24px -12px rgba(15,23,42,0.35)',
        header: '0 10px 40px -24px rgba(15,23,42,0.65)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'slide-up': 'slide-up 250ms ease-out',
      },
    },
  },
  plugins: [forms()],
} satisfies Config
