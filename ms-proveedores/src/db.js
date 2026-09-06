/* =========================================================
   Capa de datos del microservicio de PROVEEDORES.
   Persistencia simple en archivo JSON.
   ========================================================= */
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'proveedores.json');

function leer() {
  if (!fs.existsSync(DB_FILE)) {
    // Proveedores de ejemplo (NIT 1 a 5), útiles para probar la
    // carga del archivo database_productos_muestra.csv del proyecto.
    const semilla = [
      { nitProveedor: 1, nombreProveedor: 'Proveedor Uno S.A.S.', direccionProveedor: 'Calle 1 # 1-01', telefonoProveedor: '3001111111', ciudadProveedor: 'Bogotá' },
      { nitProveedor: 2, nombreProveedor: 'Proveedor Dos S.A.S.', direccionProveedor: 'Calle 2 # 2-02', telefonoProveedor: '3002222222', ciudadProveedor: 'Bogotá' },
      { nitProveedor: 3, nombreProveedor: 'Proveedor Tres S.A.S.', direccionProveedor: 'Calle 3 # 3-03', telefonoProveedor: '3003333333', ciudadProveedor: 'Medellín' },
      { nitProveedor: 4, nombreProveedor: 'Proveedor Cuatro S.A.S.', direccionProveedor: 'Calle 4 # 4-04', telefonoProveedor: '3004444444', ciudadProveedor: 'Cali' },
      { nitProveedor: 5, nombreProveedor: 'Proveedor Cinco S.A.S.', direccionProveedor: 'Calle 5 # 5-05', telefonoProveedor: '3005555555', ciudadProveedor: 'Barranquilla' }
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(semilla, null, 2));
    return semilla;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function guardar(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { leer, guardar };
