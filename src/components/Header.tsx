import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { Link, useLocation } from 'react-router-dom';
import { Github, Linkedin, Terminal, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initial header animation
    anime({
      targets: headerRef.current,
      translateY: [-100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: 800,
      delay: 200,
    });

    // Logo animation
    anime({
      targets: logoRef.current,
      translateX: [-50, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: 800,
      delay: 400,
    });

    // Nav links animation
    anime({
      targets: navLinksRef.current?.children,
      opacity: [0, 1],
      translateY: [-20, 0],
      easing: 'easeOutQuad',
      duration: 800,
      delay: anime.stagger(100, { start: 600 }),
    });

    // Social links animation
    anime({
      targets: socialLinksRef.current?.children,
      opacity: [0, 1],
      translateY: [-20, 0],
      easing: 'easeOutQuad',
      duration: 800,
      delay: anime.stagger(100, { start: 800 }),
    });
  }, []);

  return (
    <header 
      ref={headerRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <nav ref={logoRef} className="flex items-center space-x-2">
            <Terminal className="w-6 h-6 text-blue-400" />
            <Link to="/" className="text-xl font-bold text-white">DevOps Engineer</Link>
          </nav>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div ref={navLinksRef} className="space-x-6">
              <Link 
                to="/" 
                className={`nav-link text-white hover:text-blue-400 transition-colors ${
                  location.pathname === '/' ? 'text-blue-400' : ''
                }`}
              >
                Home
              </Link>
              // Fix 1: Correct template literal syntax
              <Link 
                to="/projects"
                className={`nav-link text-white hover:text-blue-400 transition-colors $
                  location.pathname === '/projects' ? 'text-blue-400' : ''
                }`} // Removed extra $
                >
              
              // Fix 2: Proper tag nesting
              <header>
                <div className="container">
                  <div className="flex justify-between">
                    {/* Logo nav */}
                    <nav>...</nav>
              
                    {/* Desktop nav */}
                    <nav>...</nav>
              
                    {/* Mobile button */}
                    <button>...</button>
                  </div>
              
                  {/* Mobile menu */}
                  {isMobileMenuOpen && (
                    <nav>...</nav>
                  )}
                </div>
              </header>
            </div>
            <div ref={socialLinksRef} className="flex space-x-4">
              <ThemeToggle />
              <SocialLink href="https://github.com/sanket363" icon={<Github />} />
              <SocialLink href="https://linkedin.com" icon={<Linkedin />} />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-slate-800 rounded-lg mt-2 p-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-white hover:text-blue-400 transition-colors ${
                  location.pathname === '/' ? 'text-blue-400' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/projects" 
                className={`text-white hover:text-blue-400 transition-colors ${
                  location.pathname === '/projects' ? 'text-blue-400' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <div className="flex space-x-4 pt-4 border-t border-slate-700">
                <SocialLink href="https://github.com/sanket363" icon={<Github />} />
                <SocialLink href="https://linkedin.com" icon={<Linkedin />} />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleHover = () => {
    anime({
      targets: linkRef.current,
      scale: [1, 1.1],
      easing: 'easeOutQuad',
      duration: 300,
    });
  };

  const handleLeave = () => {
    anime({
      targets: linkRef.current,
      scale: [1.1, 1],
      easing: 'easeOutQuad',
      duration: 300,
    });
  };
  return (
    <a 
      ref={linkRef}
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-white hover:text-blue-400 transition-colors p-2 hover:bg-slate-800 rounded-lg"
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    </a>
  );
}