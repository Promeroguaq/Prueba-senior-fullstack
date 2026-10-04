// Rutas para listar productos.

const express = require("express");
const { listar } = require("../services/productoService");

const router = express.Router();

// GET /api/productos?page=1&limit=10&categoria=Ropa&buscar=camiseta
router.get("/", (req, res) => {
  try {
    const { page, limit, categoria, buscar } = req.query;
    const resultado = listar(page, limit, categoria, buscar);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
