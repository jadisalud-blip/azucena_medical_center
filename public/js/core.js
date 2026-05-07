import { db } from './firebase-config.js'; 
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Función para capturar los datos de la interfaz de administración
 * y sincronizarlos con la base de datos jadi-salud.
 */
export const actualizarDatosPublicitarios = async () => {
    const btn = document.getElementById('main_save_btn');
    btn.innerText = "⏳ SINCRONIZANDO...";
    btn.disabled = true;

    try {
        // 1. Recolección de datos dinámicos (Listas)
        const menu = Array.from(document.querySelectorAll('.m_item_val')).map(el => el.value);
        const servicios = Array.from(document.querySelectorAll('#cont_servicios .fila-dinamica')).map(f => ({
            nombre: f.querySelector('.s_nom').value,
            texto: f.querySelector('.s_txt').value,
            img: f.querySelector('.s_img').value
        }));
        const videos = Array.from(document.querySelectorAll('.v_link_val')).map(el => el.value);

        // 2. Estructura de guardado profesional
        // Guardamos todo en un solo documento para optimizar lecturas
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
            metadatos: {
                ultima_modificacion: serverTimestamp(),
                autor: "Admin JADI"
            }
        });

        alert("✅ BASE DE DATOS ACTUALIZADA EXITOSAMENTE");

    } catch (error) {
        console.error("Error en core.js:", error);
        alert("❌ ERROR AL ACTUALIZAR: " + error.message);
    } finally {
        btn.innerText = "🚀 Actualizar Web Ahora";
        btn.disabled = false;
    }
};
