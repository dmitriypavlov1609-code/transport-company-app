/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1A73E8', light: '#4a93f0', dark: '#1557b0' },
        accent: { DEFAULT: '#FF6D00', light: '#ff8a33', dark: '#cc5700' },
        success: '#00C853',
        danger: '#D50000',
        warning: '#FFD600',
        surface: { DEFAULT: '#F5F5F5', dark: '#121212', card: '#FFFFFF', 'card-dark': '#1E1E1E' },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseDot: { '0%, 100%': { transform: 'scale(1)', opacity: 1 }, '50%': { transform: 'scale(1.5)', opacity: 0.5 } },
      },
    },
  },
  plugins: [],
};
