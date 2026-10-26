/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF0',
          100: '#FAF4D8',
          200: '#F5E6A7',
          300: '#EFD476',
          400: '#E4BD4B',
          500: '#D4AF37', // Riyadvi Primary Signature Gold
          600: '#B89228',
          700: '#94721D',
          800: '#735619',
          900: '#5A4317',
          light: '#F5E6A7',
          dark: '#B89228',
        },
        obsidian: {
          950: '#000000', // Riyadvi Pure Black
          900: '#06080D',
          850: '#0A0E17',
          800: '#111827',
          700: '#1F2937',
          card: '#0D111A',
          border: 'rgba(212, 175, 55, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'Poppins', 'sans-serif'],
        heading: ['Montserrat', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5E6A7 0%, #D4AF37 50%, #94721D 100%)',
        'gold-glow': 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
        'dark-mesh': 'radial-gradient(circle at 50% 0%, #151b28 0%, #06080d 100%)',
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(212, 175, 55, 0.15)',
        'gold-md': '0 0 30px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 0 50px rgba(212, 175, 55, 0.35)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(212, 175, 55, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
