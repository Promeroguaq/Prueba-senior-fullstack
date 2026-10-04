// Tests básicos de los endpoints usando supertest y jest.

const request = require("supertest");
const app = require("../index");
const { resetData, productos, usuario } = require("../data");

describe("API del catálogo", () => {
  // Reiniciamos los datos antes de cada test para que no se contaminen entre sí.
  beforeEach(() => {
    resetData();
  });

  test("GET /api/productos devuelve un array paginado", async () => {
    const response = await request(app)
      .get("/api/productos?page=1&limit=5")
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(5);
    expect(response.body[0]).toHaveProperty("nombre");
  });

  test("GET /api/productos?categoria=Electronica filtra correctamente", async () => {
    const response = await request(app)
      .get("/api/productos")
      .query({ categoria: "Electrónica", limit: 100 })
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.every((p) => p.categoria === "Electrónica")).toBe(true);
  });

  test("GET /api/productos?buscar=camiseta encuentra coincidencias", async () => {
    const response = await request(app)
      .get("/api/productos")
      .query({ buscar: "camiseta", limit: 100 })
      .expect(200);

    expect(response.body.some((p) => p.nombre.toLowerCase().includes("camiseta"))).toBe(true);
  });

  test("POST /api/carrito/agregar con ID válido suma puntos y resta stock", async () => {
    const response = await request(app)
      .post("/api/carrito/agregar")
      .send({ productoId: 1 })
      .expect(201);

    expect(response.body.usuario.puntos).toBe(110);
    expect(response.body.carrito[0].stock).toBe(14);
    expect(response.body.mensaje).toBe("Producto agregado al carrito");
  });

  test("POST /api/carrito/agregar con producto inexistente devuelve 400", async () => {
    const response = await request(app)
      .post("/api/carrito/agregar")
      .send({ productoId: 999 })
      .expect(400);

    expect(response.body.error).toBe("Producto no encontrado");
  });

  test("POST /api/carrito/agregar sin stock no modifica datos", async () => {
    // Agotamos el stock del producto 1 (tiene 15 unidades).
    for (let i = 0; i < 15; i += 1) {
      await request(app)
        .post("/api/carrito/agregar")
        .send({ productoId: 1 })
        .expect(201);
    }

    // Guardamos el estado justo antes del fallo.
    const stockAntes = productos.find((p) => p.id === 1).stock;
    const puntosAntes = usuario.puntos;

    const response = await request(app)
      .post("/api/carrito/agregar")
      .send({ productoId: 1 })
      .expect(400);

    expect(response.body.error).toBe("Sin stock disponible");
    // Validamos que no se haya modificado nada después del error.
    expect(productos.find((p) => p.id === 1).stock).toBe(stockAntes);
    expect(usuario.puntos).toBe(puntosAntes);
  });

  test("POST /api/carrito/agregar con ID inválido devuelve 400", async () => {
    const response = await request(app)
      .post("/api/carrito/agregar")
      .send({ productoId: "abc" })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });
});
