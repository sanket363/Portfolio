import React from 'react';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import Contact from '../components/Contact';

function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <Skills />
      <Projects />
      <Blog />
      <Contact />
    </div>
  );
}

export default HomePage;