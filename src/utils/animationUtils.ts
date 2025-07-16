import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Types and Interfaces
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  repeat?: number;
  yoyo?: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  frameDrops: number;
  averageFrameTime: number;
  isLowPerformance: boolean;
}

export interface GestureEvent {
  type: 'swipe' | 'pinch' | 'tap' | 'longpress' | 'pan';
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  scale?: number;
  velocity?: number;
  target: HTMLElement;
}

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  largeDesktop: number;
}

export interface AnimationState {
  id: string;
  isPlaying: boolean;
  progress: number;
  timeline?: gsap.core.Timeline;
  cleanup?: () => void;
}

// Constants
export const ANIMATION_DURATIONS = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

export const EASING_CURVES = {
  easeInOut: 'power2.inOut',
  easeOut: 'power2.out',
  easeIn: 'power2.in',
  bounce: 'bounce.out',
  elastic: 'elastic.out(1, 0.3)',
  back: 'back.out(1.7)',
  expo: 'expo.out',
  circ: 'circ.out',
  sine: 'sine.inOut',
} as const;

export const SPRING_CONFIGS = {
  gentle: { tension: 120, friction: 14 },
  wobbly: { tension: 180, friction: 12 },
  stiff: { tension: 210, friction: 20 },
  slow: { tension: 280, friction: 60 },
  molasses: { tension: 280, friction: 120 },
} as const;

export const RESPONSIVE_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  largeDesktop: 1920,
};

// Performance Monitoring
class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private frameDrops = 0;
  private frameTimes: number[] = [];
  private isMonitoring = false;
  private rafId: number | null = null;

  start(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.frameCount = 0;
    this.frameDrops = 0;
    this.frameTimes = [];
    this.lastTime = performance.now();
    this.monitor();
  }

  stop(): void {
    this.isMonitoring = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private monitor = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const frameTime = currentTime - this.lastTime;
    
    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }

    // Detect frame drops (assuming 60fps target)
    if (frameTime > 16.67 * 1.5) {
      this.frameDrops++;
    }

    this.frameCount++;
    this.lastTime = currentTime;
    this.rafId = requestAnimationFrame(this.monitor);
  };

  getMetrics(): PerformanceMetrics {
    const averageFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length || 16.67;
    const fps = 1000 / averageFrameTime;
    const isLowPerformance = fps < 45 || this.frameDrops > 5;

    return {
      fps: Math.round(fps),
      frameDrops: this.frameDrops,
      averageFrameTime: Math.round(averageFrameTime * 100) / 100,
      isLowPerformance,
    };
  }

  reset(): void {
    this.frameCount = 0;
    this.frameDrops = 0;
    this.frameTimes = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Animation Performance Utilities
export const animationPerformance = {
  startMonitoring: () => performanceMonitor.start(),
  stopMonitoring: () => performanceMonitor.stop(),
  getMetrics: () => performanceMonitor.getMetrics(),
  
  adjustQuality: (metrics: PerformanceMetrics): AnimationConfig => {
    if (metrics.isLowPerformance) {
      return {
        duration: ANIMATION_DURATIONS.fast,
        ease: EASING_CURVES.easeOut,
      };
    }
    return {
      duration: ANIMATION_DURATIONS.normal,
      ease: EASING_CURVES.easeInOut,
    };
  },

  optimizeForDevice: (): AnimationConfig => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    
    if (isMobile || isLowEnd) {
      return {
        duration: ANIMATION_DURATIONS.fast,
        ease: EASING_CURVES.easeOut,
      };
    }
    
    return {
      duration: ANIMATION_DURATIONS.normal,
      ease: EASING_CURVES.easeInOut,
    };
  },
};

// Animation Batching
class AnimationBatcher {
  private batches = new Map<string, gsap.core.Timeline>();
  private pendingAnimations = new Map<string, Array<() => void>>();

  createBatch(batchId: string): gsap.core.Timeline {
    const timeline = gsap.timeline({ paused: true });
    this.batches.set(batchId, timeline);
    return timeline;
  }

  addToBatch(batchId: string, animationFn: () => void): void {
    if (!this.pendingAnimations.has(batchId)) {
      this.pendingAnimations.set(batchId, []);
    }
    this.pendingAnimations.get(batchId)!.push(animationFn);
  }

  executeBatch(batchId: string, stagger = 0.1): void {
    const animations = this.pendingAnimations.get(batchId);
    if (!animations) return;

    const timeline = this.batches.get(batchId) || this.createBatch(batchId);
    
    animations.forEach((animationFn, index) => {
      timeline.add(() => animationFn(), index * stagger);
    });

    timeline.play();
    this.pendingAnimations.delete(batchId);
  }

  clearBatch(batchId: string): void {
    const timeline = this.batches.get(batchId);
    if (timeline) {
      timeline.kill();
      this.batches.delete(batchId);
    }
    this.pendingAnimations.delete(batchId);
  }

  clearAllBatches(): void {
    this.batches.forEach(timeline => timeline.kill());
    this.batches.clear();
    this.pendingAnimations.clear();
  }
}

export const animationBatcher = new AnimationBatcher();

// Gesture Detection Utilities
export const gestureUtils = {
  detectSwipe: (
    element: HTMLElement,
    callback: (gesture: GestureEvent) => void,
    threshold = 50
  ): (() => void) => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const deltaTime = Date.now() - startTime;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < threshold) return;

      const velocity = distance / deltaTime;
      let direction: 'up' | 'down' | 'left' | 'right';

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      callback({
        type: 'swipe',
        direction,
        distance,
        velocity,
        target: element,
      });
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  },

  detectPinch: (
    element: HTMLElement,
    callback: (gesture: GestureEvent) => void
  ): (() => void) => {
    let initialDistance = 0;

    const getDistance = (touches: TouchList): number => {
      const touch1 = touches[0];
      const touch2 = touches[1];
      const deltaX = touch2.clientX - touch1.clientX;
      const deltaY = touch2.clientY - touch1.clientY;
      return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance > 0) {
        const currentDistance = getDistance(e.touches);
        const scale = currentDistance / initialDistance;

        callback({
          type: 'pinch',
          scale,
          target: element,
        });
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  },

  detectLongPress: (
    element: HTMLElement,
    callback: (gesture: GestureEvent) => void,
    duration = 500
  ): (() => void) => {
    let timeoutId: NodeJS.Timeout;

    const handleStart = () => {
      timeoutId = setTimeout(() => {
        callback({
          type: 'longpress',
          target: element,
        });
      }, duration);
    };

    const handleEnd = () => {
      clearTimeout(timeoutId);
    };

    element.addEventListener('mousedown', handleStart);
    element.addEventListener('touchstart', handleStart, { passive: true });
    element.addEventListener('mouseup', handleEnd);
    element.addEventListener('mouseleave', handleEnd);
    element.addEventListener('touchend', handleEnd, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener('mousedown', handleStart);
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('mouseup', handleEnd);
      element.removeEventListener('mouseleave', handleEnd);
      element.removeEventListener('touchend', handleEnd);
    };
  },
};

// Animation Timing Coordination
export const animationTiming = {
  createMasterTimeline: (): gsap.core.Timeline => {
    return gsap.timeline({ paused: true });
  },

  syncAnimations: (animations: gsap.core.Animation[]): gsap.core.Timeline => {
    const timeline = gsap.timeline();
    animations.forEach(animation => {
      timeline.add(animation, 0);
    });
    return timeline;
  },

  staggerAnimations: (
    animations: gsap.core.Animation[],
    stagger = 0.1
  ): gsap.core.Timeline => {
    const timeline = gsap.timeline();
    animations.forEach((animation, index) => {
      timeline.add(animation, index * stagger);
    });
    return timeline;
  },

  delayAnimation: (animation: gsap.core.Animation, delay: number): gsap.core.Timeline => {
    return gsap.timeline().add(animation, delay);
  },
};

// Responsive Animation Utilities
export const responsiveAnimation = {
  getCurrentBreakpoint: (): keyof ResponsiveBreakpoints => {
    const width = window.innerWidth;
    if (width >= RESPONSIVE_BREAKPOINTS.largeDesktop) return 'largeDesktop';
    if (width >= RESPONSIVE_BREAKPOINTS.desktop) return 'desktop';
    if (width >= RESPONSIVE_BREAKPOINTS.tablet) return 'tablet';
    return 'mobile';
  },

  getResponsiveConfig: (
    configs: Partial<Record<keyof ResponsiveBreakpoints, AnimationConfig>>
  ): AnimationConfig => {
    const breakpoint = responsiveAnimation.getCurrentBreakpoint();
    return configs[breakpoint] || configs.mobile || {};
  },

  createResponsiveAnimation: (
    target: gsap.TweenTarget,
    configs: Partial<Record<keyof ResponsiveBreakpoints, gsap.TweenVars>>
  ): gsap.core.Tween => {
    const breakpoint = responsiveAnimation.getCurrentBreakpoint();
    const config = configs[breakpoint] || configs.mobile || {};
    return gsap.to(target, config);
  },

  onBreakpointChange: (callback: (breakpoint: keyof ResponsiveBreakpoints) => void): (() => void) => {
    let currentBreakpoint = responsiveAnimation.getCurrentBreakpoint();

    const handleResize = () => {
      const newBreakpoint = responsiveAnimation.getCurrentBreakpoint();
      if (newBreakpoint !== currentBreakpoint) {
        currentBreakpoint = newBreakpoint;
        callback(newBreakpoint);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },
};

// Accessibility Utilities
export const accessibilityUtils = {
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  createReducedMotionFallback: (
    normalAnimation: gsap.TweenVars,
    reducedAnimation?: gsap.TweenVars
  ): gsap.TweenVars => {
    if (accessibilityUtils.prefersReducedMotion()) {
      return reducedAnimation || {
        duration: 0,
        ease: 'none',
      };
    }
    return normalAnimation;
  },

  respectMotionPreference: (
    target: gsap.TweenTarget,
    normalVars: gsap.TweenVars,
    reducedVars?: gsap.TweenVars
  ): gsap.core.Tween => {
    const vars = accessibilityUtils.createReducedMotionFallback(normalVars, reducedVars);
    return gsap.to(target, vars);
  },

  onMotionPreferenceChange: (callback: (prefersReduced: boolean) => void): (() => void) => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => callback(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  },
};

// Animation Debugging Utilities
export const animationDebug = {
  logAnimation: (animation: gsap.core.Animation, label?: string): void => {
    if (process.env.NODE_ENV !== 'development') return;
    
    console.group(`🎬 Animation Debug${label ? `: ${label}` : ''}`);
    console.log('Duration:', animation.duration());
    console.log('Progress:', animation.progress());
    console.log('Timeline:', animation.timeline);
    console.log('Targets:', animation.targets());
    console.groupEnd();
  },

  visualizeScrollTrigger: (trigger: ScrollTrigger): void => {
    if (process.env.NODE_ENV !== 'development') return;
    
    ScrollTrigger.batch(trigger.trigger, {
      onEnter: () => console.log('🔥 ScrollTrigger entered:', trigger.trigger),
      onLeave: () => console.log('🚪 ScrollTrigger left:', trigger.trigger),
      onEnterBack: () => console.log('🔄 ScrollTrigger entered back:', trigger.trigger),
      onLeaveBack: () => console.log('⬆️ ScrollTrigger left back:', trigger.trigger),
    });
  },

  createAnimationMarkers: (): void => {
    if (process.env.NODE_ENV !== 'development') return;
    
    ScrollTrigger.defaults({
      markers: true,
    });
  },

  trackPerformance: (animationFn: () => void, label?: string): void => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const start = performance.now();
    animationFn();
    const end = performance.now();
    
    console.log(`⚡ Animation Performance${label ? ` (${label})` : ''}: ${end - start}ms`);
  },
};

// Animation Preloading Utilities
export const animationPreloader = {
  preloadLottie: async (path: string): Promise<any> => {
    try {
      const response = await fetch(path);
      return await response.json();
    } catch (error) {
      console.error('Failed to preload Lottie animation:', error);
      return null;
    }
  },

  preloadVideo: (src: string): Promise<HTMLVideoElement> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.onloadeddata = () => resolve(video);
      video.onerror = reject;
      video.src = src;
      video.load();
    });
  },

  preloadImage: (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  preloadAssets: async (assets: string[]): Promise<(HTMLImageElement | HTMLVideoElement | any)[]> => {
    const promises = assets.map(asset => {
      if (asset.endsWith('.json')) {
        return animationPreloader.preloadLottie(asset);
      } else if (asset.match(/\.(mp4|webm|ogg)$/)) {
        return animationPreloader.preloadVideo(asset);
      } else {
        return animationPreloader.preloadImage(asset);
      }
    });

    return Promise.all(promises);
  },
};

// Animation Cleanup Utilities
class AnimationCleanup {
  private animations = new Set<gsap.core.Animation>();
  private scrollTriggers = new Set<ScrollTrigger>();
  private eventListeners = new Set<() => void>();

  register(animation: gsap.core.Animation): void {
    this.animations.add(animation);
  }

  registerScrollTrigger(trigger: ScrollTrigger): void {
    this.scrollTriggers.add(trigger);
  }

  registerEventListener(cleanup: () => void): void {
    this.eventListeners.add(cleanup);
  }

  cleanup(): void {
    // Kill all animations
    this.animations.forEach(animation => animation.kill());
    this.animations.clear();

    // Kill all scroll triggers
    this.scrollTriggers.forEach(trigger => trigger.kill());
    this.scrollTriggers.clear();

    // Remove all event listeners
    this.eventListeners.forEach(cleanup => cleanup());
    this.eventListeners.clear();
  }

  cleanupByTarget(target: Element): void {
    // Kill animations for specific target
    this.animations.forEach(animation => {
      if (animation.targets().includes(target)) {
        animation.kill();
        this.animations.delete(animation);
      }
    });

    // Kill scroll triggers for specific target
    this.scrollTriggers.forEach(trigger => {
      if (trigger.trigger === target) {
        trigger.kill();
        this.scrollTriggers.delete(trigger);
      }
    });
  }
}

export const animationCleanup = new AnimationCleanup();

// Animation State Management
class AnimationStateManager {
  private states = new Map<string, AnimationState>();

  createState(id: string, timeline?: gsap.core.Timeline): AnimationState {
    const state: AnimationState = {
      id,
      isPlaying: false,
      progress: 0,
      timeline,
    };

    this.states.set(id, state);
    return state;
  }

  updateState(id: string, updates: Partial<AnimationState>): void {
    const state = this.states.get(id);
    if (state) {
      Object.assign(state, updates);
    }
  }

  getState(id: string): AnimationState | undefined {
    return this.states.get(id);
  }

  playAnimation(id: string): void {
    const state = this.states.get(id);
    if (state?.timeline) {
      state.timeline.play();
      this.updateState(id, { isPlaying: true });
    }
  }

  pauseAnimation(id: string): void {
    const state = this.states.get(id);
    if (state?.timeline) {
      state.timeline.pause();
      this.updateState(id, { isPlaying: false });
    }
  }

  resetAnimation(id: string): void {
    const state = this.states.get(id);
    if (state?.timeline) {
      state.timeline.restart();
      this.updateState(id, { isPlaying: true, progress: 0 });
    }
  }

  removeState(id: string): void {
    const state = this.states.get(id);
    if (state) {
      state.cleanup?.();
      this.states.delete(id);
    }
  }

  getAllStates(): AnimationState[] {
    return Array.from(this.states.values());
  }

  cleanup(): void {
    this.states.forEach(state => {
      state.cleanup?.();
      state.timeline?.kill();
    });
    this.states.clear();
  }
}

export const animationStateManager = new AnimationStateManager();

// Animation Interpolation Utilities
export const interpolationUtils = {
  lerp: (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  },

  smoothstep: (start: number, end: number, factor: number): number => {
    const t = Math.max(0, Math.min(1, (factor - start) / (end - start)));
    return t * t * (3 - 2 * t);
  },

  easeInOutCubic: (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },

  interpolateColor: (color1: string, color2: string, factor: number): string => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(interpolationUtils.lerp(r1, r2, factor));
    const g = Math.round(interpolationUtils.lerp(g1, g2, factor));
    const b = Math.round(interpolationUtils.lerp(b1, b2, factor));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },

  createSpring: (config = SPRING_CONFIGS.gentle) => {
    return (t: number): number => {
      const { tension, friction } = config;
      const w = Math.sqrt(tension / 1);
      const zeta = friction / (2 * Math.sqrt(tension * 1));
      
      if (zeta < 1) {
        const wd = w * Math.sqrt(1 - zeta * zeta);
        return 1 - Math.exp(-zeta * w * t) * Math.cos(wd * t);
      } else {
        return 1 - Math.exp(-w * t);
      }
    };
  },
};

// Custom Easing Utilities
export const easingUtils = {
  createCustomBezier: (x1: number, y1: number, x2: number, y2: number): string => {
    return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  },

  cyberpunkEasing: easingUtils.createCustomBezier(0.25, 0.46, 0.45, 0.94),
  glitchEasing: easingUtils.createCustomBezier(0.68, -0.55, 0.265, 1.55),
  smoothGlow: easingUtils.createCustomBezier(0.4, 0, 0.2, 1),
  quickSnap: easingUtils.createCustomBezier(0.18, 0.89, 0.32, 1.28),

  registerCustomEasing: (name: string, ease: string): void => {
    gsap.registerEase(name, ease);
  },

  createSteppedEasing: (steps: number): string => {
    return `steps(${steps}, end)`;
  },

  createBounceEasing: (amplitude = 1, period = 0.3): string => {
    return `elastic.out(${amplitude}, ${period})`;
  },
};

// Global cleanup function
export const cleanupAllAnimations = (): void => {
  animationCleanup.cleanup();
  animationStateManager.cleanup();
  animationBatcher.clearAllBatches();
  performanceMonitor.stop();
  ScrollTrigger.killAll();
  gsap.killTweensOf('*');
};

// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.start();
  animationDebug.createAnimationMarkers();
}