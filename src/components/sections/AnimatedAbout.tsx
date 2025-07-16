'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { Code, Cloud, Shield, GitBranch, Server, HardHat, ChevronDown, Award, Target, Zap } from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface SkillData {
  icon: React.ComponentType<any>;
  name: string;
  level: number;
  color: string;
  description: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  achievement: string;
}

const AnimatedAbout: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [skillsExpanded, setSkillsExpanded] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLElement>(null);
  const profileImageRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  // Mouse position for magnetic effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Skills data with enhanced information
  const skills: SkillData[] = [
    { icon: Cloud, name: 'Cloud Platforms', level: 95, color: 'from-blue-400 to-blue-600', description: 'AWS, Azure, GCP expertise' },
    { icon: Code, name: 'CI/CD & Automation', level: 90, color: 'from-green-400 to-green-600', description: 'Jenkins, GitLab, GitHub Actions' },
    { icon: Server, name: 'Containerization', level: 88, color: 'from-red-400 to-red-600', description: 'Docker, Kubernetes, Helm' },
    { icon: Shield, name: 'Security & Compliance', level: 85, color: 'from-purple-400 to-purple-600', description: 'DevSecOps, SAST, DAST' },
    { icon: GitBranch, name: 'Infrastructure as Code', level: 92, color: 'from-orange-400 to-orange-600', description: 'Terraform, Ansible, Pulumi' },
    { icon: HardHat, name: 'Monitoring & Logging', level: 87, color: 'from-yellow-400 to-yellow-600', description: 'Prometheus, Grafana, ELK' },
  ];

  // Timeline data
  const timeline: TimelineItem[] = [
    {
      year: '2024',
      title: 'Senior DevOps Engineer',
      description: 'Leading cloud transformation initiatives',
      achievement: 'Reduced deployment time by 75%'
    },
    {
      year: '2022',
      title: 'DevOps Engineer',
      description: 'Implemented comprehensive CI/CD pipelines',
      achievement: 'Achieved 99.9% uptime'
    },
    {
      year: '2020',
      title: 'Cloud Engineer',
      description: 'Migrated legacy systems to cloud',
      achievement: 'Saved 40% in infrastructure costs'
    },
    {
      year: '2018',
      title: 'System Administrator',
      description: 'Managed on-premise infrastructure',
      achievement: 'Automated 80% of manual processes'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 50,
      scale: prefersReducedMotion ? 1 : 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.6,
        ease: "easeOut"
      }
    }
  };

  const skillVariants = {
    hidden: { 
      opacity: 0, 
      x: prefersReducedMotion ? 0 : -30,
      rotateY: prefersReducedMotion ? 0 : -15
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.5,
        delay: prefersReducedMotion ? 0 : i * 0.1,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: prefersReducedMotion ? 1 : 1.05,
      rotateY: prefersReducedMotion ? 0 : 5,
      z: prefersReducedMotion ? 0 : 50,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (level: number) => ({
      width: `${level}%`,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 1.5,
        delay: prefersReducedMotion ? 0 : 0.5,
        ease: "easeOut"
      }
    })
  };

  // Initialize animations and effects
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearTimeout(timer);
    };
  }, []);

  // GSAP animations for complex effects
  useEffect(() => {
    if (!prefersReducedMotion && !isLoading) {
      const ctx = gsap.context(() => {
        // Floating animation for profile image
        if (profileImageRef.current) {
          gsap.to(profileImageRef.current, {
            y: -10,
            duration: 2,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
          });
        }

        // Parallax effect for skills section
        if (skillsRef.current) {
          gsap.to(skillsRef.current, {
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            },
            y: -50,
            ease: "none"
          });
        }

        // Timeline reveal animation
        if (timelineRef.current) {
          const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
          gsap.fromTo(timelineItems, 
            { 
              opacity: 0, 
              x: -100,
              scale: 0.8
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.2,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: timelineRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }

        // Stats counter animation
        if (statsRef.current) {
          const counters = statsRef.current.querySelectorAll('.counter');
          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target') || '0');
            gsap.fromTo(counter, 
              { textContent: 0 },
              {
                textContent: target,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 1 },
                scrollTrigger: {
                  trigger: counter,
                  start: "top 80%",
                  toggleActions: "play none none reverse"
                }
              }
            );
          });
        }
      });

      return () => ctx.revert();
    }
  }, [prefersReducedMotion, isLoading]);

  // Mouse move handler for magnetic effects
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!prefersReducedMotion) {
      const { clientX, clientY } = event;
      const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
      const x = (clientX - left - width / 2) * 0.1;
      const y = (clientY - top - height / 2) * 0.1;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  // Touch handlers for mobile gestures
  const handleTouchStart = (event: React.TouchEvent) => {
    // Handle touch start for gesture recognition
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    // Handle touch end for gesture recognition
  };

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setSkillsExpanded(!skillsExpanded);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-8 w-1/3 mx-auto"></div>
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        <div className="md:w-1/2">
          <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
        <div className="md:w-1/2 space-y-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto">
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  return (
    <motion.section
      ref={containerRef}
      id="about"
      className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900 text-gray-900 dark:text-gray-100 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container mx-auto relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-10 right-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20"
            animate={{
              scale: prefersReducedMotion ? 1 : [1, 1.2, 1],
              rotate: prefersReducedMotion ? 0 : [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20"
            animate={{
              scale: prefersReducedMotion ? 1 : [1.2, 1, 1.2],
              rotate: prefersReducedMotion ? 0 : [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Main Title */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
            style={{ x: springX, y: springY }}
          >
            About Me
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: prefersReducedMotion ? 96 : 96 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start lg:space-x-12 space-y-12 lg:space-y-0">
          {/* Profile Section */}
          <motion.div variants={itemVariants} className="lg:w-1/2">
            <motion.div
              ref={profileImageRef}
              className="relative group cursor-pointer"
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <img
                src="https://via.placeholder.com/500x600"
                alt="Profile"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover border-4 border-white dark:border-gray-700"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8"
              >
                <span className="text-white font-semibold text-lg">DevOps Engineer</span>
              </motion.div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              ref={statsRef}
              variants={itemVariants}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                <div className="counter text-2xl font-bold text-blue-600" data-target="50">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                <div className="counter text-2xl font-bold text-green-600" data-target="5">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years Exp</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                <div className="counter text-2xl font-bold text-purple-600" data-target="99">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">% Uptime</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div variants={itemVariants} className="lg:w-1/2 space-y-8">
            {/* Introduction Text */}
            <div className="space-y-6 text-lg leading-relaxed">
              <motion.p
                variants={itemVariants}
                className="text-gray-700 dark:text-gray-300"
              >
                Hello! I'm a passionate <motion.span
                  className="font-semibold text-blue-600 dark:text-blue-400"
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                >DevOps Engineer</motion.span> with a strong background in building and automating scalable, secure, and resilient cloud infrastructure.
              </motion.p>
              
              <motion.p
                variants={itemVariants}
                className="text-gray-700 dark:text-gray-300"
              >
                I thrive on optimizing workflows, implementing <motion.span
                  className="font-semibold text-purple-600 dark:text-purple-400"
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                >Infrastructure as Code (IaC)</motion.span>, and enhancing system reliability through robust monitoring solutions.
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-gray-700 dark:text-gray-300"
              >
                My goal is to create efficient, secure, and cost-effective solutions that empower development teams to deliver high-quality software rapidly.
              </motion.p>
            </div>

            {/* Skills Section */}
            <motion.div variants={itemVariants}>
              <motion.div
                className="flex items-center justify-between cursor-pointer mb-6"
                onClick={() => setSkillsExpanded(!skillsExpanded)}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-expanded={skillsExpanded}
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
              >
                <h3 className="text-2xl font-semibold flex items-center">
                  <Zap className="mr-2 text-yellow-500" size={28} />
                  My Expertise
                </h3>
                <motion.div
                  animate={{ rotate: skillsExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={24} />
                </motion.div>
              </motion.div>

              <motion.div
                ref={skillsRef}
                className="space-y-4"
                initial={false}
                animate={{ height: skillsExpanded ? "auto" : 0, opacity: skillsExpanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    custom={index}
                    variants={skillVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="group p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className={`p-2 rounded-lg bg-gradient-to-r ${skill.color}`}
                          whileHover={{ rotate: prefersReducedMotion ? 0 : 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <skill.icon className="text-white" size={20} />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{skill.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{skill.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{skill.level}%</span>
                    </div>
                    
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        custom={skill.level}
                        variants={progressVariants}
                        initial="hidden"
                        animate="visible"
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/30 rounded-full"
                          animate={{
                            x: prefersReducedMotion ? 0 : [-100, 100, -100],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Timeline Section */}
        <motion.div
          ref={timelineRef}
          variants={itemVariants}
          className="mt-20"
        >
          <motion.h3 
            className="text-3xl font-bold text-center mb-12 flex items-center justify-center"
            variants={itemVariants}
          >
            <Target className="mr-3 text-blue-500" size={32} />
            Professional Journey
          </motion.h3>

          <div className="relative">
            {/* Timeline Line */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 2, delay: 0.5 }}
            />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  className={`timeline-item flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <motion.div
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                      whileHover={{
                        boxShadow: prefersReducedMotion ? undefined : "0 20px 40px rgba(0,0,0,0.1)",
                        y: prefersReducedMotion ? 0 : -5
                      }}
                    >
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">{item.year}</div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <Award size={16} className="mr-2" />
                        <span className="text-sm font-medium">{item.achievement}</span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="w-2/12 flex justify-center">
                    <motion.div
                      className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.5 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>

                  <div className="w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <motion.div
            className="inline-block p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white"
            whileHover={{
              scale: prefersReducedMotion ? 1 : 1.05,
              boxShadow: prefersReducedMotion ? undefined : "0 20px 40px rgba(0,0,0,0.2)"
            }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-2xl font-bold mb-4">Ready to Build Something Amazing?</h4>
            <p className="text-lg opacity-90 mb-6">Let's discuss how we can optimize your infrastructure and accelerate your development workflow.</p>
            <motion.button
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            >
              Get In Touch
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AnimatedAbout;