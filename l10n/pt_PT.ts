export default {
  search: {
    placeholder: 'Pesquisar...',
  },
  sort: {
    sortAsc: 'Ordenar por ordem crescente',
    sortDesc: 'Ordenar por ordem descendente',
  },
  pagination: {
    previous: 'Anterior',
    next: 'Próxima',
    navigate: (page, pages) => `Página ${page} de ${pages}`,
    page: (page) => `Página ${page}`,
    showing: 'A mostrar',
    of: 'de',
    to: 'até',
    results: 'registos',
  },
  loading: 'A carregar...',
  noRecordsFound: 'Nenhum registro encontrado',
  error: 'Ocorreu um erro a obter os dados',
};
