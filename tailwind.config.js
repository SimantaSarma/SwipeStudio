/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',
        surface: '#FFFFFF',
        sand: {
          100: '#F2EDE4',
          200: '#E6DFD2',
        },
        ink: {
          900: '#16211F',
          700: '#3E4A47',
          500: '#5B6865',
          400: '#7C8985',
        },
        moss: {
          700: '#0D5C4B',
          600: '#11705B',
          100: '#DDF0E9',
          50: '#EEF8F4',
        },
        saffron: {
          500: '#F2A93B',
          100: '#FDEFD3',
        },
        alert: {
          700: '#B3261E',
        },
        'muted-on-dark': '#A9B6B2',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      letterSpacing: {
        'tag': '0.06em',
      },
      fontSize: {
        'tag': ['12px', { lineHeight: '16px', letterSpacing: '0.06em' }],
      }
    },
  },
  plugins: [],
}
