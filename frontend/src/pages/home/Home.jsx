import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./sheet/Hero";
import SavingThrows from "./sheet/SavingThrows";
import Languages from "./sheet/Languages";
import Training from "./sheet/Training";
import MainTabs from "./sheet/MainTabs";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <main className="page">
        <Hero />
        <div className="trio">
          <SavingThrows />
          <Languages />
          <Training />
        </div>
        <MainTabs />
      </main>
      <footer className="site-foot">
        © {new Date().getFullYear()} <span onClick={() => navigate("/auth")}>Gaby Norris</span> · Open Window Institute · Designed &amp; built with care
      </footer>
    </>
  );
}
