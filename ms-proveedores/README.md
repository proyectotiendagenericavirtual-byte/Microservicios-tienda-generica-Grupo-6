# Microservicio de Proveedores

API REST responsable de la gestión de los proveedores de la tienda.

## Instalación y ejecución

```bash
cd ms-proveedores
npm install
npm start
```

Por defecto corre en `http://localhost:3003` (variable de entorno `PORT` para cambiarlo).

## Endpoints

| Método | Ruta                     | Descripción                       |
|--------|--------------------------|-------------------------------------|
| GET    | /api/proveedores         | Listar todos los proveedores        |
| GET    | /api/proveedores/:nit    | Obtener un proveedor por NIT        |
| POST   | /api/proveedores         | Crear un proveedor                  |
| PUT    | /api/proveedores/:nit    | Actualizar un proveedor             |
| DELETE | /api/proveedores/:nit    | Eliminar un proveedor               |
| GET    | /health                  | Healthcheck                         |

## Modelo de datos

```json
{
  "nitProveedor": 1,
  "nombreProveedor": "Proveedor Uno S.A.S.",
  "direccionProveedor": "Calle 1 # 1-01",
  "telefonoProveedor": "3001111111",
  "ciudadProveedor": "Bogotá"
}
```

Los datos se persisten en `src/proveedores.json` (se crea automáticamente con
5 proveedores de ejemplo, NIT 1 a 5, para poder probar la carga del CSV de
productos de muestra del proyecto original).
