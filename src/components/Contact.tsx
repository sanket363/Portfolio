import React from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-16 px-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">Get in Touch</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          I'm always open to new opportunities and collaborations. Feel free to reach out!
        </p>
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="mailto:your.email@example.com"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-xl"
          >
            <Mail size={28} className="mr-2" /> Email Me
          </a>
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-xl"
          >
            <Linkedin size={28} className="mr-2" /> LinkedIn
          </a>
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-xl"
          >
            <Github size={28} className="mr-2" /> GitHub
          </a>
        </div>
        <p className="text-md text-gray-600 dark:text-gray-400">
          Alternatively, you can fill out the form below (coming soon).
        </p>
      </div>
    </section>
  );
};

export default Contact;