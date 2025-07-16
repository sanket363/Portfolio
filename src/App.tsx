import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import { ThemeProvider } from '@emotion/react';
import anime from 'animejs';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

import { MotionProvider } from './contexts/MotionContext';
import { LoadingProvider } from './contexts/LoadingContext';
import ErrorBoundary from './components/ErrorBoundary';
import { AnimationDebugger } from './components/AnimationDebugger';
import { AnimationPresets } from './components/AnimationPresets';
import { KeyboardNavigationProvider } from './contexts/KeyboardNavigationContext';
import { useReducedMotion, usePerformanceMode, useGesture } from './hooks/useAnimations';

import { WelcomePage } from './components/WelcomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SkillsPage } from './pages/SkillsPage';
import { ContactPage } from './pages/ContactPage';
import { Navigation } from './components/Navigation';
import { PageTransition } from './components/PageTransition';
import { cyberpunkTheme } from './styles/theme';
import { Background } from './components/Background';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const prefersReducedMotion = useReducedMotion();
  const performanceMode = usePerformanceMode();
  const gestureControls = useGesture();

  useEffect(() => {
    // Initialize Lenis with reduced-motion support
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: !prefersReducedMotion,
      smoothTouch: !prefersReducedMotion,
      touchMultiplier: 2,
    });

    // Integrate GSAP ScrollTrigger with Lenis smooth scrolling
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length
          ? lenis.scrollTo(value, { duration: 0, immediate: true })
          : lenis.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    });

    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.addEventListener('refresh', () => lenis.update());
    ScrollTrigger.refresh();

    // Request animation frame loop
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      ScrollTrigger.killAll();
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    // Initial fade-in animation for app container
    anime({
      targets: '.app-container',
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeInOutQuad',
      complete: () => {
        document.querySelector('.app-container')?.classList.add('animate');
      },
    });
  }, []);

  return (
    <ErrorBoundary>
      <MotionProvider
        reducedMotion={prefersReducedMotion}
        performanceMode={performanceMode}
        gestureControls={gestureControls}
      >
        <LoadingProvider>
          <KeyboardNavigationProvider>
            <ThemeProvider theme={cyberpunkTheme}>
              <Background />
              <AnimateSharedLayout>
                <BrowserRouter>
                  <div className="app-container">
                    <Navigation />
                    <AnimatePresence mode="wait">
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <PageTransition>
                              <WelcomePage />
                            </PageTransition>
                          }
                        />
                        <Route
                          path="/projects"
                          element={
                            <PageTransition>
                              <ProjectsPage />
                            </PageTransition>
                          }
                        />
                        <Route
                          path="/skills"
                          element={
                            <PageTransition>
                              <SkillsPage />
                            </PageTransition>
                          }
                        />
                        <Route
                          path="/contact"
                          element={
                            <PageTransition>
                              <ContactPage />
                            </PageTransition>
                          }
                        />
                      </Routes>
                    </AnimatePresence>
                  </div>
                </BrowserRouter>
              </AnimateSharedLayout>
            </ThemeProvider>
            {process.env.NODE_ENV === 'development' && <AnimationDebugger />}
            <AnimationPresets />
          </KeyboardNavigationProvider>
        </LoadingProvider>
      </MotionProvider>
    </ErrorBoundary>
  );
}

export default App;