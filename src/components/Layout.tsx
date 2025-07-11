import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import ParticlesBackground from './ParticlesBackground';
import AnimatedGridPattern from './ui/AnimatedGridPattern';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  useEffect(() => {
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <ParticlesBackground />
      <AnimatedGridPattern />
      <Header />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
};