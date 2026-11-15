'use client'

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import QuoteSection from "./components/QuoteSection";
import About from "./components/About";
import Contact from "./components/Contact";
import { useLoading } from "./context/LoadingContext";

export default function Home() {
  const { isLoaded } = useLoading();

  return (
    <main
      className="relative overflow-x-clip w-full"
      style={{
        visibility: isLoaded ? "visible" : "hidden",
        opacity: isLoaded ? 1 : 0,
      }}
    >
      <Navbar />
      <Hero />
      <QuoteSection />
      <About />
      <div className="section-divider" />
      <Contact />
    </main>
  );
}
