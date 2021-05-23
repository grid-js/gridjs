export default {
  search: {
    placeholder: 'Anahtar kelime girin...',
  },
  sort: {
    sortAsc: 'Artan şekilde sırala',
    sortDesc: 'Azalan şekilde sırala',
  },
  pagination: {
    previous: 'Önceki',
    next: 'Sonraki',
    navigate: (page, pages) => `Sayfa ${page}/${pages}`,
    page: (page) => `Sayfa ${page}`,
    showing: 'Gösteriliyor',
    of: 'nın',
    to: 'göre',
    results: 'Sonuçlar',
  },
  loading: 'Bekleniyor...',
  noRecordsFound: 'Eşleşen kayıt bulunamadı',
  error: 'Veriler alınırken bir hata oluştu',
};
