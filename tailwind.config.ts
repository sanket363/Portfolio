import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ctp-rosewater': '#f2d5cf',
        'ctp-flamingo': '#eebebe',
        'ctp-pink': '#f4b8e4',
        'ctp-mauve': '#ca9ee6',
        'ctp-red': '#e78284',
        'ctp-maroon': '#ea999c',
        'ctp-peach': '#ef9f76',
        'ctp-yellow': '#e5c890',
        'ctp-green': '#a6d189',
        'ctp-teal': '#81c8be',
        'ctp-sky': '#99d1db',
        'ctp-sapphire': '#85c1dc',
        'ctp-blue': '#8caaee',
        'ctp-lavender': '#babbf1',
        'ctp-text': '#c6d0f5',
        'ctp-subtext1': '#b5bfe2',
        'ctp-subtext0': '#a5adce',
        'ctp-overlay2': '#949cbb',
        'ctp-overlay1': '#838ba7',
        'ctp-overlay0': '#737994',
        'ctp-surface2': '#626880',
        'ctp-surface1': '#51576d',
        'ctp-surface0': '#414559',
        'ctp-base': '#303446',
        'ctp-mantle': '#292c3c',
        'ctp-crust': '#232634',
      },
      fontFamily: {
        mono: ['var(--font-fira-code)', 'monospace'],
      },
      animation: {
        'typing': 'typing 2s steps(20, end), blink .75s step-end infinite',
      },
      keyframes: {
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          'from, to': { 'border-color': 'transparent' },
          '50%': { 'border-color': '#8caaee' }, // ctp-blue
        },
      },
    },
  },
  plugins: [require('@tailwindcss/nesting')],
}
export default config
