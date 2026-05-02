import { auth, db, googleProvider } from './firebase-config.js';
import { 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. FUNCIÓN DE REDIRECCIÓN (LA ADUANA)
async function procesarAcceso(user, nombreManual = null) {
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    
    let rolActual = "paciente"; 

    if (userSnap.exists()) {
        rolActual = userSnap.data().rol;
    } else {
        await setDoc(userRef, {
            uid: user.uid,
            nombre: nombreManual || user.displayName || "Usuario Nuevo",
            email: user.email,
            rol: rolActual,
            fechaRegistro: serverTimestamp()
        });
    }

    // Rutas según el rol
    if (rolActual === "admin" || rolActual === "dueño" || rolActual === "programador") {
        window.location.href = "public/admin.html";
    } else {
        window.location.href = "public/paciente.html";
    }
}

// 2. LOGUEO CON GOOGLE
const googleBtn = document.getElementById('googleLogin');
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await procesarAcceso(result.user);
        } catch (error) {
            console.error("Error Google:", error);
        }
    });
}

// 3. LOGIN CON EMAIL/PASSWORD
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        try {
            const result = await signInWithEmailAndPassword(auth, email, pass);
            await procesarAcceso(result.user);
        } catch (error) {
            alert("Usuario o contraseña incorrectos.");
        }
    });
}

// 4. REGISTRO MANUAL DE NUEVOS PACIENTES (CORREGIDO)
const registroForm = document.getElementById('registroForm');
if (registroForm) {
    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Bloqueamos el botón para evitar múltiples clics
        const submitBtn = registroForm.querySelector('button');
        const originalText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = "PROCESANDO...";

        const nombre = document.getElementById('regNombre').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            // Al registrar, pasamos el nombre manual que escribió el paciente
            await procesarAcceso(userCredential.user, nombre);
            
        } catch (error) {
            // Si hay error, reactivamos el botón para que pueda corregir
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;

            if (error.code === 'auth/email-already-in-use') {
                alert("Este correo ya está registrado. Intenta iniciar sesión.");
            } else {
                alert("Error al crear cuenta: " + error.message);
            }
        }
    });
}
