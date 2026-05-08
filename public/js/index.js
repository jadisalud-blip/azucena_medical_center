import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const cargarWeb = async () => {
    try {
        console.log("Sincronizando JADI-SALUD...");
        const docRef = doc(db, "publicidad", "configuracion_general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // 1. Título de la pestaña
            if (data.nombre_centro) document.title = data.nombre_centro;

            // 2. LOGO CENTRAL (Reemplaza el texto de carga)
            const contenedorLogo = document.getElementById('view_logo_central');
            if (contenedorLogo && data.servicios_lista) {
                // Buscamos si guardaste el logo en el campo de 'cuerpo' o similar
                const urlLogo = data.cuerpo_logo || data.logo || ""; 
                if (urlLogo) {
                    contenedorLogo.innerHTML = `<img src="${urlLogo}" alt="Logo JADI SALUD" style="max-width:300px; height:auto; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1));">`;
                }
            }

            // 3. Eslogan y Nombre
            if (data.eslogan) document.getElementById('view_eslogan').innerText = data.eslogan;
            if (data.nombre_centro) document.getElementById('view_nombre_main').innerText = data.nombre_centro;

            // 4. Servicios Dinámicos
            const grid = document.getElementById('view_servicios_grid');
            if (grid && data.servicios_lista) {
                grid.innerHTML = data.servicios_lista.map(s => `
                    <div class="card-servicio">
                        <img src="${s.img}" alt="${s.nombre}">
                        <div class="card-info">
                            <h3>${s.nombre}</h3>
                            <p>${s.texto}</p>
                        </div>
                    </div>
                `).join('');
            }

            // 5. WhatsApp
            if (data.f_wa || data.contacto?.whatsapp) {
                const wa = data.f_wa || data.contacto.whatsapp;
                document.getElementById('view_btn_wa').href = `https://wa.me/${wa}`;
            }

            console.log("✅ Datos cargados correctamente.");
        }
    } catch (error) {
        console.error("Error en index.js:", error);
    }
};

window.addEventListener('DOMContentLoaded', cargarWeb);
