/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ubuntu: {
          orange: '#E95420',
          dark: '#300A24',
          purple: '#77216F',
          grey: '#5E2750',
          light: '#AEA79F',
          warm: '#333333',
          glass: 'rgba(48, 10, 36, 0.8)'
        },
        terminal: {
          black: '#2C001E',
          green: '#4E9A06',
          white: '#EEEEEC',
          blue: '#3465A4',
          prompt: '#87ff00'
        }
      },
      fontFamily: {
        mono: ['Ubuntu Mono', 'monospace'],
        sans: ['Ubuntu', 'sans-serif'],
      },
      boxShadow: {
        'ubuntu-glow': '0 0 20px rgba(233, 84, 32, 0.2)',
        'purple-glow': '0 0 25px rgba(119, 33, 111, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
