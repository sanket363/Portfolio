import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Mail, Github, Linkedin, Phone } from 'lucide-react';

export function Contact() {
  const contactItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    anime({
      targets: contactItemsRef.current,
      opacity: [0, 1],
      translateY: [50, 0],
      easing: 'easeOutQuad',
      duration: 800,
      delay: anime.stagger(100, { start: 500 }),
    });
  }, []);
  return (
    <section className="py-20 bg-slate-900 text-white" id="contact">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-display font-bold mb-12 text-center">Get in Touch</h2>
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Using a wrapper div for the anime.js target */}
            <div ref={el => contactItemsRef.current[0] = el}>
            <ContactItem 
              icon={<Mail />} 
              title="Email" 
              content="sanketbhalke1234@gmail.com"
              href="mailto:sanketbhalke1234@gmail.com"
            />
            </div>
            <div ref={el => contactItemsRef.current[1] = el}>
            <ContactItem 
              icon={<Linkedin />} 
              title="LinkedIn" 
              content="Sanket Bhalke"
              href="https://www.linkedin.com/in/sanket-bhalke-devops/" 
            />
            </div>
            <div ref={el => contactItemsRef.current[2] = el}>
            <ContactItem 
              icon={<Github />} 
              title="GitHub" 
              content="sanket363"
              href="https://github.com/sanket363"
            />
            </div>
            <div ref={el => contactItemsRef.current[3] = el}>
            <ContactItem
              icon={<Phone />} 
              title="Phone"
              content="+91 8177957598"
              href="tel:+918177957598"
            />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ 
  icon, 
  title, 
  content, 
  href 
}: { 
  icon: React.ReactNode; 
  title: string; 
  content: string;
  href: string;
}) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center text-center group hover:transform hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={(e) => {
        anime({
          targets: e.currentTarget,
          scale: 1.05,
          easing: 'easeOutQuad',
          duration: 300,
        });
      }}
      onMouseLeave={(e) => {
        anime({
          targets: e.currentTarget,
          scale: 1,
          easing: 'easeOutQuad',
          duration: 300,
        });
      }}
    >
      <div className="bg-slate-800 p-4 rounded-full mb-4 group-hover:bg-blue-600 transition-colors duration-300">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      </div>
      <h3 className="text-lg font-semibold mb-2 font-display">{title}</h3>
      <p className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300">{content}</p>
    </a>
  );
}