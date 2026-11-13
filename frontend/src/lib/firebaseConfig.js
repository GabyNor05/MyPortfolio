// Paste your Firebase *web app* config here (Firebase console > Project settings > Your apps).
// These values are NOT secrets: they only identify your project. Your Firestore
// security rules (firestore.rules) are what protect the data.
// Until you replace the placeholders the site still works using local project data.
export const firebaseConfig = {
  apiKey: "AIzaSyC6cPTkcWgdqBSeVf2nbq_z6_MTV2OQIy0",
  authDomain: "my-portfolio-5e9a9.firebaseapp.com",
  projectId: "my-portfolio-5e9a9",
  storageBucket: "my-portfolio-5e9a9.firebasestorage.app",
  messagingSenderId: "1028443130119",
  appId: "1:1028443130119:web:be8ca2ef2c64c83e741da2",
};

// Accounts allowed to manage the site (must also be listed in firestore.rules).
export const ADMIN_EMAILS = ["gabynorris616@gmail.com", "gmmnorris@gmail.com", "gabriellenor05@gmail.com"];
export const ADMIN_EMAIL = ADMIN_EMAILS[0]; // shown as the contact fallback

// Paste your LinkedIn profile URL here and a LinkedIn button appears in the About section.
export const LINKEDIN_URL = "";
