import { SiGithub, SiLinkedin } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-ctp-mantle p-4 mt-10">
      <div className="container mx-auto text-center text-ctp-subtext0">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://github.com/sanket363" target="_blank" rel="noopener noreferrer" className="text-ctp-lavender hover:text-ctp-mauve transition-colors">
            <SiGithub size={24} />
          </a>
          <a href="https://www.linkedin.com/in/sanket-bhalke-devops/" target="_blank" rel="noopener noreferrer" className="text-ctp-lavender hover:text-ctp-mauve transition-colors">
            <SiLinkedin size={24} />
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Sanket Bhalke. All rights reserved.</p>
        <p className="text-sm mt-2">Built with <span className="text-ctp-green">Next.js</span> & <span className="text-ctp-blue">Tailwind CSS</span>. Deployed on <span className="text-ctp-sky">Vercel</span>.</p>
      </div>
    </footer>
  );
};

export default Footer;
