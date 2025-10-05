export default {
  search: {
    placeholder: 'Wpisz słowo kluczowe...',
  },
  sort: {
    sortAsc: 'Sortuj rosnąco',
    sortDesc: 'Sortuj malejąco',
  },
  pagination: {
    previous: 'Poprzednia',
    next: 'Następna',
    navigate: (page, pages) => `Strona ${page} z ${pages}`,
    page: (page) => `Strona ${page}`,
    showing: 'Wyświetlanie',
    of: 'z',
    to: 'do',
    results: 'wyników',
  },
  loading: 'Ładowanie...',
  noRecordsFound: 'Nie znaleziono pasujących rekordów',
  error: 'Wystąpił błąd podczas pobierania danych',
};
