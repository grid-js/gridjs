export default {
  search: {
    placeholder: 'Digite uma palavra-chave...',
  },
  sort: {
    sortAsc: 'Coluna em ordem crescente',
    sortDesc: 'Coluna em ordem decrescente',
  },
  pagination: {
    previous: 'Anterior',
    next: 'Próxima',
    navigate: (page, pages) => `Página ${page} de ${pages}`,
    page: (page) => `Página ${page}`,
    showing: 'Mostrando',
    of: 'de',
    to: 'até',
    results: 'resultados',
  },
  loading: 'Carregando...',
  noRecordsFound: 'Nenhum registro encontrado',
  error: 'Ocorreu um erro ao buscar os dados',
};
