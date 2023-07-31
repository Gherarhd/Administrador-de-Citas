"use strict";
import { App } from "./Clases/App.js";
import { LoadDB } from "./Datos/baseDatos.js";

window.onload = () => {
  const app = new App();

  const datos = new LoadDB();
};
