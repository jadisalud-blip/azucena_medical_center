// auth.js
import { auth, googleProvider } from './firebase-config.js';
import { signInWithPopup, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Login con Google
const googleBtn = document.getElementById('googleLogin');
googleBtn.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Usuario logueado con Google:", result.user);
        window.location.href = "admin.html"; // Al entrar, vamos al Dashboard
    } catch (error) {
        alert("Error al ingresar con Google: " + error.message);
    }
});

// Login Tradicional
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "admin.html";
    } catch (error) {
        alert("Error: Usuario o contraseña incorrectos");
    }
});
