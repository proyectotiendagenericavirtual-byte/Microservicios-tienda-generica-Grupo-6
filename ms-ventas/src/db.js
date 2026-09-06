/* =========================================================
   Capa de datos del microservicio de VENTAS.
   Persistencia simple en archivo JSON. Guarda encabezado de
   venta (ventas.json) y el detalle línea por línea
   (detalleVentas.json), igual que en el modelo original.
   ========================================================= */
const fs = require('fs');
const path = require('path');

const VENTAS_FILE = path.join(__dirname, 'ventas.json');
const DETALLE_FILE = path.join(__dirname, 'detalleVentas.json');
const CONSECUTIVOS_FILE = path.join(__dirname, 'consecutivos.json');

function leerArchivo(file, porDefecto) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(porDefecto, null, 2));
    return porDefecto;
  }
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function guardarArchivo(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const leerVentas = () => leerArchivo(VENTAS_FILE, []);
const guardarVentas = (data) => guardarArchivo(VENTAS_FILE, data);

const leerDetalle = () => leerArchivo(DETALLE_FILE, []);
const guardarDetalle = (data) => guardarArchivo(DETALLE_FILE, data);

function siguienteConsecutivo(clave) {
  const consecutivos = leerArchivo(CONSECUTIVOS_FILE, { codigoVenta: 0, codigoDetalleVenta: 0 });
  consecutivos[clave] = (consecutivos[clave] || 0) + 1;
  guardarArchivo(CONSECUTIVOS_FILE, consecutivos);
  return consecutivos[clave];
}

module.exports = { leerVentas, guardarVentas, leerDetalle, guardarDetalle, siguienteConsecutivo };
