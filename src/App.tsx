import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { Layout } from './components/Layout';

export function App() {
  return (
    <Router>
      <Layout>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </main>
        <footer className="bg-slate-900 text-white py-6 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} DevOps Portfolio. All rights reserved.</p>
        </footer>
      </Layout>
    </Router>
  );
}

export default App;