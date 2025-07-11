import React from 'react';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Certifications from '../components/Certifications';
import Blog from '../components/Blog';
import Contact from '../components/Contact';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Hero />
      <Skills />
      <Projects />
      <Certifications />
      <Blog />
      <Contact />
    </div>
  );
};

export default HomePage;