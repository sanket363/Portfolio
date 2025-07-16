import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Github, ExternalLink } from "lucide-react";
import { 
  SiGithubactions, 
  SiAmazon, 
  SiDocker, 
  SiJenkins, 
  SiNodedotjs,
  SiGrafana,
  SiKubernetes,
  SiTerraform
} from "react-icons/si";

const projects = [
  {
    title: "GitHub Actions CI/CD",
    description: "Automated website deployment to AWS S3 using GitHub Actions with seamless CI/CD pipeline integration.",
    gradient: "from-[hsl(var(--accent-blue))] to-[hsl(var(--accent-pink))]",
    icon: SiGithubactions,
    tags: ["GitHub Actions", "AWS S3", "CI/CD"],
    tagColors: ["hsl(var(--accent-blue))", "hsl(var(--accent-green))", "hsl(var(--accent-pink))"]
  },
  {
    title: "Node.js App Deployment",
    description: "End-to-end CICD pipeline for Node.js ToDo app using Jenkins, Docker, and automated testing.",
    gradient: "from-[hsl(var(--accent-orange))] to-[hsl(var(--accent-purple))]",
    icon: SiNodedotjs,
    tags: ["Jenkins", "Docker", "Node.js"],
    tagColors: ["hsl(var(--accent-orange))", "hsl(var(--accent-blue))", "hsl(var(--accent-green))"]
  },
  {
    title: "LogFlow Monitoring",
    description: "Unified log tracking solution using Grafana, Loki, and Promtail for comprehensive monitoring.",
    gradient: "from-[hsl(var(--accent-green))] to-[hsl(var(--accent-pink))]",
    icon: SiGrafana,
    tags: ["Grafana", "Loki", "Promtail"],
    tagColors: ["hsl(var(--accent-green))", "hsl(var(--accent-pink))", "hsl(var(--accent-purple))"]
  },
  {
    title: "AWS Lambda API",
    description: "Serverless RESTful API using AWS Lambda and API Gateway for scalable backend services.",
    gradient: "from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))]",
    icon: SiAmazon,
    tags: ["AWS Lambda", "API Gateway", "Serverless"],
    tagColors: ["hsl(var(--accent-orange))", "hsl(var(--accent-blue))", "hsl(var(--accent-green))"]
  },
  {
    title: "Docker Swarm Deployment",
    description: "Container orchestration using Docker Swarm for scalable web application management.",
    gradient: "from-[hsl(var(--accent-pink))] to-[hsl(var(--accent-orange))]",
    icon: SiDocker,
    tags: ["Docker", "Swarm", "Orchestration"],
    tagColors: ["hsl(var(--accent-blue))", "hsl(var(--accent-pink))", "hsl(var(--accent-green))"]
  },
  {
    title: "AWS DevOps Pipeline",
    description: "Complete CI/CD pipeline using AWS CodeCommit, CodeBuild, and CodePipeline for automated deployments.",
    gradient: "from-[hsl(var(--accent-green))] to-[hsl(var(--accent-purple))]",
    icon: SiAmazon,
    tags: ["CodeCommit", "CodeBuild", "CodePipeline"],
    tagColors: ["hsl(var(--accent-orange))", "hsl(var(--accent-blue))", "hsl(var(--accent-green))"]
  }
];

export function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          Featured Projects
        </motion.h2>
        
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 100 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
              transition={{ 
                duration: 1, 
                delay: index * 0.2, 
                ease: "easeOut" 
              }}
              className="project-card glassmorphism p-6 rounded-2xl group cursor-pointer"
            >
              <div className={`h-48 bg-gradient-to-br ${project.gradient} rounded-xl mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                <project.icon className="text-6xl text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-[hsl(var(--accent-blue))]">
                {project.title}
              </h3>
              
              <p className="text-[hsl(var(--text-secondary))] mb-4 line-clamp-3">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${project.tagColors[tagIndex]}20`,
                      color: project.tagColors[tagIndex]
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/80 text-white py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Project
                </button>
                <button className="p-2 border border-[hsl(var(--accent-blue))] text-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))] hover:text-white rounded-full transition-all duration-300">
                  <Github className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
