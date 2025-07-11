import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ParticlesBackground } from './ParticlesBackground';
import { AnimatedGridPattern } from '../components/ui/AnimatedGridPattern';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <ParticlesBackground />
      <div className="absolute inset-0 z-0 opacity-10">
        <AnimatedGridPattern />
      </div>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};