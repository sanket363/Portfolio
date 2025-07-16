import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@emotion/styled';
import anime from 'animejs';

import { WelcomePage } from './components/WelcomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SkillsPage } from './pages/SkillsPage';
import { ContactPage } from './pages/ContactPage';
import { Navigation } from './components/Navigation';
import { PageTransition } from './components/PageTransition';
import { catppuccinTheme } from './styles/theme';

function App() {
  useEffect(() => {
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
    <ThemeProvider theme={catppuccinTheme}>
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
    </ThemeProvider>
  );
}

export default App;