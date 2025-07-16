import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle } from "lucide-react";

const experiences = [
  {
    title: "DevOps Engineer",
    company: "Teradata, Pune",
    period: "08/2024 - Present",
    achievements: [
      "Worked on onboarding and IAM processes across AWS, Azure, and GCP environments, including managing service accounts, roles, and permissions.",
      "Used GitHub for source control and CI/CD pipelines, managing deployment workflows securely.",
      "Involved in security agent (e.g., Lacework, Prisma Cloud Defender) onboarding and automated removal processes via Ansible and Terraform.",
      "Refactored multiple Python Lambda functions to version 3.13.1, improving runtime efficiency and reducing cold start latency by 25% in production.",
      "Assisted with the Lighthouse upgrade in commercial environments and validated golden image packages across environments, improving patch compliance and VM provisioning time.",
      "Led secure IAM user and role lifecycle management across AWS, including credential rotation, policy enforcement, and cleanup of cross-team access groups, ensuring 100% compliance with internal security and audit standards."
    ]
  }
  {
    title: "DevOps Engineer",
    company: "Cloudaeon, Pune",
    period: "03/2022 - 08/2024",
    achievements: [
      "Migrated IBM cloud infrastructure to AWS Cloud, improving scalability and reducing costs",
      "Upgraded AWS EKS Cluster and Oracle RDS, ensuring high availability and performance",
      "Managed containerized applications using Kubernetes and Docker, achieving 15% improvement in availability",
      "Implemented monitoring solutions with Zabbix, Grafana, and Prometheus, reducing downtime by 40%",
      "Utilized AWS services such as EC2, RDS, S3, EKS, Autoscaling, CloudWatch, Route 53",
      "Implemented ELK stack for stateless AWS EKS infrastructure to streamline log management"
    ]
  },
  {
    title: "DevOps Engineer Intern",
    company: "Cloudaeon, Pune",
    period: "09/2021 - 02/2022",
    achievements: [
      "Assisted with deployment of applications to testing, staging, and production environments",
      "Automated manual tasks and streamlined processes to improve team productivity and efficiency"
    ]
  }
];

export function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-20 bg-[hsl(var(--surface-bg))]/50">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          Experience
        </motion.h2>
        
        <div ref={ref} className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
              transition={{ 
                duration: 1, 
                delay: index * 0.3, 
                ease: "easeOut" 
              }}
              className="timeline-item glassmorphism p-8 rounded-2xl mb-8"
            >
              <div className="timeline-dot"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[hsl(var(--accent-blue))] mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-[hsl(var(--accent-pink))] font-semibold">
                    {exp.company}
                  </p>
                </div>
                <span className="text-[hsl(var(--text-secondary))] bg-[hsl(var(--accent-blue))]/20 px-4 py-2 rounded-full">
                  {exp.period}
                </span>
              </div>
              
              <ul className="text-[hsl(var(--text-secondary))] space-y-2">
                {exp.achievements.map((achievement, achIndex) => (
                  <motion.li
                    key={achIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: (index * 0.3) + (achIndex * 0.1) + 0.5, 
                      ease: "easeOut" 
                    }}
                    className="flex items-start"
                  >
                    <CheckCircle className="text-[hsl(var(--accent-green))] mr-3 mt-1 flex-shrink-0 w-5 h-5" />
                    {achievement}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
