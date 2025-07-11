import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const AnimatedHero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Animate title with word-by-word reveal
    anime({
      targets: titleRef.current?.querySelectorAll('span'),
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeOutExpo'
    });

    // Terminal-like typing effect for subtitle
    anime({
      targets: subtitleRef.current,
      opacity: [0, 1],
      duration: 2000,
      easing: 'easeInOutQuad'
    });

    // Blinking cursor animation
    anime({
      targets: cursorRef.current,
      opacity: [0, 1],
      duration: 800,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  }, []);

  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#0f0f1b] to-[#1a1a2e]">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse"
              }
            }
          },
          particles: {
            color: {
              value: ["#7f5af0", "#00ffd5", "#ff6bcb"]
            },
            links: {
              color: "#b8b8d1",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1
            },
            move: {
              direction: "none",
              enable: true,
              outModes: "bounce",
              random: false,
              speed: 2,
              straight: false
            },
            number: {
              density: {
                enable: true
              },
              value: 80
            },
            opacity: {
              value: 0.5
            },
            shape: {
              type: "circle"
            },
            size: {
              value: { min: 1, max: 3 }
            }
          },
          detectRetina: true
        }}
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 ref={titleRef} className="text-6xl md:text-8xl font-bold mb-8 text-white">
          {['Hi,', 'I\'m', 'Sanket'].map((word, i) => (
            <span key={i} className="inline-block mr-3 opacity-0">{word}</span>
          ))}
        </h1>
        
        <div className="relative">
          <p ref={subtitleRef} className="text-2xl md:text-4xl font-mono text-[#00ffd5] opacity-0">
            I automate the cloud <span className="text-white">☁️</span>
            <span ref={cursorRef} className="ml-1 inline-block w-2 h-8 bg-[#00ffd5] opacity-0"></span>
          </p>
        </div>
        
        <div className="mt-12 flex gap-4">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#7f5af0] to-[#00ffd5] text-white font-bold hover:shadow-lg hover:shadow-[#7f5af0]/50 transition-all duration-300 transform hover:scale-105">
            View My Work
          </button>
          <button className="px-8 py-3 rounded-full border-2 border-[#00ffd5] text-[#00ffd5] font-bold hover:bg-[#00ffd5]/10 transition-all duration-300 transform hover:scale-105">
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero;