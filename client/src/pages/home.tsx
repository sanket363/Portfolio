import { ScrollIndicator } from "@/components/scroll-indicator";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { SkillsSection } from "@/components/skills-section";
import { ExperienceSection } from "@/components/experience-section";
import { ProjectsSection } from "@/components/projects-section";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <ScrollIndicator />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
      
      {/* Footer */}
      <footer className="py-8 bg-[hsl(var(--surface-bg))] border-t border-[hsl(var(--text-muted))]/20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-[hsl(var(--text-secondary))]">
              &copy; 2024 Sanket Bhalke. All rights reserved.
            </p>
            <p className="text-[hsl(var(--text-muted))] mt-2">
              Designed with ❤️ and modern web technologies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
