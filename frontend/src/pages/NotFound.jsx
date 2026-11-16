import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Logo from "../components/sheet/Logo";

export default function NotFound({ message }) {
  return (
    <main className="notfound" role="main">
      <div style={{ color: "var(--accent)" }}><Logo size={120} /></div>
      <h1 className="h1" style={{ margin: "14px 0 6px" }}>Critical fail</h1>
      <p className="lede" style={{ margin: 0, textAlign: "center" }}>{message || "You rolled a 1 and wandered off the map. This page doesn't exist (or it moved)."}</p>
      <Link to="/" className="solid" style={{ marginTop: 22 }}><Home size={15} />Back to the sheet</Link>
    </main>
  );
}
