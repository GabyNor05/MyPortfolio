import React from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/admin/auth/Login";
import Home from "./pages/home/Home";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import ProjectPage from "./pages/project/ProjectPage";
import AdminSecretListener from "./pages/admin/auth/AdminSecretListener";
import Header from "./components/sheet/Header";
import Drawer from "./components/sheet/Drawer";
import DiceTray from "./components/sheet/DiceTray";
import { DiceProvider } from "./lib/dice";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { BACKGROUND_IMAGE } from "./lib/siteConfig";

function Shell() {
  const { pathname } = useLocation();
  const adminArea = pathname.startsWith("/admin") || pathname === "/auth";
  return (
    <div className="sheet-page" style={BACKGROUND_IMAGE ? { backgroundImage: `linear-gradient(var(--bg-veil),var(--bg-veil)),url(${BACKGROUND_IMAGE})`, backgroundSize: "cover", backgroundAttachment: "fixed" } : undefined}>
      {!adminArea && <Header />}
      <AdminSecretListener />
      <ErrorBoundary><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes></ErrorBoundary>
      {!adminArea && <Drawer />}
      {!adminArea && <DiceTray />}
    </div>
  );
}

// HashRouter keeps routes after a "#", so refreshing /#/auth works on GitHub Pages.
export default function App() {
  return (
    <HashRouter>
      <DiceProvider>
        <Shell />
      </DiceProvider>
    </HashRouter>
  );
}
