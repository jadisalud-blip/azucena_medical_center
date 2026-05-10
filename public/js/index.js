import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const sincronizarPagina = async () => {
    try {
        // Apuntamos al documento 'configuracion_general' dentro de 'publicidad'
        const docRef = doc(db, "publicidad", "configuracion_general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Sincronización total activa:", data);

            // 1. ENCABEZADO (Navbar y Títulos)
            // Extraído de h_nombre en tu panel
            const nombreCentro = data.encabezado?.nombre || "AZUCENA MEDICAL";
            document.title = nombreCentro;
            document.getElementById('view_brand_name').innerText = nombreCentro;
            document.getElementById('view_nombre_main').innerText = nombreCentro;
// 1. Buscamos el lugar en el HTML donde vamos a poner los links
const menuCont = document.getElementById('view_menu_links');

// 2. Extraemos el array: data (documento) -> encabesado (objeto) -> servicios_menu (array)
// Usamos el nombre exacto que me pasaste (encabesado / servicios_menu)
const listaServicios = data.encabesado?.servicios_menu || [];

// 3. Verificamos que existan datos antes de intentar pintar nada
if (menuCont && listaServicios.length > 0) {
    
    // 4. Transformamos el array de texto en etiquetas <a> (enlaces)
    menuCont.innerHTML = listaServicios.map(item => {
        
        // Limpiamos el texto para crear un ID de salto (ej: "Nuestros Servicios" -> "nuestros-servicios")
        const linkId = item.toLowerCase().trim().replace(/\s+/g, '-');
        
        // Retornamos el HTML del enlace
        return `<a href="#${linkId}">${item}</a>`;
        
    }).join(''); // El .join('') une todos los enlaces en una sola cadena de texto
}

            // 2. FONDO TOTAL (Hero Background)
            // Extraído de c_logo en tu panel
            const urlFondo = data.cuerpo?.logo;
            const header = document.getElementById('view_header_hero');
            if (header && urlFondo) {
                header.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${urlFondo}')`;
                header.style.backgroundSize = 'cover';
                header.style.backgroundPosition = 'center';
            }

            // 3. ESLOGAN
            // Extraído de c_eslogan en tu panel
            if (data.cuerpo?.eslogan) {
                document.getElementById('view_eslogan').innerText = data.cuerpo.eslogan;
            }

            // 4. DETALLE DE SERVICIOS (Cards dinámicas)
            // Extraído de cont_servicios en tu panel
            const grid = document.getElementById('view_servicios_grid');
            const servicios = data.cuerpo?.servicios_detalle || [];
            if (grid && servicios.length > 0) {
                grid.innerHTML = servicios.map(s => `
                    <div class="card">
                        <img src="${s.img}" alt="${s.nombre}">
                        <div class="card-body">
                            <h3>${s.nombre}</h3>
                            <p>${s.texto}</p>
                        </div>
                    </div>
                `).join('');
            }

            // 5. VIDEOS DE YOUTUBE
            // Extraído de cont_videos en tu panel
            const videoCont = document.getElementById('view_videos_cont');
            const videos = data.cuerpo?.videos || [];
            if (videoCont && videos.length > 0) {
                videoCont.innerHTML = videos.map(v => {
                    // Limpieza simple del link para que sea embed
                    const videoId = v.includes('v=') ? v.split('v=')[1].split('&')[0] : v.split('/').pop();
                    return `
                        <div class="video-item">
                            <iframe width="100%" height="250" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                        </div>`;
                }).join('');
            }

            // 6. REDES Y WHATSAPP (Pie de página)
            // Extraído de f_wa, f_tk, f_ig en tu panel
            if (data.redes?.whatsapp) {
                document.getElementById('view_btn_wa').href = `https://wa.me/${data.redes.whatsapp}`;
            }
            if (data.redes?.tiktok) {
                document.getElementById('view_link_tk').href = data.redes.tiktok;
            }
            if (data.redes?.instagram) {
                document.getElementById('view_link_ig').href = data.redes.instagram;
            }

        } else {
            console.warn("No se encontró el documento publicitario. Verifica el guardado.");
        }
    } catch (error) {
        console.error("Error crítico en sincronización:", error);
    }
};

window.addEventListener('DOMContentLoaded', sincronizarPagina);
