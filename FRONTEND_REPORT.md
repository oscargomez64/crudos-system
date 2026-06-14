# FRONTEND_REPORT.md

## Tecnologia usada

- Vite
- React
- JavaScript
- CSS propio
- lucide-react para iconos de interfaz

## Archivos creados

- `frontend/package.json`
- `frontend/index.html`
- `frontend/vite.config.js`
- `frontend/.env.example`
- `frontend/.gitignore`
- `frontend/README.md`
- `frontend/FRONTEND_REPORT.md`
- `frontend/src/main.jsx`
- `frontend/src/App.jsx`
- `frontend/src/api/client.js`
- `frontend/src/api/resources.js`
- `frontend/src/config/entities.js`
- `frontend/src/components/Layout.jsx`
- `frontend/src/components/Sidebar.jsx`
- `frontend/src/components/DataTable.jsx`
- `frontend/src/components/EntityForm.jsx`
- `frontend/src/components/ConfirmDialog.jsx`
- `frontend/src/components/Toast.jsx`
- `frontend/src/components/StatusBadge.jsx`
- `frontend/src/components/LoadingState.jsx`
- `frontend/src/components/EmptyState.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/EntityCrudPage.jsx`
- `frontend/src/styles/global.css`
- `frontend/src/styles/layout.css`
- `frontend/src/styles/components.css`

## Como instalar

```bash
cd frontend
npm install
```

## Como ejecutar

Primero levanta el backend desde la raiz del proyecto:

```bash
npm start
```

Luego inicia el frontend:

```bash
cd frontend
npm run dev
```

## Variable de entorno

El frontend usa:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Todas las llamadas HTTP se centralizan en `frontend/src/api/client.js`.

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
