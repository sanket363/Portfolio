'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Terminal } from 'lucide-react';

const Hero = () => {
  return (
    <section id="hero" className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-ctp-base py-12">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
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
              
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <p className="text-ctp-green mb-2">$ Check out my DevOps Dashboard</p>
                <Link 
                  href="/devops"
                  className="inline-flex items-center px-6 py-3 bg-ctp-blue text-ctp-base font-medium rounded-lg hover:bg-ctp-sapphire transition-colors duration-200"
                >
                  <Terminal className="w-5 h-5 mr-2" />
                  Explore DevOps Dashboard
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
