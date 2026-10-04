// Punto de entrada del servidor Node.js + Express.

const express = require("express");
const cors = require("cors");

const productosRouter = require("./routes/productos");
const usuarioRouter = require("./routes/usuario");
const carritoRouter = require("./routes/carrito");

const app = express();
// El puerto se puede configurar con la variable de entorno PORT.
const PORT = process.env.PORT || 3001;

// Habilitamos CORS para que cualquier frontend en localhost pueda llamar al backend.
// En producción deberías restringir esto al dominio real de tu app.
app.use(cors({
  origin: (origin, callback) => {
    // Permitimos peticiones sin origin (Postman, curl, tests) y cualquier localhost.
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));

// Permitimos leer cuerpo de peticiones en JSON.
app.use(express.json());

// Ruta raíz informativa para que al abrir http://localhost:3001 no devuelva 404.
app.get("/", (req, res) => {
  res.status(200).json({
    nombre: "API Catálogo con Recompensas",
    version: "1.0.0",
    estado: "activa",
    endpoints: {
      productos: "GET /api/productos?page=1&limit=5&categoria=X&buscar=Y",
      usuario: "GET /api/usuario",
      agregarAlCarrito: "POST /api/carrito/agregar",
      eliminarDelCarrito: "POST /api/carrito/eliminar"
    },
    documentacion: "Prueba los endpoints desde Postman o Thunder Client"
  });
});

// Montamos las rutas bajo /api.
app.use("/api/productos", productosRouter);
app.use("/api/usuario", usuarioRouter);
app.use("/api/carrito", carritoRouter);

// Manejo descriptivo para rutas que no existen.
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    ruta: `${req.method} ${req.originalUrl}`,
    sugerencia: "Prueba GET / para ver los endpoints disponibles"
  });
});

// Middleware global para capturar errores no controlados.
// Express reconoce un error middleware porque tiene 4 argumentos.
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err);
  res.status(500).json({
    error: "Error interno del servidor",
    mensaje: err.message
  });
});

// Exportamos la app para que los tests puedan usarla sin levantar el servidor.
module.exports = app;

// Solo arrancamos el servidor si ejecutamos este archivo directamente.
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
  });

  // Capturamos errores del servidor, como el puerto ya en uso.
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`⚠️ El puerto ${PORT} ya está en uso. Cierra el proceso anterior (puedes usar "npm run kill-port") o cambia el puerto con la variable de entorno PORT.`);
    } else {
      console.error("⚠️ Error al iniciar el servidor:", error.message);
    }
    process.exit(1);
  });

  // Función para cerrar el servidor de forma ordenada.
  function cerrarServidor() {
    console.log("\nCerrando servidor...");
    server.close(() => {
      console.log("Servidor cerrado correctamente");
      process.exit(0);
    });
  }

  // Capturamos señales para evitar procesos huérfanos en Windows.
  process.on("SIGINT", cerrarServidor);
  process.on("SIGTERM", cerrarServidor);
}
