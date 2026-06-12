import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import Experience from "./components/Experience";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden w-full">
      <Navbar />
      <Hero />
      <div className="section-divider" />
      <About />
      <div className="section-divider" />
      <TechStack />
      <div className="section-divider" />
      <Projects />
      <div className="section-divider" />
      <Blog />
      <div className="section-divider" />
      <Experience />
      <div className="section-divider" />
      <Contact />
    </main>
  );
}
