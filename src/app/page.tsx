import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import TechStack from "@/components/sections/TechStack";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 md:gap-40 pb-20">
      <Hero />
      <div className="space-y-40">
        <About />
        <TechStack />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
