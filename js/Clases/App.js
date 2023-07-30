"use strict";
import { datosCita, nuevaCita } from "../funciones.js";
import {
  mascotaInput,
  propietarioInput,
  telefonoInput,
  fechaInput,
  sintomasInput,
  horaInput,
  formulario,
} from "../selectores.js";

export class App {
  constructor() {
    this.aplicaciones();
  }

  aplicaciones() {
    //Registra eventos
    eventListeners();
    function eventListeners() {
      mascotaInput.addEventListener("input", datosCita);
      propietarioInput.addEventListener("input", datosCita);
      telefonoInput.addEventListener("input", datosCita);
      fechaInput.addEventListener("input", datosCita);
      horaInput.addEventListener("input", datosCita);
      sintomasInput.addEventListener("input", datosCita);
    }

    formulario.addEventListener("submit", nuevaCita);
  }
}
