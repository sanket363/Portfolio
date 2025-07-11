import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animation: anime.AnimeInstance | null = null;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (x: number, y: number) => {
      return {
        x,
        y,
        radius: anime.random(0.5, 2),
        color: `hsl(${anime.random(200, 240)}, 70%, 70%)`,
        endPos: { x: anime.random(0, canvas.width), y: anime.random(0, canvas.height) },
      };
    };

    const animateParticles = () => {
      const particles: ReturnType<typeof createParticle>[] = [];
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle(anime.random(0, canvas.width), anime.random(0, canvas.height)));
      }

      animation = anime({
        targets: particles,
        x: (p) => p.endPos.x,
        y: (p) => p.endPos.y,
        radius: anime.random(0.5, 2),
        duration: anime.random(10000, 20000),
        easing: 'linear',
        loop: true,
        update: () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
            ctx.fillStyle = p.color;
            ctx.fill();
          });
        },
      });
    };

    resizeCanvas();
    animateParticles();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animation) {
        animation.pause();
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-mono">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30"></canvas>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}