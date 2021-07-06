export default {
    search: {
      placeholder: 'Søk...',
    },
    sort: {
      sortAsc: 'Sorter kolonne i stigende rekkefølge',
      sortDesc: 'Sorter kolonne i synkende rekkefølge',
    },
    pagination: {
      previous: 'Forrige',
      next: 'Neste',
      navigate: (page, pages) => `Side ${page} av ${pages}`,
      page: (page) => `Side ${page}`,
      showing: 'Viser',
      of: 'av',
      to: 'til',
      results: 'resultater',
    },
    loading: 'Laster inn...',
    noRecordsFound: 'Ingen resultater funnet',
    error: 'Det oppsto en feil under henting av data',
  };
  