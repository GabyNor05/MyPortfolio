import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../../../lib/firebase";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const signIn = async () => {
    setError("");
    try { await signInWithPopup(auth, new GoogleAuthProvider()); navigate("/admin"); }
    catch (e) { setError(e.message); }
  };
  return (
    <main className="page" style={{ maxWidth: 520 }}>
      <section className="panel adm-card" style={{ padding: 32 }}>
        <div className="eyebrow">Manage</div>
        <h1 className="h1" style={{ fontSize: 34 }}>Sign in</h1>
        {isFirebaseConfigured ? (
          <>
            <p className="lede">Sign in with the portfolio owner's Google account.</p>
            <div className="btn-row"><button className="solid" onClick={signIn}>Sign in with Google</button></div>
            {error && <p className="status-err" role="alert">{error}</p>}
          </>
        ) : (
          <>
            <p className="lede">Firebase isn't set up yet. You can still use the dashboard to edit projects on this page and download the JSON.</p>
            <div className="btn-row"><Link to="/admin" className="solid">Open dashboard</Link></div>
          </>
        )}
      </section>
    </main>
  );
}
