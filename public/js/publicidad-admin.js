import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Guardar Títulos Principales
document.getElementById('btn-guardar-textos').onclick = async () => {
    const titulo = document.getElementById('input-titulo').value;
    const subtitulo = document.getElementById('input-subtitulo').value;

    try {
        await setDoc(doc(db, "ajustes", "publicidad"), { titulo, subtitulo }, { merge: true });
        alert("¡Web Principal Actualizada!");
    } catch (e) { alert("Error al actualizar"); }
};

// 2. Guardar Nueva Promoción
document.getElementById('btn-agregar-promo').onclick = async () => {
    const promo = {
        titulo: document.getElementById('promo-titulo').value,
        precio: document.getElementById('promo-precio').value,
        icono: document.getElementById('promo-icono').value,
        descripcion: document.getElementById('promo-desc').value
    };

    try {
        await addDoc(collection(db, "promociones"), promo);
        alert("¡Nueva promoción publicada!");
        location.reload(); // Recargar para limpiar
    } catch (e) { alert("Error al publicar"); }
};
