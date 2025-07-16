import React, { useState, useEffect, useRef } from 'react'; 
 import { Moon, Sun, Github, Linkedin, Mail, Terminal, Cloud, Server, Database, GitBranch, Code, Monitor, Shield, Zap, Download, ExternalLink, Copy, Play } from 'lucide-react'; 
  
 const DevOpsPortfolio = () => { 
   const [isDark, setIsDark] = useState(true); 
   const [isLoaded, setIsLoaded] = useState(false); 
   const [typedText, setTypedText] = useState(''); 
   const [showCursor, setShowCursor] = useState(true); 
   const heroRef = useRef(null); 
   const particlesRef = useRef(null); 
  
   const tagline = "I automate the cloud ☁️"; 
  
   // Typing animation effect 
   useEffect(() => { 
     let index = 0; 
     const timer = setInterval(() => { 
       if (index < tagline.length) { 
         setTypedText(tagline.substring(0, index + 1)); 
         index++; 
       } else { 
         clearInterval(timer); 
       } 
     }, 100); 
  
     return () => clearInterval(timer); 
   }, []); 
  
   // Cursor blinking effect 
   useEffect(() => { 
     const cursorTimer = setInterval(() => { 
       setShowCursor(prev => !prev); 
     }, 500); 
  
     return () => clearInterval(cursorTimer); 
   }, []); 
  
   // Load animation 
   useEffect(() => { 
     const timer = setTimeout(() => { 
       setIsLoaded(true); 
     }, 100); 
  
     return () => clearTimeout(timer); 
   }, []); 
  
   // Particle animation 
   useEffect(() => { 
     if (particlesRef.current) { 
       const particles = []; 
       for (let i = 0; i < 50; i++) { 
         const particle = document.createElement('div'); 
         particle.className = 'absolute w-1 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-70'; 
         particle.style.left = Math.random() * 100 + '%'; 
         particle.style.top = Math.random() * 100 + '%'; 
         particle.style.animationDelay = Math.random() * 2 + 's'; 
         particle.style.animation = 'float 6s ease-in-out infinite'; 
         particlesRef.current.appendChild(particle); 
         particles.push(particle); 
       } 
  
       return () => { 
         particles.forEach(p => p.remove()); 
       }; 
     } 
   }, []); 
  
   const skills = [ 
     { name: 'Kubernetes', icon: Server, color: 'text-blue-400' }, 
     { name: 'Docker', icon: Database, color: 'text-cyan-400' }, 
     { name: 'AWS', icon: Cloud, color: 'text-orange-400' }, 
     { name: 'Terraform', icon: Code, color: 'text-purple-400' }, 
     { name: 'GitHub Actions', icon: GitBranch, color: 'text-green-400' }, 
     { name: 'Monitoring', icon: Monitor, color: 'text-yellow-400' }, 
     { name: 'Security', icon: Shield, color: 'text-red-400' }, 
     { name: 'CI/CD', icon: Zap, color: 'text-pink-400' } 
   ]; 
  
   const projects = [ 
     { 
       title: 'Cloud Infrastructure Automation', 
       description: 'Terraform-based multi-cloud infrastructure deployment with GitOps workflow', 
       tech: ['Terraform', 'AWS', 'GitLab CI'], 
       demo: 'terraform init && terraform plan', 
       status: 'Production' 
     }, 
     { 
       title: 'Kubernetes Monitoring Stack', 
       description: 'Complete observability solution with Prometheus, Grafana, and AlertManager', 
       tech: ['Kubernetes', 'Prometheus', 'Grafana'], 
       demo: 'kubectl apply -f monitoring-stack.yaml', 
       status: 'Live' 
     }, 
     { 
       title: 'CI/CD Pipeline Optimization', 
       description: 'Reduced deployment time by 60% with parallel builds and smart caching', 
       tech: ['GitHub Actions', 'Docker', 'ArgoCD'], 
       demo: 'gh workflow run deploy --ref main', 
       status: 'Active' 
     } 
   ]; 
  
   const certifications = [ 
     { name: 'AWS Solutions Architect', provider: 'Amazon', year: '2024' }, 
     { name: 'Certified Kubernetes Administrator', provider: 'CNCF', year: '2023' }, 
     { name: 'HashiCorp Terraform Associate', provider: 'HashiCorp', year: '2023' } 
   ]; 
  
   const copyToClipboard = (text) => { 
     navigator.clipboard.writeText(text); 
   }; 
  
   const ProjectCard = ({ project, index }) => ( 
     <div className={`group relative bg-gradient-to-br ${isDark ? 'from-gray-900/50 to-gray-800/30' : 'from-white/50 to-gray-100/30'} backdrop-blur-xl rounded-2xl p-6 border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'} hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20`}> 
       <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> 
        
       <div className="relative z-10"> 
         <div className="flex items-center justify-between mb-4"> 
           <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3> 
           <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'Production' ? 'bg-green-500/20 text-green-400' : project.status === 'Live' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}> 
             {project.status} 
           </span> 
         </div> 
          
         <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{project.description}</p> 
          
         <div className="flex flex-wrap gap-2 mb-4"> 
           {project.tech.map((tech, i) => ( 
             <span key={i} className={`px-2 py-1 text-xs rounded-lg ${isDark ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-200/50 text-gray-700'}`}> 
               {tech} 
             </span> 
           ))} 
         </div> 
          
         <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-900/50' : 'bg-gray-100/50'} font-mono text-sm flex items-center justify-between group-hover:bg-gradient-to-r group-hover:from-purple-900/20 group-hover:to-cyan-900/20 transition-all duration-500`}> 
           <span className="text-green-400">$ {project.demo}</span> 
           <button  
             onClick={() => copyToClipboard(project.demo)} 
             className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-cyan-400" 
           > 
             <Copy className="w-4 h-4"/>
           </button>
         </div>
       </div>
     </div>
   );
  
   const SkillOrb = ({ skill, index }) => (
     <div  
       className={`group relative flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${isDark ? 'from-gray-900/50 to-gray-800/30' : 'from-white/50 to-gray-100/30'} backdrop-blur-xl border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'} hover:scale-110 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/30 cursor-pointer`} 
       style={{ animationDelay: `${index * 0.1}s` }} 
     > 
       <skill.icon className={`w-8 h-8 ${skill.color} mb-1 group-hover:scale-110 transition-transform duration-300`} /> 
       <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{skill.name}</span> 
       <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> 
     </div> 
   ); 
  
   return ( 
     <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}> 
       <style jsx>{` 
         @keyframes float { 
           0%, 100% { transform: translateY(0px) rotate(0deg); } 
           50% { transform: translateY(-20px) rotate(180deg); } 
         } 
          
         @keyframes pulse-glow { 
           0%, 100% { box-shadow: 0 0 20px rgba(127, 90, 240, 0.3); } 
           50% { box-shadow: 0 0 40px rgba(127, 90, 240, 0.6); } 
         } 
          
         .animate-float { 
           animation: float 6s ease-in-out infinite; 
         } 
          
         .animate-pulse-glow { 
           animation: pulse-glow 2s ease-in-out infinite; 
         } 
          
         @import url(' `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap` '); 
       `}</style> 
  
       {/* Navigation */} 
       <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl ${isDark ? 'bg-gray-900/50' : 'bg-white/50'} border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}> 
         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"> 
           <div className={`text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent`}> 
             Sanket 
           </div> 
            
           <div className="flex items-center space-x-6"> 
             <a href="#about" className={`hover:text-purple-400 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>About</a> 
             <a href="#projects" className={`hover:text-purple-400 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Projects</a> 
             <a href="#skills" className={`hover:text-purple-400 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Skills</a> 
             <a href="#contact" className={`hover:text-purple-400 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Contact</a> 
              
             <button 
               onClick={() => setIsDark(!isDark)} 
               className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`} 
             > 
               {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} 
             </button> 
           </div> 
         </div> 
       </nav> 
  
       {/* Hero Section */} 
       <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden"> 
         {/* Animated Background */} 
         <div ref={particlesRef} className="absolute inset-0 overflow-hidden"></div> 
          
         {/* Gradient Orbs */} 
         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div> 
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div> 
          
         <div className={`relative z-10 text-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}> 
           <div className={`inline-block px-4 py-2 rounded-full ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'} mb-8`}> 
             <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>👋 Available for DevOps opportunities</span> 
           </div> 
            
           <h1 className={`text-6xl md:text-8xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}> 
             Hi, I'm{' '} 
             <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent"> 
               Sanket 
             </span> 
           </h1> 
            
           <div className="mb-12 font-mono text-xl md:text-2xl"> 
             <span className={`${isDark ? 'text-green-400' : 'text-green-600'}`}>$ </span> 
             <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}> 
               {typedText} 
             </span> 
             <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span> 
           </div> 
            
           <div className="flex flex-col sm:flex-row gap-4 justify-center"> 
             <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300 animate-pulse-glow"> 
               <Download className="w-5 h-5 inline mr-2" /> 
               Download Resume 
             </button> 
             <button className={`px-8 py-4 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg hover:scale-105 transition-all duration-300`}> 
               <ExternalLink className="w-5 h-5 inline mr-2" /> 
               View Projects 
             </button> 
           </div> 
         </div> 
       </section> 
  
       {/* About Section */} 
       <section id="about" className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}> 
         <div className="max-w-7xl mx-auto px-6"> 
           <div className="flex flex-col lg:flex-row items-center gap-12"> 
             <div className="lg:w-1/2"> 
               <h2 className={`text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent`}>About Me</h2> 
               <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed mb-4`}> 
                 I'm a passionate DevOps Engineer with a knack for automating infrastructure, streamlining CI/CD pipelines, and building scalable, resilient systems. My expertise spans across cloud platforms like AWS, containerization with Docker and Kubernetes, and Infrastructure as Code with Terraform. 
               </p> 
               <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed`}> 
                 I thrive on solving complex problems and continuously learning new technologies to deliver efficient and secure solutions. When I'm not coding or architecting, you can find me exploring the latest in cloud-native trends or contributing to open-source projects. 
               </p> 
             </div> 
             <div className="lg:w-1/2 flex justify-center"> 
               <div className={`relative w-64 h-64 rounded-full overflow-hidden ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-xl border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'} flex items-center justify-center animate-float`}> 
                 <img src="https://via.placeholder.com/150" alt="Profile" className="rounded-full w-48 h-48 object-cover" /> 
                 <div className="absolute inset-0 rounded-full ring-4 ring-purple-500/50 animate-pulse-glow"></div> 
               </div> 
             </div> 
           </div> 
         </div> 
       </section> 
  
       {/* Skills Section */} 
       <section id="skills" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}> 
         <div className="max-w-7xl mx-auto px-6 text-center"> 
           <h2 className={`text-4xl font-bold mb-12 bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent`}>My Skillset</h2> 
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8"> 
             {skills.map((skill, index) => ( 
               <SkillOrb key={index} skill={skill} index={index} /> 
             ))} 
           </div> 
         </div> 
       </section> 
  
       {/* Projects Section */} 
       <section id="projects" className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}> 
         <div className="max-w-7xl mx-auto px-6"> 
           <h2 className={`text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent`}>Featured Projects</h2> 
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
             {projects.map((project, index) => ( 
               <ProjectCard key={index} project={project} index={index} /> 
             ))} 
           </div> 
         </div> 
       </section> 
  
       {/* Certifications Section */} 
       <section id="certifications" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}> 
         <div className="max-w-7xl mx-auto px-6 text-center"> 
           <h2 className={`text-4xl font-bold mb-12 bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent`}>Certifications</h2> 
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
             {certifications.map((cert, index) => ( 
               <div key={index} className={`group relative bg-gradient-to-br ${isDark ? 'from-gray-900/50 to-gray-800/30' : 'from-white/50 to-gray-100/30'} backdrop-blur-xl rounded-2xl p-6 border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'} hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20`}> 
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> 
                 <div className="relative z-10"> 
                   <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>{cert.name}</h3> 
                   <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{cert.provider} ({cert.year})</p> 
                 </div> 
               </div> 
             ))} 
           </div> 
         </div> 
       </section> 
  
       {/* Contact Section */} 
       <section id="contact" className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}> 
         <div className="max-w-4xl mx-auto px-6 text-center"> 
           <h2 className={`text-4xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent`}>Get in Touch</h2> 
           <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg mb-8`}> 
             Have a question or want to collaborate? Feel free to reach out! 
           </p> 
           <div className="flex flex-col sm:flex-row justify-center gap-6"> 
             <a 
               href="mailto:your.email@example.com" 
               className={`flex items-center justify-center px-6 py-3 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`} 
             > 
               <Mail className="w-5 h-5 mr-2" /> 
               Email Me 
             </a> 
             <a 
               href="https://github.com/yourusername" 
               target="_blank" 
               rel="noopener noreferrer" 
               className={`flex items-center justify-center px-6 py-3 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`} 
             > 
               <Github className="w-5 h-5 mr-2" /> 
               GitHub 
             </a> 
             <a 
               href="https://linkedin.com/in/yourusername" 
               target="_blank" 
               rel="noopener noreferrer" 
               className={`flex items-center justify-center px-6 py-3 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`} 
             > 
               <Linkedin className="w-5 h-5 mr-2" /> 
               LinkedIn 
             </a> 
           </div> 
         </div> 
       </section> 
  
       {/* Footer */} 
       <footer className={`py-8 text-center ${isDark ? 'bg-gray-950 text-gray-500' : 'bg-gray-200 text-gray-600'} text-sm`}> 
         <div className="max-w-7xl mx-auto px-6"> 
           &copy; {new Date().getFullYear()} Sanket. All rights reserved. 
         </div> 
       </footer> 
     </div> 
   ); 
 }; 
  
 export default DevOpsPortfolio;