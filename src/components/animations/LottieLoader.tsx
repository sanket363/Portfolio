import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import lottie, { AnimationItem, AnimationDirection, AnimationSegment } from 'lottie-web';

// Types
interface LottieLoaderProps {
  animationData?: any;
  path?: string;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  direction?: AnimationDirection;
  segments?: AnimationSegment;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: (event: any) => void;
  onSegmentStart?: (event: any) => void;
  className?: string;
  style?: React.CSSProperties;
  renderer?: 'svg' | 'canvas' | 'html';
  rendererSettings?: any;
  isPaused?: boolean;
  isStopped?: boolean;
  theme?: 'light' | 'dark';
  reducedMotion?: boolean;
  fallbackIcon?: React.ReactNode;
  alt?: string;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onClick?: (event: React.MouseEvent) => void;
  onHover?: (isHovered: boolean) => void;
  lazy?: boolean;
  cache?: boolean;
  responsive?: boolean;
  quality?: 'low' | 'medium' | 'high';
  presetAnimation?: 'loading' | 'success' | 'error' | 'warning' | 'info' | 'devops-gear' | 'devops-pipeline' | 'devops-cloud' | 'devops-server';
}

interface AnimatedIconProps extends Omit<LottieLoaderProps, 'onComplete'> {
  size?: 'small' | 'medium' | 'large' | number;
  interactive?: boolean;
  hoverAnimation?: boolean;
  clickAnimation?: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'muted';
}

interface LottieRef {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  setDirection: (direction: AnimationDirection) => void;
  goToAndStop: (value: number, isFrame?: boolean) => void;
  goToAndPlay: (value: number, isFrame?: boolean) => void;
  playSegments: (segments: AnimationSegment, forceFlag?: boolean) => void;
  destroy: () => void;
  getDuration: () => number;
  getCurrentFrame: () => number;
  getTotalFrames: () => number;
  animation: AnimationItem | null;
}

// Styled Components
const LottieContainer = styled(motion.div)<{
  $width?: number | string;
  $height?: number | string;
  $responsive?: boolean;
  $interactive?: boolean;
  $quality?: string;
}>`
  display: inline-block;
  width: ${({ $width }) => typeof $width === 'number' ? `${$width}px` : $width || 'auto'};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height || 'auto'};
  cursor: ${({ $interactive }) => $interactive ? 'pointer' : 'default'};
  
  ${({ $responsive }) => $responsive && `
    max-width: 100%;
    height: auto;
    
    @media (max-width: 768px) {
      transform: scale(0.8);
    }
    
    @media (max-width: 480px) {
      transform: scale(0.6);
    }
  `}
  
  ${({ $quality }) => $quality === 'low' && `
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  `}
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme?.colors?.accent || '#00ff88'};
    outline-offset: 2px;
    border-radius: 4px;
  }
  
  svg, canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;

const FallbackIcon = styled(motion.div)<{ $size?: string | number; $variant?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => {
    if (typeof $size === 'number') return `${$size}px`;
    switch ($size) {
      case 'small': return '24px';
      case 'medium': return '48px';
      case 'large': return '96px';
      default: return $size || '48px';
    }
  }};
  height: ${({ $size }) => {
    if (typeof $size === 'number') return `${$size}px`;
    switch ($size) {
      case 'small': return '24px';
      case 'medium': return '48px';
      case 'large': return '96px';
      default: return $size || '48px';
    }
  }};
  color: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'primary': return theme?.colors?.primary || '#00ff88';
      case 'secondary': return theme?.colors?.secondary || '#ff6b9d';
      case 'accent': return theme?.colors?.accent || '#00ff88';
      case 'muted': return theme?.colors?.muted || '#6b7280';
      default: return theme?.colors?.text || '#ffffff';
    }
  }};
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

// Animation presets
const getPresetAnimation = (preset: string, theme: 'light' | 'dark' = 'dark') => {
  const presets = {
    loading: {
      // Simple loading spinner data
      v: "5.7.4",
      fr: 60,
      ip: 0,
      op: 60,
      w: 100,
      h: 100,
      nm: "Loading",
      ddd: 0,
      assets: [],
      layers: [{
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Circle",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
          p: { a: 0, k: [50, 50, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        ao: 0,
        shapes: [{
          ty: "gr",
          it: [{
            d: 1,
            ty: "el",
            s: { a: 0, k: [40, 40] },
            p: { a: 0, k: [0, 0] }
          }, {
            ty: "st",
            c: { a: 0, k: theme === 'dark' ? [0, 1, 0.533, 1] : [0.2, 0.6, 1, 1] },
            o: { a: 0, k: 100 },
            w: { a: 0, k: 4 }
          }, {
            ty: "tr",
            p: { a: 0, k: [0, 0] },
            a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] },
            r: { a: 0, k: 0 },
            o: { a: 0, k: 100 }
          }]
        }],
        ip: 0,
        op: 60,
        st: 0,
        bm: 0
      }]
    },
    success: {
      // Checkmark animation
      v: "5.7.4",
      fr: 30,
      ip: 0,
      op: 30,
      w: 100,
      h: 100,
      nm: "Success",
      ddd: 0,
      assets: [],
      layers: [{
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Check",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [50, 50, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        ao: 0,
        shapes: [{
          ty: "gr",
          it: [{
            ind: 0,
            ty: "sh",
            ks: {
              a: 1,
              k: [
                { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 0, s: [{ i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]], v: [[-15, 0], [-15, 0], [-15, 0]], c: false }] },
                { t: 30, s: [{ i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]], v: [[-15, 0], [-5, 10], [20, -15]], c: false }] }
              ]
            }
          }, {
            ty: "st",
            c: { a: 0, k: [0, 0.8, 0.2, 1] },
            o: { a: 0, k: 100 },
            w: { a: 0, k: 6 },
            lc: 2,
            lj: 2
          }, {
            ty: "tr",
            p: { a: 0, k: [0, 0] },
            a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] },
            r: { a: 0, k: 0 },
            o: { a: 0, k: 100 }
          }]
        }],
        ip: 0,
        op: 30,
        st: 0,
        bm: 0
      }]
    }
  };
  
  return presets[preset as keyof typeof presets] || presets.loading;
};

// Cache for loaded animations
const animationCache = new Map<string, any>();

// Performance monitoring
const usePerformanceMode = () => {
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
  
  useEffect(() => {
    const checkPerformance = () => {
      const connection = (navigator as any).connection;
      const memory = (performance as any).memory;
      
      if (connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g') {
        setQuality('low');
      } else if (memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
        setQuality('medium');
      }
    };
    
    checkPerformance();
  }, []);
  
  return quality;
};

// Reduced motion detection
const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return reducedMotion;
};

// Main LottieLoader component
export const LottieLoader = forwardRef<LottieRef, LottieLoaderProps>(({
  animationData,
  path,
  width = 100,
  height = 100,
  loop = true,
  autoplay = true,
  speed = 1,
  direction = 1,
  segments,
  onComplete,
  onLoopComplete,
  onEnterFrame,
  onSegmentStart,
  className,
  style,
  renderer = 'svg',
  rendererSettings,
  isPaused = false,
  isStopped = false,
  theme = 'dark',
  reducedMotion: reducedMotionProp,
  fallbackIcon,
  alt,
  role = 'img',
  tabIndex,
  onKeyDown,
  onClick,
  onHover,
  lazy = false,
  cache = true,
  responsive = false,
  quality: qualityProp,
  presetAnimation
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const systemReducedMotion = useReducedMotion();
  const systemQuality = usePerformanceMode();
  
  const shouldReduceMotion = reducedMotionProp ?? systemReducedMotion;
  const effectiveQuality = qualityProp || systemQuality;
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isVisible) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [lazy, isVisible]);
  
  // Load and initialize animation
  useEffect(() => {
    if (!isVisible || !containerRef.current || shouldReduceMotion) return;
    
    const loadAnimation = async () => {
      try {
        let animData = animationData;
        
        // Handle preset animations
        if (presetAnimation && !animationData && !path) {
          animData = getPresetAnimation(presetAnimation, theme);
        }
        
        // Handle path loading with caching
        if (path && !animData) {
          const cacheKey = `${path}-${theme}`;
          if (cache && animationCache.has(cacheKey)) {
            animData = animationCache.get(cacheKey);
          } else {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to load animation: ${response.statusText}`);
            animData = await response.json();
            if (cache) animationCache.set(cacheKey, animData);
          }
        }
        
        if (!animData) {
          throw new Error('No animation data provided');
        }
        
        // Destroy existing animation
        if (animationRef.current) {
          animationRef.current.destroy();
        }
        
        // Create new animation
        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer,
          loop,
          autoplay: autoplay && !isPaused && !isStopped,
          animationData: animData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
            progressiveLoad: true,
            hideOnTransparent: true,
            ...rendererSettings
          }
        });
        
        // Set initial properties
        animationRef.current.setSpeed(speed);
        animationRef.current.setDirection(direction);
        
        if (segments) {
          animationRef.current.playSegments(segments, true);
        }
        
        // Event listeners
        animationRef.current.addEventListener('complete', () => {
          onComplete?.();
        });
        
        animationRef.current.addEventListener('loopComplete', () => {
          onLoopComplete?.();
        });
        
        animationRef.current.addEventListener('enterFrame', (event) => {
          onEnterFrame?.(event);
        });
        
        animationRef.current.addEventListener('segmentStart', (event) => {
          onSegmentStart?.(event);
        });
        
        animationRef.current.addEventListener('DOMLoaded', () => {
          setIsLoaded(true);
        });
        
        animationRef.current.addEventListener('error', (error) => {
          setError(error.message || 'Animation failed to load');
        });
        
        // Handle paused/stopped states
        if (isPaused) animationRef.current.pause();
        if (isStopped) animationRef.current.stop();
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };
    
    loadAnimation();
    
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [
    isVisible, animationData, path, theme, renderer, loop, autoplay, speed, direction,
    segments, isPaused, isStopped, shouldReduceMotion, presetAnimation, cache
  ]);
  
  // Imperative handle for ref
  useImperativeHandle(ref, () => ({
    play: () => animationRef.current?.play(),
    pause: () => animationRef.current?.pause(),
    stop: () => animationRef.current?.stop(),
    setSpeed: (newSpeed: number) => animationRef.current?.setSpeed(newSpeed),
    setDirection: (newDirection: AnimationDirection) => animationRef.current?.setDirection(newDirection),
    goToAndStop: (value: number, isFrame?: boolean) => animationRef.current?.goToAndStop(value, isFrame),
    goToAndPlay: (value: number, isFrame?: boolean) => animationRef.current?.goToAndPlay(value, isFrame),
    playSegments: (newSegments: AnimationSegment, forceFlag?: boolean) => animationRef.current?.playSegments(newSegments, forceFlag),
    destroy: () => animationRef.current?.destroy(),
    getDuration: () => animationRef.current?.getDuration() || 0,
    getCurrentFrame: () => animationRef.current?.currentFrame || 0,
    getTotalFrames: () => animationRef.current?.totalFrames || 0,
    animation: animationRef.current
  }), []);
  
  // Handle hover events
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover?.(true);
  }, [onHover]);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHover?.(false);
  }, [onHover]);
  
  // Handle keyboard events
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event as any);
    }
    onKeyDown?.(event);
  }, [onClick, onKeyDown]);
  
  // Render fallback for reduced motion or error
  if (shouldReduceMotion || error || !isVisible) {
    return (
      <FallbackIcon
        className={className}
        style={style}
        $size={typeof width === 'number' && typeof height === 'number' ? Math.min(width, height) : width}
        role={role}
        aria-label={alt}
        tabIndex={tabIndex}
        onKeyDown={handleKeyDown}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {fallbackIcon || (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        )}
      </FallbackIcon>
    );
  }
  
  return (
    <LottieContainer
      ref={containerRef}
      className={className}
      style={style}
      $width={width}
      $height={height}
      $responsive={responsive}
      $interactive={!!onClick}
      $quality={effectiveQuality}
      role={role}
      aria-label={alt}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isLoaded ? 1 : 0.7,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: onClick ? 1.05 : 1 }}
      whileTap={{ scale: onClick ? 0.95 : 1 }}
    />
  );
});

LottieLoader.displayName = 'LottieLoader';

// AnimatedIcon component
export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  size = 'medium',
  interactive = true,
  hoverAnimation = true,
  clickAnimation = true,
  variant = 'primary',
  onClick,
  onHover,
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(false);
  
  const sizeValue = typeof size === 'number' ? size : {
    small: 24,
    medium: 48,
    large: 96
  }[size];
  
  const handleClick = useCallback((event: React.MouseEvent) => {
    if (clickAnimation) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    }
    onClick?.(event);
  }, [clickAnimation, onClick]);
  
  const handleHover = useCallback((isHovered: boolean) => {
    if (hoverAnimation) {
      onHover?.(isHovered);
    }
  }, [hoverAnimation, onHover]);
  
  return (
    <motion.div
      animate={{
        scale: isClicked ? 0.9 : 1,
        rotate: isClicked ? 5 : 0
      }}
      transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
    >
      <LottieLoader
        width={sizeValue}
        height={sizeValue}
        onClick={interactive ? handleClick : undefined}
        onHover={interactive ? handleHover : undefined}
        tabIndex={interactive ? 0 : undefined}
        responsive
        {...props}
      />
    </motion.div>
  );
};

// Preset loaders for common use cases
export const DevOpsLoader: React.FC<Omit<LottieLoaderProps, 'presetAnimation'>> = (props) => (
  <LottieLoader presetAnimation="devops-gear" {...props} />
);

export const SuccessIcon: React.FC<Omit<AnimatedIconProps, 'presetAnimation'>> = (props) => (
  <AnimatedIcon presetAnimation="success" {...props} />
);

export const LoadingSpinner: React.FC<Omit<LottieLoaderProps, 'presetAnimation'>> = (props) => (
  <LottieLoader presetAnimation="loading" loop autoplay {...props} />
);

// Export types for external use
export type { LottieLoaderProps, AnimatedIconProps, LottieRef };