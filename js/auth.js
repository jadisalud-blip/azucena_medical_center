// js/auth.js
import { auth, db, googleProvider } from './firebase-config.js';
import { signInWithPopup, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Función maestra para guardar o actualizar el usuario en Firestore
async function guardarUsuarioEnBD(user) {
    try {
        // Creamos un documento en la colección 'usuarios' con el ID del usuario
        await setDoc(doc(db, "usuarios", user.uid), {
            uid: user.uid,
            nombre: user.displayName || "Usuario Nuevo",
            email: user.email,
            foto: user.photoURL || "",
            ultimaConexion: serverTimestamp(),
            rol: "admin" // Por defecto como admin para tus pruebas
        }, { merge: true }); // 'merge' evita borrar datos viejos si el usuario ya existe
        console.log("Registro guardado en Firestore");
    } catch (error) {
        console.error("Error al guardar en base de datos:", error);
    }
}

// Botón de Google
const googleBtn = document.getElementById('googleLogin');
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await guardarUsuarioEnBD(result.user); // AQUÍ SE CREA EL DOC EN LA BD
            window.location.href = "admin.html";
        } catch (error) {
            alert("Error con Google: " + error.message);
        }
    });
}

// Formulario Tradicional
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        try {
            const result = await signInWithEmailAndPassword(auth, email, pass);
            await guardarUsuarioEnBD(result.user); // AQUÍ SE CREA EL DOC EN LA BD
            window.location.href = "admin.html";
        } catch (error) {
            alert("Credenciales incorrectas o usuario no registrado.");
        }
    });
}
