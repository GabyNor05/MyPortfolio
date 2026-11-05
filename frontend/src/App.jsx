import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Login from "./pages/admin/auth/Login";
import Home from "./pages/home/Home";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import AdminSecretListener from "./pages/admin/auth/AdminSecretListener";

// HashRouter keeps routes after a "#", so refreshing /#/auth works on GitHub Pages.
function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-base-100 text-base-content font-body">
        <Navbar />
        <AdminSecretListener />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
