export default {
  search: {
    placeholder: 'Indtast søgeord...',
  },
  sort: {
    sortAsc: 'Sorter kolonne stigende',
    sortDesc: 'Sorter kolonne faldende',
  },
  pagination: {
    previous: 'Forrige',
    next: 'Næste',
    navigate: (page, pages) => `Side ${page} af ${pages}`,
    page: (page) => `Side ${page}`,
    showing: 'Viser',
    of: 'ud af',
    to: 'til',
    results: 'resultater',
  },
  loading: 'Indlæser...',
  noRecordsFound: 'Ingen resultater fundet',
  error: 'Der opstod en fejl under hentningen af data',
};
