export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/HeroSection";
import About from "@/components/sections/AboutSection";
import Technologies from "@/components/sections/TechSection";
import Projects from "@/components/sections/ProjectsSection";
import Contact from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";


export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-brand-primary/30 selection:text-white">
      <Navbar />
      
      <div className="space-y-4 md:space-y-0">
        <Hero />
        <About />
        <Technologies />
        <Projects />
        <Contact />
      </div>

      <Footer />
    </main>
  );
}
