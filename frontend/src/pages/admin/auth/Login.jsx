import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../../../lib/firebase";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const signIn = async () => {
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate("/admin");
    } catch (e) { setError(e.message); }
  };
  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <h1 className="font-display text-4xl">Admin</h1>
      {isFirebaseConfigured ? (
        <>
          <p className="text-neutral mt-2">Sign in with the portfolio owner's Google account.</p>
          <button className="btn btn-primary mt-6" onClick={signIn}>Sign in with Google</button>
          {error && <p className="text-error mt-3 text-sm">{error}</p>}
        </>
      ) : (
        <p className="text-neutral mt-2">Firebase isn't configured yet. Add your config in <code>src/lib/firebaseConfig.js</code>.</p>
      )}
    </main>
  );
};

export default Login;
