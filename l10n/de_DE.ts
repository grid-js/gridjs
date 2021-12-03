export default {
  search: {
    placeholder: 'Suche...',
  },
  sort: {
    sortAsc: 'Spalte aufsteigend sortieren',
    sortDesc: 'Spalte absteigend sortieren',
  },
  pagination: {
    previous: 'Zurück',
    next: 'Vor',
    navigate: (page, pages) => `Seite ${page} von ${pages}`,
    page: (page) => `Seite ${page}`,
    showing: 'Zeige',
    of: 'von',
    to: 'bis',
    results: 'Resultaten',
  },
  loading: 'Lade...',
  noRecordsFound: 'Keine passenden Einträge gefunden',
  error: 'Beim Abrufen der Daten ist ein Fehler aufgetreten',
};
