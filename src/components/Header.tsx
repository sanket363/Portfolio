import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="relative z-20 w-full py-4 px-8 flex justify-between items-center bg-transparent">
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        <Link to="/">Sanket's Portfolio</Link>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Home
            </Link>
          </li>
          <NavLink to="/projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Projects</NavLink>
          <NavLink to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Blog</NavLink>
          <NavLink to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Contact</NavLink>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
