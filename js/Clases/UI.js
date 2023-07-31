"use strict";
import { editarCita, eliminarCita, DB } from "../funciones.js";
import { contenedorCitas, heading } from "../selectores.js";

export class UI {
  constructor({ citas }) {
    this.textoHeading(citas);
  }

  imprimirAlerta(mensaje, tipo) {
    //crear el div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

    //Agregar clase ne base al tipo de error
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    //Mensaje de error
    divMensaje.textContent = mensaje;

    //Agregar al DOM
    document
      .querySelector("#contenido")
      .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

    //Quitar la alerta
    setTimeout(() => {
      divMensaje.remove();
    }, 5000);
  }

  imprimirCitas() {
    //llama el método de limpiar html antes de hacer la iteración
    this.limpiarHTML();

    this.textoHeading(citas);

    //leer el contenido de la base de datos
    const objectStore = DB.transaction("citas").objectStore("citas");

    const fnTextoHeading = this.textoHeading;

    const total = objectStore.count();
    total.onsuccess = function () {
      fnTextoHeading(total.result);
    };

    objectStore.openCursor().onsuccess = function (e) {
      const cursor = e.target.result;

      if (cursor) {
        const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
          cursor.value;

        const divCita = document.createElement("div");
        divCita.classList.add("cita", "p-3");
        divCita.dataset.id = id;

        //Scripting de los elementos de la cita
        const mascotaParrafo = document.createElement("h2");
        mascotaParrafo.classList.add("card-title", "font-weight-bolder");
        mascotaParrafo.textContent = mascota;

        const propietarioParrafo = document.createElement("p");
        propietarioParrafo.innerHTML = `
      <span class='font-weight-bolder'>Propietario: </span> ${propietario}`;

        const telefonoParrafo = document.createElement("p");
        telefonoParrafo.innerHTML = `
      <span class='font-weight-bolder'>Teléfono: </span> ${telefono}`;

        const fechaParrafo = document.createElement("p");
        fechaParrafo.innerHTML = `
      <span class='font-weight-bolder'>Fecha: </span> ${fecha}`;

        const horaParrafo = document.createElement("p");
        horaParrafo.innerHTML = `
      <span class='font-weight-bolder'>Hora: </span> ${hora}`;

        const sintomasParrafo = document.createElement("p");
        sintomasParrafo.innerHTML = `
      <span class='font-weight-bolder'>Síntomas: </span> ${sintomas}`;

        //boton para eliminar citas

        const btnElminar = document.createElement("button");
        btnElminar.classList.add("btn", "btn-danger", "mr-2");
        btnElminar.innerHTML = `Eliminar <svg
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
  ></path>
</svg>`;

        btnElminar.onclick = () => eliminarCita(id);

        //añade boton para editar

        const btnEditar = document.createElement("button");
        btnEditar.classList.add("btn", "btn-info", "mr-2");
        btnEditar.innerHTML = `Editar <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"></path>
</svg>`;
        const cita = cursor.value;
        btnEditar.onclick = () => editarCita(cita);

        //agregar los parrafos al divCitas
        divCita.appendChild(mascotaParrafo);
        divCita.appendChild(propietarioParrafo);
        divCita.appendChild(telefonoParrafo);
        divCita.appendChild(fechaParrafo);
        divCita.appendChild(horaParrafo);
        divCita.appendChild(sintomasParrafo);
        divCita.appendChild(btnElminar);
        divCita.appendChild(btnEditar);

        //agregar el divCita al HTML.
        contenedorCitas.appendChild(divCita);

        //Ve al siguiente elemento

        cursor.continue();
      }
    };
  }

  textoHeading(resultado) {
    if (resultado > 0) {
      heading.textContent = "Administra tus Citas";
    } else {
      heading.textContent = "No hay citas, comienza creando una!";
    }
  }

  //Limpiar HTML
  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}
