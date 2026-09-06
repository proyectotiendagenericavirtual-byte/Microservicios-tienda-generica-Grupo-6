/* =========================================================
   MICROSERVICIO: PROVEEDORES
   Responsable únicamente de la gestión de los proveedores
   que surten los productos de la tienda.
   ========================================================= */
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;

app.get('/health', (req, res) => res.json({ servicio: 'proveedores', estado: 'ok' }));

// Listar todos los proveedores
app.get('/api/proveedores', (req, res) => {
  res.json(db.leer());
});

// Obtener un proveedor por NIT
app.get('/api/proveedores/:nit', (req, res) => {
  const proveedores = db.leer();
  const proveedor = proveedores.find(p => String(p.nitProveedor) === req.params.nit);
  if (!proveedor) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
  res.json(proveedor);
});

// Crear proveedor
app.post('/api/proveedores', (req, res) => {
  const { nitProveedor, nombreProveedor, direccionProveedor, telefonoProveedor, ciudadProveedor } = req.body;

  if (!nitProveedor || !nombreProveedor) {
    return res.status(400).json({ mensaje: 'nitProveedor y nombreProveedor son obligatorios' });
  }

  const proveedores = db.leer();
  if (proveedores.some(p => String(p.nitProveedor) === String(nitProveedor))) {
    return res.status(409).json({ mensaje: 'Ya existe un proveedor con ese NIT' });
  }

  const nuevo = { nitProveedor, nombreProveedor, direccionProveedor, telefonoProveedor, ciudadProveedor };
  proveedores.push(nuevo);
  db.guardar(proveedores);
  res.status(201).json(nuevo);
});

// Actualizar proveedor
app.put('/api/proveedores/:nit', (req, res) => {
  const proveedores = db.leer();
  const idx = proveedores.findIndex(p => String(p.nitProveedor) === req.params.nit);
  if (idx === -1) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });

  proveedores[idx] = { ...proveedores[idx], ...req.body, nitProveedor: proveedores[idx].nitProveedor };
  db.guardar(proveedores);
  res.json(proveedores[idx]);
});

// Eliminar proveedor
app.delete('/api/proveedores/:nit', (req, res) => {
  const proveedores = db.leer();
  const idx = proveedores.findIndex(p => String(p.nitProveedor) === req.params.nit);
  if (idx === -1) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });

  const eliminado = proveedores.splice(idx, 1)[0];
  db.guardar(proveedores);
  res.json({ mensaje: 'Proveedor eliminado', proveedor: eliminado });
});

app.listen(PORT, () => {
  console.log(`Microservicio de Proveedores escuchando en http://localhost:${PORT}`);
});
