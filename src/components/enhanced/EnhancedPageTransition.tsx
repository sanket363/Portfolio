import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

// Types
interface TransitionConfig {
  type: 'slide' | 'cover' | 'reveal' | 'flip3d' | 'cube' | 'fade' | 'scale' | 'morph';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  easing?: string | number[];
  stagger?: number;
  perspective?: number;
}

interface SharedElement {
  id: string;
  element: HTMLElement;
  bounds: DOMRect;
}

interface EnhancedPageTransitionProps {
  children: React.ReactNode;
  transitionType?: TransitionConfig['type'];
  direction?: TransitionConfig['direction'];
  routeTransitions?: Record<string, TransitionConfig>;
  enableGestures?: boolean;
  enablePreloading?: boolean;
  enableDebug?: boolean;
  onTransitionStart?: () => void;
  onTransitionComplete?: () => void;
  className?: string;
}

// Styled Components
const TransitionContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  perspective: 1000px;
`;

const PageWrapper = styled(motion.div)<{ transitionType: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  
  ${({ transitionType }) => transitionType === 'cube' && `
    transform-origin: center center -50vh;
  `}
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressBar = styled(motion.div)`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #ff00ff);
  border-radius: 2px;
`;

const DebugPanel = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 12px;
  z-index: 10000;
`;

const GestureIndicator = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  z-index: 1000;
`;

// Transition Variants
const createTransitionVariants = (config: TransitionConfig, prefersReducedMotion: boolean) => {
  if (prefersReducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    };
  }

  const { type, direction = 'right', perspective = 1000 } = config;

  switch (type) {
    case 'slide':
      return {
        initial: { 
          x: direction === 'right' ? '100%' : direction === 'left' ? '-100%' : 0,
          y: direction === 'down' ? '100%' : direction === 'up' ? '-100%' : 0,
          opacity: 0
        },
        animate: { x: 0, y: 0, opacity: 1 },
        exit: { 
          x: direction === 'right' ? '-100%' : direction === 'left' ? '100%' : 0,
          y: direction === 'down' ? '-100%' : direction === 'up' ? '100%' : 0,
          opacity: 0
        }
      };

    case 'cover':
      return {
        initial: { 
          x: direction === 'right' ? '100%' : '-100%',
          zIndex: 2
        },
        animate: { x: 0 },
        exit: { 
          x: direction === 'right' ? '-100%' : '100%',
          transition: { delay: 0.1 }
        }
      };

    case 'reveal':
      return {
        initial: { 
          x: 0,
          zIndex: 1
        },
        animate: { x: 0 },
        exit: { 
          x: direction === 'right' ? '-100%' : '100%'
        }
      };

    case 'flip3d':
      return {
        initial: { 
          rotateY: direction === 'right' ? 90 : -90,
          opacity: 0,
          transformPerspective: perspective
        },
        animate: { 
          rotateY: 0,
          opacity: 1
        },
        exit: { 
          rotateY: direction === 'right' ? -90 : 90,
          opacity: 0
        }
      };

    case 'cube':
      return {
        initial: { 
          rotateY: direction === 'right' ? 90 : -90,
          transformPerspective: perspective,
          transformOrigin: direction === 'right' ? 'left center' : 'right center'
        },
        animate: { rotateY: 0 },
        exit: { 
          rotateY: direction === 'right' ? -90 : 90
        }
      };

    case 'scale':
      return {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.2, opacity: 0 }
      };

    case 'morph':
      return {
        initial: { 
          scale: 0.5,
          rotate: -180,
          opacity: 0,
          borderRadius: '50%'
        },
        animate: { 
          scale: 1,
          rotate: 0,
          opacity: 1,
          borderRadius: '0%'
        },
        exit: { 
          scale: 0.5,
          rotate: 180,
          opacity: 0,
          borderRadius: '50%'
        }
      };

    default:
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      };
  }
};

// Custom Hooks
const useReducedMotion = () => {
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

  return prefersReducedMotion;
};

const useGestureNavigation = (onNavigate: (direction: 'left' | 'right') => void, enabled: boolean) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!enabled) return;

    const threshold = 100;
    if (info.offset.x > threshold) {
      onNavigate('right');
    } else if (info.offset.x < -threshold) {
      onNavigate('left');
    }
    x.set(0);
  }, [enabled, onNavigate, x]);

  return { x, opacity, scale, handleDragEnd };
};

const useSharedElements = () => {
  const [sharedElements, setSharedElements] = useState<Map<string, SharedElement>>(new Map());

  const registerSharedElement = useCallback((id: string, element: HTMLElement) => {
    const bounds = element.getBoundingClientRect();
    setSharedElements(prev => new Map(prev).set(id, { id, element, bounds }));
  }, []);

  const unregisterSharedElement = useCallback((id: string) => {
    setSharedElements(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  return { sharedElements, registerSharedElement, unregisterSharedElement };
};

// Main Component
export const EnhancedPageTransition: React.FC<EnhancedPageTransitionProps> = ({
  children,
  transitionType = 'slide',
  direction = 'right',
  routeTransitions = {},
  enableGestures = true,
  enablePreloading = true,
  enableDebug = false,
  onTransitionStart,
  onTransitionComplete,
  className
}) => {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showGestureHint, setShowGestureHint] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { sharedElements, registerSharedElement, unregisterSharedElement } = useSharedElements();

  // Get current route transition config
  const currentConfig = useMemo(() => {
    const routeConfig = routeTransitions[router.pathname];
    return routeConfig || { type: transitionType, direction, duration: 0.6, easing: [0.25, 0.46, 0.45, 0.94] };
  }, [router.pathname, routeTransitions, transitionType, direction]);

  // Gesture navigation
  const handleNavigation = useCallback((gestureDirection: 'left' | 'right') => {
    if (gestureDirection === 'left') {
      router.back();
    } else {
      // Navigate forward or to next logical page
      // This would need to be implemented based on your routing structure
    }
  }, [router]);

  const { x, opacity, scale, handleDragEnd } = useGestureNavigation(handleNavigation, enableGestures);

  // Transition variants
  const variants = useMemo(() => 
    createTransitionVariants(currentConfig, prefersReducedMotion), 
    [currentConfig, prefersReducedMotion]
  );

  // Loading simulation
  useEffect(() => {
    if (!enablePreloading) return;

    const simulateLoading = () => {
      setIsLoading(true);
      setLoadingProgress(0);

      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsLoading(false);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 50);

      return () => clearInterval(interval);
    };

    const handleRouteChangeStart = () => {
      simulateLoading();
      onTransitionStart?.();
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);
      onTransitionComplete?.();
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [enablePreloading, router.events, onTransitionStart, onTransitionComplete]);

  // Debug info
  useEffect(() => {
    if (enableDebug) {
      setDebugInfo({
        route: router.pathname,
        transitionType: currentConfig.type,
        direction: currentConfig.direction,
        reducedMotion: prefersReducedMotion,
        gesturesEnabled: enableGestures,
        sharedElementsCount: sharedElements.size
      });
    }
  }, [enableDebug, router.pathname, currentConfig, prefersReducedMotion, enableGestures, sharedElements.size]);

  // Gesture hint
  useEffect(() => {
    if (enableGestures && !prefersReducedMotion) {
      const timer = setTimeout(() => {
        setShowGestureHint(true);
        setTimeout(() => setShowGestureHint(false), 3000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [enableGestures, prefersReducedMotion]);

  // Sound effect simulation through visual feedback
  const createSoundEffect = useCallback((type: 'whoosh' | 'pop' | 'slide') => {
    if (prefersReducedMotion) return;

    const effect = document.createElement('div');
    effect.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      background: #00ffff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10001;
      transform: translate(-50%, -50%);
    `;

    document.body.appendChild(effect);

    const animation = effect.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(20)', opacity: 0 }
    ], {
      duration: type === 'pop' ? 300 : 600,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => {
      document.body.removeChild(effect);
    };
  }, [prefersReducedMotion]);

  // Transition with sound effect
  const handleTransition = useCallback(() => {
    createSoundEffect(currentConfig.type === 'scale' ? 'pop' : 'whoosh');
  }, [createSoundEffect, currentConfig.type]);

  return (
    <>
      <TransitionContainer
        ref={containerRef}
        className={className}
        style={{ opacity, scale }}
      >
        <AnimatePresence
          mode="wait"
          onExitComplete={handleTransition}
        >
          <PageWrapper
            key={router.pathname}
            transitionType={currentConfig.type}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: currentConfig.duration,
              ease: currentConfig.easing,
              staggerChildren: currentConfig.stagger
            }}
            drag={enableGestures ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x }}
            onAnimationStart={() => {
              onTransitionStart?.();
              setDebugInfo(prev => ({ ...prev, animating: true }));
            }}
            onAnimationComplete={() => {
              onTransitionComplete?.();
              setDebugInfo(prev => ({ ...prev, animating: false }));
            }}
          >
            {children}
          </PageWrapper>
        </AnimatePresence>
      </TransitionContainer>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <ProgressBar>
                <ProgressFill
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </ProgressBar>
              <motion.div
                style={{ 
                  textAlign: 'center', 
                  marginTop: '10px', 
                  color: 'white',
                  fontSize: '14px'
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading {Math.round(loadingProgress)}%
              </motion.div>
            </div>
          </LoadingOverlay>
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <AnimatePresence>
        {showGestureHint && enableGestures && (
          <GestureIndicator
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            ← Swipe to navigate →
          </GestureIndicator>
        )}
      </AnimatePresence>

      {/* Debug Panel */}
      {enableDebug && (
        <DebugPanel>
          <div>Route: {debugInfo.route}</div>
          <div>Transition: {debugInfo.transitionType}</div>
          <div>Direction: {debugInfo.direction}</div>
          <div>Reduced Motion: {debugInfo.reducedMotion ? 'Yes' : 'No'}</div>
          <div>Gestures: {debugInfo.gesturesEnabled ? 'Enabled' : 'Disabled'}</div>
          <div>Shared Elements: {debugInfo.sharedElementsCount}</div>
          <div>Animating: {debugInfo.animating ? 'Yes' : 'No'}</div>
        </DebugPanel>
      )}
    </>
  );
};

// Shared Element Component
export const SharedElement: React.FC<{
  id: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // Register shared element for morphing transitions
      const element = ref.current;
      element.setAttribute('data-shared-element', id);
    }
  }, [id]);

  return (
    <motion.div
      ref={ref}
      className={className}
      layoutId={id}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  );
};

// Transition Presets
export const transitionPresets = {
  // Page-specific transitions
  home: { type: 'scale' as const, duration: 0.8 },
  about: { type: 'slide' as const, direction: 'right' as const },
  projects: { type: 'cube' as const, direction: 'left' as const },
  contact: { type: 'flip3d' as const, direction: 'up' as const },
  
  // Content-specific transitions
  portfolio: { type: 'cover' as const, direction: 'right' as const },
  blog: { type: 'reveal' as const, direction: 'left' as const },
  
  // Dramatic transitions
  dramatic: { type: 'morph' as const, duration: 1.2 },
  subtle: { type: 'fade' as const, duration: 0.4 }
};

export default EnhancedPageTransition;