import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const sincronizarPagina = async () => {
    try {
        const docRef = doc(db, "publicidad", "configuracion_generales");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // 1. Encabezados y Menú
            const enc = data.encabezados;
            if (enc) {
                document.getElementById('view_brand_name').innerText = enc.nombre || "AZUCENA";
                document.getElementById('view_nombre_main').innerText = enc.nombre || "AZUCENA";
                
                // Menú de navegación dinámico desde servicio_menú
                const menuCont = document.getElementById('view_menu_links');
                if (menuCont && enc.servicio_menú) {
                    menuCont.innerHTML = enc.servicio_menú.map(item => {
                        const link = item.toLowerCase().trim().replace(/\s+/g, '-');
                        return `<a href="#${link}">${item}</a>`;
                    }).join('');
                }
            }

            // 2. Imagen Principal (Hero) y Eslogan
            if (data.cuerpo) {
                if (data.cuerpo.logo) {
                    const header = document.getElementById('view_header_hero');
                    header.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${data.cuerpo.logo}')`;
                }
                document.getElementById('view_eslogan').innerText = data.cuerpo.eslogan || "";
                
                // 3. Servicios (Restaurado)
                const grid = document.getElementById('view_servicios_grid');
                if (grid && data.cuerpo.servicios_detalle) {
                    grid.innerHTML = data.cuerpo.servicios_detalle.map(s => `
                        <div class="card">
                            <img src="${s.img}" alt="${s.nombre}">
                            <div class="card-body">
                                <h3>${s.nombre}</h3>
                                <p>${s.texto}</p>
                            </div>
                        </div>
                    `).join('');
                }

                // 4. Videos (Sin espacios extra)
                const videoCont = document.getElementById('view_videos_cont');
                if (videoCont && data.cuerpo.videos) {
                    videoCont.innerHTML = data.cuerpo.videos.map(v => {
                        const videoId = v.includes('v=') ? v.split('v=')[1].split('&')[0] : v.split('/').pop();
                        return `<div class="video-item"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
                    }).join('');
                }
            }

            // 5. Redes
            if (data.redes) {
                if (data.redes.whatsapp) document.getElementById('view_btn_wa').href = `https://wa.me/${data.redes.whatsapp}`;
                if (data.redes.tiktok) document.getElementById('view_link_tk').href = data.redes.tiktok;
                if (data.redes.instagram) document.getElementById('view_link_ig').href = data.redes.instagram;
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

window.addEventListener('DOMContentLoaded', sincronizarPagina);
