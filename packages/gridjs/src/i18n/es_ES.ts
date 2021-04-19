export default {
  search: {
    placeholder: '🔍 Busqueda...',
  },
  sort: {
    sortAsc: 'Ordenar la columna en orden ascendente',
    sortDesc: 'Ordenar la columna en orden descendente',
  },
  pagination: {
    previous: 'Anterior',
    next: 'Siguiente',
    navigate: (page, pages) => `Página ${page} de ${pages}`,
    page: (page) => `Página ${page}`,
    showing: 'Mostrando los resultados',
    of: 'sobre',
    to: 'a',
    results: '',
  },
  loading: 'Cargando...',
  noRecordsFound: 'Nigún resultado encontrado',
  error: 'Se produjo un error al recuperar datos',
};
