export default {
  search: {
    placeholder: 'Sök...',
  },
  sort: {
    sortAsc: 'Sortera kolumn stigande',
    sortDesc: 'Sortera kolumn fallande',
  },
  pagination: {
    previous: 'Föregående',
    next: 'Nästa',
    navigate: (page, pages) => `Sida ${page} av ${pages}`,
    page: (page) => `Sida ${page}`,
    showing: 'Visar',
    of: 'av',
    to: 'till',
    results: 'resultat',
  },
  loading: 'Laddar...',
  noRecordsFound: 'Inga matchande poster hittades',
  error: 'Ett fel uppstod vid hämtning av data',
};
