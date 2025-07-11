import React, { useEffect } from 'react';
import anime from 'animejs';

const Hero: React.FC = () => {
  useEffect(() => {
    // Split text into words for animation
    const textWrapper = document.querySelector('.hero-title');
    if (textWrapper) {
      textWrapper.innerHTML = textWrapper.textContent!.replace(/\S/g, "<span class='word'>$&</span>");

      anime.timeline({ loop: false })
        .add({
          targets: '.hero-title .word',
          opacity: [0, 1],
          easing: "easeInOutQuad",
          duration: 1000,
          delay: (el, i) => 50 * i,
        })
        .add({
          targets: '.blinking-cursor',
          opacity: [0, 1],
          easing: "easeInOutQuad",
          duration: 500,
          loop: true,
        }, '-=750') // Start blinking cursor before title animation ends
        .add({
          targets: '.hero-subtitle',
          opacity: [0, 1],
          translateY: [20, 0],
          easing: "easeOutQuad",
          duration: 800,
        }, '-=500') // Start after title, with overlap
        .add({
          targets: '.hero-cta-buttons',
          opacity: [0, 1],
          translateY: [20, 0],
          easing: "easeOutQuad",
          duration: 800,
        }, '-=300'); // Start after subtitle, with overlap
    }
  }, []);

  return (
    <section id="hero" className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-gray-900 dark:text-gray-100 p-4">
      <h1 className="hero-title text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
        Hi, I'm a DevOps Engineer<span className="blinking-cursor">|</span>
      </h1>
      <p className="hero-subtitle text-xl md:text-2xl mb-8 max-w-2xl">
        Building and automating scalable, secure, and resilient cloud infrastructure.
      </p>
      <div className="hero-cta-buttons flex space-x-4">
        <a
          href="#projects"
          className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg"
        >
          View My Work
        </a>
        <a
          href="#contact"
          className="px-8 py-3 bg-gray-200 text-gray-800 rounded-full text-lg font-semibold hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 shadow-lg"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
};

export default Hero;