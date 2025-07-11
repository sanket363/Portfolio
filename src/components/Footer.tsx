import React from 'react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-6 text-center">
      &copy; {new Date().getFullYear()} DevOps Engineer. All rights reserved.
    </footer>
  );
} 