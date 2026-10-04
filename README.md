# Catálogo con Recompensas

## 📋 Descripción

Un catálogo de productos con carrito y puntos. Hice el backend en Node.js + Express y el frontend en React + Vite + TypeScript. La idea es que un usuario pueda ver productos, filtrarlos, agregarlos al carrito y ganar o perder puntos según lo que haga.

## 🚀 Cómo ejecutarlo

Necesitas Node.js 18+. Abre dos terminales separadas, una para el backend y otra para el frontend.

### Backend

```powershell
cd backend
npm install
npm run dev
```

El backend queda en `http://localhost:3001`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

El frontend se abre en `http://localhost:5173`. Si ese puerto está ocupado, Vite usa el siguiente, por ejemplo `http://localhost:5174`.

### Si algo falla

- **Puerto 3001 ocupado**: corre `cd backend && npm run kill-port` o `npm run dev:clean`.
- **CORS**: el backend acepta cualquier `localhost` en desarrollo. Si falla, revisa que ambos servidores estén corriendo.
- **No conecta frontend**: revisa `VITE_API_URL` en `frontend/.env`. Por defecto apunta a `http://localhost:3001/api`.

## 🧠 Decisiones técnicas

- Guardé los datos en memoria (`backend/src/data.js`) porque quería enfocarme en la lógica de negocio. Si luego se migra a PostgreSQL o MongoDB, solo habría que reemplazar la capa de datos sin tocar `services` ni `routes`.
- Separé `routes`, `services` y `data` para no mezclar la lógica con los endpoints. `routes` recibe y responde; `services` hace los cálculos.
- Usé Context API porque solo manejo carrito y puntos. Redux era demasiado para esto.
- La actualización del carrito es optimista: la UI cambia al instante y si el backend falla, se revierte y se muestra el error.
- Configuré CORS para aceptar cualquier `http://localhost:<puerto>` porque Vite cambia de puerto cuando `5173` está ocupado.
- Añadí un debounce de 300ms en la búsqueda para no hacer un fetch por cada letra que escribe el usuario.

## 🎯 Reglas de puntos

- Agregar un producto al carrito: **+10 puntos**.
- Quitar un producto del carrito: **-10 puntos**.
- Los puntos se calculan siempre en el backend. El frontend solo envía `productoId` y recibe el nuevo saldo. Así evito que alguien manipule sus puntos desde el navegador.

## 🤔 Supuestos

- Asumí un solo usuario hardcodeado con `id = 1` porque no había requisito de autenticación.
- Los datos viven en memoria: si reiniciás el backend, se resetean.
- Filtros, búsqueda y paginación los hago en el servidor.
- El frontend asume que el backend está en `http://localhost:3001`, configurable por `VITE_API_URL`.

## ⏭️ Qué faltó

- No implementé autenticación real. Se podría agregar con JWT sin tocar los servicios actuales.
- No hay base de datos. Migrar a PostgreSQL sería cambiar el repositorio y nada más.
- Los tests cubren los endpoints básicos, no todos los casos borde.
- No manejé concurrencia en el stock: si dos usuarios compran el último producto al mismo tiempo, podría haber inconsistencia.
- No llegué a tests en el frontend ni a toast notifications más elegantes.

## 📁 Estructura del proyecto

```
backend/
  scripts/kill-port.js    # Mata procesos que ocupan el puerto 3001
  src/
    data.js               # Productos, usuario y carrito en memoria
    index.js              # Servidor Express y middlewares
    routes/               # Endpoints
    services/             # Lógica de negocio
    tests/                # Tests con Jest + Supertest

frontend/
  src/
    components/           # Header, Catalog, Cart
    context/              # CartContext con actualización optimista
    services/             # Llamadas a la API
    index.css             # Estilos responsive
```

## 🔌 Endpoints

| Método | Ruta | Descripción | Ejemplo |
|--------|------|-------------|---------|
| GET | `/` | Información de la API | `curl http://localhost:3001/` |
| GET | `/api/productos` | Lista paginada y filtrada | `curl "http://localhost:3001/api/productos?page=1&limit=5&categoria=Electronica&buscar=camiseta"` |
| GET | `/api/usuario` | Datos del usuario y puntos | `curl http://localhost:3001/api/usuario` |
| POST | `/api/carrito/agregar` | Agrega un producto al carrito | `curl -X POST http://localhost:3001/api/carrito/agregar -H "Content-Type: application/json" -d "{\"productoId\":1}"` |
| POST | `/api/carrito/eliminar` | Quita un producto del carrito | `curl -X POST http://localhost:3001/api/carrito/eliminar -H "Content-Type: application/json" -d "{\"productoId\":1}"` |

## 🔍 Parte 2 - Refactor

En `REFACTOR.md` analicé un snippet problemático. Los errores más críticos eran el `fetch` dentro del render, la mutación del estado del carrito y el cálculo de puntos en el cliente. La refactorización corrige esos problemas usando `useEffect`, `useMemo` y actualizaciones funcionales. Dejé tests y accesibilidad avanzada para una segunda iteración.

## 📝 Notas finales

Hice esta prueba en unas pocas horas. Prioricé la lógica de negocio y que la experiencia de usuario se sintiera rápida (actualización optimista, debounce, buen manejo de errores) sobre tests extensivos o autenticación completa. Si tuviera más tiempo, empezaría por agregar autenticación con JWT, una base de datos real y tests de integración.
