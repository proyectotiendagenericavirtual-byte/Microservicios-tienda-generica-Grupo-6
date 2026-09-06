/* =========================================================
   Capa de datos del microservicio de PRODUCTOS.
   Persistencia simple en archivo JSON.
   ========================================================= */
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'productos.json');

function leer() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
    return [];
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function guardar(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { leer, guardar };
