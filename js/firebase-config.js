// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwspV-1KcllVyRAbajVPLc0lwsWMOLIco",
  authDomain: "jadi-salud.firebaseapp.com",
  projectId: "jadi-salud",
  storageBucket: "jadi-salud.firebasestorage.app",
  messagingSenderId: "679691723583",
  appId: "1:679691723583:web:4235a2493d09a9196ea98a",
  measurementId: "G-GWBSTLYJ3C"
};

const app = initializeApp(firebaseConfig);

// Exportamos lo necesario para Auth y Base de Datos
export const auth = getAuth(app);
export const db = getFirestore(app); // Este es el que crea los documentos
export const googleProvider = new GoogleAuthProvider();
