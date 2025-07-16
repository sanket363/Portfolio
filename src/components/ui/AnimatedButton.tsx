import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, Variants } from 'framer-motion';
import { useTheme } from '@emotion/react';
import { Theme } from '../../styles/theme';

// Animation variants and utilities from motion system
const DURATIONS = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const;

const EASINGS = {
  smooth: [0.33, 1, 0.68, 1],
  snappy: [0.4, 0, 0.2, 1],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 17,
  },
} as const;

// Button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type AnimationPersonality = 'subtle' | 'energetic' | 'cyberpunk' | 'elegant';

export interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  personality?: AnimationPersonality;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onLongPress?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  hapticFeedback?: boolean;
  soundReactive?: boolean;
  magneticHover?: boolean;
  rippleEffect?: boolean;
  glowEffect?: boolean;
  tiltEffect?: boolean;
  groupIndex?: number;
  totalInGroup?: number;
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
}

// Ripple effect component
const RippleEffect: React.FC<{ x: number; y: number; onComplete: () => void }> = ({ x, y, onComplete }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white/30 pointer-events-none"
      style={{
        left: x - 50,
        top: y - 50,
        width: 100,
        height: 100,
      }}
      initial={{ scale: 0, opacity: 0.6 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onAnimationComplete={onComplete}
    />
  );
};

// Loading spinner component
const LoadingSpinner: React.FC<{ size: number; variant: ButtonVariant }> = ({ size, variant }) => {
  const spinnerVariants: Variants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const getSpinnerColor = () => {
    switch (variant) {
      case 'primary': return 'currentColor';
      case 'secondary': return 'currentColor';
      case 'ghost': return 'currentColor';
      case 'outline': return 'currentColor';
      case 'danger': return '#ef4444';
      case 'success': return '#10b981';
      default: return 'currentColor';
    }
  };

  return (
    <motion.div
      variants={spinnerVariants}
      animate="animate"
      className="inline-block"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={getSpinnerColor()}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      </svg>
    </motion.div>
  );
};

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  personality = 'subtle',
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  onLongPress,
  onSwipe,
  hapticFeedback = true,
  soundReactive = false,
  magneticHover = false,
  rippleEffect = true,
  glowEffect = false,
  tiltEffect = false,
  groupIndex,
  totalInGroup,
  'aria-label': ariaLabel,
  type = 'button',
}) => {
  const theme = useTheme() as Theme;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Motion values for advanced interactions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Long press handling
  useEffect(() => {
    let longPressTimer: NodeJS.Timeout;
    
    const handleMouseDown = () => {
      if (onLongPress && !disabled && !loading) {
        longPressTimer = setTimeout(() => {
          setIsLongPressing(true);
          onLongPress();
          // Haptic feedback simulation
          if (hapticFeedback) {
            scale.set(0.9);
            setTimeout(() => scale.set(1), 100);
          }
        }, 500);
      }
    };

    const handleMouseUp = () => {
      clearTimeout(longPressTimer);
      setIsLongPressing(false);
    };

    const button = buttonRef.current;
    if (button) {
      button.addEventListener('mousedown', handleMouseDown);
      button.addEventListener('mouseup', handleMouseUp);
      button.addEventListener('mouseleave', handleMouseUp);
      button.addEventListener('touchstart', handleMouseDown);
      button.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      clearTimeout(longPressTimer);
      if (button) {
        button.removeEventListener('mousedown', handleMouseDown);
        button.removeEventListener('mouseup', handleMouseUp);
        button.removeEventListener('mouseleave', handleMouseUp);
        button.removeEventListener('touchstart', handleMouseDown);
        button.removeEventListener('touchend', handleMouseUp);
      }
    };
  }, [onLongPress, disabled, loading, hapticFeedback, scale]);

  // Get button styles based on variant
  const getButtonStyles = () => {
    const baseStyles = "relative overflow-hidden font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm rounded-lg",
      md: "px-6 py-3 text-base rounded-xl",
      lg: "px-8 py-4 text-lg rounded-xl",
      xl: "px-10 py-5 text-xl rounded-2xl",
    };

    const variantStyles = {
      primary: `
        bg-gradient-to-r from-cyan-500 to-blue-500 text-white
        shadow-neumorphic-light dark:shadow-neumorphic-dark
        hover:from-cyan-400 hover:to-blue-400
        focus:ring-cyan-500
        ${glowEffect ? 'hover:shadow-cyan-500/50' : ''}
      `,
      secondary: `
        bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200
        shadow-neumorphic-light dark:shadow-neumorphic-dark
        hover:bg-gray-300 dark:hover:bg-gray-700
        focus:ring-gray-500
      `,
      ghost: `
        bg-transparent text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus:ring-gray-500
      `,
      outline: `
        border-2 border-gray-300 dark:border-gray-600 bg-transparent
        text-gray-700 dark:text-gray-300
        hover:bg-gray-50 dark:hover:bg-gray-800
        focus:ring-gray-500
      `,
      danger: `
        bg-gradient-to-r from-red-500 to-pink-500 text-white
        shadow-neumorphic-light dark:shadow-neumorphic-dark
        hover:from-red-400 hover:to-pink-400
        focus:ring-red-500
        ${glowEffect ? 'hover:shadow-red-500/50' : ''}
      `,
      success: `
        bg-gradient-to-r from-green-500 to-emerald-500 text-white
        shadow-neumorphic-light dark:shadow-neumorphic-dark
        hover:from-green-400 hover:to-emerald-400
        focus:ring-green-500
        ${glowEffect ? 'hover:shadow-green-500/50' : ''}
      `,
    };

    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
    const fullWidthStyles = fullWidth ? "w-full" : "";

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${fullWidthStyles} ${className}`;
  };

  // Get animation variants based on personality
  const getAnimationVariants = (): Variants => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 1 },
        hover: { opacity: 1 },
        tap: { opacity: 0.8 },
      };
    }

    const baseVariants = {
      initial: { scale: 1 },
      hover: { 
        scale: magneticHover ? 1.05 : 1.02,
        transition: EASINGS.spring,
      },
      tap: { 
        scale: 0.95,
        transition: { duration: DURATIONS.fast },
      },
    };

    switch (personality) {
      case 'energetic':
        return {
          ...baseVariants,
          hover: {
            ...baseVariants.hover,
            scale: 1.1,
            rotate: [0, -1, 1, 0],
            transition: {
              scale: EASINGS.spring,
              rotate: { duration: 0.3, times: [0, 0.3, 0.7, 1] },
            },
          },
        };
      
      case 'cyberpunk':
        return {
          ...baseVariants,
          hover: {
            ...baseVariants.hover,
            boxShadow: glowEffect ? "0 0 20px rgba(0, 255, 255, 0.5)" : undefined,
            textShadow: "0 0 8px rgba(0, 255, 255, 0.8)",
            transition: { duration: DURATIONS.normal },
          },
        };
      
      case 'elegant':
        return {
          ...baseVariants,
          hover: {
            scale: 1.02,
            y: -2,
            transition: { duration: DURATIONS.slow, ease: EASINGS.smooth },
          },
        };
      
      default:
        return baseVariants;
    }
  };

  // Handle click with ripple effect
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    if (rippleEffect && !prefersReducedMotion) {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const newRipple = { id: Date.now(), x, y };
        setRipples(prev => [...prev, newRipple]);
      }
    }

    // Haptic feedback simulation
    if (hapticFeedback) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
    }

    onClick?.(event);
  };

  // Handle mouse move for tilt effect
  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!tiltEffect || prefersReducedMotion) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  // Handle mouse leave for tilt effect
  const handleMouseLeave = () => {
    if (tiltEffect) {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  // Remove ripple
  const removeRipple = (id: number) => {
    setRipples(prev => prev.filter(ripple => ripple.id !== id));
  };

  // Group animation delay
  const groupDelay = groupIndex !== undefined && totalInGroup !== undefined 
    ? (groupIndex / totalInGroup) * 0.1 
    : 0;

  const buttonVariants = getAnimationVariants();

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      className={getButtonStyles()}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltEffect && !prefersReducedMotion ? {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      } : undefined}
      animate={{
        scale: isPressed ? 0.95 : 1,
        transition: { duration: DURATIONS.fast },
      }}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <RippleEffect
            key={ripple.id}
            x={ripple.x}
            y={ripple.y}
            onComplete={() => removeRipple(ripple.id)}
          />
        ))}
      </AnimatePresence>

      {/* Long press indicator */}
      {isLongPressing && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-inherit"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Button content */}
      <motion.div
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{
          opacity: loading ? 0.7 : 1,
          transition: { duration: DURATIONS.fast },
        }}
      >
        {/* Icon - Left */}
        {icon && iconPosition === 'left' && !loading && (
          <motion.span
            className="inline-flex"
            animate={{
              rotate: soundReactive ? [0, 5, -5, 0] : 0,
              transition: soundReactive ? {
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              } : undefined,
            }}
          >
            {icon}
          </motion.span>
        )}

        {/* Loading spinner */}
        {loading && (
          <LoadingSpinner 
            size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 28} 
            variant={variant}
          />
        )}

        {/* Button text */}
        <motion.span
          animate={{
            x: loading ? 8 : 0,
            transition: { duration: DURATIONS.normal },
          }}
        >
          {children}
        </motion.span>

        {/* Icon - Right */}
        {icon && iconPosition === 'right' && !loading && (
          <motion.span
            className="inline-flex"
            animate={{
              rotate: soundReactive ? [0, -5, 5, 0] : 0,
              transition: soundReactive ? {
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              } : undefined,
            }}
          >
            {icon}
          </motion.span>
        )}
      </motion.div>

      {/* Glow effect overlay */}
      {glowEffect && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-inherit opacity-0 pointer-events-none"
          style={{
            background: variant === 'primary' ? 'radial-gradient(circle, rgba(0,255,255,0.3) 0%, transparent 70%)' :
                       variant === 'danger' ? 'radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%)' :
                       variant === 'success' ? 'radial-gradient(circle, rgba(0,255,0,0.3) 0%, transparent 70%)' :
                       'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: DURATIONS.normal }}
        />
      )}

      {/* Focus ring */}
      <motion.div
        className="absolute inset-0 rounded-inherit border-2 border-transparent pointer-events-none"
        whileFocus={{
          borderColor: variant === 'primary' ? '#06b6d4' :
                      variant === 'danger' ? '#ef4444' :
                      variant === 'success' ? '#10b981' :
                      '#6b7280',
          scale: 1.05,
          transition: { duration: DURATIONS.fast },
        }}
      />
    </motion.button>
  );
};

// Button group component for coordinated animations
export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  staggerDelay?: number;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = '',
  orientation = 'horizontal',
  spacing = 'md',
  staggerDelay = 0.1,
}) => {
  const spacingStyles = {
    sm: orientation === 'horizontal' ? 'gap-2' : 'gap-2',
    md: orientation === 'horizontal' ? 'gap-4' : 'gap-4',
    lg: orientation === 'horizontal' ? 'gap-6' : 'gap-6',
  };

  const orientationStyles = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: DURATIONS.normal },
    },
  };

  return (
    <motion.div
      className={`flex ${orientationStyles} ${spacingStyles[spacing]} ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div variants={itemVariants}>
          {React.isValidElement(child) && child.type === AnimatedButton
            ? React.cloneElement(child as React.ReactElement<AnimatedButtonProps>, {
                groupIndex: index,
                totalInGroup: React.Children.count(children),
              })
            : child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedButton;