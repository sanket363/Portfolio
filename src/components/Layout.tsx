import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import Header from './Header';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import ParticlesBackground from './ParticlesBackground';
import { Navigation } from './Navigation';
import { Preloader } from './Preloader';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutWrapper = styled(motion.div)`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.base};
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <Preloader />
      ) : (
        <LayoutWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col ${theme}`}
        >
          <ParticlesBackground />
          <Header />
          <main className="flex-grow container mx-auto p-4 relative z-10">
            {children}
          </main>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <Footer />
        </LayoutWrapper>
      )}
    </AnimatePresence>
  );
};

export default Layout;