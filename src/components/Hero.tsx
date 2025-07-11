import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const Hero: React.FC = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text = "Sanket's DevOps Portfolio";
    let currentText = '';
    let i = 0;

    const typeText = () => {
      if (i < text.length) {
        currentText += text.charAt(i);
        if (textRef.current) {
          textRef.current.textContent = currentText;
        }
        i++;
        setTimeout(typeText, 100); // Typing speed
      } else {
        if (cursorRef.current) {
          cursorRef.current.style.display = 'none';
        }
        // Animate tagline and CTA after typing
        anime({
          targets: taglineRef.current,
          opacity: [0, 1],
          translateY: [20, 0],
          easing: 'easeOutQuad',
          duration: 800,
          delay: 300,
        });
        anime({
          targets: ctaRef.current,
          opacity: [0, 1],
          translateY: [20, 0],
          easing: 'easeOutQuad',
          duration: 800,
          delay: 500,
        });
      }
    };

    // Initial animation for cursor
    anime({
      targets: cursorRef.current,
      opacity: [0, 1],
      easing: 'easeInOutQuad',
      duration: 500,
      loop: true,
      direction: 'alternate',
    });

    typeText();
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      <div className="relative z-10 p-4">
        <h1 ref={textRef} className="text-5xl md:text-7xl font-bold mb-4 text-blue-400">
          {/* Text will be typed here by JS */}
        </h1>
        <span ref={cursorRef} className="text-5xl md:text-7xl font-bold text-blue-400 animate-blink">|</span>
        <p ref={taglineRef} className="text-xl md:text-2xl mb-8 opacity-0">
          Building secure, scalable, and automated cloud infrastructures.
        </p>
        <div ref={ctaRef} className="flex space-x-4 justify-center opacity-0">
          <a
            href="/projects"
            className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-300 shadow-lg"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;