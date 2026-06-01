/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        blush: '#fdf2f8',
        ivory: '#fefce8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(186,230,253,0.85) 0%, rgba(254,243,199,0.75) 100%)',
        'gold-shimmer':  'linear-gradient(90deg, #fbbf24 0%, #fde68a 50%, #fbbf24 100%)',
      },
      animation: {
        'scroll-left': 'scrollLeft 30s linear infinite',
        'fade-up':     'fadeUp 0.6s ease forwards',
        'shimmer':     'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        scrollLeft: { '100%': { transform: 'translateX(-50%)' } },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}