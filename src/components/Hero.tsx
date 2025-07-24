'use client';

import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="hero" className="flex items-center justify-center h-[calc(100vh-80px)] bg-ctp-base">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="bg-ctp-crust p-6 sm:p-8 rounded-lg shadow-2xl border-2 border-ctp-surface0 w-full max-w-3xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="h-3 w-3 rounded-full bg-ctp-red mr-2"></span>
            <span className="h-3 w-3 rounded-full bg-ctp-yellow mr-2"></span>
            <span className="h-3 w-3 rounded-full bg-ctp-green mr-2"></span>
          </div>
          <div className="text-left font-mono">
            <p className="text-ctp-green">$ whoami</p>
            <p className="text-ctp-text mb-4">sanket-bhalke</p>
            <p className="text-ctp-green">$ cat /bio.txt</p>
            <div className="overflow-hidden border-r-2 border-r-ctp-blue whitespace-nowrap animate-typing my-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ctp-mauve">
                Hi, I'm Sanket Bhalke.
              </h1>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-ctp-sky mt-4">
              A DevOps Engineer passionate about automation and cloud infrastructure.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
