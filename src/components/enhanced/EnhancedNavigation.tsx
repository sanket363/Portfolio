import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, PanInfo } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { cyberpunkTheme } from '../../styles/theme';

// Styled Components
const NavContainer = styled(motion.nav)<{ isVisible: boolean; isMobile: boolean }>`
  position: fixed;
  top: 0;
  width: 100%;
  padding: ${props => props.isMobile ? '1rem' : '1.5rem'};
  background: ${cyberpunkTheme.colors.surface}${cyberpunkTheme.glassmorphism.opacity.medium.toString().slice(1)};
  backdrop-filter: blur(${cyberpunkTheme.glassmorphism.blurLevels.medium});
  border-bottom: ${cyberpunkTheme.glassmorphism.border};
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all ${cyberpunkTheme.animations.durations.normal} ${cyberpunkTheme.animations.easing.easeInOut};
  transform: translateY(${props => props.isVisible ? '0' : '-100%'});
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const DesktopNav = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNavToggle = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const HamburgerLine = styled(motion.div)<{ isOpen: boolean }>`
  width: 25px;
  height: 3px;
  background: ${cyberpunkTheme.colors.primary};
  margin: 3px 0;
  border-radius: 2px;
  box-shadow: ${cyberpunkTheme.shadows.neon};
`;

const MobileNavOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(${cyberpunkTheme.glassmorphism.blurLevels.large});
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const NavItem = styled(motion.div)<{ isActive: boolean; isMobile?: boolean }>`
  position: relative;
  cursor: pointer;
  
  ${props => props.isMobile && `
    width: 100%;
    text-align: center;
    padding: 1rem 0;
  `}
`;

const NavLink = styled(Link)<{ isActive: boolean; isMobile?: boolean }>`
  color: ${props => props.isActive ? cyberpunkTheme.colors.primary : cyberpunkTheme.colors.textPrimary};
  text-decoration: none;
  font-size: ${props => props.isMobile ? '1.5rem' : '1.1rem'};
  font-weight: ${props => props.isActive ? '600' : '400'};
  padding: 0.5rem 1rem;
  display: block;
  position: relative;
  transition: all ${cyberpunkTheme.animations.durations.fast} ${cyberpunkTheme.animations.easing.easeOut};
  
  &:focus {
    outline: ${cyberpunkTheme.accessibility.focusRing};
    outline-offset: 2px;
  }
  
  ${props => !props.isMobile && `
    &:hover {
      color: ${cyberpunkTheme.colors.primary};
      text-shadow: ${cyberpunkTheme.shadows.neon};
    }
  `}
`;

const NavIndicator = styled(motion.div)`
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 3px;
  background: ${cyberpunkTheme.gradients.primary};
  border-radius: 2px;
  box-shadow: ${cyberpunkTheme.shadows.neon};
`;

const MagneticWrapper = styled(motion.div)`
  position: relative;
  display: inline-block;
`;

const GlowEffect = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: ${cyberpunkTheme.gradients.glow};
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0;
  z-index: -1;
`;

const Breadcrumbs = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${cyberpunkTheme.colors.textSecondary};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: ${cyberpunkTheme.colors.primary};
  margin: 0 0.5rem;
`;

const ThemeToggleButton = styled(motion.button)`
  background: none;
  border: ${cyberpunkTheme.glassmorphism.border};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${cyberpunkTheme.colors.primary};
  backdrop-filter: blur(${cyberpunkTheme.glassmorphism.blurLevels.small});
  
  &:focus {
    outline: ${cyberpunkTheme.accessibility.focusRing};
  }
`;

// Animation Variants
const navVariants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: cyberpunkTheme.animations.springs.stiffness,
      damping: cyberpunkTheme.animations.springs.damping
    }
  },
  hidden: {
    y: -100,
    opacity: 0,
    transition: {
      duration: parseFloat(cyberpunkTheme.animations.durations.fast) / 1000
    }
  }
};

const mobileNavVariants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: parseFloat(cyberpunkTheme.animations.durations.normal) / 1000,
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  closed: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: parseFloat(cyberpunkTheme.animations.durations.fast) / 1000,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const mobileNavItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  },
  closed: {
    y: 20,
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const magneticVariants = {
  rest: { x: 0, y: 0 },
  hover: { x: 0, y: 0 }
};

const glowVariants = {
  rest: { opacity: 0, scale: 0.8 },
  hover: { 
    opacity: 0.6, 
    scale: 1.2,
    transition: {
      duration: parseFloat(cyberpunkTheme.animations.durations.normal) / 1000
    }
  }
};

const hamburgerVariants = {
  closed: {
    rotate: 0,
    y: 0
  },
  open: {
    rotate: 45,
    y: 6
  }
};

const hamburgerMiddleVariants = {
  closed: {
    opacity: 1,
    x: 0
  },
  open: {
    opacity: 0,
    x: -20
  }
};

const hamburgerBottomVariants = {
  closed: {
    rotate: 0,
    y: 0
  },
  open: {
    rotate: -45,
    y: -6
  }
};

// Custom Hooks
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isAtTop, setIsAtTop] = useState(true);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY.current ? 'down' : 'up';
    const atTop = latest < 10;
    
    if (direction !== scrollDirection && Math.abs(latest - lastScrollY.current) > 10) {
      setScrollDirection(direction);
    }
    
    if (atTop !== isAtTop) {
      setIsAtTop(atTop);
    }
    
    lastScrollY.current = latest;
  });

  return { scrollDirection, isAtTop };
};

const useMagnetic = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;
    
    setMousePosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return { ref, mousePosition, handleMouseMove, handleMouseLeave };
};

// Main Component
export const EnhancedNavigation: React.FC = () => {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { scrollDirection, isAtTop } = useScrollDirection();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Contact', path: '/contact' }
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mobile nav gestures
  const handlePan = (event: any, info: PanInfo) => {
    if (info.velocity.y > 500) {
      setIsMobileNavOpen(false);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileNavOpen) {
        setIsMobileNavOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileNavOpen]);

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', path: '/' }];
    
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ name, path });
    });
    
    return breadcrumbs;
  };

  const isVisible = scrollDirection === 'up' || isAtTop || isMobileNavOpen;

  const MagneticNavItem: React.FC<{ item: typeof navItems[0]; isActive: boolean; isMobile?: boolean }> = ({ 
    item, 
    isActive, 
    isMobile = false 
  }) => {
    const magnetic = useMagnetic();
    
    return (
      <MagneticWrapper
        ref={magnetic.ref}
        onMouseMove={magnetic.handleMouseMove}
        onMouseLeave={magnetic.handleMouseLeave}
        animate={{
          x: magnetic.mousePosition.x,
          y: magnetic.mousePosition.y
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1
        }}
      >
        <NavItem
          isActive={isActive}
          isMobile={isMobile}
          variants={isMobile ? mobileNavItemVariants : undefined}
          whileHover={{ scale: cyberpunkTheme.motion.hoverScale }}
          whileTap={{ scale: cyberpunkTheme.motion.pressScale }}
          onHoverStart={() => {}}
          onHoverEnd={() => {}}
        >
          <GlowEffect
            variants={glowVariants}
            initial="rest"
            whileHover="hover"
          />
          <NavLink
            to={item.path}
            isActive={isActive}
            isMobile={isMobile}
            onClick={() => isMobile && setIsMobileNavOpen(false)}
          >
            {item.name}
          </NavLink>
          {isActive && !isMobile && (
            <NavIndicator
              layoutId="navIndicator"
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 30
              }}
            />
          )}
        </NavItem>
      </MagneticWrapper>
    );
  };

  return (
    <>
      <NavContainer
        variants={navVariants}
        initial="visible"
        animate={isVisible ? "visible" : "hidden"}
        isVisible={isVisible}
        isMobile={isMobile}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {generateBreadcrumbs().map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
              <Link to={crumb.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                {crumb.name}
              </Link>
            </React.Fragment>
          ))}
        </Breadcrumbs>

        {/* Desktop Navigation */}
        <DesktopNav>
          {navItems.map((item) => (
            <MagneticNavItem
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </DesktopNav>

        {/* Theme Toggle */}
        <ThemeToggleButton
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          aria-label="Toggle theme"
        >
          {isDarkTheme ? '☀️' : '🌙'}
        </ThemeToggleButton>

        {/* Mobile Navigation Toggle */}
        <MobileNavToggle
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle mobile navigation"
        >
          <HamburgerLine
            variants={hamburgerVariants}
            animate={isMobileNavOpen ? "open" : "closed"}
            isOpen={isMobileNavOpen}
          />
          <HamburgerLine
            variants={hamburgerMiddleVariants}
            animate={isMobileNavOpen ? "open" : "closed"}
            isOpen={isMobileNavOpen}
          />
          <HamburgerLine
            variants={hamburgerBottomVariants}
            animate={isMobileNavOpen ? "open" : "closed"}
            isOpen={isMobileNavOpen}
          />
        </MobileNavToggle>
      </NavContainer>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <MobileNavOverlay
            variants={mobileNavVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onPan={handlePan}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsMobileNavOpen(false);
              }
            }}
          >
            {navItems.map((item) => (
              <MagneticNavItem
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
                isMobile={true}
              />
            ))}
          </MobileNavOverlay>
        )}
      </AnimatePresence>
    </>
  );
};