import React from "react";
import { useNavigate } from "react-router-dom";
import AbilityScores from "./sheet/AbilityScores";
import SavingThrows from "./sheet/SavingThrows";
import Languages from "./sheet/Languages";
import Training from "./sheet/Training";
import Skills from "./sheet/Skills";
import MainTabs from "./sheet/MainTabs";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <main className="sheet-main">
        <div className="left">
          <AbilityScores />
          <div className="cols">
            <div className="colA">
              <SavingThrows />
              <Languages />
              <Training />
            </div>
            <Skills />
          </div>
        </div>
        <div className="right"><MainTabs /></div>
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} <span onClick={() => navigate("/auth")}>Gaby Norris</span> · Open Window Institute · Designed &amp; built with care
      </footer>
    </>
  );
}
