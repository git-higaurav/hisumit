/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#1a1a1a',
          lighter: '#2d2d2d',
          darker: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#60a5fa',
        }
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out forwards',
        scaleIn: 'scaleIn 0.5s ease-in-out forwards',
        slideUp: 'slideUp 0.5s ease-in-out forwards',
        slideIn: 'slideIn 0.5s ease-in-out forwards',
        slideOut: 'slideOut 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
} 