import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Animation types and configurations
export type RevealPattern = 
  | 'fade-in'
  | 'slide-in-left'
  | 'slide-in-right'
  | 'slide-in-up'
  | 'slide-in-down'
  | 'scale-in'
  | 'scale-in-x'
  | 'scale-in-y'
  | 'rotate-in'
  | 'rotate-in-left'
  | 'rotate-in-right'
  | 'flip-x'
  | 'flip-y'
  | 'zoom-in'
  | 'zoom-out';

export type ParallaxDirection = 'up' | 'down' | 'left' | 'right';

export interface StaggerConfig {
  amount?: number;
  from?: 'start' | 'center' | 'end' | 'edges' | 'random' | number;
  grid?: [number, number];
  axis?: 'x' | 'y';
  ease?: string;
}

export interface ParallaxConfig {
  speed?: number;
  direction?: ParallaxDirection;
  scale?: boolean;
  rotation?: boolean;
}

export interface MorphConfig {
  property: string;
  from: any;
  to: any;
  ease?: string;
}

export interface ScrollRevealProps {
  children: React.ReactNode;
  
  // Basic animation settings
  pattern?: RevealPattern;
  duration?: number;
  delay?: number;
  ease?: string;
  
  // ScrollTrigger settings
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  pinSpacing?: boolean;
  snap?: boolean | object;
  
  // Advanced features
  stagger?: StaggerConfig;
  parallax?: ParallaxConfig;
  morph?: MorphConfig[];
  batch?: boolean;
  
  // Mobile optimization
  mobileOptimized?: boolean;
  touchAction?: string;
  
  // Performance
  refreshPriority?: number;
  invalidateOnRefresh?: boolean;
  
  // Debugging
  debug?: boolean;
  markers?: boolean;
  
  // Callbacks
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  onUpdate?: (self: ScrollTrigger) => void;
  onToggle?: (self: ScrollTrigger) => void;
  onRefresh?: () => void;
  
  // Accessibility
  respectReducedMotion?: boolean;
  
  // Custom properties
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

// Animation presets
const ANIMATION_PRESETS: Record<RevealPattern, gsap.TweenVars> = {
  'fade-in': {
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  },
  'slide-in-left': {
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  },
  'slide-in-right': {
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  },
  'slide-in-up': {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  },
  'slide-in-down': {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  },
  'scale-in': {
    scale: 0,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)'
  },
  'scale-in-x': {
    scaleX: 0,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  },
  'scale-in-y': {
    scaleY: 0,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  },
  'rotate-in': {
    rotation: 180,
    scale: 0,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)'
  },
  'rotate-in-left': {
    rotation: -90,
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  },
  'rotate-in-right': {
    rotation: 90,
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  },
  'flip-x': {
    rotationY: -90,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  },
  'flip-y': {
    rotationX: -90,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  },
  'zoom-in': {
    scale: 0.5,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  },
  'zoom-out': {
    scale: 1.5,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  }
};

// Utility functions
const isMobile = () => window.innerWidth <= 768;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Intersection Observer fallback for browsers without ScrollTrigger
const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
        ...options
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, callback, options]);
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  pattern = 'fade-in',
  duration = 1,
  delay = 0,
  ease = 'power2.out',
  trigger,
  start = 'top 80%',
  end = 'bottom 20%',
  scrub = false,
  pin = false,
  pinSpacing = true,
  snap = false,
  stagger,
  parallax,
  morph,
  batch = false,
  mobileOptimized = true,
  touchAction = 'auto',
  refreshPriority = 0,
  invalidateOnRefresh = false,
  debug = false,
  markers = false,
  onEnter,
  onLeave,
  onEnterBack,
  onLeaveBack,
  onUpdate,
  onToggle,
  onRefresh,
  respectReducedMotion = true,
  className,
  style,
  as: Component = 'div'
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const fallbackTriggeredRef = useRef(false);

  // Check for reduced motion preference
  const shouldAnimate = useMemo(() => {
    if (!respectReducedMotion) return true;
    return !prefersReducedMotion();
  }, [respectReducedMotion]);

  // Mobile optimization check
  const isMobileDevice = useMemo(() => {
    return mobileOptimized && isMobile();
  }, [mobileOptimized]);

  // Create animation timeline
  const createAnimation = useCallback(() => {
    if (!elementRef.current || !shouldAnimate) return null;

    const element = elementRef.current;
    const preset = ANIMATION_PRESETS[pattern];
    
    // Create timeline
    const tl = gsap.timeline({ paused: true });
    
    // Apply mobile optimizations
    const animationConfig = {
      ...preset,
      duration: isMobileDevice ? duration * 0.7 : duration,
      delay,
      ease,
      force3D: true,
      willChange: 'transform, opacity'
    };

    // Handle staggered animations
    if (stagger) {
      const children = element.children;
      if (children.length > 0) {
        // Set initial state for all children
        gsap.set(children, animationConfig);
        
        // Animate to final state with stagger
        tl.to(children, {
          ...Object.keys(animationConfig).reduce((acc, key) => {
            if (key !== 'duration' && key !== 'delay' && key !== 'ease') {
              acc[key] = key === 'opacity' ? 1 : 0;
            }
            return acc;
          }, {} as any),
          duration: animationConfig.duration,
          ease: animationConfig.ease,
          stagger: {
            amount: stagger.amount || 0.2,
            from: stagger.from || 'start',
            grid: stagger.grid,
            axis: stagger.axis,
            ease: stagger.ease || 'power2.out'
          }
        });
      }
    } else {
      // Set initial state
      gsap.set(element, animationConfig);
      
      // Animate to final state
      tl.to(element, {
        ...Object.keys(animationConfig).reduce((acc, key) => {
          if (key !== 'duration' && key !== 'delay' && key !== 'ease') {
            acc[key] = key === 'opacity' ? 1 : 0;
          }
          return acc;
        }, {} as any),
        duration: animationConfig.duration,
        ease: animationConfig.ease
      });
    }

    // Add morphing animations
    if (morph && morph.length > 0) {
      morph.forEach((morphConfig, index) => {
        tl.fromTo(element, 
          { [morphConfig.property]: morphConfig.from },
          { 
            [morphConfig.property]: morphConfig.to,
            ease: morphConfig.ease || 'none',
            duration: animationConfig.duration
          },
          index * 0.1
        );
      });
    }

    return tl;
  }, [pattern, duration, delay, ease, stagger, morph, shouldAnimate, isMobileDevice]);

  // Create parallax effect
  const createParallax = useCallback(() => {
    if (!elementRef.current || !parallax || !shouldAnimate) return null;

    const element = elementRef.current;
    const { speed = 0.5, direction = 'up', scale: enableScale = false, rotation: enableRotation = false } = parallax;

    const parallaxConfig: any = {};

    switch (direction) {
      case 'up':
        parallaxConfig.y = `${-100 * speed}%`;
        break;
      case 'down':
        parallaxConfig.y = `${100 * speed}%`;
        break;
      case 'left':
        parallaxConfig.x = `${-100 * speed}%`;
        break;
      case 'right':
        parallaxConfig.x = `${100 * speed}%`;
        break;
    }

    if (enableScale) {
      parallaxConfig.scale = 1 + (speed * 0.2);
    }

    if (enableRotation) {
      parallaxConfig.rotation = speed * 360;
    }

    return gsap.fromTo(element, 
      { ...parallaxConfig },
      { 
        ...Object.keys(parallaxConfig).reduce((acc, key) => {
          acc[key] = 0;
          return acc;
        }, {} as any),
        ease: 'none'
      }
    );
  }, [parallax, shouldAnimate]);

  // Intersection Observer fallback
  const handleIntersection = useCallback((isIntersecting: boolean) => {
    if (fallbackTriggeredRef.current || scrollTriggerRef.current) return;
    
    if (isIntersecting && timelineRef.current) {
      timelineRef.current.play();
      fallbackTriggeredRef.current = true;
      onEnter?.();
    }
  }, [onEnter]);

  useIntersectionObserver(elementRef, handleIntersection);

  // Main effect for setting up animations
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    
    // Create animation timeline
    const timeline = createAnimation();
    timelineRef.current = timeline;

    // Check if ScrollTrigger is available
    if (typeof ScrollTrigger !== 'undefined') {
      // Create ScrollTrigger configuration
      const scrollTriggerConfig: any = {
        trigger: trigger || element,
        start,
        end,
        scrub,
        pin,
        pinSpacing,
        snap,
        refreshPriority,
        invalidateOnRefresh,
        markers: debug && markers,
        
        // Callbacks
        onEnter: () => {
          if (timeline && !scrub) timeline.play();
          onEnter?.();
        },
        onLeave: () => {
          if (timeline && !scrub) timeline.reverse();
          onLeave?.();
        },
        onEnterBack: () => {
          if (timeline && !scrub) timeline.play();
          onEnterBack?.();
        },
        onLeaveBack: () => {
          if (timeline && !scrub) timeline.reverse();
          onLeaveBack?.();
        },
        onUpdate: onUpdate,
        onToggle: onToggle,
        onRefresh: onRefresh
      };

      // Add animation to ScrollTrigger
      if (timeline) {
        if (scrub) {
          scrollTriggerConfig.animation = timeline;
        }
      }

      // Add parallax animation
      const parallaxAnimation = createParallax();
      if (parallaxAnimation) {
        scrollTriggerConfig.animation = parallaxAnimation;
      }

      // Create ScrollTrigger
      const st = ScrollTrigger.create(scrollTriggerConfig);
      scrollTriggerRef.current = st;

      // Batch processing for performance
      if (batch) {
        ScrollTrigger.batch(element, {
          onEnter: (elements) => {
            elements.forEach((el) => {
              const tl = gsap.timeline();
              const preset = ANIMATION_PRESETS[pattern];
              gsap.set(el, preset);
              tl.to(el, {
                ...Object.keys(preset).reduce((acc, key) => {
                  if (key !== 'duration' && key !== 'delay' && key !== 'ease') {
                    acc[key] = key === 'opacity' ? 1 : 0;
                  }
                  return acc;
                }, {} as any),
                duration: preset.duration,
                ease: preset.ease
              });
            });
          },
          start: start,
          end: end
        });
      }

      // Mobile touch optimization
      if (isMobileDevice) {
        element.style.touchAction = touchAction;
      }

      // Debug logging
      if (debug) {
        console.log('ScrollReveal initialized:', {
          pattern,
          element,
          scrollTrigger: st,
          timeline,
          isMobile: isMobileDevice,
          reducedMotion: !shouldAnimate
        });
      }
    }

    // Cleanup function
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [
    pattern, duration, delay, ease, trigger, start, end, scrub, pin, pinSpacing,
    snap, batch, debug, markers, isMobileDevice, shouldAnimate, touchAction,
    refreshPriority, invalidateOnRefresh, createAnimation, createParallax,
    onEnter, onLeave, onEnterBack, onLeaveBack, onUpdate, onToggle, onRefresh
  ]);

  // Refresh ScrollTrigger on window resize
  useEffect(() => {
    const handleResize = () => {
      if (ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle reduced motion changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      if (respectReducedMotion && mediaQuery.matches) {
        // Disable animations
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
        }
        if (timelineRef.current) {
          timelineRef.current.kill();
        }
        // Show final state immediately
        if (elementRef.current) {
          gsap.set(elementRef.current, { clearProps: 'all' });
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [respectReducedMotion]);

  return (
    <Component
      ref={elementRef as any}
      className={className}
      style={{
        willChange: shouldAnimate ? 'transform, opacity' : 'auto',
        ...style
      }}
    >
      {children}
    </Component>
  );
};

// Utility components for common use cases
export const FadeInOnScroll: React.FC<Omit<ScrollRevealProps, 'pattern'>> = (props) => (
  <ScrollReveal {...props} pattern="fade-in" />
);

export const SlideInOnScroll: React.FC<Omit<ScrollRevealProps, 'pattern'> & { direction?: 'left' | 'right' | 'up' | 'down' }> = ({ 
  direction = 'up', 
  ...props 
}) => (
  <ScrollReveal {...props} pattern={`slide-in-${direction}` as RevealPattern} />
);

export const ScaleInOnScroll: React.FC<Omit<ScrollRevealProps, 'pattern'>> = (props) => (
  <ScrollReveal {...props} pattern="scale-in" />
);

export const ParallaxContainer: React.FC<Omit<ScrollRevealProps, 'parallax'> & { 
  speed?: number; 
  direction?: ParallaxDirection 
}> = ({ 
  speed = 0.5, 
  direction = 'up', 
  ...props 
}) => (
  <ScrollReveal 
    {...props} 
    parallax={{ speed, direction }} 
    scrub={true}
  />
);

// Batch animation utility
export const createBatchAnimation = (
  selector: string,
  pattern: RevealPattern = 'fade-in',
  options: Partial<ScrollRevealProps> = {}
) => {
  if (typeof ScrollTrigger === 'undefined') return;

  const preset = ANIMATION_PRESETS[pattern];
  
  ScrollTrigger.batch(selector, {
    onEnter: (elements) => {
      elements.forEach((element) => {
        gsap.fromTo(element, preset, {
          ...Object.keys(preset).reduce((acc, key) => {
            if (key !== 'duration' && key !== 'delay' && key !== 'ease') {
              acc[key] = key === 'opacity' ? 1 : 0;
            }
            return acc;
          }, {} as any),
          duration: preset.duration,
          ease: preset.ease,
          ...options
        });
      });
    },
    start: options.start || 'top 80%',
    end: options.end || 'bottom 20%'
  });
};

export default ScrollReveal;