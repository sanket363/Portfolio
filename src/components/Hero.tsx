import React from 'react';
import { Terminal, Cloud, GitBranch, Database, Mail, Github, Linkedin, Phone } from 'lucide-react';

export function Hero() {
  return (
    <section className="hero-gradient text-white min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in text-center md:text-left">
            <h1 className="font-display text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Sanket Bhalke
            </h1>
            <h2 className="text-3xl font-display font-semibold mb-6 text-blue-400">
              Cloud DevOps Engineer
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">
              Experienced Cloud DevOps Engineer managing multi-cloud architectures (AWS, Azure, GCP), 
              implementing CI/CD, and building scalable, secure, and observable systems.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start">
              <SocialButton 
                href="mailto:sanketbhalke1234@gmail.com"
                icon={<Mail />}
                text="Email"
              />
              <SocialButton 
                href="https://www.linkedin.com/in/sanket-bhalke-devops/"
                icon={<Linkedin />}
                text="LinkedIn"
              />
              <SocialButton 
                href="https://github.com/sanket363"
                icon={<Github />}
                text="GitHub"
              />
              <SocialButton 
                href="tel:+918177957598"
                icon={<Phone />}
                text="Phone"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <IconBox icon={<Terminal />} text="Infrastructure as Code" delay="0" />
            <IconBox icon={<Cloud />} text="Cloud Architecture" delay="100" />
            <IconBox icon={<GitBranch />} text="CI/CD" delay="200" />
            <IconBox icon={<Database />} text="Container Orchestration" delay="300" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialButton({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 
                 rounded-lg transition-all duration-300 backdrop-blur-sm group"
    >
      {React.cloneElement(icon as React.ReactElement, { 
        className: 'w-5 h-5 group-hover:scale-110 transition-transform duration-300' 
      })}
      <span className="font-medium">{text}</span>
    </a>
  );
}

function IconBox({ icon, text, delay }: { icon: React.ReactNode; text: string; delay: string }) {
  return (
    <div 
      className="group p-6 bg-slate-800/50 rounded-xl backdrop-blur-sm hover:bg-slate-700/50 
                 transition-all duration-300 card-hover"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-4 rounded-lg mb-4 
                      group-hover:scale-110 transition-transform duration-300">
          {React.cloneElement(icon as React.ReactElement, { className: 'w-8 h-8' })}
        </div>
        <span className="text-sm font-medium text-center">{text}</span>
      </div>
    </div>
  );
}