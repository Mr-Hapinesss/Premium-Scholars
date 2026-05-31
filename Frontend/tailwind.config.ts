import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
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
        sky: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        rose: '#fb7185',
        blush: '#fdf2f8',
        ivory: '#fefce8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, rgba(186,230,253,0.85) 0%, rgba(254,243,199,0.75) 100%)',
        'gold-shimmer':
          'linear-gradient(90deg, #fbbf24 0%, #fde68a 50%, #fbbf24 100%)',
      },
      backgroundSize: {
        '200': '200% 200%',
      },
      animation: {
        'scroll-left': 'scrollLeft 30s linear infinite',
        'fade-up':     'fadeUp 0.6s ease forwards',
        'shimmer':     'shimmer 2.5s ease-in-out infinite',
        'spin-slow':   'spin 3s linear infinite',
      },
      keyframes: {
        scrollLeft: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      boxShadow: {
        'gold': '0 4px 24px -4px rgba(251,191,36,0.25)',
        'sky':  '0 4px 24px -4px rgba(14,165,233,0.20)',
      },
    },
  },
  plugins: [],
}

export default config