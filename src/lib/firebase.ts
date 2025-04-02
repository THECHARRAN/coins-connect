
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN33PBF8QJxd241IrceVBuMBn7oGIuG28",
  authDomain: "mindyourmoney-edfbe.firebaseapp.com",
  projectId: "mindyourmoney-edfbe",
  storageBucket: "mindyourmoney-edfbe.firebasestorage.app",
  messagingSenderId: "848667086288",
  appId: "1:848667086288:web:4c5be686ce08fedc677dd5",
  measurementId: "G-9FRD7QJZ0M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics - only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
