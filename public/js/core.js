// IMPORTANTE: Agregamos la extensión .js al final de la ruta del archivo local
import { db } from './firebase-config.js'; 
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const actualizarDatosPublicitarios = async () => {
    const btn = document.getElementById('main_save_btn');
    const originalText = btn.innerText;
    btn.innerText = "⏳ CONECTANDO...";
    btn.disabled = true;

    try {
        console.log("Intentando guardar en JADI-SALUD...");
        
        const menu = Array.from(document.querySelectorAll('.m_item_val')).map(el => el.value);
        const servicios = Array.from(document.querySelectorAll('#cont_servicios .fila-dinamica')).map(f => ({
            nombre: f.querySelector('.s_nom').value,
            texto: f.querySelector('.s_txt').value,
            img: f.querySelector('.s_img').value
        }));
        const videos = Array.from(document.querySelectorAll('.v_link_val')).map(el => el.value);

        await setDoc(doc(db, "publicidad", "configuracion_general"), {
            encabezado: {
                nombre: document.getElementById('h_nombre').value,
                servicios_menu: menu
            },
            cuerpo: {
                eslogan: document.getElementById('c_eslogan').value,
                logo: document.getElementById('c_logo').value,
                servicios_lista: servicios,
                videos: videos,
                latitud: document.getElementById('loc_lat').value,
                longitud: document.getElementById('loc_lng').value
            },
            contacto: {
                whatsapp: document.getElementById('f_wa').value,
                redes: {
                    tiktok: document.getElementById('f_tk').value,
                    instagram: document.getElementById('f_ig').value
                }
            },
            ultima_actualizacion: serverTimestamp()
        });

        alert("✅ ¡ÉXITO! Base de datos actualizada.");
    } catch (error) {
        console.error("Error crítico:", error);
        alert("❌ ERROR: " + error.message);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
};
