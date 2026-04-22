import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const Portfolio = () => (
  <div className="min-h-screen bg-[#05070E] text-white selection:bg-cyan-400/30 selection:text-white antialiased">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Certifications />
      <Contact />
    </main>
    <Footer />
    <Toaster />
  </div>
);

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Portfolio />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
