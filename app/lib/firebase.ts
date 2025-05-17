// Import necessary Firebase modules
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDAMGCrLSOSpABDdfRly0Mk0X4Uy4c_3DI",
//   authDomain: "alibabahackathon2025.firebaseapp.com",
//   projectId: "alibabahackathon2025",
//   storageBucket: "alibabahackathon2025.firebasestorage.app",
//   messagingSenderId: "646093272399",
//   appId: "1:646093272399:web:d040e4d3df98bbff5fc13a",
//   measurementId: "G-DEY0952Y0F"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDAMGCrLSOSpABDdfRly0Mk0X4Uy4c_3DI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "alibabahackathon2025.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "alibabahackathon2025",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "alibabahackathon2025.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID || "646093272399",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:646093272399:web:d040e4d3df98bbff5fc13a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-DEY0952Y0F"
};

// Initialize Firebase only once (avoid multiple instances)
let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// Analytics (only supported in client)
const initAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(firebaseApp);
  }
  return null;
};

// Auth & Firestore
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, auth, db, initAnalytics };