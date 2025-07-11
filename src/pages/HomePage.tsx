import React from 'react';
import { Hero } from '../components/Hero';
import { Skills } from '../components/Skills';
import { Contact } from '../components/Contact';
import { Projects } from '../components/Projects';

export function HomePage() {
  return (
    <>
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}