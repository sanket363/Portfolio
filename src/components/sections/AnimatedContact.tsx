import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
import { Mail, Linkedin, Github, Phone, MapPin, Send, Check, X, Copy, ExternalLink } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactMethod {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: string;
  hoverColor: string;
  copyable?: boolean;
}

const AnimatedContact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [hoveredContact, setHoveredContact] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  const contactMethods: ContactMethod[] = [
    {
      id: 'email',
      icon: <Mail size={24} />,
      label: 'Email',
      value: 'your.email@example.com',
      href: 'mailto:your.email@example.com',
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'from-blue-600 to-cyan-600',
      copyable: true
    },
    {
      id: 'linkedin',
      icon: <Linkedin size={24} />,
      label: 'LinkedIn',
      value: 'Connect with me',
      href: 'https://linkedin.com/in/your-profile',
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'from-blue-700 to-blue-800'
    },
    {
      id: 'github',
      icon: <Github size={24} />,
      label: 'GitHub',
      value: 'View my code',
      href: 'https://github.com/your-username',
      color: 'from-gray-700 to-gray-900',
      hoverColor: 'from-gray-800 to-black'
    },
    {
      id: 'phone',
      icon: <Phone size={24} />,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'from-green-600 to-emerald-600',
      copyable: true
    }
  ];

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : undefined;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : undefined;
      case 'subject':
        return value.trim().length < 3 ? 'Subject must be at least 3 characters' : undefined;
      case 'message':
        return value.trim().length < 10 ? 'Message must be at least 10 characters' : undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      if (Math.random() > 0.2) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const contactCardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const formFieldVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: {
      scale: 0.9,
      rotate: -5,
      transition: { duration: 0.1 }
    }
  };

  const submitButtonVariants = {
    idle: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      scale: 1
    },
    loading: {
      background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
      scale: 1.02
    },
    success: {
      background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
      scale: 1.05
    },
    error: {
      background: 'linear-gradient(135deg, #e17055 0%, #d63031 100%)',
      scale: 0.98
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      id="contact"
      className="py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 text-gray-900 dark:text-gray-100 overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Get in Touch
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            I'm always open to new opportunities and collaborations. Let's create something amazing together!
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Methods */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.h3 
              className="text-2xl font-semibold mb-8 text-center lg:text-left"
              variants={itemVariants}
            >
              Let's Connect
            </motion.h3>
            
            <div className="grid gap-4">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  variants={contactCardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onHoverStart={() => setHoveredContact(method.id)}
                  onHoverEnd={() => setHoveredContact(null)}
                  className="group relative"
                  style={{ perspective: '1000px' }}
                >
                  <div className={`
                    relative p-6 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/30
                    bg-gradient-to-r ${method.color} shadow-lg hover:shadow-xl
                    transition-all duration-300 transform-gpu
                    ${hoveredContact === method.id ? 'shadow-2xl' : ''}
                  `}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          variants={iconVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                        >
                          {method.icon}
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-white text-lg">{method.label}</h4>
                          <p className="text-white/80 text-sm">{method.value}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {method.copyable && (
                          <motion.button
                            onClick={() => copyToClipboard(method.value, method.id)}
                            className="p-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Copy ${method.label}`}
                          >
                            <AnimatePresence mode="wait">
                              {copiedField === method.id ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Check size={16} className="text-white" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="copy"
                                  initial={{ scale: 0, rotate: 180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: -180 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Copy size={16} className="text-white" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        )}
                        
                        <motion.a
                          href={method.href}
                          target={method.href.startsWith('http') ? '_blank' : undefined}
                          rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="p-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`Contact via ${method.label}`}
                        >
                          <ExternalLink size={16} className="text-white" />
                        </motion.a>
                      </div>
                    </div>
                    
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${method.hoverColor})`,
                        filter: 'blur(20px)',
                        zIndex: -1
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="text-2xl font-semibold mb-8 text-center lg:text-left"
              variants={itemVariants}
            >
              Send a Message
            </motion.h3>
            
            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6 p-8 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 shadow-xl"
              variants={itemVariants}
            >
              {/* Name Field */}
              <motion.div
                variants={formFieldVariants}
                animate={focusedField === 'name' ? 'focus' : 'blur'}
              >
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name *
                </label>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                    bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    ${errors.name 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                    }
                  `}
                  placeholder="Your full name"
                  required
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-1 flex items-center"
                    >
                      <X size={14} className="mr-1" />
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email Field */}
              <motion.div
                variants={formFieldVariants}
                animate={focusedField === 'email' ? 'focus' : 'blur'}
              >
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                    bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    ${errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                    }
                  `}
                  placeholder="your.email@example.com"
                  required
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-1 flex items-center"
                    >
                      <X size={14} className="mr-1" />
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Subject Field */}
              <motion.div
                variants={formFieldVariants}
                animate={focusedField === 'subject' ? 'focus' : 'blur'}
              >
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <motion.input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                    bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    ${errors.subject 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                    }
                  `}
                  placeholder="What's this about?"
                  required
                />
                <AnimatePresence>
                  {errors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-1 flex items-center"
                    >
                      <X size={14} className="mr-1" />
                      {errors.subject}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Message Field */}
              <motion.div
                variants={formFieldVariants}
                animate={focusedField === 'message' ? 'focus' : 'blur'}
              >
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <motion.textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows={5}
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 resize-none
                    bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    ${errors.message 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                    }
                  `}
                  placeholder="Tell me about your project or idea..."
                  required
                />
                <AnimatePresence>
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-1 flex items-center"
                    >
                      <X size={14} className="mr-1" />
                      {errors.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                variants={submitButtonVariants}
                animate={
                  isSubmitting ? 'loading' : 
                  submitStatus === 'success' ? 'success' :
                  submitStatus === 'error' ? 'error' : 'idle'
                }
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-center space-x-2">
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 180 }}
                        className="flex items-center space-x-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Sending...</span>
                      </motion.div>
                    ) : submitStatus === 'success' ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <Check size={20} />
                        <span>Message Sent!</span>
                      </motion.div>
                    ) : submitStatus === 'error' ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <X size={20} />
                        <span>Failed to Send</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center space-x-2"
                      >
                        <Send size={20} />
                        <span>Send Message</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </motion.form>
          </motion.div>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {submitStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <div className={`
                p-4 rounded-xl shadow-lg backdrop-blur-sm border
                ${submitStatus === 'success' 
                  ? 'bg-green-500/90 border-green-400 text-white' 
                  : 'bg-red-500/90 border-red-400 text-white'
                }
              `}>
                <div className="flex items-center space-x-2">
                  {submitStatus === 'success' ? (
                    <Check size={20} />
                  ) : (
                    <X size={20} />
                  )}
                  <span className="font-medium">
                    {submitStatus === 'success' 
                      ? 'Message sent successfully!' 
                      : 'Failed to send message. Please try again.'
                    }
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default AnimatedContact;