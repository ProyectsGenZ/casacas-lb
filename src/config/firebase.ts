import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  projectId: "proyects-f1c7e",
  appId: "1:700325479475:web:c35614c6b468153d0b4f46",
  storageBucket: "proyects-f1c7e.firebasestorage.app",
  apiKey: "AIzaSyD20pbPnCPTgI4terFWs1nUBFUYGx6FJwg",
  authDomain: "proyects-f1c7e.firebaseapp.com",
  messagingSenderId: "700325479475",
  measurementId: "G-W3H3JNV42Y"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
