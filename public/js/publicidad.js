import { db } from './firebase-config.js'; 
import { collection, addDoc, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Verificación de carga en consola
console.log("🚀 Cerebro JADI-Marketing activado.");

// --- REFERENCIAS DE BOTONES ---
const btnPub = document.getElementById('btnGuardarPub');
const btnServ = document.getElementById('btnGuardarServicio');
const btnCont = document.getElementById('btnGuardarContacto');
const btnExtra = document.getElementById('btnGuardarExtra');

// --- 1. GESTIÓN DE BANNERS (SLIDER) ---
if (btnPub) {
    btnPub.onclick = async () => {
        const titulo = document.getElementById('pubTitulo').value;
        const imagen = document.getElementById('pubLinkGithub').value;
        const estilo = document.getElementById('pubEstilo').value;

        if (!titulo || !imagen) return alert("Pana, el título y el link de imagen son obligatorios.");

        try {
            await addDoc(collection(db, "publicidad"), {
                titulo,
                imagen,
                estilo,
                fecha: serverTimestamp()
            });
            alert("✅ Banner añadido al slider con éxito.");
            document.getElementById('pubTitulo').value = "";
            document.getElementById('pubLinkGithub').value = "";
        } catch (e) {
            alert("Error al guardar banner: " + e.message);
        }
    };
}

// --- 2. GESTIÓN DE ESPECIALIDADES (SERVICIOS) ---
if (btnServ) {
    btnServ.onclick = async () => {
        const nombre = document.getElementById('servNombre').value;
        const desc = document.getElementById('servDesc').value;
        const icono = document.getElementById('servIcono').value;

        if (!nombre) return alert("Debes poner al menos el nombre de la especialidad.");

        try {
            await addDoc(collection(db, "servicios"), {
                nombre,
                desc,
                icono: icono || "fa-solid fa-user-md", // Icono por defecto si está vacío
                fecha: serverTimestamp()
            });
            alert("✅ Nueva especialidad publicada.");
            document.getElementById('servNombre').value = "";
            document.getElementById('servDesc').value = "";
            document.getElementById('servIcono').value = "";
        } catch (e) {
            alert("Error al publicar servicio: " + e.message);
        }
    };
}

// --- 3. CONFIGURACIÓN GLOBAL (CONTACTO, REDES, GPS) ---
if (btnCont) {
    btnCont.onclick = async () => {
        // Recogemos toda la info de contacto en un solo objeto
        const datosContacto = {
            direccion: document.getElementById('confDireccion').value,
            telefono: document.getElementById('confTelefono').value,
            whatsapp: document.getElementById('confWhatsapp').value,
            facebook: document.getElementById('confFacebook').value,
            instagram: document.getElementById('confInstagram').value,
            tiktok: document.getElementById('confTiktok').value,
            mapa: document.getElementById('confMapaIframe').value,  // El 'src' del iframe de Google Maps
            linkGps: document.getElementById('confLinkGps').value,  // El link directo 'Cómo llegar'
            ultimaActualizacion: serverTimestamp()
        };

        try {
            // Guardamos todo en un documento único llamado 'contacto' dentro de 'configuracion'
            await setDoc(doc(db, "configuracion", "contacto"), datosContacto);
            alert("🚀 ¡Web Azucena sincronizada y actualizada!");
        } catch (e) {
            alert("Error al sincronizar datos: " + e.message);
        }
    };
}

// --- 4. PUBLICIDAD EXTRA (PROMOCIONES TEMPORALES) ---
if (btnExtra) {
    btnExtra.onclick = async () => {
        const imgExtra = document.getElementById('extraImg').value;
        const linkExtra = document.getElementById('extraLink').value;

        if (!imgExtra) return alert("Pega el link de la imagen para la promoción.");

        try {
            await addDoc(collection(db, "publicidad_extra"), {
                imagen: imgExtra,
                enlace: linkExtra || "#",
                fecha: serverTimestamp()
            });
            alert("✅ Promoción extra publicada.");
            document.getElementById('extraImg').value = "";
            document.getElementById('extraLink').value = "";
        } catch (e) {
            alert("Error al subir promo: " + e.message);
        }
    };
}
