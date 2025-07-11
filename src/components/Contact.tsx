import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 px-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold mb-12">Get in Touch</h2>
        <p className="text-lg mb-8">
          Have a project in mind or just want to say hello? Feel free to reach out!
        </p>
        <div className="flex flex-col items-center space-y-6">
          <a
            href="mailto:your.email@example.com"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-full text-xl font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg"
          >
            <Mail className="w-6 h-6 mr-3" /> Send an Email
          </a>
          <div className="flex space-x-6">
            <a
              href="https://github.com/your-github"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Github className="w-8 h-8" />
            </a>
            <a
              href="https://linkedin.com/in/your-linkedin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Linkedin className="w-8 h-8" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;