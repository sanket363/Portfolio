import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { GitBranch, Cloud, Server, Shield, Code, HardHat } from 'lucide-react';

const skillsData = [
  { name: 'AWS', icon: <Cloud size={40} className="text-orange-500" />, category: 'cloud' },
  { name: 'Azure', icon: <Cloud size={40} className="text-blue-500" />, category: 'cloud' },
  { name: 'GCP', icon: <Cloud size={40} className="text-green-500" />, category: 'cloud' },
  { name: 'Kubernetes', icon: <Server size={40} className="text-blue-600" />, category: 'orchestration' },
  { name: 'Docker', icon: <Server size={40} className="text-blue-400" />, category: 'containerization' },
  { name: 'Terraform', icon: <GitBranch size={40} className="text-purple-500" />, category: 'iac' },
  { name: 'Ansible', icon: <HardHat size={40} className="text-red-500" />, category: 'automation' },
  { name: 'Python', icon: <Code size={40} className="text-yellow-500" />, category: 'scripting' },
  { name: 'Bash', icon: <Code size={40} className="text-gray-500" />, category: 'scripting' },
  { name: 'CI/CD', icon: <Code size={40} className="text-green-600" />, category: 'ci-cd' },
  { name: 'Monitoring', icon: <Shield size={40} className="text-pink-500" />, category: 'monitoring' },
  { name: 'Security', icon: <Shield size={40} className="text-red-600" />, category: 'security' },
];

const Skills: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial random positioning
    const elements = containerRef.current.querySelectorAll('.skill-item');
    
    anime.set(elements, {
      translateX: () => anime.random(-300, 300),
      translateY: () => anime.random(-200, 200),
      rotate: () => anime.random(-15, 15),
      opacity: 0,
      scale: 0.5
    });

    // Entry animation
    anime({
      targets: elements,
      opacity: [0, 1],
      scale: [0.5, 1],
      duration: 1500,
      delay: anime.stagger(100, { grid: [4, 4], from: 'center' }),
      easing: 'spring(1, 80, 10, 0)'
    });

    // Hover effects
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        anime({
          targets: el,
          scale: 1.2,
          rotate: () => anime.random(-5, 5),
          duration: 300,
          easing: 'easeOutElastic'
        });
      });
      
      el.addEventListener('mouseleave', () => {
        anime({
          targets: el,
          scale: 1,
          rotate: 0,
          duration: 300,
          easing: 'easeOutElastic'
        });
      });
    });

    // Category filter animations
    Object.keys(categoryRefs.current).forEach(category => {
      const button = categoryRefs.current[category];
      if (!button) return;
      
      button.addEventListener('click', () => {
        anime({
          targets: elements,
          opacity: (el: HTMLElement) => el.dataset.category === category || category === 'all' ? 1 : 0.3,
          scale: (el: HTMLElement) => el.dataset.category === category || category === 'all' ? 1 : 0.8,
          duration: 500,
          easing: 'easeOutQuad'
        });
      });
    });
  }, []);

  return (
    <section id="skills" className="py-20 px-4 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1b]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7f5af0] to-[#00ffd5]">
            DevOps Toolbox
          </span>
        </h2>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button 
            ref={el => categoryRefs.current['all'] = el}
            className="px-4 py-2 rounded-full bg-[#7f5af0] text-white font-medium"
          >
            All
          </button>
          {Array.from(new Set(skillsData.map(s => s.category))).map(category => (
            <button
              key={category}
              ref={el => categoryRefs.current[category] = el}
              className="px-4 py-2 rounded-full border border-[#00ffd5] text-[#00ffd5] font-medium hover:bg-[#00ffd5]/10"
            >
              {category.replace('-', ' ')}
            </button>
          ))}
        </div>
        
        <div 
          ref={containerRef}
          className="relative h-[500px] w-full rounded-2xl bg-[#0f0f1b]/50 border border-[#ffffff10] overflow-hidden"
        >
          {skillsData.map((skill, index) => (
            <div 
              key={index}
              className="skill-item absolute flex flex-col items-center justify-center p-6 rounded-xl bg-[#ffffff05] border border-[#ffffff10] backdrop-blur-sm cursor-pointer hover:shadow-lg hover:shadow-[#7f5af0]/20"
              data-category={skill.category}
            >
              {skill.icon}
              <p className="mt-4 text-xl font-semibold text-white">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;