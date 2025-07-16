import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTheme } from '@emotion/react';

// Types for animation configurations
interface ScrollAnimationConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  easing?: string;
}

interface GestureConfig {
  swipeThreshold?: number;
  longPressDelay?: number;
  pinchThreshold?: number;
  tapThreshold?: number;
}

interface AnimationSequenceStep {
  id: string;
  duration: number;
  delay?: number;
  animation: () => Promise<void> | void;
}

interface PerformanceMetrics {
  fps: number;
  deviceMemory: number;
  hardwareConcurrency: number;
  connectionType: string;
}

interface AnimationPreset {
  name: string;
  variants: Record<string, any>;
  transition: Record<string, any>;
}

// Performance mode types
type PerformanceMode = 'high' | 'medium' | 'low' | 'minimal';

// Gesture types
type GestureType = 'swipe' | 'pinch' | 'tap' | 'longpress' | 'pan';

interface GestureEvent {
  type: GestureType;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  scale?: number;
  velocity?: number;
  target: HTMLElement;
}

// Hook: useScrollAnimation - Easy scroll-triggered animation setup
export const useScrollAnimation = (config: ScrollAnimationConfig = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
    duration = 300,
    easing = 'ease-out'
  } = config;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true);
            if (triggerOnce) setHasTriggered(true);
          }, delay);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  const animationStyle = useMemo(() => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `all ${duration}ms ${easing}`
  }), [isVisible, duration, easing]);

  return {
    ref: elementRef,
    isVisible,
    animationStyle,
    trigger: () => setIsVisible(true),
    reset: () => {
      setIsVisible(false);
      setHasTriggered(false);
    }
  };
};

// Hook: useGesture - Mobile gesture detection and handling
export const useGesture = (config: GestureConfig = {}) => {
  const [gesture, setGesture] = useState<GestureEvent | null>(null);
  const elementRef = useRef<HTMLElement>(null);
  const gestureStateRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    isPressed: false,
    initialDistance: 0,
    longPressTimer: null as NodeJS.Timeout | null
  });

  const {
    swipeThreshold = 50,
    longPressDelay = 500,
    pinchThreshold = 10,
    tapThreshold = 10
  } = config;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const state = gestureStateRef.current;
    
    state.startX = touch.clientX;
    state.startY = touch.clientY;
    state.startTime = Date.now();
    state.isPressed = true;

    if (e.touches.length === 2) {
      const touch2 = e.touches[1];
      state.initialDistance = Math.hypot(
        touch2.clientX - touch.clientX,
        touch2.clientY - touch.clientY
      );
    }

    // Long press detection
    state.longPressTimer = setTimeout(() => {
      if (state.isPressed) {
        setGesture({
          type: 'longpress',
          target: e.target as HTMLElement
        });
      }
    }, longPressDelay);
  }, [longPressDelay]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const state = gestureStateRef.current;
    if (!state.isPressed) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - state.startX;
    const deltaY = touch.clientY - state.startY;

    // Pinch detection
    if (e.touches.length === 2) {
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch.clientX,
        touch2.clientY - touch.clientY
      );
      const scale = currentDistance / state.initialDistance;

      if (Math.abs(currentDistance - state.initialDistance) > pinchThreshold) {
        setGesture({
          type: 'pinch',
          scale,
          target: e.target as HTMLElement
        });
      }
    }

    // Pan detection
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      setGesture({
        type: 'pan',
        direction: Math.abs(deltaX) > Math.abs(deltaY) 
          ? (deltaX > 0 ? 'right' : 'left')
          : (deltaY > 0 ? 'down' : 'up'),
        distance: Math.hypot(deltaX, deltaY),
        target: e.target as HTMLElement
      });
    }
  }, [pinchThreshold]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const state = gestureStateRef.current;
    if (!state.isPressed) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - state.startX;
    const deltaY = touch.clientY - state.startY;
    const deltaTime = Date.now() - state.startTime;
    const distance = Math.hypot(deltaX, deltaY);

    state.isPressed = false;
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
      state.longPressTimer = null;
    }

    // Tap detection
    if (distance < tapThreshold && deltaTime < 300) {
      setGesture({
        type: 'tap',
        target: e.target as HTMLElement
      });
    }
    // Swipe detection
    else if (distance > swipeThreshold) {
      const velocity = distance / deltaTime;
      setGesture({
        type: 'swipe',
        direction: Math.abs(deltaX) > Math.abs(deltaY) 
          ? (deltaX > 0 ? 'right' : 'left')
          : (deltaY > 0 ? 'down' : 'up'),
        distance,
        velocity,
        target: e.target as HTMLElement
      });
    }
  }, [swipeThreshold, tapThreshold]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ref: elementRef,
    gesture,
    clearGesture: () => setGesture(null)
  };
};

// Hook: usePerformanceMode - Automatic animation quality adjustment
export const usePerformanceMode = () => {
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>('high');
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    deviceMemory: 4,
    hardwareConcurrency: 4,
    connectionType: '4g'
  });
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  const measurePerformance = useCallback(() => {
    const now = performance.now();
    const delta = now - lastTimeRef.current;
    
    if (delta >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / delta);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
      
      setMetrics(prev => ({ ...prev, fps }));
      
      // Adjust performance mode based on FPS
      if (fps < 30) {
        setPerformanceMode('minimal');
      } else if (fps < 45) {
        setPerformanceMode('low');
      } else if (fps < 55) {
        setPerformanceMode('medium');
      } else {
        setPerformanceMode('high');
      }
    }
    
    frameCountRef.current++;
    requestAnimationFrame(measurePerformance);
  }, []);

  useEffect(() => {
    // Get device capabilities
    const navigator = window.navigator as any;
    const deviceMemory = navigator.deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connectionType = connection?.effectiveType || '4g';

    setMetrics(prev => ({
      ...prev,
      deviceMemory,
      hardwareConcurrency,
      connectionType
    }));

    // Start performance monitoring
    const rafId = requestAnimationFrame(measurePerformance);
    
    return () => cancelAnimationFrame(rafId);
  }, [measurePerformance]);

  const getAnimationConfig = useCallback(() => {
    const theme = useTheme();
    
    switch (performanceMode) {
      case 'minimal':
        return {
          duration: parseInt(theme.performance.lowPerformanceDurations.fast),
          easing: 'linear',
          reducedEffects: true,
          disableParticles: true
        };
      case 'low':
        return {
          duration: parseInt(theme.performance.lowPerformanceDurations.normal),
          easing: theme.animations.easing.easeOut,
          reducedEffects: true,
          disableParticles: false
        };
      case 'medium':
        return {
          duration: parseInt(theme.animations.durations.normal),
          easing: theme.animations.easing.easeInOut,
          reducedEffects: false,
          disableParticles: false
        };
      case 'high':
      default:
        return {
          duration: parseInt(theme.animations.durations.normal),
          easing: theme.animations.easing.customBezier,
          reducedEffects: false,
          disableParticles: false
        };
    }
  }, [performanceMode]);

  return {
    performanceMode,
    metrics,
    animationConfig: getAnimationConfig(),
    setPerformanceMode
  };
};

// Hook: useReducedMotion - Accessible animation alternatives
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getReducedMotionVariants = useCallback((variants: Record<string, any>) => {
    if (!prefersReducedMotion) return variants;

    // Create reduced motion alternatives
    const reducedVariants: Record<string, any> = {};
    
    Object.keys(variants).forEach(key => {
      const variant = variants[key];
      reducedVariants[key] = {
        ...variant,
        transition: {
          duration: 0.01,
          ease: 'linear'
        },
        // Remove transform animations, keep opacity
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0
      };
    });

    return reducedVariants;
  }, [prefersReducedMotion]);

  const getAccessibleTransition = useCallback((transition: any) => {
    if (!prefersReducedMotion) return transition;
    
    return {
      duration: 0.01,
      ease: 'linear'
    };
  }, [prefersReducedMotion]);

  return {
    prefersReducedMotion,
    getReducedMotionVariants,
    getAccessibleTransition
  };
};

// Hook: useThemeTransition - Smooth theme switching animations
export const useThemeTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const theme = useTheme();

  const transitionTheme = useCallback(async (newTheme: any, duration = 300) => {
    setIsTransitioning(true);

    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${newTheme.colors.background};
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      transition: opacity ${duration}ms ease-in-out;
    `;
    
    document.body.appendChild(overlay);

    // Fade in overlay
    requestAnimationFrame(() => {
      overlay.style.opacity = '0.8';
    });

    // Wait for half transition, then apply theme
    await new Promise(resolve => setTimeout(resolve, duration / 2));
    
    // Apply new theme (this would be handled by theme context)
    // The actual theme switching logic would be in the theme provider
    
    // Fade out overlay
    overlay.style.opacity = '0';
    
    await new Promise(resolve => setTimeout(resolve, duration / 2));
    
    document.body.removeChild(overlay);
    setIsTransitioning(false);
  }, []);

  const createRippleTransition = useCallback((event: MouseEvent, newTheme: any) => {
    const { clientX, clientY } = event;
    const ripple = document.createElement('div');
    
    const size = Math.max(window.innerWidth, window.innerHeight) * 2;
    
    ripple.style.cssText = `
      position: fixed;
      border-radius: 50%;
      background: ${newTheme.colors.background};
      width: ${size}px;
      height: ${size}px;
      left: ${clientX - size / 2}px;
      top: ${clientY - size / 2}px;
      transform: scale(0);
      pointer-events: none;
      z-index: 9999;
      transition: transform 600ms ease-out;
    `;
    
    document.body.appendChild(ripple);
    
    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(1)';
    });
    
    setTimeout(() => {
      document.body.removeChild(ripple);
    }, 600);
  }, []);

  return {
    isTransitioning,
    transitionTheme,
    createRippleTransition
  };
};

// Hook: useAnimationSequence - Complex multi-step animations
export const useAnimationSequence = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const sequenceRef = useRef<AnimationSequenceStep[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playSequence = useCallback(async (steps: AnimationSequenceStep[]) => {
    sequenceRef.current = steps;
    setCurrentStep(0);
    setIsPlaying(true);
    setIsComplete(false);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentStep(i);

      if (step.delay) {
        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, step.delay);
        });
      }

      await Promise.resolve(step.animation());
      
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, step.duration);
      });
    }

    setIsPlaying(false);
    setIsComplete(true);
  }, []);

  const pauseSequence = useCallback(() => {
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const resetSequence = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setIsComplete(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const skipToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < sequenceRef.current.length) {
      setCurrentStep(stepIndex);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    currentStep,
    isPlaying,
    isComplete,
    playSequence,
    pauseSequence,
    resetSequence,
    skipToStep,
    totalSteps: sequenceRef.current.length
  };
};

// Hook: useHoverAnimation - Consistent hover micro-interactions
export const useHoverAnimation = (config: any = {}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const theme = useTheme();

  const {
    scale = theme.motion.hoverScale,
    pressScale = theme.motion.pressScale,
    duration = parseInt(theme.animations.durations.fast),
    easing = theme.animations.easing.easeOut,
    glow = false,
    magnetic = false,
    magneticStrength = 0.3
  } = config;

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!magnetic || !elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;
    
    elementRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${isPressed ? pressScale : scale})`;
  }, [magnetic, magneticStrength, scale, pressScale, isPressed]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    
    if (magnetic) {
      element.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
      if (magnetic) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp, handleMouseMove, magnetic]);

  const animationStyle = useMemo(() => {
    const currentScale = isPressed ? pressScale : (isHovered ? scale : 1);
    
    return {
      transform: magnetic ? undefined : `scale(${currentScale})`,
      transition: `all ${duration}ms ${easing}`,
      boxShadow: glow && isHovered ? theme.shadows.hover : undefined,
      cursor: 'pointer'
    };
  }, [isHovered, isPressed, scale, pressScale, duration, easing, glow, magnetic, theme.shadows.hover]);

  return {
    ref: elementRef,
    isHovered,
    isPressed,
    animationStyle,
    bind: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp
    }
  };
};

// Hook: useLoadingAnimation - Loading states with animations
export const useLoadingAnimation = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading...');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback((text = 'Loading...') => {
    setIsLoading(true);
    setProgress(0);
    setLoadingText(text);
  }, []);

  const updateProgress = useCallback((newProgress: number) => {
    setProgress(Math.max(0, Math.min(100, newProgress)));
  }, []);

  const finishLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  }, []);

  const simulateProgress = useCallback((duration = 2000) => {
    setProgress(0);
    const steps = 100;
    const stepDuration = duration / steps;
    let currentProgress = 0;

    intervalRef.current = setInterval(() => {
      currentProgress += Math.random() * 3;
      if (currentProgress >= 95) {
        currentProgress = 95;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
      setProgress(currentProgress);
    }, stepDuration);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadingVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  return {
    isLoading,
    progress,
    loadingText,
    startLoading,
    updateProgress,
    finishLoading,
    simulateProgress,
    loadingVariants,
    setLoadingText
  };
};

// Hook: usePageTransition - Page-level animation transitions
export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<'fade' | 'slide' | 'scale' | 'flip'>('fade');

  const pageVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '-100%' }
    },
    scale: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.2, opacity: 0 }
    },
    flip: {
      initial: { rotateY: 90, opacity: 0 },
      animate: { rotateY: 0, opacity: 1 },
      exit: { rotateY: -90, opacity: 0 }
    }
  };

  const transitionPage = useCallback(async (type: typeof transitionType = 'fade') => {
    setTransitionType(type);
    setIsTransitioning(true);
    
    // Transition duration based on type
    const duration = type === 'flip' ? 600 : 300;
    
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTransitioning(false);
  }, []);

  return {
    isTransitioning,
    transitionType,
    pageVariants: pageVariants[transitionType],
    transitionPage,
    setTransitionType
  };
};

// Hook: useResponsiveAnimation - Screen size adaptive animations
export const useResponsiveAnimation = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const theme = useTheme();

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const getResponsiveConfig = useCallback(() => {
    const baseDuration = parseInt(theme.animations.durations.normal);
    
    switch (screenSize) {
      case 'mobile':
        return {
          duration: parseInt(theme.animations.responsiveDurations.mobile),
          scale: 0.8,
          reducedEffects: true,
          simplifiedAnimations: true
        };
      case 'tablet':
        return {
          duration: parseInt(theme.animations.responsiveDurations.tablet),
          scale: 0.9,
          reducedEffects: false,
          simplifiedAnimations: false
        };
      case 'desktop':
      default:
        return {
          duration: parseInt(theme.animations.responsiveDurations.desktop),
          scale: 1,
          reducedEffects: false,
          simplifiedAnimations: false
        };
    }
  }, [screenSize, theme]);

  const getResponsiveVariants = useCallback((variants: Record<string, any>) => {
    const config = getResponsiveConfig();
    const responsiveVariants: Record<string, any> = {};

    Object.keys(variants).forEach(key => {
      const variant = variants[key];
      responsiveVariants[key] = {
        ...variant,
        transition: {
          ...variant.transition,
          duration: config.duration / 1000
        }
      };

      // Simplify animations on mobile
      if (config.simplifiedAnimations) {
        if (variant.x) responsiveVariants[key].x = variant.x * config.scale;
        if (variant.y) responsiveVariants[key].y = variant.y * config.scale;
        if (variant.scale) responsiveVariants[key].scale = 1 + (variant.scale - 1) * config.scale;
      }
    });

    return responsiveVariants;
  }, [getResponsiveConfig]);

  return {
    screenSize,
    responsiveConfig: getResponsiveConfig(),
    getResponsiveVariants
  };
};

// Hook: useAnimationDebug - Development-time animation debugging
export const useAnimationDebug = (enabled = process.env.NODE_ENV === 'development') => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const logAnimation = useCallback((name: string, data: any) => {
    if (!enabled) return;
    
    console.log(`🎬 Animation: ${name}`, data);
    setDebugInfo(prev => ({
      ...prev,
      [name]: {
        ...data,
        timestamp: Date.now()
      }
    }));
  }, [enabled]);

  const measurePerformance = useCallback((name: string, fn: () => void) => {
    if (!enabled) return fn();
    
    const start = performance.now();
    fn();
    const end = performance.now();
    
    logAnimation(name, {
      duration: end - start,
      type: 'performance'
    });
  }, [enabled, logAnimation]);

  const toggleDebugPanel = useCallback(() => {
    setShowDebugPanel(prev => !prev);
  }, []);

  const clearDebugInfo = useCallback(() => {
    setDebugInfo({});
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        toggleDebugPanel();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enabled, toggleDebugPanel]);

  return {
    debugInfo,
    showDebugPanel,
    logAnimation,
    measurePerformance,
    toggleDebugPanel,
    clearDebugInfo,
    enabled
  };
};

// Hook: useAnimationPresets - Common animation patterns
export const useAnimationPresets = () => {
  const theme = useTheme();

  const presets: Record<string, AnimationPreset> = useMemo(() => ({
    fadeIn: {
      name: 'fadeIn',
      variants: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      transition: {
        duration: parseInt(theme.animations.durations.normal) / 1000,
        ease: theme.animations.easing.easeOut
      }
    },
    slideUp: {
      name: 'slideUp',
      variants: {
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -50, opacity: 0 }
      },
      transition: {
        duration: parseInt(theme.animations.durations.normal) / 1000,
        ease: theme.animations.easing.easeOut
      }
    },
    scaleIn: {
      name: 'scaleIn',
      variants: {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 }
      },
      transition: {
        type: 'spring',
        stiffness: theme.animations.springs.stiffness,
        damping: theme.animations.springs.damping
      }
    },
    rotateIn: {
      name: 'rotateIn',
      variants: {
        initial: { rotate: -180, opacity: 0 },
        animate: { rotate: 0, opacity: 1 },
        exit: { rotate: 180, opacity: 0 }
      },
      transition: {
        duration: parseInt(theme.animations.durations.slow) / 1000,
        ease: theme.animations.easing.easeInOut
      }
    },
    bounceIn: {
      name: 'bounceIn',
      variants: {
        initial: { scale: 0, opacity: 0 },
        animate: { 
          scale: [0, 1.2, 1], 
          opacity: [0, 1, 1] 
        },
        exit: { scale: 0, opacity: 0 }
      },
      transition: {
        duration: parseInt(theme.animations.durations.slow) / 1000,
        times: [0, 0.6, 1],
        ease: theme.animations.easing.easeOut
      }
    },
    slideInLeft: {
      name: 'slideInLeft',
      variants: {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 }
      },
      transition: {
        duration: parseInt(theme.animations.durations.normal) / 1000,
        ease: theme.animations.easing.easeOut
      }
    },
    slideInRight: {
      name: 'slideInRight',
      variants: {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 }
      },
      transition: {
        duration: parseInt(theme.animations.durations.normal) / 1000,
        ease: theme.animations.easing.easeOut
      }
    },
    flipIn: {
      name: 'flipIn',
      variants: {
        initial: { rotateY: 90, opacity: 0 },
        animate: { rotateY: 0, opacity: 1 },
        exit: { rotateY: -90, opacity: 0 }
      },
      transition: {
        duration: parseInt(theme.animations.durations.slow) / 1000,
        ease: theme.animations.easing.easeInOut
      }
    },
    staggerChildren: {
      name: 'staggerChildren',
      variants: {
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        },
        exit: {
          transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
          }
        }
      },
      transition: {}
    }
  }), [theme]);

  const getPreset = useCallback((name: string) => {
    return presets[name] || presets.fadeIn;
  }, [presets]);

  const combinePresets = useCallback((presetNames: string[]) => {
    const combined = presetNames.reduce((acc, name) => {
      const preset = presets[name];
      if (preset) {
        Object.keys(preset.variants).forEach(key => {
          acc.variants[key] = {
            ...acc.variants[key],
            ...preset.variants[key]
          };
        });
      }
      return acc;
    }, {
      name: presetNames.join('+'),
      variants: {} as Record<string, any>,
      transition: presets[presetNames[0]]?.transition || {}
    });

    return combined;
  }, [presets]);

  return {
    presets,
    getPreset,
    combinePresets,
    presetNames: Object.keys(presets)
  };
};