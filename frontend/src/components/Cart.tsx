import { useCart } from "../context/CartContext";

interface ProductoAgrupado {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

// Muestra el carrito agrupando productos repetidos y los totales.
export default function Cart() {
  const { carrito, puntos, eliminarProducto } = useCart();

  const agrupados: ProductoAgrupado[] = carrito.reduce((acc, producto) => {
    const existente = acc.find((item) => item.id === producto.id);
    if (existente) {
      existente.cantidad += 1;
    } else {
      acc.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
    return acc;
  }, [] as ProductoAgrupado[]);

  const totalDinero = agrupados.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalPuntos = carrito.length * 10;

  return (
    <aside className="cart">
      <h2>Carrito</h2>
      {agrupados.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          <ul className="cart-list">
            {agrupados.map((item) => (
              <li key={item.id} className="cart-item">
                <span>
                  {item.nombre} x {item.cantidad}
                </span>
                <button onClick={() => eliminarProducto(item.id)}>Quitar</button>
              </li>
            ))}
          </ul>
          <div className="cart-totals">
            <p>Total: ${totalDinero.toFixed(2)}</p>
            <p>Puntos ganados: {totalPuntos}</p>
            <p>Puntos disponibles: {puntos}</p>
          </div>
        </>
      )}
    </aside>
  );
}
