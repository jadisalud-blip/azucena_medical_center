import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// GUARDAR SERVICIO
const btnServicio = document.getElementById('btnGuardarServicio');
if(btnServicio) {
    btnServicio.addEventListener('click', async () => {
        const nombre = document.getElementById('servNombre').value;
        const desc = document.getElementById('servDesc').value;
        const icono = document.getElementById('servIcono').value;

        if(!nombre || !desc) return alert("Llena los campos");

        try {
            await addDoc(collection(db, "servicios"), {
                nombre, desc, icono, fecha: new Date()
            });
            alert("Servicio guardado!");
            document.getElementById('servNombre').value = "";
            document.getElementById('servDesc').value = "";
        } catch (e) { console.error(e); }
    });
}

// LEER SERVICIOS EN TIEMPO REAL
if(document.getElementById('listaServicios')) {
    onSnapshot(collection(db, "servicios"), (snapshot) => {
        const tabla = document.getElementById('listaServicios');
        tabla.innerHTML = "";
        snapshot.forEach((docSnap) => {
            const s = docSnap.data();
            tabla.innerHTML += `
                <tr>
                    <td>${s.icono} <strong>${s.nombre}</strong></td>
                    <td>${s.desc}</td>
                    <td><button onclick="eliminarServicio('${docSnap.id}')" style="color:red; background:none; border:none; cursor:pointer;">Eliminar</button></td>
                </tr>
            `;
        });
    });
}

// Función global para eliminar (necesaria para el onclick del string)
window.eliminarServicio = async (id) => {
    if(confirm("¿Seguro que quieres quitar este servicio?")) {
        await deleteDoc(doc(db, "servicios", id));
    }
}
