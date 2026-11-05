import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/admin/auth/Login";
import Home from "./pages/home/Home";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import ProjectPage from "./pages/project/ProjectPage";
import AdminSecretListener from "./pages/admin/auth/AdminSecretListener";
import Header from "./components/sheet/Header";
import Drawer from "./components/sheet/Drawer";
import DiceTray from "./components/sheet/DiceTray";
import { DiceProvider } from "./lib/dice";
import { BACKGROUND_IMAGE } from "./lib/siteConfig";

// HashRouter keeps routes after a "#", so refreshing /#/auth works on GitHub Pages.
export default function App() {
  return (
    <HashRouter>
      <DiceProvider>
        <div className="sheet-page" style={BACKGROUND_IMAGE ? { backgroundImage: `linear-gradient(var(--bg-veil),var(--bg-veil)),url(${BACKGROUND_IMAGE})`, backgroundSize: "cover", backgroundAttachment: "fixed" } : undefined}>
          <Header />
          <AdminSecretListener />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/admin" element={<Dashboard />} />
          </Routes>
          <Drawer />
          <DiceTray />
        </div>
      </DiceProvider>
    </HashRouter>
  );
}
