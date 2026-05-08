import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const sincronizarIndex = async () => {
    try {
        console.log("Conectando con la BD...");
        const docRef = doc(db, "publicidad", "configuracion_general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Datos cargados:", data);

            // 1. NOMBRE DEL CENTRO
            const nombreBD = data.nombre_centro || (data.encabezado && data.encabezado.nombre);
            if (nombreBD) {
                document.title = nombreBD;
                document.getElementById('view_brand_name').innerText = nombreBD;
                document.getElementById('view_nombre_main').innerText = nombreBD;
                document.getElementById('footer_name').innerText = nombreBD;
            }

            // --- 2. LOGO COMO FONDO TOTAL (Hero Image) ---
            const urlLogo = data.logo || (data.cuerpo && data.cuerpo.logo);
            const headerHero = document.getElementById('view_header_hero');
            
            if (headerHero && urlLogo) {
                // Aplicamos la imagen como fondo usando estilos en línea
                headerHero.style.backgroundImage = `url('${urlLogo}')`;
                
                // Aseguramos que el texto sea blanco para que contraste
                document.getElementById('view_nombre_main').style.color = "white";
                document.getElementById('view_eslogan').style.color = "rgba(255,255,255,0.9)";
            }

            // 3. ESLOGAN
            const esloganBD = data.eslogan || (data.cuerpo && data.cuerpo.eslogan);
            if (esloganBD) {
                document.getElementById('view_eslogan').innerText = esloganBD;
            }

            // 4. SERVICIOS DINÁMICOS
            const servicios = data.servicios_lista || (data.cuerpo && data.cuerpo.servicios_lista);
            const grid = document.getElementById('view_servicios_grid');
            if (grid && servicios && Array.isArray(servicios)) {
                grid.innerHTML = servicios.map(s => `
                    <div class="card">
                        <img src="${s.img || 'https://via.placeholder.com/300'}" alt="${s.nombre}">
                        <div class="card-body">
                            <h3>${s.nombre || 'Servicio'}</h3>
                            <p>${s.texto || ''}</p>
                        </div>
                    </div>
                `).join('');
            }

            // 5. WHATSAPP
            const telefono = data.f_wa || (data.contacto && data.contacto.whatsapp);
            if (telefono) {
                document.getElementById('view_btn_wa').href = `https://wa.me/${telefono}`;
            }

        } else {
            console.error("No se encontró el documento 'configuracion_general'");
        }
    } catch (error) {
        console.error("Error crítico en el index:", error);
    }
};

window.addEventListener('DOMContentLoaded', sincronizarIndex);
