export default {
  search: {
    placeholder: 'ابدأ البحث',
  },
  sort: {
    sortAsc: 'الترتيب تصاعدي',
    sortDesc: 'الترتيب تنازلي',
  },
  pagination: {
    previous: 'السابق',
    next: 'التالي',
    navigate: (page, pages) => `الصفحة ${page} من ${pages}`,
    page: (page) => `الصفحة ${page}`,
    showing: 'المعروض',
    of: 'من',
    to: 'إلى',
    results: 'النتائج',
  },
  loading: 'جاري التحميل...',
  noRecordsFound: 'لم نجد ما تبحث عنه',
  error: 'حصل خطأ ما أثناء جلب البيانات',
};
