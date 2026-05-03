// public/js/admin_logic.js
import { db } from './firebase-config.js';
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    setDoc,
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const storage = getStorage();

// --- FUNCIÓN GENÉRICA PARA SUBIR IMÁGENES ---
async function subirImagen(archivo, carpeta) {
    if (!archivo) return null;
    try {
        const nombreUnico = `${Date.now()}_${archivo.name}`;
        const storageRef = ref(storage, `${carpeta}/${nombreUnico}`);
        await uploadBytes(storageRef, archivo);
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error("Error al subir imagen:", error);
        return null;
    }
}

// --- 1. GESTIÓN DE SERVICIOS (CON FOTO) ---
const btnServicio = document.getElementById('btnGuardarServicio');
if (btnServicio) {
    btnServicio.addEventListener('click', async () => {
        const nombre = document.getElementById('servNombre').value;
        const desc = document.getElementById('servDesc').value;
        const file = document.getElementById('servFile').files[0];

        if (!nombre || !desc || !file) {
            return alert("Por favor, completa el nombre, la descripción y selecciona una imagen.");
        }

        btnServicio.innerText = "Subiendo...";
        btnServicio.disabled = true;

        const urlImagen = await subirImagen(file, 'servicios');

        try {
            await addDoc(collection(db, "servicios"), {
                nombre,
                desc,
                imagen: urlImagen,
                fechaCreacion: serverTimestamp()
            });
            alert("✅ Servicio guardado con éxito.");
            document.getElementById('servNombre').value = "";
            document.getElementById('servDesc').value = "";
            document.getElementById('servFile').value = "";
        } catch (e) { console.error(e); }
        
        btnServicio.innerText = "Guardar Servicio";
        btnServicio.disabled = false;
    });
}

// --- 2. GESTIÓN DE PUBLICIDAD (BANNERS) ---
const btnPub = document.getElementById('btnGuardarPub');
if (btnPub) {
    btnPub.addEventListener('click', async () => {
        const titulo = document.getElementById('pubTitulo').value;
        const file = document.getElementById('pubFile').files[0];
        const estilo = document.getElementById('pubEstilo').value;

        if (!titulo || !file) return alert("Título e imagen son obligatorios.");

        btnPub.innerText = "Publicando...";
        const urlBanner = await subirImagen(file, 'banners');

        try {
            await addDoc(collection(db, "publicidad"), {
                titulo,
                imagen: urlBanner,
                estilo,
                fecha: serverTimestamp()
            });
            alert("🚀 Banner publicado en la web.");
        } catch (e) { console.error(e); }
        btnPub.innerText = "Subir a la Web";
    });
}

// --- 3. GESTIÓN DE CONTACTO Y REDES ---
const btnContacto = document.getElementById('btnGuardarContacto');
if (btnContacto) {
    btnContacto.addEventListener('click', async () => {
        const info = {
            direccion: document.getElementById('confDireccion').value,
            whatsapp: document.getElementById('confWhatsapp').value,
            facebook: document.getElementById('confFacebook').value,
            instagram: document.getElementById('confInstagram').value
        };

        try {
            await setDoc(doc(db, "configuracion", "contacto"), info);
            alert("📱 Datos de contacto actualizados correctamente.");
        } catch (e) {
            console.error(e);
            alert("Error al actualizar contacto.");
        }
    });
}

// --- 4. CARGA DE TABLA DE SERVICIOS (TIEMPO REAL) ---
const listaServicios = document.getElementById('listaServicios');
if (listaServicios) {
    const q = query(collection(db, "servicios"), orderBy("fechaCreacion", "desc"));
    onSnapshot(q, (snapshot) => {
        listaServicios.innerHTML = "";
        document.getElementById('statServicios').innerText = snapshot.size;
        snapshot.forEach((docSnap) => {
            const s = docSnap.data();
            listaServicios.innerHTML += `
                <tr>
                    <td><img src="${s.imagen}" width="50" style="border-radius:5px"></td>
                    <td><strong>${s.nombre}</strong></td>
                    <td>${s.desc}</td>
                    <td><button class="btn-delete" onclick="eliminarDoc('servicios','${docSnap.id}')">Eliminar</button></td>
                </tr>
            `;
        });
    });
}

// Borrado global
window.eliminarDoc = async (coleccion, id) => {
    if (confirm("¿Eliminar este registro?")) {
        await deleteDoc(doc(db, coleccion, id));
    }
};
