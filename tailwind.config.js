/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'clocktower-gold': '#c1a171',
        'clocktower-dark': 'rgba(20, 20, 20, 0.807)',
        'clocktower-text': 'rgba(245, 245, 245, 0.97)',
        'clocktower-red': 'rgb(177, 36, 36)',
      },
      fontFamily: {
        'almendra': ['Almendra', 'serif'],
        'xanh-mono': ['Xanh Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}



