/* =========================================================
   MICROSERVICIO: PRODUCTOS
   Responsable de la gestión de productos, incluida la carga
   masiva desde CSV. Valida el proveedor consultando al
   microservicio de PROVEEDORES por HTTP (comunicación entre
   microservicios), en lugar de compartir base de datos.
   ========================================================= */
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' })); // margen amplio para cargas CSV grandes

const PORT = process.env.PORT || 3004;

// URL del microservicio de Proveedores (configurable por entorno,
// por defecto asume que corre en localhost:3003)
const URL_PROVEEDORES = process.env.URL_PROVEEDORES || 'http://localhost:3003';

async function proveedorExiste(nitProveedor) {
  try {
    const resp = await fetch(`${URL_PROVEEDORES}/api/proveedores/${nitProveedor}`);
    return resp.ok;
  } catch (err) {
    console.error('No se pudo contactar al microservicio de Proveedores:', err.message);
    // Si el servicio de proveedores no está disponible, no bloqueamos
    // la operación por completo; se podría cambiar a "return false"
    // si se prefiere fallar de forma estricta.
    return true;
  }
}

app.get('/health', (req, res) => res.json({ servicio: 'productos', estado: 'ok' }));

// Listar todos los productos
app.get('/api/productos', (req, res) => {
  res.json(db.leer());
});

// Obtener un producto por código
app.get('/api/productos/:codigo', (req, res) => {
  const productos = db.leer();
  const producto = productos.find(p => String(p.codigoProducto) === req.params.codigo);
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  res.json(producto);
});

// Crear producto
app.post('/api/productos', async (req, res) => {
  const { codigoProducto, nombreProducto, nitProveedor, precioCompra, ivaCompra, precioVenta } = req.body;

  if (!codigoProducto || !nombreProducto || !nitProveedor || precioCompra == null || ivaCompra == null || precioVenta == null) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const productos = db.leer();
  if (productos.some(p => String(p.codigoProducto) === String(codigoProducto))) {
    return res.status(409).json({ mensaje: 'Ya existe un producto con ese código' });
  }

  if (!(await proveedorExiste(nitProveedor))) {
    return res.status(400).json({ mensaje: `El NIT del proveedor ${nitProveedor} no existe en el sistema.` });
  }

  const nuevo = { codigoProducto, nombreProducto, nitProveedor, precioCompra, ivaCompra, precioVenta };
  productos.push(nuevo);
  db.guardar(productos);
  res.status(201).json(nuevo);
});

// Carga masiva de productos (usada por el botón de importar CSV del frontend)
// Espera: [{ codigoProducto, nombreProducto, nitProveedor, precioCompra, ivaCompra, precioVenta }, ...]
app.post('/api/productos/carga-masiva', async (req, res) => {
  const nuevos = Array.isArray(req.body) ? req.body : [];
  if (!nuevos.length) {
    return res.status(400).json({ mensaje: 'Se esperaba un arreglo de productos en el body' });
  }

  const productos = db.leer();
  const insertados = [];
  const errores = [];

  for (const item of nuevos) {
    const { codigoProducto, nombreProducto, nitProveedor, precioCompra, ivaCompra, precioVenta } = item;

    if (!codigoProducto || !nombreProducto || !nitProveedor) {
      errores.push({ item, motivo: 'Campos obligatorios faltantes' });
      continue;
    }
    if (productos.some(p => String(p.codigoProducto) === String(codigoProducto))) {
      errores.push({ item, motivo: 'Código de producto duplicado' });
      continue;
    }
    if (!(await proveedorExiste(nitProveedor))) {
      errores.push({ item, motivo: `NIT de proveedor ${nitProveedor} inexistente` });
      continue;
    }

    const nuevo = { codigoProducto, nombreProducto, nitProveedor, precioCompra, ivaCompra, precioVenta };
    productos.push(nuevo);
    insertados.push(nuevo);
  }

  db.guardar(productos);
  res.status(201).json({ insertados: insertados.length, errores });
});

// Actualizar producto
app.put('/api/productos/:codigo', async (req, res) => {
  const productos = db.leer();
  const idx = productos.findIndex(p => String(p.codigoProducto) === req.params.codigo);
  if (idx === -1) return res.status(404).json({ mensaje: 'Producto no encontrado' });

  if (req.body.nitProveedor && !(await proveedorExiste(req.body.nitProveedor))) {
    return res.status(400).json({ mensaje: `El NIT del proveedor ${req.body.nitProveedor} no existe en el sistema.` });
  }

  productos[idx] = { ...productos[idx], ...req.body, codigoProducto: productos[idx].codigoProducto };
  db.guardar(productos);
  res.json(productos[idx]);
});

// Eliminar producto
app.delete('/api/productos/:codigo', (req, res) => {
  const productos = db.leer();
  const idx = productos.findIndex(p => String(p.codigoProducto) === req.params.codigo);
  if (idx === -1) return res.status(404).json({ mensaje: 'Producto no encontrado' });

  const eliminado = productos.splice(idx, 1)[0];
  db.guardar(productos);
  res.json({ mensaje: 'Producto eliminado', producto: eliminado });
});

app.listen(PORT, () => {
  console.log(`Microservicio de Productos escuchando en http://localhost:${PORT}`);
});
