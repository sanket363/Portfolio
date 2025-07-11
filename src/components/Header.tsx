import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, Linkedin, Terminal, Menu, X } from 'lucide-react';

export function Header() {
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

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <Terminal className="w-6 h-6 text-blue-400" />
            <Link to="/" className="text-xl font-bold text-white">DevOps Engineer</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="space-x-6">
              <Link 
                to="/" 
                className={`nav-link text-white hover:text-blue-400 transition-colors ${
                  location.pathname === '/' ? 'text-blue-400' : ''
                }`}
              >
                Home
              </Link>
              <Link 
                to="/projects" 
                className={`nav-link text-white hover:text-blue-400 transition-colors ${
                  location.pathname === '/projects' ? 'text-blue-400' : ''
                }`}
              >
                Projects
              </Link>
            </div>
            <div className="flex space-x-4">
              <SocialLink href="https://github.com/sanket363" icon={<Github />} />
              <SocialLink href="https://linkedin.com" icon={<Linkedin />} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 rounded-lg mt-2 p-4">
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
          </div>
        )}
      </div>
    </header>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-white hover:text-blue-400 transition-colors p-2 hover:bg-slate-800 rounded-lg"
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    </a>
  );
}