import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Typed from 'typed.js';
import Splitting from 'splitting';
import { cyberpunkTheme } from '../../styles/theme';
import { fadeInUp, staggerContainer } from '../../styles/animations';

// Import Splitting CSS for proper functionality
import 'splitting/dist/splitting.css';
import 'splitting/dist/splitting-cells.css';

interface AnimatedHeadingProps {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  animationType?: 'fade' | 'slide' | 'scale' | 'rotate' | 'glitch';
  glowEffect?: boolean;
  splitBy?: 'chars' | 'words' | 'lines';
}

interface TypewriterTextProps {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  startDelay?: number;
  loop?: boolean;
  showCursor?: boolean;
  cursorChar?: string;
  className?: string;
  onComplete?: () => void;
  onStringTyped?: (arrayPos: number) => void;
  smartBackspace?: boolean;
  fadeOut?: boolean;
}

interface SplitTextProps {
  text: string;
  splitBy?: 'chars' | 'words' | 'lines' | 'grid';
  className?: string;
  animationType?: 'fade' | 'slide' | 'scale' | 'rotate' | 'wave' | 'elastic';
  delay?: number;
  staggerDelay?: number;
  trigger?: 'hover' | 'inView' | 'immediate';
  direction?: 'up' | 'down' | 'left' | 'right';
}

interface CountingNumberProps {
  from: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
  separator?: string;
  onComplete?: () => void;
}

interface TextHighlightProps {
  text: string;
  highlightWords: string[];
  className?: string;
  highlightClassName?: string;
  animationType?: 'underline' | 'background' | 'glow' | 'gradient';
  delay?: number;
  staggerDelay?: number;
}

interface TextMorphProps {
  texts: string[];
  duration?: number;
  delay?: number;
  className?: string;
  loop?: boolean;
  morphType?: 'fade' | 'slide' | 'scale' | 'blur';
}

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  trigger?: 'hover' | 'continuous' | 'click';
  glitchColors?: string[];
}

interface GradientTextProps {
  text: string;
  gradient?: string;
  className?: string;
  animationType?: 'wave' | 'slide' | 'pulse' | 'rainbow';
  duration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

// Utility function to detect reduced motion preference
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Utility function to get responsive animation values
const useResponsiveAnimation = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return {
    isMobile,
    duration: isMobile ? 0.3 : 0.6,
    staggerDelay: isMobile ? 0.02 : 0.05,
  };
};

// AnimatedHeading Component
export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  level = 1,
  className = '',
  delay = 0,
  staggerDelay = 0.05,
  animationType = 'fade',
  glowEffect = false,
  splitBy = 'chars',
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const { isMobile, duration } = useResponsiveAnimation();

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  useEffect(() => {
    if (ref.current && !prefersReducedMotion) {
      Splitting({ target: ref.current, by: splitBy });
    }
  }, [splitBy, prefersReducedMotion]);

  useEffect(() => {
    if (inView && !prefersReducedMotion) {
      controls.start('animate');
    } else if (prefersReducedMotion) {
      controls.start('animate');
    }
  }, [inView, controls, prefersReducedMotion]);

  const getAnimationVariants = () => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
      };
    }

    const baseVariants = {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      },
      slide: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
      },
      scale: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
      },
      rotate: {
        initial: { opacity: 0, rotateX: -90 },
        animate: { opacity: 1, rotateX: 0 },
      },
      glitch: {
        initial: { opacity: 0, x: -5 },
        animate: { 
          opacity: 1, 
          x: 0,
          textShadow: [
            '0 0 0 transparent',
            '2px 0 0 #ff00ff, -2px 0 0 #00fff5',
            '0 0 0 transparent',
          ],
        },
      },
    };

    return baseVariants[animationType];
  };

  const variants = getAnimationVariants();

  const glowStyles = glowEffect ? {
    textShadow: cyberpunkTheme.shadows.neon,
    color: cyberpunkTheme.colors.primary,
  } : {};

  return (
    <motion.div
      initial="initial"
      animate={controls}
      variants={{
        animate: {
          transition: {
            staggerChildren: isMobile ? 0.02 : staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      <Tag
        ref={ref}
        className={`${className} ${prefersReducedMotion ? '' : 'splitting'}`}
        style={{
          ...glowStyles,
          ...(prefersReducedMotion ? {} : { '--char-stagger': staggerDelay }),
        }}
        data-splitting={prefersReducedMotion ? undefined : ''}
      >
        {prefersReducedMotion ? (
          <motion.span variants={variants}>{text}</motion.span>
        ) : (
          text.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={variants}
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))
        )}
      </Tag>
    </motion.div>
  );
};

// TypewriterText Component
export const TypewriterText: React.FC<TypewriterTextProps> = ({
  strings,
  typeSpeed = 50,
  backSpeed = 30,
  backDelay = 1500,
  startDelay = 0,
  loop = false,
  showCursor = true,
  cursorChar = '|',
  className = '',
  onComplete,
  onStringTyped,
  smartBackspace = true,
  fadeOut = false,
}) => {
  const el = useRef<HTMLSpanElement>(null);
  const typed = useRef<Typed | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isMobile } = useResponsiveAnimation();

  useEffect(() => {
    if (el.current) {
      if (prefersReducedMotion) {
        // Show final text immediately for reduced motion
        el.current.textContent = strings[strings.length - 1] || '';
        if (onComplete) onComplete();
        return;
      }

      const options: any = {
        strings,
        typeSpeed: isMobile ? typeSpeed * 0.7 : typeSpeed,
        backSpeed: isMobile ? backSpeed * 0.7 : backSpeed,
        backDelay,
        startDelay,
        loop,
        showCursor,
        cursorChar,
        smartBackspace,
        fadeOut,
        onComplete,
        onStringTyped,
      };

      typed.current = new Typed(el.current, options);
    }

    return () => {
      if (typed.current) {
        typed.current.destroy();
      }
    };
  }, [strings, typeSpeed, backSpeed, backDelay, startDelay, loop, showCursor, cursorChar, smartBackspace, fadeOut, onComplete, onStringTyped, prefersReducedMotion, isMobile]);

  return (
    <span
      ref={el}
      className={`${className} ${prefersReducedMotion ? 'opacity-100' : ''}`}
      style={{
        color: cyberpunkTheme.colors.textPrimary,
      }}
    />
  );
};

// SplitText Component
export const SplitText: React.FC<SplitTextProps> = ({
  text,
  splitBy = 'chars',
  className = '',
  animationType = 'fade',
  delay = 0,
  staggerDelay = 0.05,
  trigger = 'inView',
  direction = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, threshold: 0.1 });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { isMobile, duration } = useResponsiveAnimation();

  useEffect(() => {
    if (ref.current && !prefersReducedMotion) {
      Splitting({ target: ref.current, by: splitBy });
    }
  }, [splitBy, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      controls.start('animate');
      return;
    }

    if (trigger === 'inView' && inView) {
      controls.start('animate');
    } else if (trigger === 'immediate') {
      controls.start('animate');
    } else if (trigger === 'hover' && isHovered) {
      controls.start('animate');
    }
  }, [inView, isHovered, trigger, controls, prefersReducedMotion]);

  const getAnimationVariants = () => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
      };
    }

    const directionMap = {
      up: { y: 30 },
      down: { y: -30 },
      left: { x: 30 },
      right: { x: -30 },
    };

    const variants = {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      },
      slide: {
        initial: { opacity: 0, ...directionMap[direction] },
        animate: { opacity: 1, x: 0, y: 0 },
      },
      scale: {
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 1, scale: 1 },
      },
      rotate: {
        initial: { opacity: 0, rotate: -180 },
        animate: { opacity: 1, rotate: 0 },
      },
      wave: {
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 10,
          },
        },
      },
      elastic: {
        initial: { opacity: 0, scale: 0 },
        animate: { 
          opacity: 1, 
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
          },
        },
      },
    };

    return variants[animationType];
  };

  const variants = getAnimationVariants();

  return (
    <motion.div
      ref={ref}
      className={`${className} ${prefersReducedMotion ? '' : 'splitting'}`}
      data-splitting={prefersReducedMotion ? undefined : ''}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="initial"
      animate={controls}
      variants={{
        animate: {
          transition: {
            staggerChildren: isMobile ? 0.02 : staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {prefersReducedMotion ? (
        <motion.span variants={variants}>{text}</motion.span>
      ) : (
        text.split(splitBy === 'words' ? ' ' : '').map((segment, index) => (
          <motion.span
            key={index}
            variants={variants}
            style={{ display: 'inline-block' }}
          >
            {segment === '' ? '\u00A0' : segment}
            {splitBy === 'words' && index < text.split(' ').length - 1 ? ' ' : ''}
          </motion.span>
        ))
      )}
    </motion.div>
  );
};

// CountingNumber Component
export const CountingNumber: React.FC<CountingNumberProps> = ({
  from,
  to,
  duration = 2,
  delay = 0,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0,
  separator = ',',
  onComplete,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });
  const [displayValue, setDisplayValue] = useState(from);
  const prefersReducedMotion = useReducedMotion();

  const formatNumber = useCallback((num: number) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  }, [decimals, separator]);

  useEffect(() => {
    if (inView || prefersReducedMotion) {
      if (prefersReducedMotion) {
        setDisplayValue(to);
        if (onComplete) onComplete();
        return;
      }

      const startTime = Date.now() + delay * 1000;
      const endTime = startTime + duration * 1000;

      const animate = () => {
        const now = Date.now();
        
        if (now < startTime) {
          requestAnimationFrame(animate);
          return;
        }

        if (now >= endTime) {
          setDisplayValue(to);
          if (onComplete) onComplete();
          return;
        }

        const progress = (now - startTime) / (duration * 1000);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = from + (to - from) * easeOutQuart;
        
        setDisplayValue(currentValue);
        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [inView, from, to, duration, delay, onComplete, prefersReducedMotion]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ color: cyberpunkTheme.colors.primary }}
    >
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  );
};

// TextHighlight Component
export const TextHighlight: React.FC<TextHighlightProps> = ({
  text,
  highlightWords,
  className = '',
  highlightClassName = '',
  animationType = 'glow',
  delay = 0,
  staggerDelay = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (inView && !prefersReducedMotion) {
      controls.start('animate');
    } else if (prefersReducedMotion) {
      controls.start('animate');
    }
  }, [inView, controls, prefersReducedMotion]);

  const getHighlightVariants = () => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      };
    }

    const variants = {
      underline: {
        initial: { scaleX: 0 },
        animate: { scaleX: 1 },
      },
      background: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
      },
      glow: {
        initial: { textShadow: '0 0 0 transparent' },
        animate: { textShadow: cyberpunkTheme.shadows.neon },
      },
      gradient: {
        initial: { backgroundSize: '0% 100%' },
        animate: { backgroundSize: '100% 100%' },
      },
    };

    return variants[animationType];
  };

  const highlightVariants = getHighlightVariants();

  const renderText = () => {
    const words = text.split(' ');
    
    return words.map((word, index) => {
      const isHighlighted = highlightWords.some(hw => 
        word.toLowerCase().includes(hw.toLowerCase())
      );

      if (isHighlighted) {
        return (
          <motion.span
            key={index}
            className={`${highlightClassName} relative inline-block`}
            variants={highlightVariants}
            style={{
              color: cyberpunkTheme.colors.accent,
              ...(animationType === 'gradient' && {
                background: cyberpunkTheme.gradients.primary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }),
            }}
          >
            {word}
            {animationType === 'underline' && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-current"
                style={{ width: '100%', originX: 0 }}
                variants={highlightVariants}
              />
            )}
          </motion.span>
        );
      }

      return <span key={index}>{word}</span>;
    }).reduce((acc, word, index) => {
      if (index === 0) return [word];
      return [...acc, ' ', word];
    }, [] as React.ReactNode[]);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="initial"
      animate={controls}
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {renderText()}
    </motion.div>
  );
};

// TextMorph Component
export const TextMorph: React.FC<TextMorphProps> = ({
  texts,
  duration = 3,
  delay = 0,
  className = '',
  loop = true,
  morphType = 'fade',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % texts.length;
        if (!loop && next === 0) {
          clearInterval(interval);
          return prev;
        }
        return next;
      });
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [texts.length, duration, loop, prefersReducedMotion]);

  const getMorphVariants = () => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      };
    }

    const variants = {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      slide: {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
      },
      scale: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.2 },
      },
      blur: {
        initial: { opacity: 0, filter: 'blur(10px)' },
        animate: { opacity: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, filter: 'blur(10px)' },
      },
    };

    return variants[morphType];
  };

  const variants = getMorphVariants();

  return (
    <div className={`relative ${className}`}>
      <motion.span
        key={currentIndex}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
        style={{ color: cyberpunkTheme.colors.primary }}
      >
        {texts[currentIndex]}
      </motion.span>
    </div>
  );
};

// GlitchText Component
export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  intensity = 'medium',
  trigger = 'hover',
  glitchColors = ['#ff00ff', '#00fff5', '#ffff00'],
}) => {
  const [isGlitching, setIsGlitching] = useState(trigger === 'continuous');
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();

  const intensityMap = {
    low: { duration: 0.1, iterations: 2 },
    medium: { duration: 0.15, iterations: 4 },
    high: { duration: 0.2, iterations: 6 },
  };

  const glitchAnimation = useCallback(async () => {
    if (prefersReducedMotion) return;

    const { duration, iterations } = intensityMap[intensity];
    
    for (let i = 0; i < iterations; i++) {
      await controls.start({
        x: [0, -2, 2, 0],
        textShadow: [
          '0 0 0 transparent',
          `2px 0 0 ${glitchColors[0]}, -2px 0 0 ${glitchColors[1]}`,
          `1px 0 0 ${glitchColors[2]}, -1px 0 0 ${glitchColors[0]}`,
          '0 0 0 transparent',
        ],
        transition: { duration, ease: 'easeInOut' },
      });
    }
  }, [controls, intensity, glitchColors, prefersReducedMotion]);

  useEffect(() => {
    if (trigger === 'continuous' && isGlitching) {
      const interval = setInterval(glitchAnimation, 2000);
      return () => clearInterval(interval);
    }
  }, [trigger, isGlitching, glitchAnimation]);

  const handleInteraction = () => {
    if (trigger === 'hover') {
      setIsGlitching(true);
      glitchAnimation();
    } else if (trigger === 'click') {
      glitchAnimation();
    }
  };

  return (
    <motion.span
      className={`${className} cursor-pointer`}
      animate={controls}
      onMouseEnter={trigger === 'hover' ? handleInteraction : undefined}
      onMouseLeave={trigger === 'hover' ? () => setIsGlitching(false) : undefined}
      onClick={trigger === 'click' ? handleInteraction : undefined}
      style={{
        color: cyberpunkTheme.colors.textPrimary,
        display: 'inline-block',
      }}
    >
      {text}
    </motion.span>
  );
};

// GradientText Component
export const GradientText: React.FC<GradientTextProps> = ({
  text,
  gradient = cyberpunkTheme.gradients.primary,
  className = '',
  animationType = 'wave',
  duration = 3,
  direction = 'right',
}) => {
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const animate = async () => {
      switch (animationType) {
        case 'wave':
          await controls.start({
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            transition: { duration, repeat: Infinity, ease: 'linear' },
          });
          break;
        case 'slide':
          await controls.start({
            backgroundPosition: direction === 'right' ? ['0% 50%', '100% 50%'] : ['100% 50%', '0% 50%'],
            transition: { duration, repeat: Infinity, repeatType: 'reverse' },
          });
          break;
        case 'pulse':
          await controls.start({
            opacity: [1, 0.7, 1],
            scale: [1, 1.05, 1],
            transition: { duration, repeat: Infinity },
          });
          break;
        case 'rainbow':
          await controls.start({
            filter: [
              'hue-rotate(0deg)',
              'hue-rotate(360deg)',
            ],
            transition: { duration, repeat: Infinity, ease: 'linear' },
          });
          break;
      }
    };

    animate();
  }, [controls, animationType, duration, direction, prefersReducedMotion]);

  return (
    <motion.span
      className={className}
      animate={controls}
      style={{
        background: gradient,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundSize: '200% 200%',
        display: 'inline-block',
      }}
    >
      {text}
    </motion.span>
  );
};

// Export all components
export {
  useReducedMotion,
  useResponsiveAnimation,
};