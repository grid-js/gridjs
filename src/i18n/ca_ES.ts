export default {
  search: {
    placeholder: 'Introdueix un terme...',
  },
  sort: {
    sortAsc: 'Ordernar columna per ordre ascendent',
    sortDesc: 'Ordernar columna per ordre descendent',
  },
  pagination: {
    previous: 'Previ',
    next: 'Següent',
    navigate: (page, pages) => `Pàgina ${page} de ${pages}`,
    page: (page) => `Pàgina ${page}`,
    showing: 'Mostrant',
    of: 'de',
    to: 'a',
    results: 'resultats',
  },
  loading: 'Carregant...',
  noRecordsFound: 'No s\'han trobat coincidències',
  error: 'Hi hagut un error mentre es carregaven les dades',
};
