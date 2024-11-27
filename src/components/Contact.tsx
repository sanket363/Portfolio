import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

export function Contact() {
  return (
    <section className="py-20 bg-slate-900 text-white" id="contact">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-display font-bold mb-12 text-center">Get in Touch</h2>
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ContactItem 
              icon={<Mail />} 
              title="Email" 
              content="sanketbhalke1234@gmail.com"
              href="mailto:sanketbhalke1234@gmail.com"
            />
            <ContactItem 
              icon={<Linkedin />} 
              title="LinkedIn" 
              content="Connect with me"
              href="https://www.linkedin.com/in/sanket-bhalke-devops/"
            />
            <ContactItem 
              icon={<Github />} 
              title="GitHub" 
              content="View my projects"
              href="https://github.com/sanket363"
            />
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
    >
      <div className="bg-slate-800 p-4 rounded-full mb-4 group-hover:bg-blue-600 transition-colors duration-300">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      </div>
      <h3 className="text-lg font-semibold mb-2 font-display">{title}</h3>
      <p className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300">{content}</p>
    </a>
  );
}