// js/auth.js

// Importamos las herramientas desde tu archivo de configuración
import { auth, googleProvider } from './firebase-config.js';
import { 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/**
 * 1. LÓGICA PARA INGRESO CON GOOGLE
 */
const googleBtn = document.getElementById('googleLogin');

if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Si el login es exitoso, Firebase nos devuelve el usuario
            console.log("Usuario detectado:", result.user.displayName);
            
            // Redireccionamos al Dashboard de Administración
            window.location.href = "admin.html";
        } catch (error) {
            console.error("Error en Google Auth:", error);
            alert("No se pudo ingresar con Google. Verifica tu conexión.");
        }
    });
}

/**
 * 2. LÓGICA PARA LOGIN TRADICIONAL (Email/Password)
 */
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Acceso concedido");
            window.location.href = "admin.html";
        } catch (error) {
            console.error("Error de credenciales:", error.code);
            // Mensajes amigables para el usuario
            if (error.code === 'auth/invalid-credential') {
                alert("Usuario o contraseña incorrectos.");
            } else {
                alert("Error al intentar ingresar. Intenta de nuevo.");
            }
        }
    });
}

/**
 * 3. OBSERVADOR DE ESTADO (Opcional pero recomendado)
 * Verifica si el usuario ya está logueado para mandarlo directo al admin
 */
onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = "admin.html";
    }
});
