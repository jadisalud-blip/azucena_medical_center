import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const cargarWeb = async () => {
    try {
        console.log("Sincronizando con JADI-SALUD...");
        const docRef = doc(db, "publicidad", "configuracion_general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // --- ESTA ES LA PARTE QUE BUSCABAS ---
            // Accedemos a la colección 'publicidad', documento 'configuracion_general'
            // y buscamos el campo 'nombre' dentro del mapa 'encabezado'
            if (data.encabezado && data.encabezado.nombre) {
                const nuevoNombre = data.encabezado.nombre;
                
                // Cambia el nombre en la pestaña del navegador
                document.title = nuevoNombre;
                
                // Cambia el nombre en el Navbar (si existe el ID)
                const navName = document.getElementById('view_brand_name');
                if (navName) navName.innerText = nuevoNombre;

                // Cambia el nombre gigante del medio (Hero)
                const mainTitle = document.getElementById('view_nombre_main');
                if (mainTitle) mainTitle.innerText = nuevoNombre;
            }

            // Inyectar el Logo (buscando en data.cuerpo.logo)
            const contenedorLogo = document.getElementById('view_logo_central');
            if (contenedorLogo && data.cuerpo && data.cuerpo.logo) {
                contenedorLogo.innerHTML = `<img src="${data.cuerpo.logo}" alt="Logo Dinámico" style="max-width:280px; height:auto;">`;
            }

            // Cargar eslogan
            if (data.cuerpo && data.cuerpo.eslogan) {
                document.getElementById('view_eslogan').innerText = data.cuerpo.eslogan;
            }

            // Cargar servicios
            const grid = document.getElementById('view_servicios_grid');
            if (grid && data.cuerpo && data.cuerpo.servicios_lista) {
                grid.innerHTML = data.cuerpo.servicios_lista.map(s => `
                    <div class="card-servicio">
                        <img src="${s.img}" alt="${s.nombre}">
                        <div class="card-info">
                            <h3>${s.nombre}</h3>
                            <p>${s.texto}</p>
                        </div>
                    </div>
                `).join('');
            }

            console.log("✅ Sincronización exitosa con la BD.");
        }
    } catch (error) {
        console.error("Error al sincronizar:", error);
    }
};

window.addEventListener('DOMContentLoaded', cargarWeb);
