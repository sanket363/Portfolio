import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sun, Moon, Settings, Palette } from 'lucide-react';

interface EnhancedThemeToggleProps {
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  className?: string;
}

interface RippleEffect {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

const EnhancedThemeToggle: React.FC<EnhancedThemeToggleProps> = ({ 
  theme, 
  setTheme, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark' | null>(null);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Motion values for smooth animations
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  const springScale = useSpring(scale, { stiffness: 400, damping: 25 });
  const springRotate = useSpring(rotate, { stiffness: 300, damping: 30 });
  
  // Transform values for icon morphing
  const iconOpacity = useTransform(springRotate, [0, 180], [1, 0]);
  const iconScale = useTransform(springScale, [0.8, 1.2], [0.8, 1.2]);

  // System theme detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
      if (theme === 'auto') {
        triggerThemeTransition(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Reduced motion detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Theme scheduling (automatic dark mode at night)
  useEffect(() => {
    if (!isScheduleEnabled) return;
    
    const checkTime = () => {
      const hour = new Date().getHours();
      const shouldBeDark = hour >= 20 || hour <= 6;
      const targetTheme = shouldBeDark ? 'dark' : 'light';
      
      if (theme !== targetTheme && theme !== 'auto') {
        setTheme(targetTheme);
        triggerThemeTransition(targetTheme);
      }
    };
    
    const interval = setInterval(checkTime, 60000); // Check every minute
    checkTime(); // Check immediately
    
    return () => clearInterval(interval);
  }, [isScheduleEnabled, theme, setTheme]);

  // Global CSS variable transition
  const triggerThemeTransition = useCallback((newTheme: 'light' | 'dark') => {
    if (prefersReducedMotion) {
      // Instant theme switch for reduced motion
      document.documentElement.setAttribute('data-theme', newTheme);
      return;
    }

    // Smooth CSS variable interpolation
    const root = document.documentElement;
    root.style.setProperty('--theme-transition-duration', '0.6s');
    root.setAttribute('data-theme', newTheme);
    
    // Reset transition duration after animation
    setTimeout(() => {
      root.style.removeProperty('--theme-transition-duration');
    }, 600);
  }, [prefersReducedMotion]);

  // Ripple effect animation
  const createRipple = useCallback((event: React.MouseEvent) => {
    if (!buttonRef.current || prefersReducedMotion) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple: RippleEffect = {
      id: Date.now().toString(),
      x,
      y,
      timestamp: Date.now()
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Create page-wide ripple effect
    const pageRipple = document.createElement('div');
    pageRipple.className = 'theme-ripple';
    pageRipple.style.cssText = `
      position: fixed;
      top: ${event.clientY}px;
      left: ${event.clientX}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(var(--theme-ripple-color), 0.3) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      animation: themeRipple 0.8s ease-out forwards;
    `;
    
    document.body.appendChild(pageRipple);
    
    setTimeout(() => {
      document.body.removeChild(pageRipple);
    }, 800);
    
    // Clean up local ripples
    if (rippleTimeoutRef.current) {
      clearTimeout(rippleTimeoutRef.current);
    }
    
    rippleTimeoutRef.current = setTimeout(() => {
      setRipples(prev => prev.filter(ripple => 
        Date.now() - ripple.timestamp < 600
      ));
    }, 600);
  }, [prefersReducedMotion]);

  // Theme toggle handler
  const handleThemeToggle = useCallback((event: React.MouseEvent) => {
    createRipple(event);
    
    // Haptic feedback simulation through animation
    scale.set(0.85);
    rotate.set(rotate.get() + 180);
    
    setTimeout(() => {
      scale.set(1);
    }, 150);
    
    const nextTheme = theme === 'light' ? 'dark' : 
                     theme === 'dark' ? 'auto' : 'light';
    
    setTheme(nextTheme);
    
    const effectiveTheme = nextTheme === 'auto' ? systemTheme : nextTheme;
    triggerThemeTransition(effectiveTheme);
  }, [theme, setTheme, systemTheme, scale, rotate, createRipple, triggerThemeTransition]);

  // Theme preview on hover
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    if (!prefersReducedMotion) {
      scale.set(1.1);
      
      // Show preview of alternate theme
      const previewTarget = theme === 'light' ? 'dark' : 
                           theme === 'dark' ? 'light' : 
                           systemTheme === 'light' ? 'dark' : 'light';
      
      setPreviewTheme(previewTarget);
      
      // Subtle preview effect
      const root = document.documentElement;
      root.style.setProperty('--theme-preview-opacity', '0.1');
      root.setAttribute('data-theme-preview', previewTarget);
    }
  }, [theme, systemTheme, scale, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (!prefersReducedMotion) {
      scale.set(1);
      setPreviewTheme(null);
      
      // Remove preview effect
      const root = document.documentElement;
      root.style.removeProperty('--theme-preview-opacity');
      root.removeAttribute('data-theme-preview');
    }
  }, [scale, prefersReducedMotion]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleThemeToggle(event as any);
    } else if (event.key === 'Escape' && isExpanded) {
      setIsExpanded(false);
    }
  }, [handleThemeToggle, isExpanded]);

  // Get current icon based on theme
  const getCurrentIcon = () => {
    if (theme === 'auto') {
      return systemTheme === 'dark' ? Moon : Sun;
    }
    return theme === 'dark' ? Moon : Sun;
  };

  const CurrentIcon = getCurrentIcon();

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: prefersReducedMotion ? 1 : 1.1,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: prefersReducedMotion ? 1 : 0.95,
      transition: { duration: 0.1 }
    }
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    animate: { 
      rotate: theme === 'dark' ? 180 : 0,
      scale: [1, 1.2, 1],
      transition: { 
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: "easeInOut"
      }
    }
  };

  const expandedMenuVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: { duration: prefersReducedMotion ? 0 : 0.2 }
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      {/* Global CSS for theme transitions and ripple effect */}
      <style jsx global>{`
        :root {
          --theme-ripple-color: ${theme === 'dark' ? '255, 255, 255' : '0, 0, 0'};
        }
        
        @keyframes themeRipple {
          to {
            width: 200vmax;
            height: 200vmax;
            opacity: 0;
          }
        }
        
        * {
          transition: 
            background-color var(--theme-transition-duration, 0.3s) ease,
            border-color var(--theme-transition-duration, 0.3s) ease,
            color var(--theme-transition-duration, 0.3s) ease,
            box-shadow var(--theme-transition-duration, 0.3s) ease;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        {/* Main toggle button */}
        <motion.button
          ref={buttonRef}
          onClick={handleThemeToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          className="relative overflow-hidden p-4 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          style={{ scale: springScale }}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'} theme`}
          aria-pressed={theme === 'dark'}
        >
          {/* Ripple effects */}
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                className="absolute rounded-full bg-white/30 dark:bg-black/30 pointer-events-none"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{ 
                  width: 100, 
                  height: 100, 
                  opacity: 0,
                  transition: { duration: 0.6, ease: "easeOut" }
                }}
                exit={{ opacity: 0 }}
              />
            ))}
          </AnimatePresence>

          {/* Icon with morphing animation */}
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
            style={{ rotate: springRotate }}
            className="relative z-10"
          >
            <CurrentIcon 
              size={24} 
              className={`text-gray-800 dark:text-gray-200 transition-colors duration-300 ${
                theme === 'auto' ? 'opacity-75' : ''
              }`}
            />
            
            {/* Auto mode indicator */}
            {theme === 'auto' && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              />
            )}
          </motion.div>

          {/* Settings button for expanded menu */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="absolute top-1 right-1 p-1 rounded-full bg-white/20 dark:bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings size={12} className="text-gray-600 dark:text-gray-400" />
          </motion.button>
        </motion.button>

        {/* Expanded customization menu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={expandedMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute bottom-full right-0 mb-2 p-4 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-lg shadow-xl min-w-[200px]"
            >
              <div className="space-y-3">
                {/* Theme options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme Mode
                  </label>
                  <div className="flex gap-2">
                    {(['light', 'dark', 'auto'] as const).map((themeOption) => (
                      <motion.button
                        key={themeOption}
                        onClick={() => {
                          setTheme(themeOption);
                          const effectiveTheme = themeOption === 'auto' ? systemTheme : themeOption;
                          triggerThemeTransition(effectiveTheme);
                        }}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          theme === themeOption
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/20 dark:bg-black/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-black/30'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Schedule toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto Schedule
                  </label>
                  <motion.button
                    onClick={() => setIsScheduleEnabled(!isScheduleEnabled)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      isScheduleEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full shadow-md"
                      animate={{ x: isScheduleEnabled ? 20 : 4 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>

                {/* System theme indicator */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  System: {systemTheme}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme preview overlay */}
        <AnimatePresence>
          {previewTheme && isHovering && (
            <motion.div
              className="fixed inset-0 pointer-events-none z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                background: previewTheme === 'dark' 
                  ? 'linear-gradient(45deg, #000000, #1a1a1a)'
                  : 'linear-gradient(45deg, #ffffff, #f5f5f5)'
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default EnhancedThemeToggle;