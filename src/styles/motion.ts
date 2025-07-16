import { Variants, Transition, PanInfo } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// ANIMATION TIMING CONSTANTS
// ============================================================================

export const DURATIONS = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
} as const;

export const DELAYS = {
  none: 0,
  short: 0.1,
  medium: 0.2,
  long: 0.3,
  longer: 0.5,
} as const;

// ============================================================================
// CUSTOM EASING CURVES
// ============================================================================

export const EASINGS = {
  // Brand personality curves
  cyberpunk: [0.25, 0.46, 0.45, 0.94],
  smooth: [0.33, 1, 0.68, 1],
  snappy: [0.4, 0, 0.2, 1],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
  
  // Standard curves
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  
  // Spring configurations
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 17,
  },
  springBouncy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 10,
  },
  springGentle: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20,
  },
} as const;

// ============================================================================
// CORE ANIMATION VARIANTS
// ============================================================================

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: DURATIONS.normal, 
      ease: EASINGS.smooth 
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: DURATIONS.fast, 
      ease: EASINGS.easeIn 
    }
  },
};

export const scaleIn: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: DURATIONS.normal, 
      ease: EASINGS.smooth 
    }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { 
      duration: DURATIONS.fast, 
      ease: EASINGS.easeIn 
    }
  },
};

// Direction-based slide animations
export const slideIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up', distance: number = 60): Variants => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, opacity: 0 };
      case 'down': return { y: -distance, opacity: 0 };
      case 'left': return { x: distance, opacity: 0 };
      case 'right': return { x: -distance, opacity: 0 };
      default: return { y: distance, opacity: 0 };
    }
  };

  const getExitPosition = () => {
    switch (direction) {
      case 'up': return { y: -distance, opacity: 0 };
      case 'down': return { y: distance, opacity: 0 };
      case 'left': return { x: -distance, opacity: 0 };
      case 'right': return { x: distance, opacity: 0 };
      default: return { y: -distance, opacity: 0 };
    }
  };

  return {
    initial: getInitialPosition(),
    animate: { 
      x: 0, 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: DURATIONS.normal, 
        ease: EASINGS.smooth 
      }
    },
    exit: {
      ...getExitPosition(),
      transition: { 
        duration: DURATIONS.fast, 
        ease: EASINGS.easeIn 
      }
    },
  };
};

// ============================================================================
// INTERACTION VARIANTS
// ============================================================================

export const pressable: Variants = {
  whileTap: { 
    scale: 0.95,
    transition: { 
      duration: DURATIONS.fast, 
      ease: EASINGS.easeOut 
    }
  },
};

export const hoverable: Variants = {
  whileHover: { 
    scale: 1.05,
    transition: EASINGS.spring
  },
};

export const draggable: Variants = {
  whileDrag: { 
    scale: 1.1,
    rotate: 5,
    transition: EASINGS.spring
  },
};

// Advanced interaction variants
export const magneticHover = (strength: number = 20): Variants => ({
  whileHover: {
    scale: 1.05,
    transition: EASINGS.springGentle,
  },
});

export const glowHover: Variants = {
  whileHover: {
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
    transition: { duration: DURATIONS.normal }
  },
};

// ============================================================================
// SCROLL-TRIGGERED ANIMATION VARIANTS
// ============================================================================

export const scrollFadeIn: Variants = {
  initial: { opacity: 0, y: 50 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: DURATIONS.normal, 
      ease: EASINGS.smooth 
    }
  },
  viewport: { once: true, amount: 0.3 },
};

export const scrollSlideIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up'): Variants => {
  const distance = 80;
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, opacity: 0 };
      case 'down': return { y: -distance, opacity: 0 };
      case 'left': return { x: distance, opacity: 0 };
      case 'right': return { x: -distance, opacity: 0 };
      default: return { y: distance, opacity: 0 };
    }
  };

  return {
    initial: getInitialPosition(),
    whileInView: { 
      x: 0, 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: DURATIONS.slow, 
        ease: EASINGS.smooth 
      }
    },
    viewport: { once: true, amount: 0.2 },
  };
};

export const scrollScaleIn: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  whileInView: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: DURATIONS.slow, 
      ease: EASINGS.elastic 
    }
  },
  viewport: { once: true, amount: 0.3 },
};

export const scrollRotateIn: Variants = {
  initial: { rotate: -10, opacity: 0, scale: 0.9 },
  whileInView: { 
    rotate: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: DURATIONS.slow, 
      ease: EASINGS.smooth 
    }
  },
  viewport: { once: true, amount: 0.3 },
};

// ============================================================================
// STAGGERED ANIMATION VARIANTS
// ============================================================================

export const staggerContainer = (delayChildren: number = 0.1, staggerChildren: number = 0.1): Variants => ({
  animate: {
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
});

export const staggerItem: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: DURATIONS.normal, 
      ease: EASINGS.smooth 
    }
  },
};

export const staggerGrid = (rows: number, cols: number): Variants => ({
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
});

// ============================================================================
// MOBILE-SPECIFIC VARIANTS
// ============================================================================

export const mobileOptimized = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: DURATIONS.fast }
    },
  },
  
  slideIn: {
    initial: { y: 30, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: DURATIONS.fast }
    },
  },
  
  tap: {
    whileTap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    },
  },
} as const;

// ============================================================================
// GESTURE-BASED VARIANTS
// ============================================================================

export const swipeableCard: Variants = {
  center: { x: 0, opacity: 1 },
  left: { x: -300, opacity: 0 },
  right: { x: 300, opacity: 0 },
};

export const pullToRefresh: Variants = {
  initial: { y: -50, opacity: 0 },
  pulling: { y: 0, opacity: 0.7 },
  released: { y: 0, opacity: 1 },
};

export const longPressScale: Variants = {
  initial: { scale: 1 },
  pressing: { 
    scale: 1.1,
    transition: { duration: 0.2 }
  },
  pressed: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  },
};

// ============================================================================
// REDUCED MOTION VARIANTS
// ============================================================================

export const reducedMotion = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.01 },
  },
  
  slideIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.01 },
  },
  
  scaleIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.01 },
  },
  
  hover: {
    whileHover: {},
  },
  
  tap: {
    whileTap: {},
  },
} as const;

// ============================================================================
// SHARED LAYOUT ANIMATIONS
// ============================================================================

export const sharedLayoutTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const modalTransition: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.8,
    y: 50,
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: 50,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.easeIn,
    }
  },
};

// ============================================================================
// GSAP UTILITIES AND HELPERS
// ============================================================================

export const gsapUtils = {
  // Timeline creation helper
  createTimeline: (options?: gsap.TimelineVars) => {
    return gsap.timeline({
      paused: true,
      ...options,
    });
  },

  // ScrollTrigger presets
  scrollTriggerPresets: {
    fadeInUp: (trigger: string | Element) => ({
      trigger,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    }),
    
    parallax: (trigger: string | Element, speed: number = 0.5) => ({
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self: ScrollTrigger) => {
        const progress = self.progress;
        gsap.set(trigger, { y: progress * speed * 100 });
      },
    }),
    
    pin: (trigger: string | Element) => ({
      trigger,
      start: "top top",
      end: "bottom bottom",
      pin: true,
      pinSpacing: false,
    }),
    
    batch: (targets: string | Element[]) => ({
      targets,
      onEnter: (elements: Element[]) => {
        gsap.fromTo(elements, 
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
        );
      },
      onLeave: (elements: Element[]) => {
        gsap.to(elements, { opacity: 0.3, duration: 0.3 });
      },
      onEnterBack: (elements: Element[]) => {
        gsap.to(elements, { opacity: 1, duration: 0.3 });
      },
    }),
  },

  // Animation cleanup
  killAll: () => {
    gsap.killTweensOf("*");
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  },

  // Refresh ScrollTrigger (useful after layout changes)
  refresh: () => {
    ScrollTrigger.refresh();
  },
};

// ============================================================================
// PERFORMANCE OPTIMIZATION UTILITIES
// ============================================================================

export const performanceUtils = {
  // Will-change helper
  willChange: (properties: string[]) => ({
    willChange: properties.join(', '),
  }),

  // Transform3d acceleration
  transform3d: {
    enable: { transform: 'translateZ(0)' },
    disable: { transform: 'none' },
  },

  // GPU acceleration helper
  gpuAcceleration: {
    transform: 'translate3d(0, 0, 0)',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
  },

  // Contain layout for animation performance
  containLayout: {
    contain: 'layout style paint' as const,
  },

  // Optimize for animations
  optimizeForAnimation: (element: HTMLElement) => {
    Object.assign(element.style, {
      willChange: 'transform, opacity',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
    });
  },

  // Clean up optimization
  cleanupOptimization: (element: HTMLElement) => {
    Object.assign(element.style, {
      willChange: 'auto',
      transform: '',
      backfaceVisibility: '',
    });
  },
};

// ============================================================================
// ANIMATION COORDINATION HELPERS
// ============================================================================

export const coordinationUtils = {
  // Sequence multiple animations
  sequence: (...animations: (() => Promise<void>)[]) => {
    return animations.reduce((promise, animation) => 
      promise.then(animation), Promise.resolve()
    );
  },

  // Parallel animations
  parallel: (...animations: (() => Promise<void>)[]) => {
    return Promise.all(animations.map(animation => animation()));
  },

  // Delay helper
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Animation state manager
  createAnimationState: () => {
    let isAnimating = false;
    
    return {
      start: () => { isAnimating = true; },
      end: () => { isAnimating = false; },
      isAnimating: () => isAnimating,
    };
  },
};

// ============================================================================
// RESPONSIVE ANIMATION HELPERS
// ============================================================================

export const responsiveUtils = {
  // Get appropriate animation based on screen size
  getResponsiveVariant: (
    mobile: Variants, 
    tablet: Variants, 
    desktop: Variants
  ) => {
    if (typeof window === 'undefined') return desktop;
    
    const width = window.innerWidth;
    if (width < 768) return mobile;
    if (width < 1024) return tablet;
    return desktop;
  },

  // Reduced motion detection
  prefersReducedMotion: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get safe animation variant
  getSafeVariant: (normalVariant: Variants, reducedVariant: Variants) => {
    return responsiveUtils.prefersReducedMotion() ? reducedVariant : normalVariant;
  },
};

// ============================================================================
// PRESET ANIMATION COMBINATIONS
// ============================================================================

export const presets = {
  // Card entrance
  cardEntrance: {
    ...scrollFadeIn,
    ...hoverable,
    ...pressable,
  },

  // Button interactions
  buttonInteraction: {
    ...hoverable,
    ...pressable,
    ...glowHover,
  },

  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: DURATIONS.slow, 
        ease: EASINGS.smooth 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: DURATIONS.normal, 
        ease: EASINGS.easeIn 
      }
    },
  },

  // Hero section
  heroSection: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: DURATIONS.slower, 
        ease: EASINGS.elastic 
      }
    },
  },

  // Navigation items
  navItem: {
    ...hoverable,
    whileHover: {
      scale: 1.1,
      color: "#00ffff",
      textShadow: "0 0 8px #00ffff",
      transition: EASINGS.spring,
    },
  },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AnimationDirection = 'up' | 'down' | 'left' | 'right';
export type AnimationSpeed = keyof typeof DURATIONS;
export type EasingType = keyof typeof EASINGS;

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Core variants
  fadeIn,
  slideIn,
  scaleIn,
  pressable,
  hoverable,
  draggable,
  
  // Scroll variants
  scrollFadeIn,
  scrollSlideIn,
  scrollScaleIn,
  scrollRotateIn,
  
  // Stagger variants
  staggerContainer,
  staggerItem,
  staggerGrid,
  
  // Mobile variants
  mobileOptimized,
  
  // Gesture variants
  swipeableCard,
  pullToRefresh,
  longPressScale,
  
  // Reduced motion
  reducedMotion,
  
  // Utilities
  gsapUtils,
  performanceUtils,
  coordinationUtils,
  responsiveUtils,
  
  // Presets
  presets,
  
  // Constants
  DURATIONS,
  DELAYS,
  EASINGS,
};