# Microservicio de Productos

API REST responsable de la gestión de productos, incluida la carga masiva
desde el CSV de muestra. Se comunica por HTTP con el **microservicio de
Proveedores** para validar que el `nitProveedor` exista (así cada
microservicio conserva su propia base de datos, sin compartirla).

> Requiere Node.js 18 o superior (usa `fetch` nativo).

## Instalación y ejecución

```bash
cd ms-productos
npm install
# Opcional: URL del microservicio de proveedores si no corre en localhost:3003
export URL_PROVEEDORES=http://localhost:3003
npm start
```

Por defecto corre en `http://localhost:3004` (variable de entorno `PORT` para cambiarlo).

## Endpoints

| Método | Ruta                          | Descripción                                  |
|--------|-------------------------------|-----------------------------------------------|
| GET    | /api/productos                | Listar todos los productos                    |
| GET    | /api/productos/:codigo        | Obtener un producto por código                |
| POST   | /api/productos                | Crear un producto                             |
| POST   | /api/productos/carga-masiva   | Cargar varios productos (desde el CSV)        |
| PUT    | /api/productos/:codigo        | Actualizar un producto                        |
| DELETE | /api/productos/:codigo        | Eliminar un producto                          |
| GET    | /health                       | Healthcheck                                   |

## Modelo de datos

```json
{
  "codigoProducto": 1,
  "nombreProducto": "Melocotones",
  "nitProveedor": 1,
  "precioCompra": 25505,
  "ivaCompra": 19,
  "precioVenta": 30351
}
```

Los datos se persisten en `src/productos.json`.
