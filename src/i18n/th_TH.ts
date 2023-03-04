export default {
    search: {
    placeholder: 'พิมพ์คีย์เวิร์ด...',
    },
    sort: {
      sortAsc: 'เรียงคอลัมน์จากน้อยไปมาก',
      sortDesc: 'เรียงคอลัมน์จากมากไปน้อย',
    },
    pagination: {
      previous: 'ก่อนหน้า',
      next: 'ถัดไป',
      navigate: (page, pages) => `หน้า ${page} ของ ${pages}`,
      page: (page) => `หน้า ${page}`,
      showing: 'แสดง',
      of: 'ของ',
      to: 'ถึง',
      results: 'ผลลัพธ์',
    },
    loading: 'กำลังโหลด...',
    noRecordsFound: 'ไม่พบข้อมูล',
    error: 'เกิดข้อผิดพลาดขณะดึงข้อมูล',
  };