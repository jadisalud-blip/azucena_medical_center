import { db } from './firebase-config.js'; 
import { collection, addDoc, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btnPub = document.getElementById('btnGuardarPub');
const btnServ = document.getElementById('btnGuardarServicio');
const btnCont = document.getElementById('btnGuardarContacto');
const btnExtra = document.getElementById('btnGuardarExtra');

// 1. Slider Principal
btnPub.onclick = async () => {
    const titulo = document.getElementById('pubTitulo').value;
    const imagen = document.getElementById('pubLinkGithub').value;
    const estilo = document.getElementById('pubEstilo').value;
    if(!titulo || !imagen) return alert("Completa los campos, pana.");
    await addDoc(collection(db, "publicidad"), { titulo, imagen, estilo, fecha: serverTimestamp() });
    alert("¡Slider actualizado!");
};

// 2. Servicios
btnServ.onclick = async () => {
    const nombre = document.getElementById('servNombre').value;
    const desc = document.getElementById('servDesc').value;
    const icono = document.getElementById('servIcono').value;
    await addDoc(collection(db, "servicios"), { nombre, desc, icono, fecha: serverTimestamp() });
    alert("Servicio publicado.");
};

// 3. Contacto
btnCont.onclick = async () => {
    const datos = {
        whatsapp: document.getElementById('confWhatsapp').value,
        direccion: document.getElementById('confDireccion').value,
        instagram: document.getElementById('confInstagram').value,
        ultimaActualizacion: serverTimestamp()
    };
    await setDoc(doc(db, "configuracion", "contacto"), datos);
    alert("Información de contacto actualizada.");
};

// 4. Publicidad Extra
btnExtra.onclick = async () => {
    const img = document.getElementById('extraImg').value;
    const link = document.getElementById('extraLink').value;
    await addDoc(collection(db, "publicidad_extra"), { imagen: img, enlace: link, fecha: serverTimestamp() });
    alert("Publicidad extra cargada.");
};
