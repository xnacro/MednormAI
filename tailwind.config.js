/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060e1e',
          900: '#0b1529',
          800: '#0f1d38',
          700: '#142a4e',
          600: '#1a3768',
          500: '#1e3a5f',
        },
        accent: {
          cyan: '#06d6f2',
          blue: '#3b82f6',
          indigo: '#6366f1',
          violet: '#8b5cf6',
          purple: '#a855f7',
          pink: '#ec4899',
          rose: '#f43f5e',
          emerald: '#10b981',
          green: '#34d399',
          amber: '#f59e0b',
          orange: '#f97316',
          red: '#ef4444',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-blue': 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
        'glow-cyan': 'radial-gradient(circle, rgba(6,214,242,0.12) 0%, transparent 70%)',
        'glow-violet': 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pipeline-pulse': 'pipeline-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(37,99,235,0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(37,99,235,0.5)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pipeline-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(59, 130, 246, 0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
