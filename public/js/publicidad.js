import { db } from './firebase-config.js'; // Ajusta la ruta si es necesario
import { collection, addDoc, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- REFERENCIAS ---
const btnPub = document.getElementById('btnGuardarPub');
const btnServ = document.getElementById('btnGuardarServicio');
const btnCont = document.getElementById('btnGuardarContacto');

// --- 1. GESTIÓN DE BANNERS (IMÁGENES GITHUB) ---
btnPub.addEventListener('click', async () => {
    const titulo = document.getElementById('pubTitulo').value;
    const imagen = document.getElementById('pubLinkGithub').value;
    const estilo = document.getElementById('pubEstilo').value;

    if(!titulo || !imagen) return alert("Pana, el título y el link de GitHub son obligatorios.");

    try {
        await addDoc(collection(db, "publicidad"), {
            titulo, imagen, estilo, fecha: serverTimestamp()
        });
        alert("✅ Banner añadido al carrusel del Index.");
        document.getElementById('pubTitulo').value = "";
        document.getElementById('pubLinkGithub').value = "";
    } catch (e) { alert("Error: " + e.message); }
});

// --- 2. GESTIÓN DE SERVICIOS Y PROMOS ---
btnServ.addEventListener('click', async () => {
    const nombre = document.getElementById('servNombre').value;
    const desc = document.getElementById('servDesc').value;
    const icono = document.getElementById('servIcono').value;

    if(!nombre || !desc) return alert("Llena el nombre y la descripción.");

    try {
        await addDoc(collection(db, "servicios"), {
            nombre, desc, icono: icono || '🩺', fecha: serverTimestamp()
        });
        alert("✅ Nuevo servicio/promo publicado.");
        document.getElementById('servNombre').value = "";
        document.getElementById('servDesc').value = "";
    } catch (e) { alert("Error: " + e.message); }
});

// --- 3. REDES, CONTACTO Y UBICACIÓN (DOCUMENTO ÚNICO) ---
btnCont.addEventListener('click', async () => {
    const datos = {
        whatsapp: document.getElementById('confWhatsapp').value,
        facebook: document.getElementById('confFacebook').value,
        instagram: document.getElementById('confInstagram').value,
        direccion: document.getElementById('confDireccion').value,
        mapa: document.getElementById('confMapa').value,
        ultimaActualizacion: serverTimestamp()
    };

    try {
        // Usamos setDoc con un ID fijo 'info_centro' para que siempre se sobrescriba el mismo
        await setDoc(doc(db, "configuracion", "contacto"), datos);
        alert("✅ Información de contacto y redes actualizada.");
    } catch (e) { alert("Error: " + e.message); }
});
