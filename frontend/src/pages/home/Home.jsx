import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import About from "./sections/About";
import Contact from "./sections/Contact";

function Home() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col items-center bg-base-100">
      <Hero />
      <Projects />
      <About />
      <Contact />
      <footer className="border-t-[0.5px] border-primary/30 w-full py-4 px-4 text-center text-sm text-neutral">
        © {currentYear}{" "}
        <span className="cursor-pointer text-accent" onClick={() => navigate("/auth")}>Gaby Norris</span>
        {" "}· Open Window Institute · Designed &amp; built with care
      </footer>
    </div>
  );
}

export default Home;
