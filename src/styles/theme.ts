import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: {
        primary: string;
        secondary: string;
        accent: string;
      };
      gradient: {
        primary: string;
        secondary: string;
        glow: string;
      };
    };
    shadows: {
      neon: string;
      hover: string;
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
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      accent: '#00fff5'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #00fff5 0%, #ff00ff 100%)',
      secondary: 'linear-gradient(135deg, #ff00ff 0%, #ffff00 100%)',
      glow: 'rgba(0, 255, 245, 0.5)'
    }
  },
  shadows: {
    neon: '0 0 10px rgba(0, 255, 245, 0.5), 0 0 20px rgba(0, 255, 245, 0.3)',
    hover: '0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)'
  }
};
    text: '#CDD6F4',
    subtext1: '#BAC2DE',
    subtext0: '#A6ADC8',
    overlay2: '#9399B2',
    overlay1: '#7F849C',
    overlay0: '#6C7086',
    surface2: '#585B70',
    surface1: '#45475A',
    surface0: '#313244',
    base: '#1E1E2E',
    mantle: '#181825',
    crust: '#11111B'
  }
};
