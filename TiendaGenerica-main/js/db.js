/* =========================================================
   Capa de datos para la DEMO (sin backend, sin AWS).
   Simula las tablas de la base de datos usando localStorage
   del navegador, con la misma estructura de campos que la
   API REST real (ver documento Parte 4).
   ========================================================= */

const DB = {
  KEYS: {
    usuarios: 'tg_usuarios',
    clientes: 'tg_clientes',
    proveedores: 'tg_proveedores',
    productos: 'tg_productos',
    ventas: 'tg_ventas',
    detalleVentas: 'tg_detalleVentas',
    consecutivoVenta: 'tg_consecutivoVenta',
    consecutivoDetalle: 'tg_consecutivoDetalle',
    sesion: 'tg_sesion'
  },

  get(key) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  init() {
    // Usuario administrador inicial (HU-001)
    let usuarios = this.get(this.KEYS.usuarios);
    if (!usuarios.length) {
      usuarios = [{
        cedulaUsuario: 1,
        nombreUsuario: 'Administrador Inicial',
        emailUsuario: 'admin@tiendagenerica.com',
        usuario: 'admininicial',
        password: 'admin123456'
      }];
      this.set(this.KEYS.usuarios, usuarios);
    }

    // Proveedores de ejemplo, requeridos para poder probar la carga
    // del archivo productos_muestra.csv (NIT 1 a 5)
    let proveedores = this.get(this.KEYS.proveedores);
    if (!proveedores.length) {
      proveedores = [
        { nitProveedor: 1, nombreProveedor: 'Proveedor Uno S.A.S.', direccionProveedor: 'Calle 1 # 1-01', telefonoProveedor: '3001111111', ciudadProveedor: 'Bogotá' },
        { nitProveedor: 2, nombreProveedor: 'Proveedor Dos S.A.S.', direccionProveedor: 'Calle 2 # 2-02', telefonoProveedor: '3002222222', ciudadProveedor: 'Bogotá' },
        { nitProveedor: 3, nombreProveedor: 'Proveedor Tres S.A.S.', direccionProveedor: 'Calle 3 # 3-03', telefonoProveedor: '3003333333', ciudadProveedor: 'Medellín' },
        { nitProveedor: 4, nombreProveedor: 'Proveedor Cuatro S.A.S.', direccionProveedor: 'Calle 4 # 4-04', telefonoProveedor: '3004444444', ciudadProveedor: 'Cali' },
        { nitProveedor: 5, nombreProveedor: 'Proveedor Cinco S.A.S.', direccionProveedor: 'Calle 5 # 5-05', telefonoProveedor: '3005555555', ciudadProveedor: 'Barranquilla' }
      ];
      this.set(this.KEYS.proveedores, proveedores);
    }

    if (localStorage.getItem(this.KEYS.consecutivoVenta) === null) {
      localStorage.setItem(this.KEYS.consecutivoVenta, '0');
    }
    if (localStorage.getItem(this.KEYS.consecutivoDetalle) === null) {
      localStorage.setItem(this.KEYS.consecutivoDetalle, '0');
    }
  },

  siguienteConsecutivo(key) {
    const actual = parseInt(localStorage.getItem(key) || '0', 10) + 1;
    localStorage.setItem(key, String(actual));
    return actual;
  },

  reset() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
    this.init();
  }
};

DB.init();
