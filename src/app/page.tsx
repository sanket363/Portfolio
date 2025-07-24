"use client";

import TerminalIntro from "../components/TerminalIntro";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import ExperienceCertsSection from "../components/ExperienceCertsSection";
import DevOpsMonitoring from "../components/DevOpsMonitoring";
import CICDPipeline from "../components/CICDPipeline";
import InfrastructureAsCode from "../components/InfrastructureAsCode";
import ContainerOrchestration from "../components/ContainerOrchestration";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div id="hero">
        <TerminalIntro />
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6 mb-12">
          <a href="https://drive.google.com/file/d/1NmrZlXoGbKiaqUT3JwRO2J3iG12C5hB4/view?pli=1" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold transition">Resume</a>
          <a href="https://github.com/sanket363" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded font-bold transition">GitHub</a>
          <a href="https://www.linkedin.com/in/sanket-bhalke-devops/" target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded font-bold transition">LinkedIn</a>
        </div>
      </div>
      <div id="skills"><SkillsSection /></div>
      <div id="projects"><ProjectsSection /></div>
      <div id="experience"><ExperienceCertsSection /></div>
      <div id="dashboard"><DevOpsMonitoring /></div>
      <div id="cicd"><CICDPipeline /></div>
      <div id="iac"><InfrastructureAsCode /></div>
      <div id="orchestration"><ContainerOrchestration /></div>
      <div id="contact"><ContactForm /></div>
      <Footer />
    </main>
  );
}
