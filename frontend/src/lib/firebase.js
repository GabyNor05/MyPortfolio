import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

export const isFirebaseConfigured =
  !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_");

let app = null;
export let db = null;
export let auth = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}
