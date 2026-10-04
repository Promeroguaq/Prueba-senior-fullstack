import { useCart } from "../context/CartContext";

export default function Catalog() {
  const {
    productos,
    pagina,
    limite,
    categoria,
    buscar,
    cargando,
    error,
    setPagina,
    setCategoria,
    setBuscar,
    agregarProducto,
    recargarProductos,
    limpiarError,
  } = useCart();

  const categorias = ["", "Ropa", "Calzado", "Electrónica", "Accesorios", "Hogar", "Papelería", "Deportes"];

  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuscar(e.target.value);
    setPagina(1); // Siempre volvemos a la primera página al buscar.
  };

  const handleCategoria = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoria(e.target.value);
    setPagina(1);
  };

  return (
    <section className="catalog">
      <h2>Productos</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar..."
          value={buscar}
          onChange={handleBuscar}
          className="input-search"
        />
        <select value={categoria} onChange={handleCategoria} className="select-category">
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c || "Todas las categorías"}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="error-message">
          <span style={{ whiteSpace: "pre-line" }}>{error}</span>
          <div className="error-actions">
            <button onClick={recargarProductos}>Reintentar</button>
            <button onClick={limpiarError}>×</button>
          </div>
        </div>
      )}

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <>
          {productos.length === 0 ? (
            <p>No se encontraron productos.</p>
          ) : (
            <div className="product-grid">
              {productos.map((producto) => (
                <div key={producto.id} className="product-card">
                  <img src={producto.imagen} alt={producto.nombre} />
                  <h3>{producto.nombre}</h3>
                  <p className="category">{producto.categoria}</p>
                  <p className="price">${producto.precio.toFixed(2)}</p>
                  <p className="stock">Stock: {producto.stock}</p>
                  <button
                    onClick={() => agregarProducto(producto)}
                    disabled={producto.stock <= 0}
                    className="btn-add"
                  >
                    {producto.stock > 0 ? "Agregar" : "Sin stock"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pagination">
            <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>
              Anterior
            </button>
            <span>Página {pagina}</span>
            <button onClick={() => setPagina(pagina + 1)} disabled={productos.length < limite}>
              Siguiente
            </button>
          </div>
        </>
      )}
    </section>
  );
}
