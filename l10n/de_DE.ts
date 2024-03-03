export default {
  search: {
    placeholder: 'Suchbegriff eingeben...',
  },
  sort: {
    sortAsc: 'Spalte aufsteigend sortieren',
    sortDesc: 'Spalte absteigend sortieren',
  },
  pagination: {
    previous: 'Zurück',
    next: 'Nächste',
    navigate: (page, pages) => `Seite ${page} von ${pages}`,
    page: (page) => `Seite ${page}`,
    showing: 'Datensätze',
    of: 'von',
    to: 'bis',
    results: 'Ergebnissen',
  },
  loading: 'Wird geladen...',
  noRecordsFound: 'Keine passenden Daten gefunden',
  error: 'Beim Abrufen der Daten ist ein Fehler aufgetreten',
};
