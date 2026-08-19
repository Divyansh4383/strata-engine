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
        obsidian: {
          DEFAULT: '#050608',
          subtle: '#090b0f',
          card: '#0d0f14',
          panel: '#13161f',
          border: '#1f2430',
          hover: '#282f3f'
        },
        strata: {
          amber: '#f59e0b',
          amberGlow: 'rgba(245, 158, 11, 0.15)',
          cyan: '#06b6d4',
          cyanGlow: 'rgba(6, 182, 212, 0.15)',
          emerald: '#10b981',
          rose: '#f43f5e',
          violet: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'glow-bounce': 'glowBounce 3s ease-in-out infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        glowBounce: {
          '0%': { opacity: '0.4', filter: 'blur(20px)' },
          '100%': { opacity: '0.8', filter: 'blur(35px)' }
        }
      }
    },
  },
  plugins: [],
}
