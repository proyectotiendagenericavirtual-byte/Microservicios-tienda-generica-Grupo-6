/* =========================================================
   MICROSERVICIO: CLIENTES
   Responsable únicamente de la gestión de los clientes de
   la tienda (a quienes se les hacen las ventas).
   ========================================================= */
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get('/health', (req, res) => res.json({ servicio: 'clientes', estado: 'ok' }));

// Listar todos los clientes
app.get('/api/clientes', (req, res) => {
  res.json(db.leer());
});

// Obtener un cliente por cédula
app.get('/api/clientes/:cedula', (req, res) => {
  const clientes = db.leer();
  const cliente = clientes.find(c => String(c.cedulaCliente) === req.params.cedula);
  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  res.json(cliente);
});

// Crear cliente
app.post('/api/clientes', (req, res) => {
  const { cedulaCliente, nombreCliente, emailCliente, direccionCliente, telefonoCliente } = req.body;

  if (!cedulaCliente || !nombreCliente) {
    return res.status(400).json({ mensaje: 'cedulaCliente y nombreCliente son obligatorios' });
  }

  const clientes = db.leer();
  if (clientes.some(c => String(c.cedulaCliente) === String(cedulaCliente))) {
    return res.status(409).json({ mensaje: 'Ya existe un cliente con esa cédula' });
  }

  const nuevo = { cedulaCliente, nombreCliente, emailCliente, direccionCliente, telefonoCliente };
  clientes.push(nuevo);
  db.guardar(clientes);
  res.status(201).json(nuevo);
});

// Actualizar cliente
app.put('/api/clientes/:cedula', (req, res) => {
  const clientes = db.leer();
  const idx = clientes.findIndex(c => String(c.cedulaCliente) === req.params.cedula);
  if (idx === -1) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

  clientes[idx] = { ...clientes[idx], ...req.body, cedulaCliente: clientes[idx].cedulaCliente };
  db.guardar(clientes);
  res.json(clientes[idx]);
});

// Eliminar cliente
app.delete('/api/clientes/:cedula', (req, res) => {
  const clientes = db.leer();
  const idx = clientes.findIndex(c => String(c.cedulaCliente) === req.params.cedula);
  if (idx === -1) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

  const eliminado = clientes.splice(idx, 1)[0];
  db.guardar(clientes);
  res.json({ mensaje: 'Cliente eliminado', cliente: eliminado });
});

app.listen(PORT, () => {
  console.log(`Microservicio de Clientes escuchando en http://localhost:${PORT}`);
});
