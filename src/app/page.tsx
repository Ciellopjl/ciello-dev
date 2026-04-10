import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Technologies from "@/components/Technologies";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
