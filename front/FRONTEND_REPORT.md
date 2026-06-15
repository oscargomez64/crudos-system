# FRONTEND_REPORT.md

## Tecnologia usada

- Vite
- React
- JavaScript
- CSS propio
- lucide-react para iconos de interfaz

## Archivos creados

- `front/package.json`
- `front/index.html`
- `front/vite.config.js`
- `front/.env.example`
- `front/README.md`
- `front/FRONTEND_REPORT.md`
- `front/src/main.jsx`
- `front/src/App.jsx`
- `front/src/api/client.js`
- `front/src/api/resources.js`
- `front/src/api/consultasApi.js`
- `front/src/config/entities.js`
- `front/src/components/Layout.jsx`
- `front/src/components/Navbar.jsx`
- `front/src/components/DataTable.jsx`
- `front/src/components/ConsultaCard.jsx`
- `front/src/components/TablaResultados.jsx`
- `front/src/components/EntityForm.jsx`
- `front/src/components/ConfirmDialog.jsx`
- `front/src/components/Toast.jsx`
- `front/src/components/StatusBadge.jsx`
- `front/src/components/LoadingState.jsx`
- `front/src/components/EmptyState.jsx`
- `front/src/pages/Home.jsx`
- `front/src/pages/ConsultasSencillas.jsx`
- `front/src/pages/ConsultasAgrupadas.jsx`
- `front/src/pages/ConsultasHaving.jsx`
- `front/src/pages/ConsultasMultitabla.jsx`
- `front/src/pages/EntityCrudPage.jsx`
- `front/src/styles/global.css`
- `front/src/styles/layout.css`
- `front/src/styles/components.css`

## Como instalar

```bash
cd front
npm install
```

## Como ejecutar

Primero levanta el backend:

```bash
cd back
npm start
```

Luego inicia el frontend:

```bash
cd front
npm run dev
```

## Variable de entorno

El frontend usa:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Todas las llamadas HTTP se centralizan en `front/src/api/client.js` y `front/src/api/consultasApi.js`.

## Modulos CRUD incluidos

- Cliente
- Cerveza
- Proveedor
- Ingrediente
- Pedido
- Pedido_Cerveza
- Cerveza_Ingrediente

Cada modulo incluye tabla, busqueda local, formulario de creacion, formulario de edicion, eliminacion con confirmacion, estados de carga, errores y mensajes de exito.

## Endpoints consumidos

- `GET /health`
- `GET /api/cliente`
- `GET /api/cliente/:id`
- `POST /api/cliente`
- `PUT /api/cliente/:id`
- `DELETE /api/cliente/:id`
- `GET /api/cerveza`
- `GET /api/cerveza/:id`
- `POST /api/cerveza`
- `PUT /api/cerveza/:id`
- `DELETE /api/cerveza/:id`
- `GET /api/proveedor`
- `GET /api/proveedor/:id`
- `POST /api/proveedor`
- `PUT /api/proveedor/:id`
- `DELETE /api/proveedor/:id`
- `GET /api/ingrediente`
- `GET /api/ingrediente/:id`
- `POST /api/ingrediente`
- `PUT /api/ingrediente/:id`
- `DELETE /api/ingrediente/:id`
- `GET /api/pedido/all`
- `GET /api/pedido/:id`
- `POST /api/pedido`
- `PUT /api/pedido/:id`
- `DELETE /api/pedido/:id`
- `GET /api/pedido_cerveza/all`
- `GET /api/pedido_cerveza?idPedido=ID&idCerveza=ID`
- `POST /api/pedido_cerveza`
- `PUT /api/pedido_cerveza?idPedido=ID&idCerveza=ID`
- `DELETE /api/pedido_cerveza?idPedido=ID&idCerveza=ID`
- `GET /api/cerveza_ingrediente/all`
- `GET /api/cerveza_ingrediente?idCerveza=ID&idIngrediente=ID`
- `POST /api/cerveza_ingrediente`
- `PUT /api/cerveza_ingrediente?idCerveza=ID&idIngrediente=ID`
- `DELETE /api/cerveza_ingrediente?idCerveza=ID&idIngrediente=ID`

## Que se pudo probar

- Instalacion de dependencias del frontend.
- Build de produccion con `npm run build`.
- Arranque de Vite en desarrollo.
- Dashboard cargando y consultando `GET /health`.
- Navegacion al modulo Clientes.
- Intento de carga real contra `GET /api/cliente`.
- Apertura del formulario de Clientes.
- Intento de creacion desde el formulario de Clientes, que disparo `POST /api/cliente` y mostro el error controlado del backend.

## Que no se pudo probar

- Operaciones reales de creacion, edicion y eliminacion contra MySQL porque no hay servicio MySQL escuchando en `3306` en este entorno.
- Persistencia real en `LaEspumaDorada` por la misma razon.
- Acciones reales de edicion y eliminacion desde filas existentes, porque no se pudieron listar registros sin MySQL.

## Pendientes

- Levantar MySQL y crear la base con `db/schema.sql`.
- Validar manualmente altas, ediciones y eliminaciones con datos reales.
- Agregar pruebas automatizadas de interfaz si el proyecto lo requiere.
- Agregar paginacion si el volumen de datos crece.
