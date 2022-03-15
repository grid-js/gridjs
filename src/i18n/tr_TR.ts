export default {
  search: {
    placeholder: 'Bir şeyler arayın...',
  },
  sort: {
    sortAsc: 'Sütunu artan şekilde sırala',
    sortDesc: 'Sütunu azalan şekilde sırala',
  },
  pagination: {
    previous: 'Geri',
    next: 'İleri',
    navigate: (page, pages) => `${page} Sayfadan ${pages} sayfa`,
    page: (page) => `Sayfa ${page}`,
    showing: 'Gösteriliyor',
    of: 'ile ilgili',
    to: 'ile',
    results: 'sonuçlar',
  },
  loading: 'Yükleniyor...',
  noRecordsFound: 'Eşleşen herhangi bir kayıt bulunamadı',
  error: 'Veriler alınırken bir hata oluştu',
};
