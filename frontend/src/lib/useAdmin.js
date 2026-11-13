import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";
import { ADMIN_EMAILS } from "./firebaseConfig";

// True when the signed-in user is one of the owner accounts.
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(auth, (u) => setIsAdmin(!!u && ADMIN_EMAILS.includes((u.email || "").toLowerCase())));
  }, []);
  return isAdmin;
}
