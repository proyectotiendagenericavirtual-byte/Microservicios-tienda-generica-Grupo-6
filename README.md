# Tienda Genérica — Microservicios

División del proyecto **Tienda Genérica** en 5 microservicios independientes,
cada uno con su propia base de datos (archivo JSON) y su propia API REST,
que se comunican entre sí por HTTP.

## Microservicios

| Microservicio  | Carpeta          | Puerto por defecto | Responsabilidad                                             |
|----------------|-------------------|---------------------|--------------------------------------------------------------|
| Usuarios       | `ms-usuarios/`    | 3001                | Usuarios del sistema y login                                  |
| Clientes       | `ms-clientes/`    | 3002                | Clientes de la tienda                                          |
| Proveedores    | `ms-proveedores/` | 3003                | Proveedores de productos                                       |
| Productos      | `ms-productos/`   | 3004                | Productos y carga masiva (CSV); valida proveedor vía HTTP       |
| Ventas         | `ms-ventas/`      | 3005                | Registra ventas orquestando Clientes, Usuarios y Productos      |

Cada carpeta es un proyecto Node.js/Express **totalmente independiente**
(su propio `package.json`, su propia base de datos, su propio `Dockerfile`).
Se pueden desarrollar, versionar y desplegar por separado, que es justamente
el objetivo de una arquitectura de microservicios.

## Cómo se comunican

- **Productos → Proveedores**: al crear/actualizar un producto, valida que
  el `nitProveedor` exista.
- **Ventas → Clientes, Usuarios, Productos**: al registrar una venta, valida
  que el cliente y el usuario existan, obtiene el precio real de cada
  producto y calcula IVA y total del lado del servidor.

Esto se hace con `fetch` nativo de Node 18+ (sin librerías extra), usando
URLs configurables por variable de entorno (para que cada servicio pueda
correr en otra máquina/puerto sin tocar el código).

## Opción A: correr cada uno manualmente

```bash
cd ms-usuarios && npm install && npm start     # puerto 3001
cd ms-clientes && npm install && npm start     # puerto 3002
cd ms-proveedores && npm install && npm start  # puerto 3003
cd ms-productos && npm install && npm start    # puerto 3004
cd ms-ventas && npm install && npm start       # puerto 3005
```

(Requiere Node.js 18 o superior en `ms-productos` y `ms-ventas`.)

## Opción B: correr todo con Docker Compose

```bash
docker compose up --build
```

Esto levanta los 5 microservicios en contenedores separados, ya configurados
para hablar entre sí por su nombre de servicio.

## Probar el flujo completo

```bash
# 1. Crear un cliente
curl -X POST http://localhost:3002/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"cedulaCliente":123456,"nombreCliente":"Juan Perez","emailCliente":"juan@correo.com","direccionCliente":"Calle 10","telefonoCliente":"3101234567"}'

# 2. Crear un producto (usa un proveedor de ejemplo, NIT 1 a 5)
curl -X POST http://localhost:3004/api/productos \
  -H "Content-Type: application/json" \
  -d '{"codigoProducto":1,"nombreProducto":"Melocotones","nitProveedor":1,"precioCompra":25505,"ivaCompra":19,"precioVenta":30351}'

# 3. Registrar una venta (usuario 1 es el admin inicial, creado automáticamente)
curl -X POST http://localhost:3005/api/ventas \
  -H "Content-Type: application/json" \
  -d '{"cedulaCliente":123456,"cedulaUsuario":1,"items":[{"codigoProducto":1,"cantidadProducto":3}]}'
```

## Sobre el uso de IA en este refinamiento

Este desglose en microservicios se construyó con ayuda de IA a partir del
proyecto original (`TiendaGenerica`), respetando exactamente los mismos
campos y reglas de negocio que ya existían en la versión de un solo
frontend con `localStorage` (ver `js/db.js` del repo original), pero
separando cada entidad en su propio servicio con su propia base de datos y
comunicación HTTP entre ellos, cumpliendo con el requerimiento de dividir
el proyecto en los microservicios de Clientes, Usuarios, Proveedores,
Productos y Ventas.
