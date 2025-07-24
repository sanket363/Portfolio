/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { mono: ['JetBrains Mono', 'monospace'] },
      colors: {
        frappe: {
          bg: '#303446',
          surface: '#414559',
          text: '#c6d0f5',
          accent: '#8caaee',
          green: '#a6d189',
          orange: '#ff9e64'
        }
      }
    }
  },
  plugins: []
};
