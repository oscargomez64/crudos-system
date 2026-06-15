# Proyecto La Espuma Dorada

Sistema con backend Express + MySQL y frontend Vite + React para administrar datos y ejecutar consultas SQL.

## Organizacion

- `back`: API NodeJS/Express, conexion MySQL, rutas CRUD y rutas de consultas.
- `front`: interfaz React, vistas de consultas y modulos CRUD.
- `CORRECTION.md`: registro de analisis, reorganizacion y validaciones.

## Ejecutar backend

```bash
cd back
npm install
npm run dev
```

## Ejecutar frontend

```bash
cd front
npm install
npm run dev
```

El frontend abre en `http://127.0.0.1:5173` y consume la API en `http://localhost:3000` por defecto.

## Variables de entorno

- Backend: copia `back/.env.example` como `back/.env`.
- Frontend: copia `front/.env.example` como `front/.env`.

No subas archivos `.env` reales al repositorio.
