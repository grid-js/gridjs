export default {
  search: {
    placeholder: 'Escribe para buscar...',
  },
  sort: {
    sortAsc: 'Orden de columna ascendente.',
    sortDesc: 'Orden de columna descendente.',
  },
  pagination: {
    previous: 'Anterior',
    next: 'Siguiente',
    navigate: (page, pages) => `Página ${page} de ${pages}`,
    page: (page) => `Página ${page}`,
    showing: 'Mostrando del',
    of: 'de',
    to: 'al',
    results: 'registros',
  },
  loading: 'Cargando...',
  noRecordsFound: 'Sin coincidencias encontradas.',
  error: 'Ocurrió un error al obtener los datos.',
};
