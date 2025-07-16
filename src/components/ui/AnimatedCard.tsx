import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimation, AnimatePresence, PanInfo } from 'framer-motion';
import styled from '@emotion/styled';
import { cyberpunkTheme } from '../../styles/theme';

// Styled components for enhanced glassmorphism effects
const CardContainer = styled(motion.div)<{ $isFlipped?: boolean; $isLoading?: boolean }>`
  position: relative;
  perspective: 1000px;
  cursor: pointer;
  transform-style: preserve-3d;
  
  ${({ $isLoading }) => $isLoading && `
    pointer-events: none;
    opacity: 0.7;
  `}
`;

const CardFace = styled(motion.div)<{ $isBack?: boolean }>`
  position: ${({ $isBack }) => $isBack ? 'absolute' : 'relative'};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${({ $isBack }) => $isBack && `
    transform: rotateY(180deg);
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(135deg, 
      rgba(0, 255, 245, 0.3) 0%, 
      rgba(255, 0, 255, 0.3) 50%, 
      rgba(255, 255, 0, 0.3) 100%
    );
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const GlowEffect = styled(motion.div)`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 18px;
  background: linear-gradient(135deg, 
    ${cyberpunkTheme.colors.primary}40 0%, 
    ${cyberpunkTheme.colors.secondary}40 50%, 
    ${cyberpunkTheme.colors.accent}40 100%
  );
  filter: blur(8px);
  opacity: 0;
  z-index: -1;
`;

const LoadingSkeleton = styled(motion.div)`
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  border-radius: 8px;
  height: 20px;
  margin: 8px 0;
`;

// Animation variants
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.9,
    rotateX: -15 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.6
    }
  },
  exit: { 
    opacity: 0, 
    y: -50, 
    scale: 0.9,
    transition: { duration: 0.3 }
  }
};

const entranceVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slide: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  flip: {
    hidden: { opacity: 0, rotateY: -90 },
    visible: { opacity: 1, rotateY: 0 }
  }
};

const skeletonVariants = {
  loading: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 1.5,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Interfaces
interface AnimatedCardProps {
  children?: React.ReactNode;
  backContent?: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'flip';
  delay?: number;
  isFlippable?: boolean;
  isLoading?: boolean;
  onHover?: () => void;
  onPress?: () => void;
  onFlip?: (isFlipped: boolean) => void;
  enableMagneticHover?: boolean;
  enable3DTilt?: boolean;
  enableGestures?: boolean;
  reducedMotion?: boolean;
  staggerIndex?: number;
}

// Custom hooks
const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  backContent,
  className = '',
  variant = 'fade',
  delay = 0,
  isFlippable = false,
  isLoading = false,
  onHover,
  onPress,
  onFlip,
  enableMagneticHover = true,
  enable3DTilt = true,
  enableGestures = true,
  reducedMotion: forcedReducedMotion,
  staggerIndex = 0,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // Motion values for 3D tilt and magnetic effects
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  
  // Transforms for 3D effects
  const rotateX = useTransform(y, [-100, 100], enable3DTilt ? [15, -15] : [0, 0]);
  const rotateY = useTransform(x, [-100, 100], enable3DTilt ? [-15, 15] : [0, 0]);
  
  // Spring configurations
  const springConfig = { damping: 25, stiffness: 300 };
  const magneticConfig = { damping: 20, stiffness: 400 };
  
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springMagneticX = useSpring(magneticX, magneticConfig);
  const springMagneticY = useSpring(magneticY, magneticConfig);
  
  // Hooks
  const isInView = useIntersectionObserver(cardRef, { threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = forcedReducedMotion || prefersReducedMotion;
  
  // Calculate stagger delay
  const staggerDelay = delay + (staggerIndex * 0.1);
  
  // Mouse move handler for 3D tilt and magnetic effects
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!cardRef.current || shouldReduceMotion) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    // 3D tilt effect
    if (enable3DTilt) {
      x.set(mouseX * 0.5);
      y.set(mouseY * 0.5);
    }
    
    // Magnetic hover effect
    if (enableMagneticHover && isHovered) {
      const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      const maxDistance = 100;
      const strength = Math.max(0, 1 - distance / maxDistance);
      
      magneticX.set(mouseX * strength * 0.3);
      magneticY.set(mouseY * strength * 0.3);
    }
  }, [x, y, magneticX, magneticY, enable3DTilt, enableMagneticHover, isHovered, shouldReduceMotion]);
  
  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    if (shouldReduceMotion) return;
    
    x.set(0);
    y.set(0);
    magneticX.set(0);
    magneticY.set(0);
    setIsHovered(false);
  }, [x, y, magneticX, magneticY, shouldReduceMotion]);
  
  // Mouse enter handler
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover?.();
  }, [onHover]);
  
  // Press handler
  const handlePress = useCallback(() => {
    if (shouldReduceMotion) return;
    
    controls.start({
      scale: 0.95,
      transition: { duration: 0.1 }
    }).then(() => {
      controls.start({
        scale: 1,
        transition: { duration: 0.2, type: "spring" }
      });
    });
    
    onPress?.();
  }, [controls, onPress, shouldReduceMotion]);
  
  // Flip handler
  const handleFlip = useCallback(() => {
    if (!isFlippable || shouldReduceMotion) return;
    
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    onFlip?.(newFlippedState);
  }, [isFlippable, isFlipped, onFlip, shouldReduceMotion]);
  
  // Gesture handlers
  const handlePan = useCallback((event: any, info: PanInfo) => {
    if (!enableGestures || shouldReduceMotion) return;
    
    // Swipe to flip
    if (isFlippable && Math.abs(info.offset.x) > 100) {
      handleFlip();
    }
  }, [enableGestures, isFlippable, handleFlip, shouldReduceMotion]);
  
  // Long press handler
  const handleLongPress = useCallback(() => {
    if (!enableGestures || shouldReduceMotion) return;
    
    // Trigger flip on long press
    if (isFlippable) {
      handleFlip();
    }
  }, [enableGestures, isFlippable, handleFlip, shouldReduceMotion]);
  
  // Animation variants based on reduced motion preference
  const currentVariants = shouldReduceMotion 
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : entranceVariants[variant];
  
  // Loading skeleton content
  const renderLoadingSkeleton = () => (
    <div style={{ padding: '1.5rem' }}>
      <LoadingSkeleton
        variants={skeletonVariants}
        animate="loading"
        style={{ height: '24px', marginBottom: '16px' }}
      />
      <LoadingSkeleton
        variants={skeletonVariants}
        animate="loading"
        style={{ height: '16px', marginBottom: '12px', width: '80%' }}
      />
      <LoadingSkeleton
        variants={skeletonVariants}
        animate="loading"
        style={{ height: '16px', width: '60%' }}
      />
    </div>
  );
  
  return (
    <CardContainer
      ref={cardRef}
      className={className}
      $isFlipped={isFlipped}
      $isLoading={isLoading}
      variants={currentVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      transition={{
        delay: staggerDelay,
        type: "spring",
        damping: 25,
        stiffness: 300
      }}
      style={{
        rotateX: shouldReduceMotion ? 0 : springRotateX,
        rotateY: shouldReduceMotion ? 0 : springRotateY,
        x: shouldReduceMotion ? 0 : springMagneticX,
        y: shouldReduceMotion ? 0 : springMagneticY,
      }}
      animate={controls}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTap={handlePress}
      onPan={enableGestures ? handlePan : undefined}
      onTapStart={enableGestures ? handleLongPress : undefined}
      whileHover={shouldReduceMotion ? {} : { 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={shouldReduceMotion ? {} : { 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      {/* Glow effect */}
      <GlowEffect
        animate={{
          opacity: isHovered && !shouldReduceMotion ? 0.6 : 0,
          scale: isHovered && !shouldReduceMotion ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Front face */}
      <CardFace
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.6,
          type: "spring",
          damping: 20,
          stiffness: 300
        }}
        onClick={isFlippable ? handleFlip : undefined}
      >
        {isLoading ? renderLoadingSkeleton() : children}
      </CardFace>
      
      {/* Back face */}
      {isFlippable && backContent && (
        <CardFace
          $isBack
          animate={{
            rotateY: isFlipped ? 0 : -180,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.6,
            type: "spring",
            damping: 20,
            stiffness: 300
          }}
          onClick={handleFlip}
        >
          {backContent}
        </CardFace>
      )}
    </CardContainer>
  );
};

// Export additional utility components
export const AnimatedCardGrid: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className = '' }) => {
  return (
    <motion.div
      className={`grid gap-6 ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;