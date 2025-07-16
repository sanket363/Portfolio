import React, { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Types and Interfaces
interface DeviceCapabilities {
  gpu: 'high' | 'medium' | 'low';
  memory: number;
  cores: number;
  isMobile: boolean;
  supportsWebGL: boolean;
  supportsIntersectionObserver: boolean;
}

interface PerformanceMetrics {
  fps: number;
  frameDrops: number;
  memoryUsage: number;
  animationCount: number;
}

interface AnimationQueueItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  animation: () => Promise<void> | void;
  dependencies?: string[];
  timeout?: number;
}

interface GestureConfig {
  swipeThreshold: number;
  tapThreshold: number;
  longPressThreshold: number;
  pinchThreshold: number;
  enabled: boolean;
}

interface AnimationPresets {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    smooth: string;
    bounce: string;
    elastic: string;
    sharp: string;
  };
  stagger: {
    fast: number;
    normal: number;
    slow: number;
  };
}

interface ThemeAnimationConfig {
  colorTransitionDuration: number;
  backgroundTransitionDuration: number;
  shadowTransitionDuration: number;
  borderTransitionDuration: number;
}

interface MotionContextType {
  // Core state
  prefersReducedMotion: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  deviceCapabilities: DeviceCapabilities;
  currentTheme: 'light' | 'dark';
  
  // Animation configuration
  animationPresets: AnimationPresets;
  themeAnimationConfig: ThemeAnimationConfig;
  gestureConfig: GestureConfig;
  
  // Performance monitoring
  performanceMetrics: PerformanceMetrics;
  isPerformanceMonitoringEnabled: boolean;
  
  // Animation queue
  queueAnimation: (item: AnimationQueueItem) => void;
  clearAnimationQueue: () => void;
  pauseAnimations: () => void;
  resumeAnimations: () => void;
  
  // Global animation coordination
  registerAnimation: (id: string, cleanup: () => void) => void;
  unregisterAnimation: (id: string) => void;
  killAllAnimations: () => void;
  
  // Theme transitions
  triggerThemeTransition: (newTheme: 'light' | 'dark') => Promise<void>;
  
  // Debug utilities
  debugMode: boolean;
  setDebugMode: (enabled: boolean) => void;
  getAnimationStats: () => object;
}

// Default configurations
const defaultAnimationPresets: AnimationPresets = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.2,
  },
};

const defaultThemeAnimationConfig: ThemeAnimationConfig = {
  colorTransitionDuration: 300,
  backgroundTransitionDuration: 500,
  shadowTransitionDuration: 200,
  borderTransitionDuration: 150,
};

const defaultGestureConfig: GestureConfig = {
  swipeThreshold: 50,
  tapThreshold: 10,
  longPressThreshold: 500,
  pinchThreshold: 0.1,
  enabled: true,
};

// Context creation
const MotionContext = createContext<MotionContextType | undefined>(undefined);

// Device capability detection
const detectDeviceCapabilities = (): DeviceCapabilities => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  return {
    gpu: gl ? 'high' : 'low', // Simplified detection
    memory: (navigator as any).deviceMemory || 4,
    cores: navigator.hardwareConcurrency || 4,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    supportsWebGL: !!gl,
    supportsIntersectionObserver: 'IntersectionObserver' in window,
  };
};

// Performance monitoring utilities
const createPerformanceMonitor = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 60;
  let frameDrops = 0;
  
  const monitor = () => {
    const currentTime = performance.now();
    frameCount++;
    
    if (currentTime - lastTime >= 1000) {
      const newFps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      if (newFps < fps - 5) frameDrops++;
      fps = newFps;
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(monitor);
  };
  
  return { start: () => requestAnimationFrame(monitor), getFps: () => fps, getFrameDrops: () => frameDrops };
};

// Motion Provider Component
interface MotionProviderProps {
  children: ReactNode;
  reducedMotion?: boolean;
  performanceMode?: 'high' | 'medium' | 'low';
  gestureControls?: any;
}

export const MotionProvider: React.FC<MotionProviderProps> = ({
  children,
  reducedMotion,
  performanceMode: initialPerformanceMode,
  gestureControls,
}) => {
  // Core state
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(reducedMotion || false);
  const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>(initialPerformanceMode || 'high');
  const [deviceCapabilities] = useState<DeviceCapabilities>(detectDeviceCapabilities());
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [debugMode, setDebugMode] = useState(process.env.NODE_ENV === 'development');
  
  // Configuration state
  const [animationPresets] = useState<AnimationPresets>(defaultAnimationPresets);
  const [themeAnimationConfig] = useState<ThemeAnimationConfig>(defaultThemeAnimationConfig);
  const [gestureConfig] = useState<GestureConfig>(defaultGestureConfig);
  
  // Performance monitoring
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameDrops: 0,
    memoryUsage: 0,
    animationCount: 0,
  });
  const [isPerformanceMonitoringEnabled, setIsPerformanceMonitoringEnabled] = useState(true);
  
  // Animation management
  const animationQueue = useRef<AnimationQueueItem[]>([]);
  const activeAnimations = useRef<Map<string, () => void>>(new Map());
  const animationsPaused = useRef(false);
  const performanceMonitor = useRef(createPerformanceMonitor());
  
  // Media query for reduced motion
  const systemPrefersReducedMotion = useMediaQuery({ query: '(prefers-reduced-motion: reduce)' });
  
  // Update reduced motion preference
  useEffect(() => {
    setPrefersReducedMotion(reducedMotion || systemPrefersReducedMotion);
  }, [reducedMotion, systemPrefersReducedMotion]);
  
  // Performance monitoring setup
  useEffect(() => {
    if (isPerformanceMonitoringEnabled) {
      performanceMonitor.current.start();
      
      const updateMetrics = () => {
        setPerformanceMetrics(prev => ({
          ...prev,
          fps: performanceMonitor.current.getFps(),
          frameDrops: performanceMonitor.current.getFrameDrops(),
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
          animationCount: activeAnimations.current.size,
        }));
      };
      
      const interval = setInterval(updateMetrics, 1000);
      return () => clearInterval(interval);
    }
  }, [isPerformanceMonitoringEnabled]);
  
  // Auto-adjust performance mode based on metrics
  useEffect(() => {
    if (performanceMetrics.fps < 30 && performanceMode === 'high') {
      setPerformanceMode('medium');
    } else if (performanceMetrics.fps < 20 && performanceMode === 'medium') {
      setPerformanceMode('low');
    } else if (performanceMetrics.fps > 50 && performanceMode === 'low') {
      setPerformanceMode('medium');
    } else if (performanceMetrics.fps > 55 && performanceMode === 'medium') {
      setPerformanceMode('high');
    }
  }, [performanceMetrics.fps, performanceMode]);
  
  // Animation queue management
  const queueAnimation = useCallback((item: AnimationQueueItem) => {
    animationQueue.current.push(item);
    processAnimationQueue();
  }, []);
  
  const processAnimationQueue = useCallback(async () => {
    if (animationsPaused.current || animationQueue.current.length === 0) return;
    
    // Sort by priority
    animationQueue.current.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    const item = animationQueue.current.shift();
    if (!item) return;
    
    try {
      await item.animation();
    } catch (error) {
      console.error('Animation error:', error);
    }
    
    // Process next item
    setTimeout(processAnimationQueue, 16); // ~60fps
  }, []);
  
  const clearAnimationQueue = useCallback(() => {
    animationQueue.current = [];
  }, []);
  
  const pauseAnimations = useCallback(() => {
    animationsPaused.current = true;
    gsap.globalTimeline.pause();
  }, []);
  
  const resumeAnimations = useCallback(() => {
    animationsPaused.current = false;
    gsap.globalTimeline.resume();
    processAnimationQueue();
  }, [processAnimationQueue]);
  
  // Animation registration
  const registerAnimation = useCallback((id: string, cleanup: () => void) => {
    activeAnimations.current.set(id, cleanup);
  }, []);
  
  const unregisterAnimation = useCallback((id: string) => {
    const cleanup = activeAnimations.current.get(id);
    if (cleanup) {
      cleanup();
      activeAnimations.current.delete(id);
    }
  }, []);
  
  const killAllAnimations = useCallback(() => {
    activeAnimations.current.forEach(cleanup => cleanup());
    activeAnimations.current.clear();
    gsap.killTweensOf('*');
    ScrollTrigger.killAll();
    clearAnimationQueue();
  }, [clearAnimationQueue]);
  
  // Theme transition
  const triggerThemeTransition = useCallback(async (newTheme: 'light' | 'dark') => {
    return new Promise<void>((resolve) => {
      const duration = themeAnimationConfig.colorTransitionDuration / 1000;
      
      gsap.to(document.documentElement, {
        duration,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentTheme(newTheme);
          resolve();
        },
      });
    });
  }, [themeAnimationConfig.colorTransitionDuration]);
  
  // Debug utilities
  const getAnimationStats = useCallback(() => {
    return {
      activeAnimations: activeAnimations.current.size,
      queuedAnimations: animationQueue.current.length,
      performanceMetrics,
      deviceCapabilities,
      currentSettings: {
        prefersReducedMotion,
        performanceMode,
        debugMode,
      },
    };
  }, [performanceMetrics, deviceCapabilities, prefersReducedMotion, performanceMode, debugMode]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      killAllAnimations();
    };
  }, [killAllAnimations]);
  
  const contextValue: MotionContextType = {
    // Core state
    prefersReducedMotion,
    performanceMode,
    deviceCapabilities,
    currentTheme,
    
    // Configuration
    animationPresets,
    themeAnimationConfig,
    gestureConfig,
    
    // Performance monitoring
    performanceMetrics,
    isPerformanceMonitoringEnabled,
    
    // Animation queue
    queueAnimation,
    clearAnimationQueue,
    pauseAnimations,
    resumeAnimations,
    
    // Animation coordination
    registerAnimation,
    unregisterAnimation,
    killAllAnimations,
    
    // Theme transitions
    triggerThemeTransition,
    
    // Debug utilities
    debugMode,
    setDebugMode,
    getAnimationStats,
  };
  
  return (
    <MotionContext.Provider value={contextValue}>
      {children}
    </MotionContext.Provider>
  );
};

// Custom Hooks
export const useMotion = () => {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return context;
};

export const useReducedMotion = () => {
  const { prefersReducedMotion } = useMotion();
  return prefersReducedMotion;
};

export const usePerformanceMode = () => {
  const { performanceMode, deviceCapabilities } = useMotion();
  
  const getOptimalSettings = useCallback(() => {
    const baseSettings = {
      high: { maxAnimations: 20, complexAnimations: true, particles: true },
      medium: { maxAnimations: 10, complexAnimations: true, particles: false },
      low: { maxAnimations: 5, complexAnimations: false, particles: false },
    };
    
    return baseSettings[performanceMode];
  }, [performanceMode]);
  
  return { performanceMode, deviceCapabilities, getOptimalSettings };
};

export const useScrollAnimation = () => {
  const { prefersReducedMotion, performanceMode, registerAnimation, unregisterAnimation } = useMotion();
  
  const createScrollAnimation = useCallback((
    element: HTMLElement | string,
    animation: gsap.TweenVars,
    triggerOptions?: ScrollTrigger.Vars
  ) => {
    if (prefersReducedMotion) {
      return null;
    }
    
    const id = `scroll-${Date.now()}-${Math.random()}`;
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      ...triggerOptions,
      animation: gsap.to(element, {
        duration: performanceMode === 'low' ? 0.2 : 0.5,
        ease: 'power2.out',
        ...animation,
      }),
    });
    
    const cleanup = () => scrollTrigger.kill();
    registerAnimation(id, cleanup);
    
    return { id, cleanup };
  }, [prefersReducedMotion, performanceMode, registerAnimation, unregisterAnimation]);
  
  return { createScrollAnimation };
};

export const useGesture = () => {
  const { gestureConfig, deviceCapabilities } = useMotion();
  const [gestureState, setGestureState] = useState({
    isSwipe: false,
    isTap: false,
    isLongPress: false,
    isPinch: false,
    direction: null as 'left' | 'right' | 'up' | 'down' | null,
  });
  
  const handleGesture = useCallback((
    element: HTMLElement,
    handlers: {
      onSwipe?: (direction: string) => void;
      onTap?: () => void;
      onLongPress?: () => void;
      onPinch?: (scale: number) => void;
    }
  ) => {
    if (!gestureConfig.enabled || !deviceCapabilities.isMobile) return;
    
    let startX = 0, startY = 0, startTime = 0;
    let longPressTimer: NodeJS.Timeout;
    
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      
      longPressTimer = setTimeout(() => {
        handlers.onLongPress?.();
        setGestureState(prev => ({ ...prev, isLongPress: true }));
      }, gestureConfig.longPressThreshold);
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      clearTimeout(longPressTimer);
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const deltaTime = Date.now() - startTime;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < gestureConfig.tapThreshold && deltaTime < 300) {
        handlers.onTap?.();
        setGestureState(prev => ({ ...prev, isTap: true }));
      } else if (distance > gestureConfig.swipeThreshold) {
        const direction = Math.abs(deltaX) > Math.abs(deltaY)
          ? deltaX > 0 ? 'right' : 'left'
          : deltaY > 0 ? 'down' : 'up';
        
        handlers.onSwipe?.(direction);
        setGestureState(prev => ({ ...prev, isSwipe: true, direction }));
      }
      
      setTimeout(() => {
        setGestureState({
          isSwipe: false,
          isTap: false,
          isLongPress: false,
          isPinch: false,
          direction: null,
        });
      }, 100);
    };
    
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(longPressTimer);
    };
  }, [gestureConfig, deviceCapabilities.isMobile]);
  
  return { gestureState, handleGesture };
};

// Export the context for direct access if needed
export { MotionContext };