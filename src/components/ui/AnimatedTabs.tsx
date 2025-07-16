'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';

// Animation variants
const tabIndicatorVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

const tabContentVariants = {
  initial: { opacity: 0, x: 20, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -20, scale: 0.95 }
};

const tabTriggerVariants = {
  idle: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -1 },
  tap: { scale: 0.98, y: 0 },
  focus: { scale: 1.01, y: -0.5 }
};

const badgeVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  pulse: { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }
};

const skeletonVariants = {
  loading: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Types
interface AnimatedTabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  enableSwipeGestures?: boolean;
  enableDragReorder?: boolean;
  reducedMotion?: boolean;
  loadingStates?: Record<string, boolean>;
}

interface TabTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  badge?: number | string;
  badgeVariant?: 'default' | 'destructive' | 'secondary';
  isDraggable?: boolean;
}

interface TabContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  isLoading?: boolean;
  transition?: 'slide' | 'fade' | 'scale';
}

// Context for tab state management
const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabsOrder: string[];
  setTabsOrder: (order: string[]) => void;
  reducedMotion: boolean;
  enableSwipeGestures: boolean;
  enableDragReorder: boolean;
}>({
  activeTab: '',
  setActiveTab: () => {},
  tabsOrder: [],
  setTabsOrder: () => {},
  reducedMotion: false,
  enableSwipeGestures: false,
  enableDragReorder: false
});

// Main Tabs component
const AnimatedTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  AnimatedTabsProps
>(({ 
  className, 
  enableSwipeGestures = true, 
  enableDragReorder = false,
  reducedMotion = false,
  loadingStates = {},
  children,
  onValueChange,
  defaultValue,
  value,
  ...props 
}, ref) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || '');
  const [tabsOrder, setTabsOrder] = React.useState<string[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);

  // Detect reduced motion preference
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches || reducedMotion;
  }, [reducedMotion]);

  const handleValueChange = React.useCallback((newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  const contextValue = React.useMemo(() => ({
    activeTab: value || activeTab,
    setActiveTab: handleValueChange,
    tabsOrder,
    setTabsOrder,
    reducedMotion: prefersReducedMotion,
    enableSwipeGestures,
    enableDragReorder
  }), [value, activeTab, handleValueChange, tabsOrder, prefersReducedMotion, enableSwipeGestures, enableDragReorder]);

  return (
    <TabsContext.Provider value={contextValue}>
      <TabsPrimitive.Root
        ref={ref}
        className={cn('w-full', className)}
        value={value || activeTab}
        onValueChange={handleValueChange}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  );
});
AnimatedTabs.displayName = 'AnimatedTabs';

// Animated TabsList with indicator
const AnimatedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const { activeTab, reducedMotion } = React.useContext(TabsContext);
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 });
  const listRef = React.useRef<HTMLDivElement>(null);

  // Update indicator position
  React.useEffect(() => {
    if (!listRef.current || !activeTab) return;

    const activeElement = listRef.current.querySelector(`[data-state="active"]`) as HTMLElement;
    if (activeElement) {
      const listRect = listRef.current.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();
      
      setIndicatorStyle({
        left: activeRect.left - listRect.left,
        width: activeRect.width
      });
    }
  }, [activeTab]);

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg bg-slate-100/80 backdrop-blur-sm p-1 dark:bg-slate-800/80',
        'border border-slate-200/50 dark:border-slate-700/50',
        className
      )}
      {...props}
    >
      <div ref={listRef} className="relative flex items-center">
        {/* Animated indicator */}
        <AnimatePresence>
          {activeTab && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute top-0 h-full bg-white dark:bg-slate-900 rounded-md shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width
              }}
              variants={!reducedMotion ? tabIndicatorVariants : undefined}
              initial={!reducedMotion ? "initial" : false}
              animate={!reducedMotion ? "animate" : false}
              exit={!reducedMotion ? "exit" : false}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            />
          )}
        </AnimatePresence>
        {children}
      </div>
    </TabsPrimitive.List>
  );
});
AnimatedTabsList.displayName = 'AnimatedTabsList';

// Animated TabsTrigger with hover effects and badges
const AnimatedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabTriggerProps
>(({ 
  className, 
  children, 
  badge, 
  badgeVariant = 'default',
  isDraggable = false,
  ...props 
}, ref) => {
  const { reducedMotion, enableDragReorder } = React.useContext(TabsContext);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-100, 0, 100], [0.5, 1, 0.5]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Handle tab reordering logic here
    dragX.set(0);
  };

  const badgeColors = {
    default: 'bg-blue-500 text-white',
    destructive: 'bg-red-500 text-white',
    secondary: 'bg-slate-500 text-white'
  };

  return (
    <motion.div
      drag={enableDragReorder && isDraggable ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x: dragX, opacity: dragOpacity }}
      whileHover={!reducedMotion ? "hover" : undefined}
      whileTap={!reducedMotion ? "tap" : undefined}
      variants={!reducedMotion ? tabTriggerVariants : undefined}
      animate={isFocused && !reducedMotion ? "focus" : "idle"}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          'relative inline-flex min-w-[100px] items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all',
          'disabled:pointer-events-none disabled:opacity-50',
          'data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100',
          'data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400',
          'hover:text-slate-900 dark:hover:text-slate-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          'dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-900',
          enableDragReorder && isDraggable && 'cursor-grab active:cursor-grabbing',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {badge && (
            <motion.span
              className={cn(
                'inline-flex items-center justify-center min-w-[18px] h-[18px] text-xs font-semibold rounded-full',
                badgeColors[badgeVariant]
              )}
              variants={!reducedMotion ? badgeVariants : undefined}
              initial={!reducedMotion ? "initial" : false}
              animate={!reducedMotion ? "animate" : false}
              whileHover={!reducedMotion ? { scale: 1.1 } : undefined}
            >
              {badge}
            </motion.span>
          )}
        </span>
      </TabsPrimitive.Trigger>
    </motion.div>
  );
});
AnimatedTabsTrigger.displayName = 'AnimatedTabsTrigger';

// Animated TabsContent with transitions and loading states
const AnimatedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabContentProps
>(({ 
  className, 
  children, 
  isLoading = false,
  transition = 'slide',
  ...props 
}, ref) => {
  const { reducedMotion, enableSwipeGestures } = React.useContext(TabsContext);
  const dragX = useMotionValue(0);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      // Handle swipe navigation
      // This would need to be connected to the parent tabs logic
    }
    dragX.set(0);
  };

  const getTransitionVariants = () => {
    switch (transition) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 }
        };
      default:
        return tabContentVariants;
    }
  };

  const LoadingSkeleton = () => (
    <motion.div
      className="space-y-4"
      variants={!reducedMotion ? skeletonVariants : undefined}
      animate={!reducedMotion ? "loading" : undefined}
    >
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
    </motion.div>
  );

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-4 rounded-lg border border-slate-200/50 dark:border-slate-700/50 p-6',
        'bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-900',
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={props.value}
          drag={enableSwipeGestures ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          style={{ x: dragX }}
          variants={!reducedMotion ? getTransitionVariants() : undefined}
          initial={!reducedMotion ? "initial" : false}
          animate={!reducedMotion ? "animate" : false}
          exit={!reducedMotion ? "exit" : false}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.2
          }}
        >
          {isLoading ? <LoadingSkeleton /> : children}
        </motion.div>
      </AnimatePresence>
    </TabsPrimitive.Content>
  );
});
AnimatedTabsContent.displayName = 'AnimatedTabsContent';

// Export components
export { 
  AnimatedTabs as Tabs, 
  AnimatedTabsList as TabsList, 
  AnimatedTabsTrigger as TabsTrigger, 
  AnimatedTabsContent as TabsContent 
};

// Export types
export type { AnimatedTabsProps, TabTriggerProps, TabContentProps };