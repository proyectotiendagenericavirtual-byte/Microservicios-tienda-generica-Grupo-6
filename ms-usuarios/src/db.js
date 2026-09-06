/* =========================================================
   Capa de datos del microservicio de USUARIOS.
   Persistencia simple en archivo JSON (sin necesidad de
   levantar un motor de base de datos aparte). Si el equipo
   ya cuenta con MySQL/Postgres, este archivo es el único
   punto que habría que reemplazar por un ORM/driver real.
   ========================================================= */
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'usuarios.json');

function leer() {
  if (!fs.existsSync(DB_FILE)) {
    const semilla = [
      {
        cedulaUsuario: 1,
        nombreUsuario: 'Administrador Inicial',
        emailUsuario: 'admin@tiendagenerica.com',
        usuario: 'admininicial',
        password: 'admin123456'
      }
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
