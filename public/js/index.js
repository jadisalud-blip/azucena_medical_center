import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const cargarWeb = async () => {
    try {
        console.log("Sincronizando JADI-SALUD...");
        const docRef = doc(db, "publicidad", "configuracion_general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // 1. Título de pestaña y Nombre del Centro
            if (data.nombre_centro) {
                document.title = data.nombre_centro;
                document.getElementById('view_brand_name').innerText = data.nombre_centro;
            }

            // 2. Logo
            if (data.cuerpo?.logo || data.logo) {
                const logoImg = document.getElementById('view_logo');
                logoImg.src = data.cuerpo?.logo || data.logo;
            }

            // 3. Menú Dinámico
            const menuCont = document.getElementById('view_menu');
            if (menuCont && data.servicios_menu) {
                menuCont.innerHTML = data.servicios_menu
                    .map(item => `<li><a href="#servicios">${item}</a></li>`).join('');
            }

            // 4. Hero Section (Eslogan)
            if (data.eslogan) {
                document.getElementById('view_eslogan').innerText = data.eslogan;
            }

            // 5. Grid de Servicios
            const serviciosCont = document.getElementById('view_servicios_grid');
            if (serviciosCont && data.servicios_lista) {
                serviciosCont.innerHTML = data.servicios_lista.map(s => `
                    <div class="card-servicio">
                        <img src="${s.img}" alt="${s.nombre}">
                        <h3>${s.nombre}</h3>
                        <p>${s.texto}</p>
                    </div>
                `).join('');
            }

            // 6. Contacto
            if (data.contacto?.whatsapp) {
                document.getElementById('view_btn_wa').href = `https://wa.me/${data.contacto.whatsapp}`;
            }

            console.log("✅ Web cargada exitosamente.");
        }
    } catch (error) {
        console.error("Error en el cerebro index.js:", error);
    }
};

window.addEventListener('DOMContentLoaded', cargarWeb);
