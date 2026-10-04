// Servicio que maneja la lógica de listar y filtrar productos.

const { productos } = require("../data");

function listar(page, limit, categoria, buscar) {
  // Convertimos a número y usamos valores por defecto si no vienen o son inválidos.
  let pagina = parseInt(page, 10);
  pagina = Number.isNaN(pagina) || pagina < 1 ? 1 : pagina;

  let porPagina = parseInt(limit, 10);
  porPagina = Number.isNaN(porPagina) || porPagina < 1 ? 10 : porPagina;
  if (porPagina > 100) porPagina = 100; // Evitamos que pidan páginas gigantes.

  // Filtramos por categoría y/o búsqueda por nombre (sin importar mayúsculas).
  let resultado = productos;

  if (categoria) {
    resultado = resultado.filter((p) => p.categoria.toLowerCase() === categoria.toLowerCase());
  }

  if (buscar) {
    const termino = buscar.toLowerCase();
    resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(termino));
  }

  // Paginamos el resultado.
  const inicio = (pagina - 1) * porPagina;
  return resultado.slice(inicio, inicio + porPagina);
}

module.exports = { listar };
