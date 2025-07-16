import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import Typed from 'typed.js';
import Splitting from 'splitting';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';
import 'splitting/dist/splitting.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface AnimatedHeroProps {
  theme?: 'light' | 'dark';
  reducedMotion?: boolean;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ 
  theme = 'dark', 
  reducedMotion = false 
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const floatingIconsRef = useRef<HTMLDivElement>(null);
  const ctaButtonsRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [typedInstance, setTypedInstance] = useState<Typed | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Mouse position for particle interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  
  // Transform mouse position for particle effects
  const particleX = useTransform(springX, [0, window.innerWidth], [-50, 50]);
  const particleY = useTransform(springY, [0, window.innerHeight], [-50, 50]);

  // Theme-aware colors
  const themeColors = {
    light: {
      primary: '#6366f1',
      secondary: '#06b6d4',
      accent: '#f59e0b',
      background: 'from-slate-50 to-slate-100',
      text: '#1f2937',
      particles: ['#6366f1', '#06b6d4', '#f59e0b']
    },
    dark: {
      primary: '#7f5af0',
      secondary: '#00ffd5',
      accent: '#ff6bcb',
      background: 'from-[#0f0f1b] to-[#1a1a2e]',
      text: '#ffffff',
      particles: ['#7f5af0', '#00ffd5', '#ff6bcb']
    }
  };

  const currentTheme = themeColors[theme];

  // DevOps icons data
  const devopsIcons = [
    { icon: '☁️', name: 'Cloud', delay: 0 },
    { icon: '🐳', name: 'Docker', delay: 0.2 },
    { icon: '⚙️', name: 'CI/CD', delay: 0.4 },
    { icon: '🔧', name: 'Tools', delay: 0.6 },
    { icon: '📊', name: 'Monitoring', delay: 0.8 },
    { icon: '🚀', name: 'Deploy', delay: 1.0 }
  ];

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse tracking for particle interaction
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!reducedMotion && !isMobile) {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    }
  }, [mouseX, mouseY, reducedMotion, isMobile]);

  // Initialize particles
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  // Splitting.js text animation
  useEffect(() => {
    if (!reducedMotion && nameRef.current) {
      // Apply splitting to the name
      Splitting({ target: nameRef.current, by: 'chars' });
      
      // Animate letters with GSAP
      const chars = nameRef.current.querySelectorAll('.char');
      gsap.fromTo(chars, 
        { 
          opacity: 0, 
          y: 50, 
          rotationX: -90 
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          delay: 0.5
        }
      );
    }
  }, [reducedMotion]);

  // Typed.js initialization
  useEffect(() => {
    if (!reducedMotion && subtitleRef.current) {
      const typed = new Typed(subtitleRef.current, {
        strings: [
          'I automate the cloud ☁️',
          'I build CI/CD pipelines 🚀',
          'I orchestrate containers 🐳',
          'I monitor infrastructure 📊',
          'I optimize deployments ⚡'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 1500,
        loop: true,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true
      });
      
      setTypedInstance(typed);
      
      return () => {
        typed.destroy();
      };
    }
  }, [reducedMotion]);

  // Floating DevOps icons animation
  useEffect(() => {
    if (!reducedMotion && floatingIconsRef.current) {
      const icons = floatingIconsRef.current.querySelectorAll('.floating-icon');
      
      icons.forEach((icon, index) => {
        // Create floating animation path
        const tl = gsap.timeline({ repeat: -1 });
        
        tl.to(icon, {
          duration: 3 + Math.random() * 2,
          x: `+=${Math.random() * 100 - 50}`,
          y: `+=${Math.random() * 100 - 50}`,
          rotation: Math.random() * 360,
          ease: 'sine.inOut'
        })
        .to(icon, {
          duration: 3 + Math.random() * 2,
          x: `-=${Math.random() * 100 - 50}`,
          y: `-=${Math.random() * 100 - 50}`,
          rotation: Math.random() * 360,
          ease: 'sine.inOut'
        });
        
        // Stagger the start times
        tl.delay(index * 0.2);
      });
    }
  }, [reducedMotion]);

  // Scroll-triggered animations
  useEffect(() => {
    if (!reducedMotion && heroRef.current) {
      const ctx = gsap.context(() => {
        // Hero section entrance animation
        gsap.fromTo(heroRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Parallax effect for background elements
        gsap.to(particlesRef.current, {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      return () => ctx.revert();
    }
  }, [reducedMotion]);

  // Mouse move listener
  useEffect(() => {
    if (!reducedMotion && !isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [handleMouseMove, reducedMotion, isMobile]);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1, boxShadow: '0 0 0 rgba(127, 90, 240, 0)' },
    hover: { 
      scale: 1.05, 
      boxShadow: '0 10px 30px rgba(127, 90, 240, 0.3)',
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  // Gesture handlers for mobile
  const handleTap = () => {
    if (isMobile && !reducedMotion) {
      // Trigger particle burst effect
      gsap.to('.particle-burst', {
        scale: 1.5,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="animate-pulse space-y-4">
        <div className="h-16 bg-gray-300 rounded-lg w-96"></div>
        <div className="h-8 bg-gray-300 rounded-lg w-64 mx-auto"></div>
        <div className="flex space-x-4 justify-center mt-8">
          <div className="h-12 bg-gray-300 rounded-full w-32"></div>
          <div className="h-12 bg-gray-300 rounded-full w-32"></div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.section
      ref={heroRef}
      className={`relative h-screen w-full overflow-hidden bg-gradient-to-b ${currentTheme.background}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onTap={handleTap}
    >
      {/* Particles Background */}
      <motion.div
        ref={particlesRef}
        className="absolute inset-0"
        style={{
          x: !reducedMotion ? particleX : 0,
          y: !reducedMotion ? particleY : 0
        }}
      >
        <Particles
          id="hero-particles"
          init={particlesInit}
          options={{
            fpsLimit: reducedMotion ? 30 : 60,
            interactivity: {
              events: {
                onHover: {
                  enable: !reducedMotion && !isMobile,
                  mode: "repulse"
                },
                onClick: {
                  enable: !reducedMotion,
                  mode: "push"
                }
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4
                },
                push: {
                  quantity: 4
                }
              }
            },
            particles: {
              color: {
                value: currentTheme.particles
              },
              links: {
                color: theme === 'dark' ? "#b8b8d1" : "#64748b",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1
              },
              move: {
                direction: "none",
                enable: true,
                outModes: "bounce",
                random: false,
                speed: reducedMotion ? 1 : 2,
                straight: false
              },
              number: {
                density: {
                  enable: true
                },
                value: isMobile ? 40 : 80
              },
              opacity: {
                value: 0.5
              },
              shape: {
                type: "circle"
              },
              size: {
                value: { min: 1, max: 3 }
              }
            },
            detectRetina: true
          }}
        />
      </motion.div>

      {/* Floating DevOps Icons */}
      <div ref={floatingIconsRef} className="absolute inset-0 pointer-events-none">
        {devopsIcons.map((item, index) => (
          <motion.div
            key={item.name}
            className="floating-icon absolute text-4xl opacity-20"
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${30 + (index % 2) * 40}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: reducedMotion ? 0.2 : [0.1, 0.3, 0.1],
              scale: reducedMotion ? 1 : [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: item.delay
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingSkeleton key="skeleton" />
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Animated Name */}
              <motion.div variants={itemVariants}>
                <motion.h1
                  ref={nameRef}
                  className={`text-6xl md:text-8xl font-bold mb-8 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  data-splitting="chars"
                >
                  Hi, I'm Sanket
                </motion.h1>
              </motion.div>

              {/* Typed Subtitle */}
              <motion.div variants={itemVariants} className="relative min-h-[3rem]">
                <p className={`text-2xl md:text-4xl font-mono ${
                  theme === 'dark' ? 'text-[#00ffd5]' : 'text-cyan-600'
                }`}>
                  <span ref={subtitleRef}></span>
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                ref={ctaButtonsRef}
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  variants={buttonVariants}
                  initial="idle"
                  whileHover={!reducedMotion ? "hover" : "idle"}
                  whileTap={!reducedMotion ? "tap" : "idle"}
                  className={`px-8 py-3 rounded-full bg-gradient-to-r from-[${currentTheme.primary}] to-[${currentTheme.secondary}] text-white font-bold transition-all duration-300`}
                >
                  View My Work
                </motion.button>
                
                <motion.button
                  variants={buttonVariants}
                  initial="idle"
                  whileHover={!reducedMotion ? "hover" : "idle"}
                  whileTap={!reducedMotion ? "tap" : "idle"}
                  className={`px-8 py-3 rounded-full border-2 border-[${currentTheme.secondary}] text-[${currentTheme.secondary}] font-bold hover:bg-[${currentTheme.secondary}]/10 transition-all duration-300`}
                >
                  Contact Me
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
      >
        <motion.div
          className={`w-6 h-10 border-2 border-[${currentTheme.secondary}] rounded-full flex justify-center`}
          animate={!reducedMotion ? { y: [0, 10, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className={`w-1 h-3 bg-[${currentTheme.secondary}] rounded-full mt-2`}
            animate={!reducedMotion ? { y: [0, 12, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Particle burst effect for mobile tap */}
      <div className="particle-burst absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 bg-[${currentTheme.accent}] rounded-full`}
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: Math.cos((i * 60) * Math.PI / 180) * 100,
              y: Math.sin((i * 60) * Math.PI / 180) * 100,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default AnimatedHero;