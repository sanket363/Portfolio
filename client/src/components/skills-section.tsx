import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  SiDocker, 
  SiJenkins, 
  SiAmazon, 
  SiKubernetes, 
  SiPython, 
  SiLinux,
  SiGrafana,
  SiPrometheus,
  SiAnsible,
  SiTerraform,
  SiGithubactions,
  SiElasticsearch
} from "react-icons/si";
import { Network, Shield, GitBranch, Activity } from "lucide-react";

const skills = [
  { name: "Docker", icon: SiDocker, color: "hsl(var(--accent-blue))" },
  { name: "Jenkins", icon: SiJenkins, color: "hsl(var(--accent-blue))" },
  { name: "AWS", icon: SiAmazon, color: "hsl(var(--accent-orange))" },
  { name: "Kubernetes", icon: SiKubernetes, color: "hsl(var(--accent-blue))" },
  { name: "Python", icon: SiPython, color: "hsl(var(--accent-green))" },
  { name: "Linux", icon: SiLinux, color: "hsl(var(--accent-purple))" },
  { name: "Grafana", icon: SiGrafana, color: "hsl(var(--accent-pink))" },
  { name: "Prometheus", icon: SiPrometheus, color: "hsl(var(--accent-orange))" },
  { name: "CI/CD", icon: GitBranch, color: "hsl(var(--accent-green))" },
  { name: "Networking", icon: Network, color: "hsl(var(--accent-blue))" },
  { name: "Ansible", icon: SiAnsible, color: "hsl(var(--accent-purple))" },
  { name: "Security", icon: Shield, color: "hsl(var(--accent-pink))" },
  { name: "Terraform", icon: SiTerraform, color: "hsl(var(--accent-purple))" },
  { name: "GitHub Actions", icon: SiGithubactions, color: "hsl(var(--accent-green))" },
  { name: "ELK Stack", icon: SiElasticsearch, color: "hsl(var(--accent-orange))" },
  { name: "Monitoring", icon: Activity, color: "hsl(var(--accent-pink))" },
];

export function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          Skills & Technologies
        </motion.h2>
        
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1, 
                ease: "easeOut" 
              }}
              className="skill-card glassmorphism p-6 rounded-xl text-center hover:bg-[hsl(var(--accent-blue))]/20 cursor-pointer"
            >
              <skill.icon 
                className="text-4xl mb-4 mx-auto" 
                style={{ color: skill.color }}
              />
              <h3 className="font-semibold">{skill.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
