// Ruta para obtener los datos del usuario.

const express = require("express");
const { usuario } = require("../data");

const router = express.Router();

// GET /api/usuario
router.get("/", (req, res) => {
  try {
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
