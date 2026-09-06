/* =========================================================
   MICROSERVICIO: USUARIOS
   Responsable únicamente de la gestión de usuarios del
   sistema (los que inician sesión y operan la tienda) y del
   login.
   ========================================================= */
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Healthcheck
app.get('/health', (req, res) => res.json({ servicio: 'usuarios', estado: 'ok' }));

// Listar todos los usuarios
app.get('/api/usuarios', (req, res) => {
  const usuarios = db.leer();
  res.json(usuarios);
});

// Obtener un usuario por cédula
app.get('/api/usuarios/:cedula', (req, res) => {
  const usuarios = db.leer();
  const usuario = usuarios.find(u => String(u.cedulaUsuario) === req.params.cedula);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  res.json(usuario);
});

// Crear usuario
app.post('/api/usuarios', (req, res) => {
  const { cedulaUsuario, nombreUsuario, emailUsuario, usuario, password } = req.body;

  if (!cedulaUsuario || !nombreUsuario || !emailUsuario || !usuario || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const usuarios = db.leer();
  if (usuarios.some(u => String(u.cedulaUsuario) === String(cedulaUsuario))) {
    return res.status(409).json({ mensaje: 'Ya existe un usuario con esa cédula' });
  }
  if (usuarios.some(u => u.usuario === usuario)) {
    return res.status(409).json({ mensaje: 'Ese nombre de usuario ya está en uso' });
  }

  const nuevo = { cedulaUsuario, nombreUsuario, emailUsuario, usuario, password };
  usuarios.push(nuevo);
  db.guardar(usuarios);
  res.status(201).json(nuevo);
});

// Actualizar usuario
app.put('/api/usuarios/:cedula', (req, res) => {
  const usuarios = db.leer();
  const idx = usuarios.findIndex(u => String(u.cedulaUsuario) === req.params.cedula);
  if (idx === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  usuarios[idx] = { ...usuarios[idx], ...req.body, cedulaUsuario: usuarios[idx].cedulaUsuario };
  db.guardar(usuarios);
  res.json(usuarios[idx]);
});

// Eliminar usuario
app.delete('/api/usuarios/:cedula', (req, res) => {
  const usuarios = db.leer();
  const idx = usuarios.findIndex(u => String(u.cedulaUsuario) === req.params.cedula);
  if (idx === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  const eliminado = usuarios.splice(idx, 1)[0];
  db.guardar(usuarios);
  res.json({ mensaje: 'Usuario eliminado', usuario: eliminado });
});

// Login (usado por index.html)
app.post('/api/usuarios/login', (req, res) => {
  const { usuario, password } = req.body;
  const usuarios = db.leer();
  const encontrado = usuarios.find(u => u.usuario === usuario && u.password === password);

  if (!encontrado) {
    return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
  }
  const { password: _pw, ...usuarioSinPassword } = encontrado;
  res.json({ mensaje: 'Login exitoso', usuario: usuarioSinPassword });
});

app.listen(PORT, () => {
  console.log(`Microservicio de Usuarios escuchando en http://localhost:${PORT}`);
});
