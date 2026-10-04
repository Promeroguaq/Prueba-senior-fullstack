// Funciones para hablar con el backend Node.js/Express.
// Todas devuelven promesas tipadas para que TypeScript nos ayude en el frontend.

// La URL de la API se puede configurar con la variable de entorno VITE_API_URL.
const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:3001/api";
// Base del backend (sin /api) para mostrar mensajes amigables de conexión.
const API_BASE = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  stock: number;
}

export interface Usuario {
  id: number;
  nombre: string;
  puntos: number;
}

export interface EstadoCarrito {
  usuario: Usuario;
  carrito: Producto[];
  mensaje: string;
}

export interface FiltrosProductos {
  page: number;
  limit: number;
  categoria?: string;
  buscar?: string;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response;
  // Si el backend no responde en 5 segundos, cancelamos la petición.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    response = await fetch(url, { ...options, signal: controller.signal });
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("El servidor tardó demasiado en responder");
    }
    throw new Error(`No se pudo conectar con el servidor en ${API_BASE}. Asegúrate de que el backend esté corriendo con: cd backend && npm run dev`);
  } finally {
    clearTimeout(timeoutId);
  }

  // Intentamos parsear la respuesta como JSON; si falla, usamos un objeto vacío.
  let data: any = {};
  try {
    data = await response.json();
  } catch {
    // Si el backend devuelve HTML o texto plano, data queda vacío.
  }

  if (!response.ok) {
    throw new Error(data.error || data.detail || `Error ${response.status} en la petición`);
  }

  return data;
}

export async function getUsuario(): Promise<Usuario> {
  return fetchJson<Usuario>(`${API_URL}/usuario`);
}

export async function getProductos(filtros: FiltrosProductos): Promise<Producto[]> {
  const params = new URLSearchParams();
  params.append("page", String(filtros.page));
  params.append("limit", String(filtros.limit));
  if (filtros.categoria) params.append("categoria", filtros.categoria);
  if (filtros.buscar) params.append("buscar", filtros.buscar);

  return fetchJson<Producto[]>(`${API_URL}/productos?${params.toString()}`);
}

export async function agregarAlCarrito(productoId: number): Promise<EstadoCarrito> {
  return fetchJson<EstadoCarrito>(`${API_URL}/carrito/agregar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productoId }),
  });
}

export async function eliminarDelCarrito(productoId: number): Promise<EstadoCarrito> {
  return fetchJson<EstadoCarrito>(`${API_URL}/carrito/eliminar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productoId }),
  });
}
