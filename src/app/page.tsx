import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';

export default function Home() {
  return (
    <main className="bg-ctp-base">
      <Header />
      <Hero />
      <div className="bg-ctp-mantle">
        <AboutMe />
        <Skills />
        <Projects />
        {/* Other sections will be added here */}
      </div>
      <Footer />
    </main>
  );
}
