# Microservicio de Ventas

API REST responsable de registrar ventas. Es el microservicio "orquestador":
valida cliente, usuario y productos consultando por HTTP a los microservicios
correspondientes, calcula IVA y total del lado del servidor, y guarda el
encabezado (`ventas.json`) y el detalle (`detalleVentas.json`) de cada venta.

> Requiere Node.js 18 o superior (usa `fetch` nativo). Para funcionar
> completo necesita que los microservicios de Clientes, Usuarios y
> Productos estén corriendo.

## Instalación y ejecución

```bash
cd ms-ventas
npm install
export URL_CLIENTES=http://localhost:3002
export URL_USUARIOS=http://localhost:3001
export URL_PRODUCTOS=http://localhost:3004
npm start
```

Por defecto corre en `http://localhost:3005` (variable de entorno `PORT` para cambiarlo).

## Endpoints

| Método | Ruta                  | Descripción                                       |
|--------|-----------------------|-----------------------------------------------------|
| GET    | /api/ventas           | Listar todas las ventas (encabezados)               |
| GET    | /api/ventas/:codigo   | Obtener una venta con su detalle                    |
| POST   | /api/ventas           | Registrar una venta completa                        |
| DELETE | /api/ventas/:codigo   | Anular una venta                                    |
| GET    | /health               | Healthcheck                                         |

## Ejemplo de creación de venta

```json
POST /api/ventas
{
  "cedulaCliente": 123456,
  "cedulaUsuario": 1,
  "items": [
    { "codigoProducto": 1, "cantidadProducto": 3 },
    { "codigoProducto": 2, "cantidadProducto": 1 }
  ]
}
```

El servicio consulta el precio, el IVA y el nombre real de cada producto en
el microservicio de Productos (nunca confía en valores enviados desde el
frontend), calcula `ivaVenta` y `totalVenta`, y persiste todo.
