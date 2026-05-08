import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const sincronizarTodo = async () => {
    try {
        console.log("Sincronizando con Firebase...");
        const docRef = doc(db, "publicidad", "configuracion_general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Datos recibidos:", data);

            // 1. NOMBRE DEL CENTRO (Desde encabezado.nombre)
            const nombreCentro = data.encabezado?.nombre || "JADI SALUD";
            document.title = nombreCentro;
            document.getElementById('view_brand_name').innerText = nombreCentro;
            document.getElementById('view_nombre_main').innerText = nombreCentro;

            // 2. IMAGEN DE FONDO TOTAL (Hero Background)
            // Según tu captura, la imagen está en el mapa 0, 1, 2... o un campo 'img'
            // Usaremos el campo 'logo' o la primera imagen que encontremos para el fondo
            const urlFondo = data.logo || data.cuerpo?.logo || (data.servicios_lista && data.servicios_lista[0]?.img);
            
            if (urlFondo) {
                const header = document.getElementById('view_header_hero');
                header.style.backgroundImage = `url('${urlLogo}')`; // Aquí usamos el logo como fondo
                header.style.backgroundSize = 'cover';
                header.style.backgroundPosition = 'center';
            }

            // 3. CARGAR SERVICIOS (El grid que ya tenías)
            const servicios = data.servicios_lista || [];
            const grid = document.getElementById('view_servicios_grid');
            
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

            // 4. WHATSAPP Y OTROS
            if (data.f_wa) {
                document.getElementById('view_btn_wa').href = `https://wa.me/${data.f_wa}`;
            }

        }
    } catch (error) {
        console.error("Error al cargar la publicidad:", error);
    }
};

window.addEventListener('DOMContentLoaded', sincronizarTodo);
