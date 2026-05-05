import { db } from './firebase-config.js'; 
import { collection, addDoc, doc, setDoc, serverTimestamp, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- REFERENCIAS ---
const btnPub = document.getElementById('btnGuardarPub');
const btnServ = document.getElementById('btnGuardarServicio');
const btnCont = document.getElementById('btnGuardarContacto');
const btnExtra = document.getElementById('btnGuardarExtra'); // Nuevo botón

// --- 1. GESTIÓN DE BANNERS PRINCIPALES (SLIDER HERO) ---
btnPub.addEventListener('click', async () => {
    const titulo = document.getElementById('pubTitulo').value;
    const imagen = document.getElementById('pubLinkGithub').value;
    const estilo = document.getElementById('pubEstilo').value;

    if(!titulo || !imagen) return alert("Pana, el título y el link de GitHub son obligatorios.");

    try {
        await addDoc(collection(db, "publicidad"), {
            titulo, imagen, estilo, fecha: serverTimestamp()
        });
        alert("✅ Banner añadido al Slider Principal.");
        document.getElementById('pubTitulo').value = "";
        document.getElementById('pubLinkGithub').value = "";
    } catch (e) { alert("Error: " + e.message); }
});

// --- 2. GESTIÓN DE SERVICIOS ---
btnServ.addEventListener('click', async () => {
    const nombre = document.getElementById('servNombre').value;
    const desc = document.getElementById('servDesc').value;
    const icono = document.getElementById('servIcono').value;

    if(!nombre || !desc) return alert("Llena el nombre y la descripción.");

    try {
        await addDoc(collection(db, "servicios"), {
            nombre, desc, icono: icono || '🩺', fecha: serverTimestamp()
        });
        alert("✅ Servicio publicado.");
        document.getElementById('servNombre').value = "";
        document.getElementById('servDesc').value = "";
    } catch (e) { alert("Error: " + e.message); }
});

// --- 3. REDES, CONTACTO Y UBICACIÓN ---
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
        await setDoc(doc(db, "configuracion", "contacto"), datos);
        alert("✅ Datos de contacto actualizados.");
    } catch (e) { alert("Error: " + e.message); }
});

// --- 4. NUEVA SECCIÓN: PUBLICIDAD EXTRA (IMÁGENES SECUNDARIAS) ---
btnExtra.addEventListener('click', async () => {
    const img = document.getElementById('extraImg').value;
    const link = document.getElementById('extraLink').value;

    if(!img) return alert("Pega al menos el link de la imagen.");

    try {
        await addDoc(collection(db, "publicidad_extra"), {
            imagen: img,
            enlace: link || "#",
            fecha: serverTimestamp()
        });
        alert("✅ Publicidad extra añadida.");
        document.getElementById('extraImg').value = "";
    } catch (e) { alert("Error: " + e.message); }
});
