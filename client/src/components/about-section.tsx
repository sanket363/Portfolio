import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface CounterProps {
  target: number;
  suffix?: string;
  delay?: number;
}

function Counter({ target, suffix = "", delay = 0 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        const stepDuration = duration / steps;

        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, stepDuration);

        return () => clearInterval(timer);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [inView, target, delay]);

  return (
    <div ref={ref} className="text-3xl font-bold mb-2">
      {count}{suffix}
    </div>
  );
}

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 bg-[hsl(var(--surface-bg))]/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl font-bold mb-8 gradient-text"
          >
            About Me
          </motion.h2>
          
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 100 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="glassmorphism p-8 rounded-2xl mb-12"
          >
            <p className="text-lg text-[hsl(var(--text-secondary))] leading-relaxed mb-6">
              I'm a passionate DevOps Engineer with 4 years of experience in cloud infrastructure, automation, and continuous integration. I specialize in AWS services, containerization, and monitoring solutions that drive business efficiency and scalability.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat-card text-center">
                <div className="text-[hsl(var(--accent-blue))] mb-2">
                  <Counter target={2} suffix="+" />
                </div>
                <p className="text-[hsl(var(--text-secondary))]">Years Experience</p>
              </div>
              
              <div className="stat-card text-center">
                <div className="text-[hsl(var(--accent-green))] mb-2">
                  <Counter target={10} suffix="+" delay={300} />
                </div>
                <p className="text-[hsl(var(--text-secondary))]">Projects Completed</p>
              </div>
              
              <div className="stat-card text-center">
                <div className="text-[hsl(var(--accent-pink))] mb-2">
                  <Counter target={40} suffix="%" delay={600} />
                </div>
                <p className="text-[hsl(var(--text-secondary))]">Reduced Downtime</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
