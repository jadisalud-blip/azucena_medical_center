import { db } from './firebase-config.js'; 
import { collection, addDoc, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("Cerebro JADI conectado: Modo Blanco y Celesto Neón");

// --- REFERENCIAS ---
const btnPub = document.getElementById('btnGuardarPub');
const btnServ = document.getElementById('btnGuardarServicio');
const btnCont = document.getElementById('btnGuardarContacto');
const btnExtra = document.getElementById('btnGuardarExtra');

// 1. GESTIÓN DEL SLIDER (BANNERS)
if(btnPub) {
    btnPub.onclick = async () => {
        const titulo = document.getElementById('pubTitulo').value;
        const imagen = document.getElementById('pubLinkGithub').value;
        const estilo = document.getElementById('pubEstilo').value;

        if(!titulo || !imagen) return alert("Pana, el título y la imagen son obligatorios.");

        try {
            await addDoc(collection(db, "publicidad"), { 
                titulo, 
                imagen, 
                estilo, 
                fecha: serverTimestamp() 
            });
            alert("✅ Slider principal actualizado.");
            document.getElementById('pubTitulo').value = "";
            document.getElementById('pubLinkGithub').value = "";
        } catch (e) {
            console.error("Error slider:", e);
            alert("Error al guardar: " + e.message);
        }
    };
}

// 2. GESTIÓN DE SERVICIOS (Medicina, Odontología, etc.)
if(btnServ) {
    btnServ.onclick = async () => {
        const nombre = document.getElementById('servNombre').value;
        const desc = document.getElementById('servDesc').value;
        const icono = document.getElementById('servIcono').value;

        if(!nombre) return alert("Ponle nombre a la especialidad.");

        try {
            await addDoc(collection(db, "servicios"), { 
                nombre, 
                desc, 
                icono: icono || '🩺', 
                fecha: serverTimestamp() 
            });
            alert("✅ Especialidad publicada correctamente.");
            document.getElementById('servNombre').value = "";
            document.getElementById('servDesc').value = "";
        } catch (e) { alert("Error servicios: " + e.message); }
    };
}

// 3. GESTIÓN DE CONTACTO, GPS Y REDES (DOCUMENTO ÚNICO)
if(btnCont) {
    btnCont.onclick = async () => {
        // Recopilamos todos los datos en un solo objeto
        const datos = {
            whatsapp: document.getElementById('confWhatsapp').value,
            telefono: document.getElementById('confTelefono').value,
            direccion: document.getElementById('confDireccion').value,
            facebook: document.getElementById('confFacebook').value,
            instagram: document.getElementById('confInstagram').value,
            tiktok: document.getElementById('confTiktok').value,
            mapa: document.getElementById('confMapaIframe').value,
            linkGps: document.getElementById('confLinkGps').value,
            ultimaActualizacion: serverTimestamp() // Usamos serverTimestamp para mayor precisión
        };

        try {
            await setDoc(doc(db, "configuracion", "contacto"), datos);
            alert("🚀 ¡Web de Azucena sincronizada con éxito!");
        } catch (e) {
            console.error("Error contacto:", e);
            alert("Error al actualizar contacto: " + e.message);
        }
    };
}

// 4. PUBLICIDAD EXTRA / PROMOCIONES
if(btnExtra) {
    btnExtra.onclick = async () => {
        const img = document.getElementById('extraImg').value;
        const link = document.getElementById('extraLink').value;

        if(!img) return alert("Pega el link de la imagen promocional.");

        try {
            await addDoc(collection(db, "publicidad_extra"), { 
                imagen: img, 
                enlace: link || "#", 
                fecha: serverTimestamp() 
            });
            alert("✅ Publicidad extra añadida.");
            document.getElementById('extraImg').value = "";
        } catch (e) { alert("Error extra: " + e.message); }
    };
}
