// Servicio que maneja las acciones del carrito: agregar y eliminar.
// Aquí validamos todo ANTES de modificar datos, como una transacción lógica.

const { productos, usuario, carrito } = require("../data");

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

function agregarProducto(productoId) {
  // Validamos que el ID venga y sea un número entero positivo.
  if (productoId === undefined || productoId === null) {
    throw crearError("productoId es requerido", 400);
  }

  const id = Number(productoId);
  if (!Number.isInteger(id) || id <= 0) {
    throw crearError("productoId debe ser un número válido", 400);
  }

  // Validamos que el producto exista y tenga stock.
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    throw crearError("Producto no encontrado", 400);
  }

  if (producto.stock <= 0) {
    throw crearError("Sin stock disponible", 400);
  }

  // Todo validado: ahora modificamos stock, puntos y carrito.
  producto.stock -= 1;
  usuario.puntos += 10;
  carrito.push(producto);

  return {
    usuario,
    carrito,
    mensaje: "Producto agregado al carrito"
  };
}

function eliminarProducto(productoId) {
  if (productoId === undefined || productoId === null) {
    throw crearError("productoId es requerido", 400);
  }

  const id = Number(productoId);
  if (!Number.isInteger(id) || id <= 0) {
    throw crearError("productoId debe ser un número válido", 400);
  }

  // Buscamos la última aparición del producto en el carrito.
  const indice = carrito.map((p) => p.id).lastIndexOf(id);
  if (indice === -1) {
    throw crearError("El producto no está en el carrito", 400);
  }

  const producto = carrito[indice];

  // Devolvemos stock, restamos puntos y sacamos el producto del carrito.
  producto.stock += 1;
  usuario.puntos -= 10;
  carrito.splice(indice, 1);

  return {
    usuario,
    carrito,
    mensaje: "Producto eliminado del carrito"
  };
}

module.exports = { agregarProducto, eliminarProducto };
