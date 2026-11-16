import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../../../lib/firebase";
import { ADMIN_EMAILS } from "../../../lib/firebaseConfig";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(auth, (u) => { if (u && ADMIN_EMAILS.includes((u.email || "").toLowerCase())) navigate("/admin"); });
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!ADMIN_EMAILS.includes(email.trim().toLowerCase())) { setError("That email or password isn't right."); return; }
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/admin");
    } catch (err) {
      setError("That email or password isn't right.");
    }
    setBusy(false);
  };

  return (
    <main className="login-wrap">
      <section className="panel login-card">
        <span className="hdr-logo" style={{ margin: "0 auto 18px" }}>GN</span>
        <h1 className="h2" style={{ fontSize: 26 }}>Welcome back</h1>
        <p className="quote" style={{ margin: "8px auto 22px" }}>Sign in to manage your portfolio projects and messages.</p>
        {isFirebaseConfigured ? (
          <form className="form" style={{ marginTop: 0, textAlign: "left" }} onSubmit={submit}>
            <div className="field"><label htmlFor="em">Email</label><input id="em" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="field"><label htmlFor="pw">Password</label><input id="pw" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <button className="solid" style={{ justifyContent: "center" }} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
            {error && <p className="status-err" role="alert" style={{ margin: 0 }}>{error}</p>}
          </form>
        ) : (
          <Link to="/admin" className="solid" style={{ justifyContent: "center", width: "100%" }}>Open dashboard</Link>
        )}
        <p style={{ margin: "18px 0 0", fontSize: 12, color: "var(--muted)" }}>Private area. Only the portfolio owner can sign in.</p>
        <div style={{ marginTop: 14 }}><Link to="/" style={{ color: "var(--accent)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}><ArrowLeft size={14} />Back to portfolio</Link></div>
      </section>
    </main>
  );
}
