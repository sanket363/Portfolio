import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
import styled from '@emotion/styled';
import { cyberpunkTheme } from '../styles/theme';

// Styled Components
const ContactContainer = styled(motion.div)`
  padding: 100px 2rem;
  background: ${cyberpunkTheme.colors.background};
  color: ${cyberpunkTheme.colors.textPrimary};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
`;

const ContactGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  width: 100%;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactSection = styled(motion.div)`
  background: ${cyberpunkTheme.glassmorphism.border};
  backdrop-filter: blur(${cyberpunkTheme.glassmorphism.blurLevels.medium});
  border-radius: 1rem;
  padding: 2rem;
  border: ${cyberpunkTheme.glassmorphism.border};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${cyberpunkTheme.gradients.primary};
    transform: scaleX(0);
    transition: transform ${cyberpunkTheme.animations.durations.normal};
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const ContactForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormField = styled(motion.div)`
  position: relative;
`;

const FormInput = styled(motion.input)<{ hasError?: boolean }>`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => props.hasError ? cyberpunkTheme.colors.error : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 0.5rem;
  color: ${cyberpunkTheme.colors.textPrimary};
  font-size: 1rem;
  transition: all ${cyberpunkTheme.animations.durations.normal};

  &:focus {
    outline: none;
    border-color: ${cyberpunkTheme.colors.primary};
    box-shadow: ${cyberpunkTheme.shadows.neon};
  }

  &::placeholder {
    color: ${cyberpunkTheme.colors.textSecondary};
  }
`;

const FormTextarea = styled(motion.textarea)<{ hasError?: boolean }>`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => props.hasError ? cyberpunkTheme.colors.error : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 0.5rem;
  color: ${cyberpunkTheme.colors.textPrimary};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all ${cyberpunkTheme.animations.durations.normal};

  &:focus {
    outline: none;
    border-color: ${cyberpunkTheme.colors.primary};
    box-shadow: ${cyberpunkTheme.shadows.neon};
  }

  &::placeholder {
    color: ${cyberpunkTheme.colors.textSecondary};
  }
`;

const FormLabel = styled(motion.label)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: ${cyberpunkTheme.colors.textSecondary};
  pointer-events: none;
  transition: all ${cyberpunkTheme.animations.durations.fast};
  transform-origin: left;
`;

const ErrorMessage = styled(motion.span)`
  color: ${cyberpunkTheme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
`;

const SubmitButton = styled(motion.button)<{ isLoading?: boolean }>`
  padding: 1rem 2rem;
  background: ${cyberpunkTheme.gradients.primary};
  border: none;
  border-radius: 0.5rem;
  color: ${cyberpunkTheme.colors.background};
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all ${cyberpunkTheme.animations.durations.normal};

  &:hover {
    box-shadow: ${cyberpunkTheme.shadows.hover};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left ${cyberpunkTheme.animations.durations.slow};
  }

  &:hover::before {
    left: 100%;
  }
`;

const ContactMethodsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const ContactMethod = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  color: ${cyberpunkTheme.colors.textPrimary};
  text-decoration: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all ${cyberpunkTheme.animations.durations.normal};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${cyberpunkTheme.shadows.elevation.level3};
    border-color: ${cyberpunkTheme.colors.primary};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${cyberpunkTheme.gradients.primary};
    opacity: 0;
    transition: opacity ${cyberpunkTheme.animations.durations.normal};
  }

  &:hover::before {
    opacity: 0.1;
  }
`;

const ContactIcon = styled(motion.div)`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${cyberpunkTheme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  position: relative;
  z-index: 1;
`;

const ContactInfo = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;

  h3 {
    margin: 0 0 0.5rem 0;
    color: ${cyberpunkTheme.colors.primary};
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    color: ${cyberpunkTheme.colors.textSecondary};
    font-size: 0.9rem;
  }
`;

const AvailabilityCalendar = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
`;

const CalendarDay = styled(motion.div)<{ available?: boolean; selected?: boolean }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  background: ${props => 
    props.selected ? cyberpunkTheme.colors.primary :
    props.available ? 'rgba(0, 255, 245, 0.1)' : 
    'rgba(255, 255, 255, 0.05)'
  };
  color: ${props => 
    props.selected ? cyberpunkTheme.colors.background :
    props.available ? cyberpunkTheme.colors.primary : 
    cyberpunkTheme.colors.textSecondary
  };
  border: 1px solid ${props => 
    props.available ? cyberpunkTheme.colors.primary : 
    'rgba(255, 255, 255, 0.1)'
  };
  transition: all ${cyberpunkTheme.animations.durations.fast};

  &:hover {
    transform: scale(1.1);
    box-shadow: ${cyberpunkTheme.shadows.neon};
  }
`;

const TestimonialsCarousel = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TestimonialCard = styled(motion.div)`
  padding: 2rem;
  text-align: center;

  .quote {
    font-style: italic;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: ${cyberpunkTheme.colors.textPrimary};
  }

  .author {
    color: ${cyberpunkTheme.colors.primary};
    font-weight: bold;
  }

  .role {
    color: ${cyberpunkTheme.colors.textSecondary};
    font-size: 0.9rem;
  }
`;

const CarouselControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const CarouselDot = styled(motion.button)<{ active?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? cyberpunkTheme.colors.primary : 'rgba(255, 255, 255, 0.3)'};
  cursor: pointer;
  transition: all ${cyberpunkTheme.animations.durations.fast};

  &:hover {
    transform: scale(1.2);
  }
`;

const FAQSection = styled(motion.div)`
  width: 100%;
  max-width: 800px;
  margin-top: 3rem;
`;

const FAQItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

const FAQQuestion = styled(motion.button)`
  width: 100%;
  padding: 1.5rem;
  background: none;
  border: none;
  color: ${cyberpunkTheme.colors.textPrimary};
  font-size: 1.1rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all ${cyberpunkTheme.animations.durations.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const FAQAnswer = styled(motion.div)`
  padding: 0 1.5rem 1.5rem;
  color: ${cyberpunkTheme.colors.textSecondary};
  line-height: 1.6;
`;

const SuccessModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const SuccessContent = styled(motion.div)`
  background: ${cyberpunkTheme.colors.surface};
  padding: 3rem;
  border-radius: 1rem;
  text-align: center;
  border: 2px solid ${cyberpunkTheme.colors.success};
  box-shadow: ${cyberpunkTheme.shadows.elevation.level5};
  max-width: 400px;
  width: 90%;
`;

// Animation Variants
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const formVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const contactMethodVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "backOut"
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
};

// Component
export const EnhancedContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Contact methods data
  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      description: 'Send me a message',
      value: 'sanket.bhalke@example.com',
      href: 'mailto:sanket.bhalke@example.com'
    },
    {
      icon: '📱',
      title: 'Phone',
      description: 'Call me directly',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567'
    },
    {
      icon: '💼',
      title: 'LinkedIn',
      description: 'Connect professionally',
      value: 'linkedin.com/in/sanket-bhalke-devops',
      href: 'https://www.linkedin.com/in/sanket-bhalke-devops/'
    },
    {
      icon: '💻',
      title: 'GitHub',
      description: 'Check out my code',
      value: 'github.com/sanket363',
      href: 'https://github.com/sanket363'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "Sanket's DevOps expertise transformed our deployment pipeline. Incredible attention to detail and problem-solving skills.",
      author: "Sarah Johnson",
      role: "CTO, TechCorp"
    },
    {
      quote: "Working with Sanket was a game-changer. His automation solutions saved us countless hours and improved our reliability.",
      author: "Mike Chen",
      role: "Lead Developer, StartupXYZ"
    },
    {
      quote: "Professional, knowledgeable, and always delivers on time. Sanket is the DevOps engineer every team needs.",
      author: "Emily Rodriguez",
      role: "Project Manager, CloudSolutions"
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "What's your typical response time?",
      answer: "I typically respond to emails within 24 hours during business days. For urgent matters, feel free to call or message me on LinkedIn."
    },
    {
      question: "Do you work with remote teams?",
      answer: "Absolutely! I have extensive experience working with distributed teams across different time zones. I'm comfortable with various collaboration tools and communication platforms."
    },
    {
      question: "What DevOps tools do you specialize in?",
      answer: "I specialize in Docker, Kubernetes, Jenkins, GitLab CI/CD, Terraform, AWS, Azure, Ansible, and monitoring tools like Prometheus and Grafana."
    },
    {
      question: "Can you help with cloud migration?",
      answer: "Yes! I have experience migrating applications from on-premises to cloud platforms like AWS and Azure, including containerization and infrastructure as code implementation."
    }
  ];

  // Generate calendar days (simplified)
  const generateCalendarDays = () => {
    const days = [];
    const availableDays = [5, 8, 12, 15, 19, 22, 26, 29]; // Example available days
    
    for (let i = 1; i <= 30; i++) {
      days.push({
        day: i,
        available: availableDays.includes(i)
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <ContactContainer
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      exit={{ opacity: 0 }}
    >
      <motion.h1 
        variants={itemVariants}
        style={{ 
          color: cyberpunkTheme.colors.primary, 
          marginBottom: '1rem',
          fontSize: '3rem',
          textAlign: 'center',
          background: cyberpunkTheme.gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Let's Connect
      </motion.h1>

      <motion.p
        variants={itemVariants}
        style={{
          color: cyberpunkTheme.colors.textSecondary,
          textAlign: 'center',
          fontSize: '1.2rem',
          marginBottom: '2rem'
        }}
      >
        Ready to transform your infrastructure? Let's discuss your project!
      </motion.p>

      <ContactGrid>
        {/* Contact Form */}
        <ContactSection variants={formVariants}>
          <h2 style={{ color: cyberpunkTheme.colors.primary, marginBottom: '1.5rem' }}>
            Send Message
          </h2>
          
          <ContactForm onSubmit={handleSubmit}>
            <FormField>
              <FormInput
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                hasError={!!formErrors.name}
                whileFocus={{ scale: 1.02 }}
              />
              <AnimatePresence>
                {formErrors.name && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {formErrors.name}
                  </ErrorMessage>
                )}
              </AnimatePresence>
            </FormField>

            <FormField>
              <FormInput
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                hasError={!!formErrors.email}
                whileFocus={{ scale: 1.02 }}
              />
              <AnimatePresence>
                {formErrors.email && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {formErrors.email}
                  </ErrorMessage>
                )}
              </AnimatePresence>
            </FormField>

            <FormField>
              <FormInput
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                hasError={!!formErrors.subject}
                whileFocus={{ scale: 1.02 }}
              />
              <AnimatePresence>
                {formErrors.subject && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {formErrors.subject}
                  </ErrorMessage>
                )}
              </AnimatePresence>
            </FormField>

            <FormField>
              <FormTextarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                hasError={!!formErrors.message}
                whileFocus={{ scale: 1.02 }}
              />
              <AnimatePresence>
                {formErrors.message && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {formErrors.message}
                  </ErrorMessage>
                )}
              </AnimatePresence>
            </FormField>

            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ display: 'inline-block' }}
                >
                  ⚡
                </motion.div>
              ) : (
                'Send Message'
              )}
            </SubmitButton>
          </ContactForm>
        </ContactSection>

        {/* Availability Calendar */}
        <ContactSection variants={itemVariants}>
          <h2 style={{ color: cyberpunkTheme.colors.primary, marginBottom: '1.5rem' }}>
            Schedule a Call
          </h2>
          
          <AvailabilityCalendar>
            <p style={{ color: cyberpunkTheme.colors.textSecondary, marginBottom: '1rem' }}>
              Select an available date to schedule a consultation
            </p>
            
            <CalendarGrid>
              {calendarDays.map((day) => (
                <CalendarDay
                  key={day.day}
                  available={day.available}
                  selected={selectedDate === day.day}
                  onClick={() => day.available && setSelectedDate(day.day)}
                  whileHover={day.available ? { scale: 1.1 } : {}}
                  whileTap={day.available ? { scale: 0.95 } : {}}
                >
                  {day.day}
                </CalendarDay>
              ))}
            </CalendarGrid>
            
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '1rem', textAlign: 'center' }}
              >
                <p style={{ color: cyberpunkTheme.colors.primary }}>
                  Selected: Day {selectedDate}
                </p>
                <SubmitButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ marginTop: '1rem' }}
                >
                  Book Consultation
                </SubmitButton>
              </motion.div>
            )}
          </AvailabilityCalendar>
        </ContactSection>
      </ContactGrid>

      {/* Contact Methods */}
      <motion.div variants={itemVariants} style={{ width: '100%', maxWidth: '1200px' }}>
        <h2 style={{ 
          color: cyberpunkTheme.colors.primary, 
          textAlign: 'center', 
          marginBottom: '2rem',
          marginTop: '3rem'
        }}>
          Get In Touch
        </h2>
        
        <ContactMethodsGrid>
          {contactMethods.map((method, index) => (
            <ContactMethod
              key={method.title}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={contactMethodVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ContactIcon
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {method.icon}
              </ContactIcon>
              <ContactInfo>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
                <p style={{ color: cyberpunkTheme.colors.primary, fontSize: '0.8rem' }}>
                  {method.value}
                </p>
              </ContactInfo>
            </ContactMethod>
          ))}
        </ContactMethodsGrid>
      </motion.div>

      {/* Testimonials */}
      <motion.div 
        variants={itemVariants} 
        style={{ width: '100%', maxWidth: '800px', marginTop: '3rem' }}
      >
        <h2 style={{ 
          color: cyberpunkTheme.colors.primary, 
          textAlign: 'center', 
          marginBottom: '2rem'
        }}>
          What Clients Say
        </h2>
        
        <TestimonialsCarousel>
          <AnimatePresence mode="wait">
            <TestimonialCard
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="quote">"{testimonials[currentTestimonial].quote}"</div>
              <div className="author">{testimonials[currentTestimonial].author}</div>
              <div className="role">{testimonials[currentTestimonial].role}</div>
            </TestimonialCard>
          </AnimatePresence>
          
          <CarouselControls>
            {testimonials.map((_, index) => (
              <CarouselDot
                key={index}
                active={index === currentTestimonial}
                onClick={() => setCurrentTestimonial(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </CarouselControls>
        </TestimonialsCarousel>
      </motion.div>

      {/* FAQ Section */}
      <FAQSection variants={itemVariants}>
        <h2 style={{ 
          color: cyberpunkTheme.colors.primary, 
          textAlign: 'center', 
          marginBottom: '2rem'
        }}>
          Frequently Asked Questions
        </h2>
        
        {faqs.map((faq, index) => (
          <FAQItem key={index}>
            <FAQQuestion
              onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              {faq.question}
              <motion.span
                animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </FAQQuestion>
            
            <AnimatePresence>
              {expandedFAQ === index && (
                <FAQAnswer
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </FAQAnswer>
              )}
            </AnimatePresence>
          </FAQItem>
        ))}
      </FAQSection>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccess(false)}
          >
            <SuccessContent
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                style={{ fontSize: '4rem', marginBottom: '1rem' }}
              >
                ✅
              </motion.div>
              <h3 style={{ color: cyberpunkTheme.colors.success, marginBottom: '1rem' }}>
                Message Sent!
              </h3>
              <p style={{ color: cyberpunkTheme.colors.textSecondary, marginBottom: '2rem' }}>
                Thank you for reaching out. I'll get back to you within 24 hours.
              </p>
              <SubmitButton
                onClick={() => setShowSuccess(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </SubmitButton>
            </SuccessContent>
          </SuccessModal>
        )}
      </AnimatePresence>
    </ContactContainer>
  );
};