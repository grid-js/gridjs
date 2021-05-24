export default {
  search: {
    placeholder: '🔍 Recherche...',
  },
  sort: {
    sortAsc: 'Trier la colonne dans l\'ordre croissant',
    sortDesc: 'Trier la colonne dans l\'ordre décroissant',
  },
  pagination: {
    previous: 'Précédent',
    next: 'Suivant',
    navigate: (page, pages) => `Page ${page} de ${pages}`,
    page: (page) => `Page ${page}`,
    showing: 'Affichage des résultats',
    of: 'sur',
    to: 'à',
    results: '',
  },
  loading: 'Chargement...',
  noRecordsFound: 'Aucun résultat trouvé',
  error: 'Une erreur est survenue lors de la récupération des données',
};
