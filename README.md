# Frontend La Espuma Dorada

Interfaz CRUD en Vite + React para administrar la base `LaEspumaDorada` consumiendo la API Express del backend.

## Requisitos

- Node.js
- Backend corriendo en `http://localhost:3000`

## Instalacion

```bash
cd frontend
npm install
```

## Variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Ejecucion

```bash
npm run dev
```

La app se abre por defecto en:

```text
http://127.0.0.1:5173
```

## Build

```bash
npm run build
```

## Modulos incluidos

- Clientes
- Cervezas
- Proveedores
- Ingredientes
- Pedidos
- Pedido - Cerveza
- Cerveza - Ingrediente

Todas las operaciones usan `fetch` hacia el backend. El frontend no se conecta directamente a MySQL.
