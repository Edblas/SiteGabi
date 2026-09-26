/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bordo: {
          DEFAULT: '#581221',
          deep: '#3B0813',
          soft: '#8B2E3A',
        },
        creme: {
          DEFAULT: '#FBF6F2',
          deep: '#F2EAE1',
        },
        vinho: {
          DEFAULT: '#2B1216',
          soft: '#4A1E25',
        },
        rose: {
          nude: '#E8CFC8',
          soft: '#F3E3DE',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.22em',
        wideish: '0.12em',
      },
      fontSize: {
        'display': ['clamp(2.75rem, 9vw, 6.25rem)', { lineHeight: '0.92', letterSpacing: '-0.01em' }],
        'h-editorial': ['clamp(2rem, 5.5vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.005em' }],
      },
      boxShadow: {
        paper: '0 1px 0 0 rgba(88, 18, 33, 0.10)',
        card: '0 1px 2px rgba(43, 18, 22, 0.06), 0 6px 24px -12px rgba(59, 8, 19, 0.28)',
      },
      backgroundImage: {
        'paper-texture':
          "radial-gradient(rgba(88, 18, 33, 0.040) 1px, transparent 1px), radial-gradient(rgba(43, 18, 22, 0.030) 1px, transparent 1px)",
        'hero-bleed':
          "linear-gradient(180deg, rgba(251,246,242,0) 0%, rgba(251,246,242,0.92) 88%, #FBF6F2 100%)",
      },
      backgroundSize: {
        'paper': '22px 22px, 22px 22px',
      },
      backgroundPosition: {
        'paper': '0 0, 11px 11px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 34s linear infinite',
        'fade-up': 'fadeUp 600ms ease-out both',
      },
      content: {
        'dot-bordo': '""',
      },
    },
  },
  plugins: [],
}
