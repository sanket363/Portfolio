import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Performance monitoring hook
const usePerformanceMonitor = () => {
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const checkPerformance = () => {
      const now = performance.now();
      const deltaTime = now - lastTime.current;
      frameCount.current++;

      if (frameCount.current % 60 === 0) {
        const fps = 1000 / (deltaTime / 60);
        if (fps < 30) {
          setPerformanceLevel('low');
        } else if (fps < 50) {
          setPerformanceLevel('medium');
        } else {
          setPerformanceLevel('high');
        }
      }
      lastTime.current = now;
    };

    const interval = setInterval(checkPerformance, 1000);
    return () => clearInterval(interval);
  }, []);

  return performanceLevel;
};

// Reduced motion detection
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

// Theme detection hook
const useTheme = () => {
  const [isDark, setIsDark] = useState(true);
  const [currentRoute, setCurrentRoute] = useState('/');

  useEffect(() => {
    // Listen for theme changes
    const handleThemeChange = (e: CustomEvent) => {
      setIsDark(e.detail.isDark);
    };

    // Listen for route changes
    const handleRouteChange = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('themechange', handleThemeChange as EventListener);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return { isDark, currentRoute };
};

// Interactive Grid Component
const InteractiveGrid = ({ 
  mousePosition, 
  scrollY, 
  performanceLevel, 
  prefersReducedMotion,
  theme 
}: {
  mousePosition: { x: number; y: number };
  scrollY: number;
  performanceLevel: 'high' | 'medium' | 'low';
  prefersReducedMotion: boolean;
  theme: { isDark: boolean; currentRoute: string };
}) => {
  const gridRef = useRef<THREE.GridHelper>();
  const rippleRef = useRef<THREE.Mesh>();
  const { viewport } = useThree();

  // Theme-based colors
  const colors = useMemo(() => {
    const routeColors = {
      '/': { primary: '#00fff5', secondary: '#ff00ff' },
      '/projects': { primary: '#ffff00', secondary: '#00fff5' },
      '/skills': { primary: '#ff00ff', secondary: '#ffff00' },
      '/contact': { primary: '#00ff00', secondary: '#ff00ff' },
    };

    const current = routeColors[theme.currentRoute as keyof typeof routeColors] || routeColors['/'];
    return theme.isDark ? current : { 
      primary: '#333333', 
      secondary: '#666666' 
    };
  }, [theme]);

  // Animated color transitions
  const { primaryColor, secondaryColor } = useSpring({
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    config: { duration: 1000 }
  });

  // Grid complexity based on performance
  const gridSize = useMemo(() => {
    switch (performanceLevel) {
      case 'low': return [50, 50];
      case 'medium': return [75, 75];
      case 'high': return [100, 100];
      default: return [100, 100];
    }
  }, [performanceLevel]);

  useFrame(({ clock }) => {
    if (!gridRef.current) return;

    if (prefersReducedMotion) {
      // Minimal animation for reduced motion
      gridRef.current.position.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
      return;
    }

    const time = clock.getElapsedTime();
    
    // Base movement
    gridRef.current.position.z = (time * 0.5) % 1;
    
    // Parallax effect based on scroll
    gridRef.current.position.y = -5 + (scrollY * 0.001);
    
    // Mouse interaction ripple effect
    if (rippleRef.current) {
      const mouseInfluence = Math.sqrt(
        Math.pow(mousePosition.x - viewport.width / 2, 2) + 
        Math.pow(mousePosition.y - viewport.height / 2, 2)
      ) / 100;
      
      rippleRef.current.scale.setScalar(1 + Math.sin(time * 3 + mouseInfluence) * 0.1);
      rippleRef.current.position.x = (mousePosition.x / viewport.width) * 10 - 5;
      rippleRef.current.position.z = (mousePosition.y / viewport.height) * 10 - 5;
    }

    // Rotation based on mouse position
    gridRef.current.rotation.x = Math.PI / 2 + (mousePosition.y / viewport.height) * 0.1;
    gridRef.current.rotation.z = (mousePosition.x / viewport.width) * 0.1;
  });

  return (
    <group>
      <animated.gridHelper
        ref={gridRef}
        args={[...gridSize, primaryColor, secondaryColor]}
        position={[0, -5, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      
      {/* Ripple effect mesh */}
      <mesh ref={rippleRef} position={[0, -4.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1, 32]} />
        <animated.meshBasicMaterial 
          color={primaryColor}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

// Particle System Component
const ParticleSystem = ({ 
  mousePosition, 
  performanceLevel, 
  prefersReducedMotion,
  theme 
}: {
  mousePosition: { x: number; y: number };
  performanceLevel: 'high' | 'medium' | 'low';
  prefersReducedMotion: boolean;
  theme: { isDark: boolean; currentRoute: string };
}) => {
  const particlesRef = useRef<THREE.Points>();
  const { viewport } = useThree();

  // Particle count based on performance
  const particleCount = useMemo(() => {
    switch (performanceLevel) {
      case 'low': return 50;
      case 'medium': return 150;
      case 'high': return 300;
      default: return 300;
    }
  }, [performanceLevel]);

  // Generate particles
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, velocities };
  }, [particleCount]);

  useFrame(() => {
    if (!particlesRef.current || prefersReducedMotion) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Mouse attraction effect
      const mouseX = (mousePosition.x / viewport.width) * 20 - 10;
      const mouseY = -(mousePosition.y / viewport.height) * 20 + 10;
      
      const dx = mouseX - positions[i3];
      const dy = mouseY - positions[i3 + 1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 3) {
        const force = (3 - distance) / 3;
        positions[i3] += dx * force * 0.01;
        positions[i3 + 1] += dy * force * 0.01;
      }
      
      // Base movement
      positions[i3] += particles.velocities[i3];
      positions[i3 + 1] += particles.velocities[i3 + 1];
      positions[i3 + 2] += particles.velocities[i3 + 2];
      
      // Boundary wrapping
      if (Math.abs(positions[i3]) > 10) positions[i3] *= -1;
      if (Math.abs(positions[i3 + 1]) > 10) positions[i3 + 1] *= -1;
      if (Math.abs(positions[i3 + 2]) > 10) positions[i3 + 2] *= -1;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleColor = theme.isDark ? '#00fff5' : '#333333';

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={particleColor}
        size={0.05}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Audio Reactive Component
const AudioReactiveElements = ({ 
  performanceLevel, 
  prefersReducedMotion 
}: {
  performanceLevel: 'high' | 'medium' | 'low';
  prefersReducedMotion: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>();
  const [audioData, setAudioData] = useState<number[]>([]);

  useEffect(() => {
    if (prefersReducedMotion || performanceLevel === 'low') return;

    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;

    const initAudio = async () => {
      try {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Try to get microphone access for audio reactivity
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const updateAudioData = () => {
          analyser.getByteFrequencyData(dataArray);
          setAudioData(Array.from(dataArray));
          requestAnimationFrame(updateAudioData);
        };
        updateAudioData();
      } catch (error) {
        console.log('Audio access not available:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [prefersReducedMotion, performanceLevel]);

  useFrame(() => {
    if (!meshRef.current || audioData.length === 0) return;

    const average = audioData.reduce((a, b) => a + b, 0) / audioData.length;
    const scale = 1 + (average / 255) * 0.5;
    meshRef.current.scale.setScalar(scale);
  });

  if (prefersReducedMotion || performanceLevel === 'low') return null;

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#ff00ff" transparent opacity={0.3} />
    </mesh>
  );
};

// Main Enhanced3DBackground Component
export const Enhanced3DBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  
  const performanceLevel = usePerformanceMonitor();
  const prefersReducedMotion = useReducedMotion();
  const theme = useTheme();

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Touch tracking for mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setTouchPosition({ x: touch.clientX, y: touch.clientY });
        setMousePosition({ x: touch.clientX, y: touch.clientY });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setTouchPosition({ x: touch.clientX, y: touch.clientY });
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Gesture handling for mobile
  useEffect(() => {
    let startY = 0;
    let startX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const deltaY = startY - endY;
      const deltaX = startX - endX;

      // Detect swipe gestures and trigger visual feedback
      if (Math.abs(deltaY) > 50 || Math.abs(deltaX) > 50) {
        // Trigger ripple effect at touch position
        const event = new CustomEvent('touchripple', {
          detail: { x: endX, y: endY, direction: { x: deltaX, y: deltaY } }
        });
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Camera settings based on performance
  const cameraSettings = useMemo(() => {
    switch (performanceLevel) {
      case 'low':
        return { position: [0, 0, 8], fov: 60 };
      case 'medium':
        return { position: [0, 0, 10], fov: 65 };
      case 'high':
        return { position: [0, 0, 10], fov: 75 };
      default:
        return { position: [0, 0, 10], fov: 75 };
    }
  }, [performanceLevel]);

  // Fallback for reduced motion
  if (prefersReducedMotion) {
    return (
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: -1,
          background: theme.isDark 
            ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)'
            : 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
          opacity: 0.8
        }} 
      />
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: -1 
    }}>
      <Canvas 
        camera={{ 
          position: cameraSettings.position as [number, number, number], 
          fov: cameraSettings.fov 
        }}
        dpr={performanceLevel === 'low' ? 1 : window.devicePixelRatio}
        performance={{ min: 0.5 }}
      >
        <fog 
          attach="fog" 
          args={[
            theme.isDark ? '#0a0a0f' : '#f0f0f0', 
            5, 
            15
          ]} 
        />
        
        <InteractiveGrid
          mousePosition={mousePosition}
          scrollY={scrollY}
          performanceLevel={performanceLevel}
          prefersReducedMotion={prefersReducedMotion}
          theme={theme}
        />
        
        {performanceLevel !== 'low' && (
          <ParticleSystem
            mousePosition={mousePosition}
            performanceLevel={performanceLevel}
            prefersReducedMotion={prefersReducedMotion}
            theme={theme}
          />
        )}
        
        {performanceLevel === 'high' && (
          <AudioReactiveElements
            performanceLevel={performanceLevel}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </Canvas>
    </div>
  );
};

export default Enhanced3DBackground;