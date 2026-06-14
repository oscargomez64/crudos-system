# crudos-system

Backend CRUD en Node.js/Express para gestionar clientes, cervezas, proveedores, ingredientes, pedidos y relaciones entre pedidos/cervezas y cervezas/ingredientes.

## Tecnologias

- Node.js
- Express
- MySQL
- mysql2/promise
- dotenv
- cors

## Instalacion

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` basado en `/.env-example`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=LaEspumaDorada
DB_PORT=3306
```

## Base de datos

El schema propuesto esta en:

```bash
db/schema.sql
```

Para crearlo manualmente en MySQL:

```bash
mysql -u root -p < db/schema.sql
```

## Ejecucion

Modo normal:

```bash
npm start
```

Modo desarrollo con nodemon:

```bash
npm run dev
```

Verificacion de sintaxis:

```bash
npm test
```

## Healthcheck

```http
GET /health
```

Respuesta esperada:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "message": "API crudOS funcionando correctamente"
  }
}
```

## Endpoints principales

- `/api/cliente`
- `/api/cerveza`
- `/api/proveedor`
- `/api/ingrediente`
- `/api/pedido`
- `/api/pedido_cerveza`
- `/api/cerveza_ingrediente`

Cada recurso expone operaciones CRUD segun su ruta. Las relaciones compuestas usan query params para sus llaves, por ejemplo:

```http
GET /api/pedido_cerveza?idPedido=1&idCerveza=2
GET /api/cerveza_ingrediente?idCerveza=1&idIngrediente=3
```
