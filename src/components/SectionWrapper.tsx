'use client';

import { motion } from 'framer-motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  title: string;
  className?: string;
}

const SectionWrapper = ({ children, id, title, className = '' }: SectionWrapperProps) => {
  return (
    <section id={id} className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-ctp-mauve">
            [ {title} ]
          </h2>
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default SectionWrapper;
