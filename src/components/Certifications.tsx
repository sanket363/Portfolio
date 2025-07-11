import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const certificationsData = [
  { 
    name: 'AWS Certified Solutions Architect - Associate', 
    issuer: 'Amazon Web Services',
    year: '2023',
    logo: 'AWS',
    color: '#FF9900',
    image: 'https://via.placeholder.com/150/FF9900/FFFFFF?text=AWS+SAA',
    link: '#'
  },
  { 
    name: 'Certified Kubernetes Administrator (CKA)', 
    issuer: 'Cloud Native Computing Foundation',
    year: '2022',
    logo: 'K8s',
    color: '#326CE5',
    image: 'https://via.placeholder.com/150/326CE5/FFFFFF?text=CKA',
    link: '#'
  },
  { 
    name: 'Microsoft Certified: Azure Administrator Associate', 
    issuer: 'Microsoft',
    year: '2021',
    logo: 'Azure',
    color: '#0089D6',
    image: 'https://via.placeholder.com/150/0078D4/FFFFFF?text=Azure+Admin',
    link: '#'
  },
];

const Certifications: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial setup for floating animation
    const elements = containerRef.current.querySelectorAll('.cert-card');
    
    anime.set(elements, {
      translateY: () => anime.random(-20, 20),
      rotate: () => anime.random(-5, 5),
      opacity: 0,
      scale: 0.9
    });

    // Entry animation
    anime({
      targets: elements,
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 1000,
      delay: anime.stagger(200, { grid: [3, 1], from: 'center' }),
      easing: 'spring(1, 80, 10, 0)'
    });

    // Continuous floating animation
    elements.forEach((el, index) => {
      anime({
        targets: el,
        translateY: () => anime.random(-15, 15),
        rotate: () => anime.random(-3, 3),
        duration: 8000,
        delay: index * 200,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });
    });

    // Hover effects
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        anime({
          targets: el,
          scale: 1.05,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          duration: 300,
          easing: 'easeOutElastic'
        });
      });
      
      el.addEventListener('mouseleave', () => {
        anime({
          targets: el,
          scale: 1,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          duration: 300,
          easing: 'easeOutElastic'
        });
      });
    });
  }, []);

  return (
    <section id="certifications" className="py-20 px-4 bg-gradient-to-b from-[#0f0f1b] to-[#1a1a2e]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7f5af0] to-[#00ffd5]">
            Certifications
          </span>
        </h2>
        
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {certificationsData.map((cert, index) => (
            <div 
              key={index}
              className="cert-card p-6 rounded-2xl bg-[#ffffff05] border border-[#ffffff10] backdrop-blur-sm transform transition-all duration-300"
              style={{
                borderLeft: `4px solid ${cert.color}`,
                boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
              }}
            >
              <div className="flex items-center mb-4">
                <img src={cert.image} alt={cert.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-white">{cert.name}</h3>
                  <p className="text-sm text-gray-300">{cert.issuer}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">{cert.year}</span>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full text-white font-medium"
                    style={{ backgroundColor: cert.color }}
                  >
                    View Credential
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;