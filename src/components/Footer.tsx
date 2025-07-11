import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full p-4 bg-white dark:bg-gray-800 shadow-md mt-8 text-center text-gray-700 dark:text-gray-300">
      <p>&copy; {new Date().getFullYear()} MyDevOpsPortfolio. All rights reserved.</p>
    </footer>
  );
};

export default Footer;