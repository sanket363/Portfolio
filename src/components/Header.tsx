import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 bg-white dark:bg-gray-800 shadow-md z-20 relative">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          MyDevOpsPortfolio
        </Link>
        <ul className="flex space-x-6">
          <NavLink to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Home</NavLink>
          <NavLink to="/projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Projects</NavLink>
          <NavLink to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Blog</NavLink>
          <NavLink to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Contact</NavLink>
        </ul>
      </nav>
    </header>
  );
};

export default Header;