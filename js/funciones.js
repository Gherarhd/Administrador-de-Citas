"use strict";
import { Citas } from "./Clases/citas.js";
import { UI } from "./Clases/UI.js";

import {
  mascotaInput,
  propietarioInput,
  telefonoInput,
  fechaInput,
  sintomasInput,
  horaInput,
  formulario,
} from "./selectores.js";

const administrarCitas = new Citas();
const ui = new UI(administrarCitas);

let editando = false;

//Objeto principal con la informacion de la cita
const citaObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

//Agrega datos al objeto de la citas
export function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
}

//valida y agrega una nueva cita a la clase de citas
export function nuevaCita(e) {
  e.preventDefault();

  //extrae el  la informacion del objeto de citas
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  //validar
  if (
    mascota === "" ||
    propietario === "" ||
    telefono === "" ||
    fecha === "" ||
    hora === "" ||
    sintomas === ""
  ) {
    ui.imprimirAlerta("Todos los campos son obligatorios", "error");
    return;
  }

  if (editando) {
    ui.imprimirAlerta("Editado correctamente");
    //pasar el objeto de la cita a edicion
    administrarCitas.editarCitas({ ...citaObj });

    //regresar el texto del boton a su estado original

    formulario.querySelector('button[type="submit"]').textContent =
      "Crear Cita";

    //Quitar modo edicion
    editando = false;
  } else {
    //generar un id unico

    citaObj.id = Date.now();

    // creando nueva cita

    administrarCitas.agregarCita({ ...citaObj });

    //mensaje de agregado correctamente
    ui.imprimirAlerta("Se agrego correctamente");
  }

  //reiniciar objeto
  reiniciarObjeto();

  //reiniciar el formulario

  formulario.reset();

  //Agregar el HTML

  ui.imprimirCitas(administrarCitas);
}

export function reiniciarObjeto() {
  (citaObj.mascota = ""),
    (citaObj.propietario = ""),
    (citaObj.telefono = ""),
    (citaObj.fecha = ""),
    (citaObj.hora = ""),
    (citaObj.sintomas = "");
}

export function eliminarCita(id) {
  //eliminar la cita
  administrarCitas.eliminarCita(id);

  //muestre un mensaje
  ui.imprimirAlerta("La cita se elimino correctamente");

  //refrescar las citas

  ui.imprimirCitas(administrarCitas);
}

//edita la cita y carga los datos
export function editarCita(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  //llenar los input
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  //llenar el objeto
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  //Cambiar el texto del boton
  formulario.querySelector('button[type="submit"]').textContent =
    "Guardar Cambios";

  editando = true;
}
