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
export let DB;

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
    //pasar el objeto de la cita a edicion
    administrarCitas.editarCitas({ ...citaObj });

    //edita en indexDB

    const transaction = DB.transaction(["citas"], "readwrite");
    const objectStore = transaction.objectStore("citas");

    objectStore.put(citaObj);
    transaction.oncomplete = () => {
      ui.imprimirAlerta("Editado correctamente");
      //regresar el texto del boton a su estado original

      formulario.querySelector('button[type="submit"]').textContent =
        "Crear Cita";

      //Quitar modo edicion
      editando = false;
    };

    transaction.onerror = () => {
      console.log("Hubo un error");
    };
  } else {
    //generar un id unico

    citaObj.id = Date.now();

    // creando nueva cita

    administrarCitas.agregarCita({ ...citaObj });

    //insertar registro de indexDB
    const transaction = DB.transaction(["citas"], "readwrite");

    //habilitar el objectStore
    const objectStore = transaction.objectStore("citas");

    //insertar en DB
    objectStore.add(citaObj);

    transaction.oncomplete = () => {
      console.log("transacción completa");
      //mensaje de agregado correctamente
      ui.imprimirAlerta("Se agrego correctamente");
    };
  }

  //Agregar el HTML
  ui.imprimirCitas();
  //reiniciar objeto
  reiniciarObjeto();

  //reiniciar el formulario

  formulario.reset();
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
  //administrarCitas.eliminarCita(id);

  const transaction = DB.transaction(["citas"], "readwrite");
  const objectStore = transaction.objectStore("citas");

  objectStore.delete(id);

  transaction.oncomplete = () => {
    //refrescar las citas
    console.log("cita eliminada");
    ui.imprimirCitas();
    //muestre un mensaje
    ui.imprimirAlerta("La cita se elimino correctamente");
  };

  objectStore.onerror = () => {
    console.log("Hubo un error a eliminar cita");
  };
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

export function crearBase() {
  //crea la base de datos en version 1.0

  const crearDB = window.indexedDB.open("citas", 1);

  //cuando hay un error
  crearDB.onerror = function () {
    console.log("Hubo un error en la base");
  };

  // si no hay error
  crearDB.onsuccess = function () {
    console.log("Datos cargados correctamente ");

    DB = crearDB.result;
    //mostrar citas al cargar indexBD
    ui.imprimirCitas();
  };

  //definir schema
  crearDB.onupgradeneeded = function (e) {
    const db = e.target.result;

    const objectStore = db.createObjectStore("citas", {
      keyPath: "id",
      autoIncrement: true,
    });

    //definir las columnas

    objectStore.createIndex("mascota", "mascota", { unique: false });
    objectStore.createIndex("propietario", "propietario", { unique: false });
    objectStore.createIndex("telefono", "telefono", { unique: false });
    objectStore.createIndex("fecha", "fecha", { unique: false });
    objectStore.createIndex("hora", "hora", { unique: false });
    objectStore.createIndex("sintomas", "sintomas", { unique: false });
    objectStore.createIndex("id", "id", { unique: true });

    console.log("DB creado");
  };
}
