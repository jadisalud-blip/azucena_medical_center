import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar la publicidad
async function cargarPublicidad() {
    const tituloEl = document.getElementById('pub-titulo');
    const subtituloEl = document.getElementById('pub-subtitulo');
    const promoContenedor = document.getElementById('contenedor-promos');

    try {
        // 1. Cargar Textos Principales
        const docRef = doc(db, "ajustes", "publicidad");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            tituloEl.innerText = data.titulo || "Cuidamos tu salud";
            subtituloEl.innerText = data.subtitulo || "Tecnología médica avanzada.";
        }

        // 2. Cargar Tarjetas de Promociones
        const querySnapshot = await getDocs(collection(db, "promociones"));
        if (!querySnapshot.empty) {
            promoContenedor.innerHTML = ''; // Limpiar cargando
            querySnapshot.forEach((doc) => {
                const promo = doc.data();
                promoContenedor.innerHTML += `
                    <div class="bg-blue-50 p-8 rounded-3xl border border-blue-100 hover:scale-105 transition">
                        <span class="text-3xl">${promo.icono || '🏥'}</span>
                        <h3 class="tech-font font-bold text-blue-900 mt-4">${promo.titulo}</h3>
                        <p class="text-sm text-gray-600 mt-2">${promo.descripcion}</p>
                        <div class="mt-4 text-blue-600 font-bold">$${promo.precio}</div>
                    </div>
                `;
            });
        }
    } catch (e) {
        console.error("Error cargando publicidad:", e);
    }
}

cargarPublicidad();
