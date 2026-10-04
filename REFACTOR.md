# Análisis y refactorización - ProductCatalog.jsx

## Snippet original

```jsx
// ProductCatalog.jsx
import React, { useState } from "react";

let cachedProducts = [];

function ProductCatalog(props) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [points, setPoints] = useState(0);

  // Se dispara en cada render
  fetch("https://api.tienda.com/products?category=" + props.category)
    .then((res) => res.json())
    .then((data) => {
      cachedProducts = data;
      setProducts(data);
    });

  function handleSearch(e) {
    setSearch(e.target.value);
    var filtered = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].name.indexOf(e.target.value) > -1) {
        filtered.push(products[i]);
      }
    }
    setProducts(filtered);
  }

  function addToCart(product) {
    cart.push(product);
    setCart(cart);
    setPoints(points + 10);
    fetch("https://api.tienda.com/users/1/points", {
      method: "POST",
      body: JSON.stringify({ points: points + 10 }),
    });
  }

  return (
    <div>
      <input value={search} onChange={handleSearch} />
      <p>Puntos: {points}</p>
      {products.map((p) => (
        <div onClick={() => addToCart(p)}>
          <img src={p.image} />
          <span>{p.name}</span>
          <span>${p.price}</span>
        </div>
      ))}
      <div>Items en carrito: {cart.length}</div>
    </div>
  );
}

export default ProductCatalog;
```

## Problemas identificados

1. **Fetch en cada render**: La llamada a `fetch` está directamente en el cuerpo del componente, por lo que se ejecuta en cada render. Esto genera un bucle infinito de peticiones y re-renders.
2. **Mutación del estado del carrito**: `cart.push(product)` muta el array del estado. React no detecta cambios en referencias mutadas, así que el carrito puede no actualizarse correctamente.
3. **Puntos calculados con estado desactualizado**: `setPoints(points + 10)` usa `points` del closure actual, lo que puede llevar a resultados incorrectos si hay varios clicks seguidos.
4. **No se usa `useEffect`**: Las peticiones a la API deben ir dentro de `useEffect` para controlar cuándo se ejecutan.
5. **No hay manejo de loading ni errores**: Si la API falla, la app se queda en silencio sin feedback para el usuario.
6. **Búsqueda destructiva**: Al filtrar, `setProducts(filtered)` sobreescribe la lista original. Si borras el texto de búsqueda, los productos no vuelven a aparecer porque se perdió la lista base.
7. **Variables globales innecesarias**: `cachedProducts` es una variable fuera del componente que genera side effects globales y no es reactiva.
8. **Uso de `var`**: Es preferible usar `const` o `let` por scope y claridad.
9. **Falta `key` en el `.map`**: React necesita una `key` única en listas para evitar renders incorrectos.
10. **Accesibilidad y semántica**: los productos se hacen clickeables con un `div`, sin `alt` en la imagen ni roles.

## Versión refactorizada

```jsx
// ProductCatalog.jsx
import React, { useEffect, useMemo, useState } from "react";

function ProductCatalog({ category }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar productos una sola vez cuando cambia la categoría.
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://api.tienda.com/products?category=${encodeURIComponent(category)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar productos");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  // Filtrado reactivo sin modificar la lista original.
  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const term = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(term));
  }, [products, search]);

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function addToCart(product) {
    setCart((prev) => [...prev, product]);
    setPoints((prev) => {
      const newPoints = prev + 10;
      fetch("https://api.tienda.com/users/1/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: newPoints }),
      });
      return newPoints;
    });
  }

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <input
        value={search}
        onChange={handleSearch}
        placeholder="Buscar productos..."
      />
      <p>Puntos: {points}</p>
      {filteredProducts.map((p) => (
        <div key={p.id}>
          <img src={p.image} alt={p.name} />
          <span>{p.name}</span>
          <span>${p.price}</span>
          <button onClick={() => addToCart(p)}>Agregar al carrito</button>
        </div>
      ))}
      <div>Items en carrito: {cart.length}</div>
    </div>
  );
}

export default ProductCatalog;
```

## Decisiones técnicas

- **`useEffect` con dependencia `[category]`**: asegura que la petición solo se dispare cuando cambia la categoría, evitando el bucle infinito.
- **`useMemo` para el filtrado**: mantiene la lista original intacta y calcula los productos filtrados de forma reactiva.
- **Actualizaciones funcionales**: `setCart((prev) => [...])` y `setPoints((prev) => ...)` evitan depender de valores desactualizados del estado.
- **Manejo de loading y error**: da feedback al usuario y evita silencios en caso de fallos de red.
- **Uso de `key` en listas**: React puede identificar cada elemento y renderizar eficientemente.
- **Mejoras de accesibilidad**: `button` en lugar de `div` clickeable y `alt` en imágenes.
