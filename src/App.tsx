import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@emotion/react';
import anime from 'animejs';

import DevOpsPortfolio from './pages/DevOpsPortfolioPage';
import { catppuccinTheme } from './styles/theme';
import { Navigation } from './components/Navigation';
import { WelcomePage } from './components/WelcomePage';
import { PageTransition } from './components/PageTransition';

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
              {/* Add more routes with PageTransition wrapper */}
            </Routes>
          </AnimatePresence>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;