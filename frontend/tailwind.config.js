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
          DEFAULT: '#FFD700',
          dark: '#FFC700',
          light: '#FFF3CD'
        },
        secondary: {
          DEFAULT: '#4CAF50',
          dark: '#388E3C',
          light: '#81C784'
        },
        accent: {
          DEFAULT: '#2196F3',
          dark: '#1976D2',
          light: '#64B5F6'
        },
        warning: {
          DEFAULT: '#FF9800',
          dark: '#F57C00',
          light: '#FFB74D'
        },
        danger: {
          DEFAULT: '#F44336',
          dark: '#D32F2F',
          light: '#EF5350'
        },
        purple: {
          DEFAULT: '#9C27B0',
          dark: '#7B1FA2',
          light: '#BA68C8'
        }
      },
      fontFamily: {
        'comic': ['Comic Sans MS', 'cursive'],
        'display': ['Fredoka', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(255, 215, 0, 0.5)',
        'neon-green': '0 0 20px rgba(76, 175, 80, 0.5)',
        'neon-blue': '0 0 20px rgba(33, 150, 243, 0.5)',
      }
    },
  },
  plugins: [],
}