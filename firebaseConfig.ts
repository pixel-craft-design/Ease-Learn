import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCywbC2PGGnE8uJit3m6IudNIkECrGtuk",
  authDomain: "easelearn2517.firebaseapp.com",
  projectId: "easelearn2517",
  storageBucket: "easelearn2517.firebasestorage.app",
  messagingSenderId: "336836948938",
  appId: "1:336836948938:web:4722b9cbb2808d9086d533"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();