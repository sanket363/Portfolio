import { motion } from "framer-motion";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import { useTypewriter } from "@/hooks/use-typewriter";

export function HeroSection() {
  const name = useTypewriter("Sanket Bhalke", 80);
  const subtitle = useTypewriter("DevOps Engineer & Cloud Architect", 60, 1500);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle absolute w-2 h-2 bg-[hsl(var(--accent-blue))] rounded-full animate-float" style={{top: '20%', left: '10%', animationDelay: '-0.5s'}} />
        <div className="particle absolute w-3 h-3 bg-[hsl(var(--accent-pink))] rounded-full animate-float" style={{top: '60%', left: '80%', animationDelay: '-1.5s'}} />
        <div className="particle absolute w-1 h-1 bg-[hsl(var(--accent-green))] rounded-full animate-float" style={{top: '40%', left: '70%', animationDelay: '-0.8s'}} />
        <div className="particle absolute w-2 h-2 bg-[hsl(var(--accent-purple))] rounded-full animate-float" style={{top: '80%', left: '20%', animationDelay: '-2s'}} />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="hero-content"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text">
            <span className="typing-cursor">{name}</span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            className="text-xl md:text-2xl text-[hsl(var(--text-secondary))] mb-8"
          >
            {subtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="bg-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/80 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 animate-glow"
            >
              View My Work
            </button>
            <button className="border-2 border-[hsl(var(--accent-pink))] text-[hsl(var(--accent-pink))] hover:bg-[hsl(var(--accent-pink))] hover:text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
              Download CV
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5, ease: "easeOut" }}
            className="flex justify-center space-x-6"
          >
            <a href="https://linkedin.com/in/sanket-bhalke" target="_blank" rel="noopener noreferrer" className="text-3xl text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-pink))] transition-all duration-300 transform hover:scale-110">
              <Linkedin />
            </a>
            <a href="https://github.com/sanketbhalke" target="_blank" rel="noopener noreferrer" className="text-3xl text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-pink))] transition-all duration-300 transform hover:scale-110">
              <Github />
            </a>
            <a href="mailto:sanketbhalke1234@gmail.com" className="text-3xl text-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-pink))] transition-all duration-300 transform hover:scale-110">
              <Mail />
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => scrollToSection('about')}
      >
        <div className="w-6 h-10 border-2 border-[hsl(var(--accent-blue))] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[hsl(var(--accent-blue))] rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
}
