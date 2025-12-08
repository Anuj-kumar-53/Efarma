// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf0dc',
          200: '#bce1bc',
          300: '#8fcc8f',
          400: '#5db05d',
          500: '#3d943d',
          600: '#2f7a2f',
          700: '#286228',
          800: '#234e23',
          900: '#1e411e',
        },
        secondary: {
          50: '#fdf8e6',
          100: '#f9e9b9',
          200: '#f4da89',
          300: '#efca57',
          400: '#eabb2c',
          500: '#e4ab12',
          600: '#d49a0e',
          700: '#c0880c',
          800: '#ab7709',
          900: '#8f6106',
        },
        earthy: {
          50: '#faf7f2',
          100: '#f1e9d9',
          200: '#e2d2b4',
          300: '#ccb485',
          400: '#b89658',
          500: '#a57f3c',
          600: '#8c6830',
          700: '#705129',
          800: '#5a4224',
          900: '#4b3721',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}