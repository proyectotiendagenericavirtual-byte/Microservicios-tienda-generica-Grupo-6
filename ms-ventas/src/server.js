/* =========================================================
   MICROSERVICIO: VENTAS
   Es el microservicio "orquestador": valida cliente, usuario
   y producto consultando a los otros microservicios por HTTP,
   calcula el IVA y el total, y guarda el encabezado + detalle
   de la venta en su propia base de datos.
   ========================================================= */
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3005;

// URLs de los demás microservicios (configurables por variables de entorno)
const URL_CLIENTES = process.env.URL_CLIENTES || 'http://localhost:3002';
const URL_USUARIOS = process.env.URL_USUARIOS || 'http://localhost:3001';
const URL_PRODUCTOS = process.env.URL_PRODUCTOS || 'http://localhost:3004';

async function obtenerRecurso(baseUrl, ruta) {
  try {
    const resp = await fetch(`${baseUrl}${ruta}`);
    if (!resp.ok) return null;
    return await resp.json();
  } catch (err) {
    console.error(`No se pudo contactar ${baseUrl}${ruta}:`, err.message);
    return null;
  }
}

app.get('/health', (req, res) => res.json({ servicio: 'ventas', estado: 'ok' }));

// Listar todas las ventas (encabezados)
app.get('/api/ventas', (req, res) => {
  res.json(db.leerVentas());
});

// Obtener una venta con su detalle
app.get('/api/ventas/:codigo', (req, res) => {
  const venta = db.leerVentas().find(v => String(v.codigoVenta) === req.params.codigo);
  if (!venta) return res.status(404).json({ mensaje: 'Venta no encontrada' });

  const detalle = db.leerDetalle().filter(d => String(d.codigoVenta) === req.params.codigo);
  res.json({ ...venta, detalle });
});

/**
 * Crear una venta completa.
 * Body esperado:
 * {
 *   cedulaCliente, cedulaUsuario,
 *   items: [{ codigoProducto, cantidadProducto }, ...]
 * }
 * El precio, el IVA y el total se calculan aquí a partir de la
 * información real del microservicio de Productos (nunca se
 * confía en precios que vengan del cliente/frontend).
 */
app.post('/api/ventas', async (req, res) => {
  const { cedulaCliente, cedulaUsuario, items } = req.body;

  if (!cedulaCliente || !cedulaUsuario || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ mensaje: 'cedulaCliente, cedulaUsuario e items son obligatorios' });
  }

  // 1. Validar cliente
  const cliente = await obtenerRecurso(URL_CLIENTES, `/api/clientes/${cedulaCliente}`);
  if (!cliente) {
    return res.status(400).json({ mensaje: `El cliente con cédula ${cedulaCliente} no existe.` });
  }

  // 2. Validar usuario (quien realiza la venta)
  const usuario = await obtenerRecurso(URL_USUARIOS, `/api/usuarios/${cedulaUsuario}`);
  if (!usuario) {
    return res.status(400).json({ mensaje: `El usuario con cédula ${cedulaUsuario} no existe.` });
  }

  // 3. Validar cada producto y calcular valores
  const detalleCalculado = [];
  let subtotal = 0;
  let ivaTotal = 0;

  for (const item of items) {
    const { codigoProducto, cantidadProducto } = item;
    const producto = await obtenerRecurso(URL_PRODUCTOS, `/api/productos/${codigoProducto}`);

    if (!producto) {
      return res.status(400).json({ mensaje: `El producto con código ${codigoProducto} no existe.` });
    }
    if (!cantidadProducto || cantidadProducto <= 0) {
      return res.status(400).json({ mensaje: `La cantidad para el producto ${codigoProducto} debe ser mayor a 0.` });
    }

    const valorSinIva = producto.precioVenta * cantidadProducto;
    const ivaVenta = valorSinIva * ((producto.ivaCompra || 0) / 100);
    const valorVenta = valorSinIva + ivaVenta;

    subtotal += valorSinIva;
    ivaTotal += ivaVenta;

    detalleCalculado.push({
      codigoDetalleVenta: db.siguienteConsecutivo('codigoDetalleVenta'),
      codigoProducto,
      nombreProducto: producto.nombreProducto,
      cantidadProducto,
      precioVenta: producto.precioVenta,
      ivaVenta,
      valorVenta
    });
  }

  const totalVenta = subtotal + ivaTotal;

  const nuevaVenta = {
    codigoVenta: db.siguienteConsecutivo('codigoVenta'),
    cedulaCliente,
    nombreCliente: cliente.nombreCliente,
    cedulaUsuario,
    nombreUsuario: usuario.nombreUsuario,
    fecha: new Date().toISOString(),
    subtotal,
    ivaVenta: ivaTotal,
    totalVenta
  };

  const ventas = db.leerVentas();
  ventas.push(nuevaVenta);
  db.guardarVentas(ventas);

  const detalles = db.leerDetalle();
  detalleCalculado.forEach(d => detalles.push({ ...d, codigoVenta: nuevaVenta.codigoVenta }));
  db.guardarDetalle(detalles);

  res.status(201).json({ ...nuevaVenta, detalle: detalleCalculado });
});

// Eliminar (anular) una venta y su detalle
app.delete('/api/ventas/:codigo', (req, res) => {
  const ventas = db.leerVentas();
  const idx = ventas.findIndex(v => String(v.codigoVenta) === req.params.codigo);
  if (idx === -1) return res.status(404).json({ mensaje: 'Venta no encontrada' });

  const eliminada = ventas.splice(idx, 1)[0];
  db.guardarVentas(ventas);

  const detalles = db.leerDetalle().filter(d => String(d.codigoVenta) !== req.params.codigo);
  db.guardarDetalle(detalles);

  res.json({ mensaje: 'Venta eliminada', venta: eliminada });
});

app.listen(PORT, () => {
  console.log(`Microservicio de Ventas escuchando en http://localhost:${PORT}`);
});
