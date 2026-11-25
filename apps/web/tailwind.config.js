/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pure: '#FFFFFF',
        ivory: '#FAF9F6',
        porcelain: '#F5F4F0',
        platinum: '#E8E8E8',
        charcoal: '#262626',
        graphite: '#454545',
        silver: '#A4A4A4',
        brand: {
          green: '#03F008',
          emerald: '#00A846',
          teal: '#02D2C1',
          cyan: '#0299F7',
          blue: '#0241FC',
          cobalt: '#0132C9',
        },
        gold: {
          light: '#02D2C1',
          DEFAULT: '#0252FC',
          dark: '#0132C9',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        display: ['Manrope', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        luxury: '.25em',
        ultra: '.35em',
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(0, 0, 0, 0.03)',
        luxe: '0 10px 35px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02)',
        'luxe-hover': '0 20px 45px -10px rgba(2, 65, 252, 0.10), 0 0 0 1px rgba(2, 153, 247, 0.12)',
      },
      animation: {
        'dial-spin-slow': 'dialSpin 120s linear infinite',
        'subtle-pulse': 'subtlePulse 4s ease-in-out infinite',
      },
      keyframes: {
        dialSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
