# CORRECTION.md

## Analisis realizado

Antes de modificar archivos se reviso la estructura completa del proyecto. La raiz tenia dos carpetas principales con nombres largos:

- una carpeta para backend NodeJS + Express + MySQL.
- una carpeta para frontend Vite + React.

Tambien existia `CORRECTION.md` en la raiz. Cada subproyecto tenia su propio `package.json`, `package-lock.json`, README, `.gitignore`, archivo de ejemplo de entorno y dependencias separadas.

## Problemas encontrados

- Las carpetas principales no seguian la organizacion solicitada de `back` y `front`.
- Habia `.gitignore` duplicados dentro de backend y frontend, pero no un `.gitignore` global en la raiz.
- Los archivos de ejemplo de entorno usaban un nombre no estandar frente a `.env.example`.
- El ejemplo de variables del backend incluia `VITE_API_BASE_URL`, que pertenece al frontend.
- El ejemplo de variables del frontend incluia variables de MySQL, que pertenecen al backend.
- La documentacion mencionaba rutas antiguas o genericas que ya no coincidian con `back` y `front`.
- `node_modules` y `dist` fueron identificados como generados automaticamente; se conservaron localmente, pero quedaron ignorados por `.gitignore`.

## Cambios realizados

- Se renombro la carpeta del backend a `back`.
- Se renombro la carpeta del frontend a `front`.
- Se creo un `README.md` global en la raiz con comandos de ejecucion para ambos lados.
- Se creo un `.gitignore` global en la raiz.
- Se eliminaron los `.gitignore` duplicados dentro de `back` y `front` porque la raiz ahora cubre ambos subproyectos.
- Se normalizo el archivo de entorno de backend como `back/.env.example`.
- Se normalizo el archivo de entorno de frontend como `front/.env.example`.
- Se separaron correctamente las variables de entorno de backend y frontend.
- Se actualizaron README internos y `front/FRONTEND_REPORT.md` para usar la ruta final `front`.
- Se corrigio `back/package.json`: `main` ahora apunta a `server.js` y `npm test` ejecuta una verificacion de sintaxis real.
- Se actualizo el nombre npm del backend a `crudos-system-back` en `back/package.json` y `back/package-lock.json`.
- Se actualizo el nombre npm del frontend a `crudos-system-front` en `front/package.json` y `front/package-lock.json`.

## Rutas corregidas

- Comandos de instalacion y ejecucion:
  - `cd back`
  - `cd front`
- Documentacion de variables de entorno:
  - `back/.env.example`
  - `front/.env.example`
- Referencias documentales a archivos frontend:
  - `front/src/api/client.js`
  - `front/src/api/consultasApi.js`
  - `front/src/pages/*`
  - `front/src/components/*`

No fue necesario cambiar imports internos del backend ni del frontend porque todos eran relativos dentro de cada subproyecto y siguieron funcionando despues del renombrado.

## Organizacion final

```text
Proyecto/
  .gitignore
  README.md
  CORRECTION.md
  back/
    .env.example
    README.md
    package.json
    package-lock.json
    server.js
    controllers/
    db/
    model/
    routes/
    node_modules/
  front/
    .env.example
    README.md
    FRONTEND_REPORT.md
    index.html
    package.json
    package-lock.json
    vite.config.js
    src/
      api/
      components/
      config/
      pages/
      styles/
    dist/
    node_modules/
```

`node_modules/` y `dist/` aparecen porque existen localmente tras instalar/compilar, pero son generados y estan ignorados por `.gitignore`.

## Archivos que quedaron en raiz

- `.gitignore`: aplica reglas comunes para backend, frontend, dependencias, builds, logs y variables reales.
- `README.md`: explica como ejecutar el proyecto completo desde la nueva organizacion.
- `CORRECTION.md`: documenta el analisis, cambios y validacion.

Los README especificos de `back` y `front` se conservaron dentro de cada carpeta porque documentan solo ese subproyecto.

## Decisiones sobre package.json y package-lock.json

Se conservaron dos proyectos npm independientes:

- `back/package.json` y `back/package-lock.json` para Express, MySQL, CORS, dotenv y nodemon.
- `front/package.json` y `front/package-lock.json` para Vite, React y lucide-react.

No se unificaron en un `package.json` raiz porque backend y frontend tienen dependencias, scripts y ciclos de ejecucion separados. Unificarlos habria requerido crear una configuracion nueva de workspace o scripts raiz que no era necesaria para mantener el funcionamiento.

## Validacion

Validaciones realizadas despues de reorganizar:

- `npm test` en `back` paso correctamente y verifico `server.js`.
- `node --check controllers/consultas.controller.js` paso correctamente en `back`.
- `npm run build` en `front` paso correctamente.
- El backend levanto y respondio `GET /health` con estado `200`.
- El frontend levanto y respondio `http://127.0.0.1:5173/` con estado `200`.
- Se verifico que no quedaran referencias a carpetas antiguas ni al nombre anterior del archivo de entorno en archivos fuente/documentacion, excluyendo dependencias y build generado.
- `GET /api/consultas/agrupadas/ventas-por-cliente` ya no falla por ruta inexistente; devuelve `ECONNREFUSED` porque MySQL no esta aceptando conexion.
- `GET /api/consultas/multitabla/cervezas-clientes-guadalajara` conserva el filtro `WHERE cl.Ciudad = 'Guadalajara'` y tambien queda bloqueada solo por la conexion MySQL.

## Pendientes o recomendaciones

- MySQL debe estar activo y con la base `LaEspumaDorada` creada para validar consultas con datos reales.
- Si se desea controlar ambos proyectos desde la raiz en el futuro, se puede agregar un `package.json` raiz con scripts coordinados, pero no se hizo porque no era necesario.
