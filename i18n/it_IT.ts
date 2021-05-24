export default {
  search: {
    placeholder: 'Ricerca...',
  },
  sort: {
    sortAsc: 'Ordina ascendente',
    sortDesc: 'Ordina discendente',
  },
  pagination: {
    previous: 'Precedente',
    next: 'Successivo',
    navigate: (page, pages) => `Pagina ${page} di ${pages}`,
    page: (page) => `Pagina ${page}`,
    showing: 'Mostra',
    of: 'dei',
    to: 'di',
    results: 'risultati',
  },
  loading: 'Caricamento...',
  noRecordsFound: 'Nessun risultato trovato.',
  error: 'Errore durante il caricamento dei dati.',
};
