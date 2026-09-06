# Microservicio de Clientes

API REST responsable de la gestión de los clientes de la tienda.

## Instalación y ejecución

```bash
cd ms-clientes
npm install
npm start
```

Por defecto corre en `http://localhost:3002` (variable de entorno `PORT` para cambiarlo).

## Endpoints

| Método | Ruta                     | Descripción                    |
|--------|--------------------------|---------------------------------|
| GET    | /api/clientes            | Listar todos los clientes       |
| GET    | /api/clientes/:cedula    | Obtener un cliente por cédula   |
| POST   | /api/clientes            | Crear un cliente                |
| PUT    | /api/clientes/:cedula    | Actualizar un cliente           |
| DELETE | /api/clientes/:cedula    | Eliminar un cliente             |
| GET    | /health                  | Healthcheck                     |

## Modelo de datos

```json
{
  "cedulaCliente": 123456,
  "nombreCliente": "Juan Pérez",
  "emailCliente": "juan@correo.com",
  "direccionCliente": "Calle 10 # 5-20",
  "telefonoCliente": "3101234567"
}
```

Los datos se persisten en `src/clientes.json`.
