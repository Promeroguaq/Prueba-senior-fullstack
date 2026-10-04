// Datos en memoria para simular una base de datos.
// Usamos arrays y un objeto simple para que el proyecto corra sin instalar PostgreSQL ni Docker.

const productos = [
  { id: 1, nombre: "Camiseta Básica", precio: 19.99, categoria: "Ropa", imagen: "https://picsum.photos/seed/1/200", stock: 15 },
  { id: 2, nombre: "Pantalón Jeans", precio: 49.99, categoria: "Ropa", imagen: "https://picsum.photos/seed/2/200", stock: 8 },
  { id: 3, nombre: "Zapatillas Deportivas", precio: 89.99, categoria: "Calzado", imagen: "https://picsum.photos/seed/3/200", stock: 5 },
  { id: 4, nombre: "Auriculares Bluetooth", precio: 59.99, categoria: "Electrónica", imagen: "https://picsum.photos/seed/4/200", stock: 12 },
  { id: 5, nombre: "Reloj Inteligente", precio: 129.99, categoria: "Electrónica", imagen: "https://picsum.photos/seed/5/200", stock: 7 },
  { id: 6, nombre: "Mochila Escolar", precio: 34.99, categoria: "Accesorios", imagen: "https://picsum.photos/seed/6/200", stock: 20 },
  { id: 7, nombre: "Botella Térmica", precio: 14.99, categoria: "Hogar", imagen: "https://picsum.photos/seed/7/200", stock: 30 },
  { id: 8, nombre: "Gorra Deportiva", precio: 12.99, categoria: "Accesorios", imagen: "https://picsum.photos/seed/8/200", stock: 25 },
  { id: 9, nombre: "Teclado Mecánico", precio: 79.99, categoria: "Electrónica", imagen: "https://picsum.photos/seed/9/200", stock: 6 },
  { id: 10, nombre: "Mouse Inalámbrico", precio: 29.99, categoria: "Electrónica", imagen: "https://picsum.photos/seed/10/200", stock: 14 },
  { id: 11, nombre: "Camisa Formal", precio: 39.99, categoria: "Ropa", imagen: "https://picsum.photos/seed/11/200", stock: 9 },
  { id: 12, nombre: "Chaqueta Impermeable", precio: 89.99, categoria: "Ropa", imagen: "https://picsum.photos/seed/12/200", stock: 4 },
  { id: 13, nombre: "Libreta Premium", precio: 9.99, categoria: "Papelería", imagen: "https://picsum.photos/seed/13/200", stock: 50 },
  { id: 14, nombre: "Lámpara LED", precio: 24.99, categoria: "Hogar", imagen: "https://picsum.photos/seed/14/200", stock: 18 },
  { id: 15, nombre: "Silla Ergonómica", precio: 199.99, categoria: "Hogar", imagen: "https://picsum.photos/seed/15/200", stock: 3 },
  { id: 16, nombre: "Pelota de Fútbol", precio: 22.99, categoria: "Deportes", imagen: "https://picsum.photos/seed/16/200", stock: 11 },
  { id: 17, nombre: "Raqueta de Tenis", precio: 69.99, categoria: "Deportes", imagen: "https://picsum.photos/seed/17/200", stock: 6 },
  { id: 18, nombre: "Set de Ollas", precio: 119.99, categoria: "Hogar", imagen: "https://picsum.photos/seed/18/200", stock: 5 },
  { id: 19, nombre: "Cargador Portátil", precio: 39.99, categoria: "Electrónica", imagen: "https://picsum.photos/seed/19/200", stock: 22 },
  { id: 20, nombre: "Gafas de Sol", precio: 29.99, categoria: "Accesorios", imagen: "https://picsum.photos/seed/20/200", stock: 13 }
];

const usuario = { id: 1, nombre: "Juan Perez", puntos: 100 };
const carrito = [];

// Guardamos los datos iniciales para poder reiniciarlos en los tests.
const productosIniciales = productos.map((p) => ({ ...p }));
const usuarioInicial = { ...usuario };

function resetData() {
  // Restauramos productos mutando el array original para que los servicios vean los cambios.
  productos.splice(0, productos.length, ...productosIniciales.map((p) => ({ ...p })));
  usuario.puntos = usuarioInicial.puntos;
  carrito.length = 0;
}

module.exports = { productos, usuario, carrito, resetData };
