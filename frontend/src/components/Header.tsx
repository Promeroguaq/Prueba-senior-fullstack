import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { getUsuario } from "../services/api";

// Indicador de conexión al backend con polling cada 10 segundos.
export default function Header() {
  const { puntos, carrito } = useCart();
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    const verificarConexion = async () => {
      try {
        await getUsuario();
        setConectado(true);
      } catch {
        setConectado(false);
      }
    };

    verificarConexion();
    const intervalo = setInterval(verificarConexion, 10000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <header className="header">
      <h1>Catálogo con Recompensas</h1>
      <div className="header-info">
        <span
          className="connection-status"
          style={{ color: conectado ? "green" : "red" }}
        >
          {conectado ? "🟢 Conectado" : "🔴 Sin conexión"}
        </span>
        <span className="points">Puntos: {puntos}</span>
        <span className="cart-count">Carrito: {carrito.length}</span>
      </div>
    </header>
  );
}
