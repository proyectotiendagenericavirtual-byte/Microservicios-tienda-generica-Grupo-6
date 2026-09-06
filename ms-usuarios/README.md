# Microservicio de Usuarios

API REST responsable de los usuarios que operan el sistema (login incluido).

## Instalación y ejecución

```bash
cd ms-usuarios
npm install
npm start
```

Por defecto corre en `http://localhost:3001` (variable de entorno `PORT` para cambiarlo).

## Endpoints

| Método | Ruta                      | Descripción                          |
|--------|---------------------------|---------------------------------------|
| GET    | /api/usuarios             | Listar todos los usuarios             |
| GET    | /api/usuarios/:cedula     | Obtener un usuario por cédula         |
| POST   | /api/usuarios             | Crear un usuario                      |
| PUT    | /api/usuarios/:cedula     | Actualizar un usuario                 |
| DELETE | /api/usuarios/:cedula     | Eliminar un usuario                   |
| POST   | /api/usuarios/login       | Validar usuario y contraseña          |
| GET    | /health                   | Healthcheck                           |

## Modelo de datos

```json
{
  "cedulaUsuario": 1,
  "nombreUsuario": "Administrador Inicial",
  "emailUsuario": "admin@tiendagenerica.com",
  "usuario": "admininicial",
  "password": "admin123456"
}
```

Los datos se persisten en `src/usuarios.json` (se crea automáticamente con el
usuario administrador inicial la primera vez que se ejecuta el servicio).
