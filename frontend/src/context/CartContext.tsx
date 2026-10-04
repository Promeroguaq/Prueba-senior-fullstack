import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import {
  agregarAlCarrito,
  eliminarDelCarrito,
  getProductos,
  getUsuario,
  Producto,
} from "../services/api";

interface CartContextType {
  carrito: Producto[];
  puntos: number;
  error: string | null;
  cargando: boolean;
  productos: Producto[];
  pagina: number;
  limite: number;
  categoria: string;
  buscar: string;
  setPagina: (pagina: number) => void;
  setCategoria: (categoria: string) => void;
  setBuscar: (buscar: string) => void;
  agregarProducto: (producto: Producto) => Promise<void>;
  eliminarProducto: (productoId: number) => Promise<void>;
  recargarProductos: () => void;
  limpiarError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [puntos, setPuntos] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const [productos, setProductos] = useState<Producto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(10);
  const [categoria, setCategoria] = useState("");
  // El input de búsqueda vive en `buscar`; la API usa `buscarDebounced` para no petar el servidor.
  const [buscar, setBuscar] = useState("");
  const [buscarDebounced, setBuscarDebounced] = useState("");

  // Cargar puntos del usuario al iniciar.
  useEffect(() => {
    getUsuario()
      .then((usuario) => setPuntos(usuario.puntos))
      .catch((err) => setError(err.message));
  }, []);

  // Debounce de 300ms para la búsqueda.
  useEffect(() => {
    const timer = setTimeout(() => setBuscarDebounced(buscar), 300);
    return () => clearTimeout(timer);
  }, [buscar]);

  // Función que carga los productos según los filtros actuales.
  const cargarProductos = useCallback(() => {
    setCargando(true);
    getProductos({
      page: pagina,
      limit: limite,
      categoria: categoria || undefined,
      buscar: buscarDebounced || undefined,
    })
      .then((data) => {
        setProductos(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [pagina, limite, categoria, buscarDebounced]);

  // Cargar productos cuando cambian los filtros o la página.
  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const recargarProductos = () => cargarProductos();

  const agregarProducto = async (producto: Producto) => {
    if (producto.stock <= 0) {
      setError("Sin stock disponible");
      return;
    }

    // Actualización optimista: modificamos la UI antes de llamar al backend.
    setCarrito((prev) => [...prev, producto]);
    setPuntos((prev) => prev + 10);
    setProductos((prev) =>
      prev.map((p) => (p.id === producto.id ? { ...p, stock: p.stock - 1 } : p))
    );
    setError(null);

    try {
      const response = await agregarAlCarrito(producto.id);
      setPuntos(response.usuario.puntos);
      setProductos((prev) =>
        prev.map((p) => {
          if (p.id !== producto.id) return p;
          const actualizado = response.carrito.find((c) => c.id === producto.id);
          return actualizado ? { ...actualizado } : p;
        })
      );
    } catch (err: any) {
      // Si el backend falla, revertimos el cambio optimista.
      setCarrito((prev) => {
        const ids = prev.map((p) => p.id);
        const index = ids.lastIndexOf(producto.id);
        if (index === -1) return prev;
        const actualizado = [...prev];
        actualizado.splice(index, 1);
        return actualizado;
      });
      setPuntos((prev) => prev - 10);
      setProductos((prev) =>
        prev.map((p) => (p.id === producto.id ? { ...p, stock: p.stock + 1 } : p))
      );
      setError(err.message);
    }
  };

  const eliminarProducto = async (productoId: number) => {
    const ids = carrito.map((p) => p.id);
    const index = ids.lastIndexOf(productoId);

    if (index === -1) {
      setError("El producto no está en el carrito");
      return;
    }

    const removido = carrito[index];
    const actualizado = [...carrito];
    actualizado.splice(index, 1);

    // Actualización optimista.
    setCarrito(actualizado);
    setPuntos((prev) => prev - 10);
    setProductos((prev) =>
      prev.map((p) => (p.id === productoId ? { ...p, stock: p.stock + 1 } : p))
    );
    setError(null);

    try {
      const response = await eliminarDelCarrito(productoId);
      setPuntos(response.usuario.puntos);
      setProductos((prev) =>
        prev.map((p) => {
          if (p.id !== productoId) return p;
          const actualizado = response.carrito.find((c) => c.id === productoId);
          return actualizado ? { ...actualizado } : p;
        })
      );
    } catch (err: any) {
      // Revertir si el backend falla.
      setCarrito((prev) => [...prev, removido]);
      setPuntos((prev) => prev + 10);
      setProductos((prev) =>
        prev.map((p) => (p.id === productoId ? { ...p, stock: p.stock - 1 } : p))
      );
      setError(err.message);
    }
  };

  const limpiarError = () => setError(null);

  return (
    <CartContext.Provider
      value={{
        carrito,
        puntos,
        error,
        cargando,
        productos,
        pagina,
        limite,
        categoria,
        buscar,
        setPagina,
        setCategoria,
        setBuscar,
        agregarProducto,
        eliminarProducto,
        recargarProductos,
        limpiarError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
