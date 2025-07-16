import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Message Sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-20 bg-[hsl(var(--surface-bg))]/50">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          Get In Touch
        </motion.h2>
        
        <div ref={ref} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-bold mb-8 text-[hsl(var(--accent-blue))]">
                Let's Connect
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[hsl(var(--accent-blue))]/20 rounded-full flex items-center justify-center">
                    <Mail className="text-[hsl(var(--accent-blue))]" />
                  </div>
                  <div>
                    <p className="text-[hsl(var(--text-secondary))]">Email</p>
                    <p className="font-semibold">sanketbhalke1234@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[hsl(var(--accent-green))]/20 rounded-full flex items-center justify-center">
                    <Phone className="text-[hsl(var(--accent-green))]" />
                  </div>
                  <div>
                    <p className="text-[hsl(var(--text-secondary))]">Phone</p>
                    <p className="font-semibold">+91 8177957598</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[hsl(var(--accent-pink))]/20 rounded-full flex items-center justify-center">
                    <MapPin className="text-[hsl(var(--accent-pink))]" />
                  </div>
                  <div>
                    <p className="text-[hsl(var(--text-secondary))]">Location</p>
                    <p className="font-semibold">Pune, India</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-xl font-bold mb-4 text-[hsl(var(--accent-purple))]">
                  Follow Me
                </h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://linkedin.com/in/sanket-bhalke" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[hsl(var(--accent-blue))]/20 rounded-full flex items-center justify-center hover:bg-[hsl(var(--accent-blue))] hover:text-white transition-all duration-300 transform hover:scale-110"
                  >
                    <Linkedin />
                  </a>
                  <a 
                    href="https://github.com/sanketbhalke" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[hsl(var(--accent-blue))]/20 rounded-full flex items-center justify-center hover:bg-[hsl(var(--accent-blue))] hover:text-white transition-all duration-300 transform hover:scale-110"
                  >
                    <Github />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-[hsl(var(--accent-blue))]/20 rounded-full flex items-center justify-center hover:bg-[hsl(var(--accent-blue))] hover:text-white transition-all duration-300 transform hover:scale-110"
                  >
                    <Twitter />
                  </a>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="glassmorphism p-8 rounded-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[hsl(var(--text-secondary))] mb-2">
                    Name
                  </label>
                  <Input 
                    type="text" 
                    placeholder="Your Name" 
                    required 
                    className="bg-[hsl(var(--surface-bg))]/50 border-[hsl(var(--text-muted))] focus:border-[hsl(var(--accent-blue))] transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-[hsl(var(--text-secondary))] mb-2">
                    Email
                  </label>
                  <Input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    required 
                    className="bg-[hsl(var(--surface-bg))]/50 border-[hsl(var(--text-muted))] focus:border-[hsl(var(--accent-blue))] transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-[hsl(var(--text-secondary))] mb-2">
                    Subject
                  </label>
                  <Input 
                    type="text" 
                    placeholder="Project Discussion" 
                    required 
                    className="bg-[hsl(var(--surface-bg))]/50 border-[hsl(var(--text-muted))] focus:border-[hsl(var(--accent-blue))] transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-[hsl(var(--text-secondary))] mb-2">
                    Message
                  </label>
                  <Textarea 
                    rows={5} 
                    placeholder="Tell me about your project..." 
                    required 
                    className="bg-[hsl(var(--surface-bg))]/50 border-[hsl(var(--text-muted))] focus:border-[hsl(var(--accent-blue))] transition-all duration-300 resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[hsl(var(--accent-blue))] to-[hsl(var(--accent-pink))] hover:from-[hsl(var(--accent-blue))]/80 hover:to-[hsl(var(--accent-pink))]/80 text-white transition-all duration-300 transform hover:scale-105 animate-glow"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
