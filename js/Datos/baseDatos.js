"use strict";
import { crearBase } from "../funciones.js";

export class LoadDB {
  constructor() {
    this.crearDb();
  }
  crearDb() {
    const db = crearBase();
  }
}
