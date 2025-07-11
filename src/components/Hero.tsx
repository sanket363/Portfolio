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
          translateY: [40, 0],
          rotateX: [90, 0],
          easing: "easeOutQuint",
          duration: 1200,
          delay: (el, i) => 50 * i,
        })
        .add({
          targets: '.blinking-cursor',
          opacity: [0, 1],
          easing: "easeInOutQuad",
          duration: 500,
          loop: true,
        }, '-=750')
        .add({
          targets: '.hero-subtitle',
          opacity: [0, 1],
          translateY: [40, 0],
          scale: [0.9, 1],
          easing: "easeOutBack",
          duration: 1000,
        }, '-=500')
        .add({
          targets: '.hero-cta-buttons',
          opacity: [0, 1],
          translateY: [40, 0],
          easing: "easeOutBack",
          duration: 800,
          delay: anime.stagger(200),
        }, '-=300');

      // Floating animation for the whole hero section
      anime({
        targets: '#hero',
        translateY: [10, -10],
        easing: 'easeInOutSine',
        duration: 8000,
        direction: 'alternate',
        loop: true
      });
    }
  }, []);

  return (
    <section id="hero" className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-gray-100 p-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="glass-container backdrop-blur-lg bg-white/5 dark:bg-black/10 p-12 rounded-3xl shadow-2xl border border-white/10">
        <h1 className="hero-title text-5xl md:text-7xl font-extrabold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Hi, I'm a DevOps Engineer<span className="blinking-cursor">|</span>
        </h1>
        <p className="hero-subtitle text-xl md:text-2xl mb-8 max-w-2xl text-gray-300">
          Building and automating scalable, secure, and resilient cloud infrastructure.
        </p>
        <div className="hero-cta-buttons flex space-x-4">
          <a
            href="#projects"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 bg-white/10 text-white rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-white/20"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;