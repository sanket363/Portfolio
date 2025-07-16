/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#00fff5',
        secondary: '#ff00ff',
        accent: '#ffff00',
        background: '#0a0a0f',
        surface: '#1a1a2e',
        textPrimary: '#ffffff',
        textSecondary: '#b3b3b3',
        textAccent: '#00fff5',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8',
        disabled: '#6c757d',
        hover: 'rgba(255,255,255,0.1)',
        active: 'rgba(255,255,255,0.2)',
        focus: 'rgba(0,255,245,0.4)',
        pressed: 'rgba(255,0,255,0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00fff5 0%, #ff00ff 100%)',
        'gradient-primary-45': 'linear-gradient(45deg, #00fff5 0%, #ff00ff 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #ff00ff 0%, #ffff00 100%)',
        'gradient-glow': 'rgba(0,255,245,0.5)',
        'gradient-radial': 'radial-gradient(circle at center, #00fff5, #ff00ff)',
      },
      boxShadow: {
        neon: '0 0 10px rgba(0,255,245,0.5), 0 0 20px rgba(0,255,245,0.3)',
        'neon-hover': '0 0 20px rgba(255,0,255,0.5), 0 0 40px rgba(255,0,255,0.3)',
        'elevation-1': '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)',
        'elevation-2': '0px 3px 6px rgba(0,0,0,0.16), 0px 3px 6px rgba(0,0,0,0.23)',
        'elevation-3': '0px 10px 20px rgba(0,0,0,0.19), 0px 6px 6px rgba(0,0,0,0.23)',
        'elevation-4': '0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22)',
        'elevation-5': '0px 19px 38px rgba(0,0,0,0.30), 0px 15px 12px rgba(0,0,0,0.22)',
        'neumo-inset': 'inset 2px 2px 5px rgba(0,0,0,0.2), inset -5px -5px 10px rgba(255,255,255,0.1)',
        'neumo-outset': '5px 5px 15px rgba(0,0,0,0.3), -5px -5px 15px rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      borderWidth: {
        glass: '1px',
      },
      borderColor: {
        glass: 'rgba(255,255,255,0.2)',
      },
      scale: {
        '95': '0.95',
        '105': '1.05',
        '110': '1.1',
        '150': '1.5',
      },
      translate: {
        'z-10': 'translateZ(10px)',
        'z-20': 'translateZ(20px)',
      },
      perspective: {
        '3d': '1000px',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        mobile: '200ms',
        tablet: '300ms',
        desktop: '400ms',
      },
      transitionTimingFunction: {
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        customBezier: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        ripple: 'ripple 0.6s ease-out',
        'morph-border': 'morphBorder 1.5s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'text-reveal': 'textReveal 0.8s ease forwards',
        'neon-flicker': 'neonFlicker 1.5s linear infinite',
        'tap-feedback': 'tapFeedback 0.2s ease-in-out',
        'spin-glow': 'spin 1s linear infinite, glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.5)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        morphBorder: {
          '0%': { borderRadius: '20%', borderColor: '#00fff5' },
          '50%': { borderRadius: '50%', borderColor: '#ff00ff' },
          '100%': { borderRadius: '20%', borderColor: '#00fff5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        textReveal: {
          '0%': { opacity: '0', transform: 'translateY(0.25em)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        neonFlicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '0.99', filter: 'drop-shadow(0 0 2px #00fff5)' },
          '20%, 24%, 55%': { opacity: '0.4', filter: 'none' },
          '22%, 26%, 53%': { opacity: '0.8', filter: 'drop-shadow(0 0 6px #ff00ff)' },
        },
        tapFeedback: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  variants: {
    extend: {
      animation: ['motion-safe', 'motion-reduce', 'hover', 'responsive'],
      boxShadow: ['hover', 'active', 'focus'],
      backdropBlur: ['hover', 'focus'],
      transform: ['hover', 'active', 'group-hover'],
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      const newUtilities = {
        '.glass-card': {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: `1px solid ${theme('borderColor.glass')}`,
          boxShadow: theme('boxShadow.neon'),
        },
        '.glass-sm': {
          backdropFilter: 'blur(4px)',
        },
        '.glass-md': {
          backdropFilter: 'blur(8px)',
        },
        '.glass-lg': {
          backdropFilter: 'blur(12px)',
        },
        '.neumo-card': {
          boxShadow: theme('boxShadow.neumo-outset'),
        },
        '.neumo-card-inset': {
          boxShadow: theme('boxShadow.neumo-inset'),
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover', 'focus']);
    }),
  ],
};