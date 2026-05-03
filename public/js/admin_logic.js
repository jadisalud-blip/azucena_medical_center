// public/js/admin_logic.js
import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==========================================
// 1. GESTIÓN DE SERVICIOS MÉDICOS
// ==========================================

const btnServicio = document.getElementById('btnGuardarServicio');
if (btnServicio) {
    btnServicio.addEventListener('click', async () => {
        const nombre = document.getElementById('servNombre').value;
        const icono = document.getElementById('servIcono').value;
        const desc = document.getElementById('servDesc').value;

        if (!nombre || !desc) {
            return alert("Por favor, completa el nombre y la descripción del servicio.");
        }

        try {
            await addDoc(collection(db, "servicios"), {
                nombre,
                icono: icono || "🩺",
                desc,
                fechaCreacion: serverTimestamp()
            });
            alert("✅ Servicio guardado correctamente.");
            // Limpiar campos
            document.getElementById('servNombre').value = "";
            document.getElementById('servIcono').value = "";
            document.getElementById('servDesc').value = "";
        } catch (error) {
            console.error("Error al guardar servicio:", error);
            alert("Error al guardar en la base de datos.");
        }
    });
}

// Escuchar servicios en tiempo real para la tabla del admin
const listaServicios = document.getElementById('listaServicios');
if (listaServicios) {
    const qServicios = query(collection(db, "servicios"), orderBy("fechaCreacion", "desc"));
    onSnapshot(qServicios, (snapshot) => {
        listaServicios.innerHTML = "";
        document.getElementById('statServicios').innerText = snapshot.size; // Actualiza contador dashboard
        
        snapshot.forEach((docSnap) => {
            const s = docSnap.data();
            const id = docSnap.id;
            listaServicios.innerHTML += `
                <tr>
                    <td><span style="font-size:1.5rem;">${s.icono}</span></td>
                    <td><strong>${s.nombre}</strong></td>
                    <td>${s.desc}</td>
                    <td>
                        <button class="btn-delete" onclick="eliminarDocumento('servicios', '${id}')">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });
    });
}

// ==========================================
// 2. GESTIÓN DE PUBLICIDAD (BANNERS WEB)
// ==========================================

const btnPub = document.getElementById('btnGuardarPub');
if (btnPub) {
    btnPub.addEventListener('click', async () => {
        const titulo = document.getElementById('pubTitulo').value;
        const imagen = document.getElementById('pubLink').value;
        const estilo = document.getElementById('pubEstilo').value;

        if (!titulo || !imagen) {
            return alert("Necesitas un título y un link de imagen para la publicidad.");
        }

        try {
            await addDoc(collection(db, "publicidad"), {
                titulo,
                imagen,
                estilo,
                fechaPublicacion: serverTimestamp()
            });
            alert("🚀 Publicidad lanzada al Index con éxito.");
            document.getElementById('pubTitulo').value = "";
            document.getElementById('pubLink').value = "";
        } catch (error) {
            console.error("Error al publicar:", error);
        }
    });
}

// ==========================================
// 3. FUNCIONES GLOBALES (ELIMINACIÓN)
// ==========================================

// La exponemos a window para que el onclick del HTML pueda verla
window.eliminarDocumento = async (coleccion, id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        try {
            await deleteDoc(doc(db, coleccion, id));
            alert("Registro eliminado.");
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
};

console.log("Cerebro Admin Logic cargado y listo, bro.");
