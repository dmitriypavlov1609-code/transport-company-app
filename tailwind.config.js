/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'Manrope', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#0F172A', light: '#1E293B', dark: '#020617' },
        accent: { DEFAULT: '#2563EB', light: '#3B82F6', dark: '#1D4ED8' },
        success: '#059669',
        danger: '#DC2626',
        warning: '#D97706',
        surface: { DEFAULT: '#F8FAFC', dark: '#0F172A', card: '#FFFFFF', 'card-dark': '#1E293B' },
      },
      borderRadius: {
        '2xl': '12px',
        'xl': '8px',
        'lg': '6px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(12px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseDot: { '0%, 100%': { transform: 'scale(1)', opacity: 1 }, '50%': { transform: 'scale(1.5)', opacity: 0.5 } },
      },
    },
  },
  plugins: [],
};
