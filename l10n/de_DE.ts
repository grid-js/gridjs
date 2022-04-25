export default {
  search: {
    placeholder: 'Geben Sie ein Schlüsselwort ein...',
  },
  sort: {
    sortAsc: 'Spalte aufsteigend sortieren',
    sortDesc: 'Spalte absteigend sortieren',
  },
  pagination: {
    previous: 'Bisherige',
    next: 'Nächste',
    navigate: (page, pages) => `Buchseite ${page} von ${pages}`,
    page: (page) => `Buchseite ${page}`,
    showing: 'Anzeigen',
    of: 'von',
    to: 'zu',
    results: 'Ergebnisse',
  },
  loading: 'Wird geladen...',
  noRecordsFound: 'Keine übereinstimmenden Aufzeichnungen gefunden',
  error: 'Beim Abrufen der Daten ist ein Fehler aufgetreten',
};
