export default {
  search: {
    placeholder: 'Cari pada tabel...',
  },
  sort: {
    sortAsc: 'Sortir kolom naik',
    sortDesc: 'Sortir kolom turun',
  },
  pagination: {
    previous: 'Sebelumnya',
    next: 'Berikutnya',
    navigate: (page, pages) => `Halaman ${page} dari ${pages}`,
    page: (page) => `Halaman ${page}`,
    showing: 'Menampilkan',
    of: 'dari',
    to: 'sampai',
    results: 'hasil',
  },
  loading: 'Memuat...',
  noRecordsFound: 'Tidak ada data yang ditemukan',
  error: 'Terjadi error saat memuat data',
};
