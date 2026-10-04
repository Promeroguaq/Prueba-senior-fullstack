# Catálogo con Recompensas

## 📋 Descripción

Catálogo de productos con carrito y puntos. Backend en Node.js + Express y frontend en React + Vite + TypeScript. Sirve para mostrar arquitectura limpia, capas separadas y manejo de errores.

## 🚀 Cómo ejecutarlo

Necesitas Node.js 18 o superior.

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

El frontend se abre en `http://localhost:5173` (Vite puede usar `5174` si el anterior está ocupado).

### Solución de problemas comunes

- **Puerto 3001 ocupado**: corre `cd backend && npm run kill-port` o `npm run dev:clean`.
- **Error de CORS**: el backend acepta cualquier `http://localhost:<puerto>` en desarrollo; verifica que esté corriendo.
- **Frontend no conecta**: revisa que `VITE_API_URL` apunte a `http://localhost:3001/api`.

## 🧠 Decisiones de arquitectura

- **Persistencia en memoria**: usé `data.js` para no depender de una base de datos. En producción cambiaría solo la capa de datos.
- **Separación en capas**: `routes` reciben peticiones, `services` tienen la lógica y `data` guarda el estado. Así es más fácil de testear.
- **Context API en vez de Redux**: el estado es pequeño, no hace falta una librería pesada.
- **Actualización optimista**: el carrito cambia al instante y se revierte si el backend falla.
- **CORS dinámico**: acepta cualquier `localhost` en desarrollo, porque Vite cambia de puerto si `5173` está ocupado.
- **Debounce en búsqueda**: espera 300 ms para no hacer una petición por tecla.

## 🎯 Reglas de puntos

- Agregar producto: **+10 puntos**.
- Quitar producto: **-10 puntos**.
- Los puntos se calculan **siempre en el servidor**. El frontend solo envía `productoId`.

## 🤔 Supuestos

- Un solo usuario hardcodeado con `id = 1`.
- Los datos viven en memoria y se reinician al arrancar el backend.
- Filtros, búsqueda y paginación se hacen en el servidor.
- El backend está en `http://localhost:3001`, configurable con `VITE_API_URL`.

## ⏭️ Qué faltó y qué haría con más tiempo

- Autenticación con JWT.
- Base de datos real (PostgreSQL o MongoDB).
- Tests más completos en frontend y backend.
- Historial de puntos y favoritos.
- Manejo de concurrencia en stock.

## 📁 Estructura del proyecto

```
backend/
  src/
    data.js          # Datos en memoria
    index.js         # Servidor Express
    routes/          # Endpoints
    services/        # Lógica de negocio
    tests/           # Tests con Jest y Supertest
  scripts/
    kill-port.js     # Libera el puerto 3001

frontend/
  src/
    components/      # Header, Catalog, Cart
    context/         # CartContext
    services/        # Llamadas a la API
    index.css        # Estilos responsive

package.json         # Scripts de la raíz
README.md            # Este archivo
REFACTOR.md          # Análisis de la Parte 2
```

## 🔌 Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Información de la API |
| GET | `/api/productos` | Lista paginada y filtrada |
| GET | `/api/usuario` | Usuario y puntos |
| POST | `/api/carrito/agregar` | Agrega un producto (`{ productoId }`) |
| POST | `/api/carrito/eliminar` | Quita un producto (`{ productoId }`) |

`GET /api/productos` acepta `?page=1&limit=5&categoria=Electronica&buscar=camiseta`.

## 🔍 Parte 2 - Refactor

El análisis del snippet problemático está en `REFACTOR.md`. Se corrige el bucle de fetch, la mutación de estado y el filtrado destructivo usando `useEffect`, `useMemo` y actualizaciones funcionales.
