import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const sincronizarWeb = async () => {
    try {
        const docRef = doc(db, "publicidad", "configuracion_general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Datos de Azucena cargados:", data);

            // 1. NOMBRE (Dentro de encabezado -> nombre)
            if (data.encabezado && data.encabezado.nombre) {
                const nombre = data.encabezado.nombre;
                document.title = nombre;
                document.getElementById('view_brand_name').innerText = nombre;
                document.getElementById('view_nombre_main').innerText = nombre;
            }

            // 2. LOGO Y FONDO (Dentro de cuerpo -> logo)
            if (data.cuerpo && data.cuerpo.logo) {
                const urlLogo = data.cuerpo.logo;
                const header = document.getElementById('view_header_hero');
                // Aplicamos la imagen de la BD como fondo total
                header.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${urlLogo}')`;
            }

            // 3. ESLOGAN (Dentro de cuerpo -> eslogan)
            if (data.cuerpo && data.cuerpo.eslogan) {
                document.getElementById('view_eslogan').innerText = data.cuerpo.eslogan;
            }

            // 4. SERVICIOS (Dentro de cuerpo -> servicios_lista)
            const grid = document.getElementById('view_servicios_grid');
            if (grid && data.cuerpo && data.cuerpo.servicios_lista) {
                grid.innerHTML = data.cuerpo.servicios_lista.map(s => `
                    <div class="card">
                        <img src="${s.img}" alt="${s.nombre}">
                        <div class="card-body">
                            <h3>${s.nombre}</h3>
                            <p>${s.texto}</p>
                        </div>
                    </div>
                `).join('');
            }

            // 5. WHATSAPP (Está en la raíz del documento según tu captura)
            if (data.whatsapp) {
                // Limpiamos el número por si tiene espacios
                const num = data.whatsapp.replace(/\s+/g, '');
                document.getElementById('view_btn_wa').href = `https://wa.me/${num}`;
            }

        }
    } catch (e) {
        console.error("Error sincronizando:", e);
    }
};

window.addEventListener('DOMContentLoaded', sincronizarWeb);
