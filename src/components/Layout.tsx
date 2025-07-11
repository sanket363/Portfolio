import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import ParticlesBackground from './ParticlesBackground';

interface LayoutProps {
  children: React.ReactNode;
}

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

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      <ParticlesBackground />
      <Header />
      <main className="flex-grow container mx-auto p-4 relative z-10">
        {children}
      </main>
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <Footer />
    </div>
  );
};

export default Layout;