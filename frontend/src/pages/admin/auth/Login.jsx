import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { auth, isFirebaseConfigured } from "../../../lib/firebase";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const signIn = async () => {
    setError(""); setBusy(true);
    try { await signInWithPopup(auth, new GoogleAuthProvider()); navigate("/admin"); }
    catch (e) { setError(e.code === "auth/popup-closed-by-user" ? "Sign-in was cancelled." : "Sign-in failed. Please try again."); }
    setBusy(false);
  };
  return (
    <main className="login-wrap">
      <section className="panel login-card">
        <span className="hdr-logo" style={{ margin: "0 auto 18px" }}>GN</span>
        <h1 className="h2" style={{ fontSize: 26 }}>Welcome back</h1>
        <p className="quote" style={{ margin: "8px auto 24px" }}>Sign in to manage your portfolio projects and messages.</p>
        {isFirebaseConfigured ? (
          <>
            <button type="button" className="g-btn" onClick={signIn} disabled={busy}><FaGoogle size={16} />{busy ? "Signing in…" : "Continue with Google"}</button>
            {error && <p className="status-err" role="alert" style={{ marginTop: 14 }}>{error}</p>}
            <p style={{ margin: "18px 0 0", fontSize: 12, color: "var(--muted)" }}>Private area. Only the portfolio owner's account can sign in.</p>
          </>
        ) : (
          <Link to="/admin" className="solid" style={{ justifyContent: "center", width: "100%" }}>Open dashboard</Link>
        )}
        <div style={{ marginTop: 22 }}><Link to="/" style={{ color: "var(--accent)", fontSize: 14 }}>← Back to portfolio</Link></div>
      </section>
    </main>
  );
}
