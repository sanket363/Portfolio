import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      textPrimary: string;
      textSecondary: string;
      textAccent: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      disabled: string;
    };
    stateColors: {
      hover: string;
      active: string;
      focus: string;
      pressed: string;
    };
    gradients: {
      primary: string;
      primary45: string;
      secondary: string;
      glow: string;
      radial: string;
    };
    shadows: {
      neon: string;
      hover: string;
      elevation: {
        level1: string;
        level2: string;
        level3: string;
        level4: string;
        level5: string;
      };
    };
    animations: {
      durations: {
        fast: string;
        normal: string;
        slow: string;
      };
      easing: {
        easeIn: string;
        easeOut: string;
        easeInOut: string;
        customBezier: string;
      };
      springs: {
        stiffness: number;
        damping: number;
        mass: number;
      };
      transitions: {
        property: string;
        duration: string;
        timingFunction: string;
      };
      responsiveDurations: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
    };
    accessibility: {
      focusRing: string;
      outline: string;
      highContrast: {
        background: string;
        text: string;
      };
    };
    glassmorphism: {
      blurLevels: {
        small: string;
        medium: string;
        large: string;
      };
      opacity: {
        low: number;
        medium: number;
        high: number;
      };
      border: string;
    };
    neumorphism: {
      inset: string;
      outset: string;
      highlight: string;
      shadow: string;
    };
    motion: {
      hoverScale: number;
      pressScale: number;
      rotateSmall: string;
      rotateMedium: string;
      rotateLarge: string;
    };
    performance: {
      reducedMotion: boolean;
      lowPerformanceDurations: {
        fast: string;
        normal: string;
        slow: string;
      };
    };
  }
}

export const cyberpunkTheme = {
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
    disabled: '#6c757d'
  },
  stateColors: {
    hover: 'rgba(255, 255, 255, 0.1)',
    active: 'rgba(255, 255, 255, 0.2)',
    focus: 'rgba(0, 255, 245, 0.4)',
    pressed: 'rgba(255, 0, 255, 0.3)'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #00fff5 0%, #ff00ff 100%)',
    primary45: 'linear-gradient(45deg, #00fff5 0%, #ff00ff 100%)',
    secondary: 'linear-gradient(135deg, #ff00ff 0%, #ffff00 100%)',
    glow: 'rgba(0, 255, 245, 0.5)',
    radial: 'radial-gradient(circle at center, #00fff5, #ff00ff)'
  },
  shadows: {
    neon: '0 0 10px rgba(0, 255, 245, 0.5), 0 0 20px rgba(0, 255, 245, 0.3)',
    hover: '0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)',
    elevation: {
      level1: '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)',
      level2: '0px 3px 6px rgba(0,0,0,0.16), 0px 3px 6px rgba(0,0,0,0.23)',
      level3: '0px 10px 20px rgba(0,0,0,0.19), 0px 6px 6px rgba(0,0,0,0.23)',
      level4: '0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22)',
      level5: '0px 19px 38px rgba(0,0,0,0.30), 0px 15px 12px rgba(0,0,0,0.22)'
    }
  },
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      customBezier: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
    },
    springs: {
      stiffness: 300,
      damping: 20,
      mass: 0.5
    },
    transitions: {
      property: 'all',
      duration: '300ms',
      timingFunction: 'ease-in-out'
    },
    responsiveDurations: {
      mobile: '200ms',
      tablet: '300ms',
      desktop: '400ms'
    }
  },
  accessibility: {
    focusRing: '2px solid rgba(0, 255, 245, 0.7)',
    outline: 'none',
    highContrast: {
      background: '#000000',
      text: '#ffffff'
    }
  },
  glassmorphism: {
    blurLevels: {
      small: '4px',
      medium: '8px',
      large: '12px'
    },
    opacity: {
      low: 0.3,
      medium: 0.5,
      high: 0.7
    },
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  neumorphism: {
    inset: 'inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -5px -5px 10px rgba(255, 255, 255, 0.1)',
    outset: '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
    highlight: 'rgba(255, 255, 255, 0.8)',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  motion: {
    hoverScale: 1.05,
    pressScale: 0.95,
    rotateSmall: '5deg',
    rotateMedium: '15deg',
    rotateLarge: '30deg'
  },
  performance: {
    reducedMotion: false,
    lowPerformanceDurations: {
      fast: '250ms',
      normal: '400ms',
      slow: '700ms'
    }
  }
};