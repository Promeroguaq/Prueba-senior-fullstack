// Rutas para agregar y eliminar productos del carrito.
// Las rutas solo reciben la petición, llaman al servicio y responden con el código HTTP correcto.

const express = require("express");
const { agregarProducto, eliminarProducto } = require("../services/carritoService");

const router = express.Router();

// POST /api/carrito/agregar
router.post("/agregar", (req, res) => {
  try {
    const { productoId } = req.body;
    const resultado = agregarProducto(productoId);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// POST /api/carrito/eliminar
router.post("/eliminar", (req, res) => {
  try {
    const { productoId } = req.body;
    const resultado = eliminarProducto(productoId);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;
