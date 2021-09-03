export default {
  search: {
    placeholder: '输入关键字...',
  },
  sort: {
    sortAsc: '升序排列',
    sortDesc: '降序排列',
  },
  pagination: {
    previous: '上一页',
    next: '下一页',
    navigate: (page, pages) => `Page ${page} of ${pages}`,
    page: (page) => `Page ${page}`,
    showing: '第',
    of: '到',
    to: '页，共',
    results: '页',
  },
  loading: '玩命加载中...',
  noRecordsFound: '没找到匹配的项',
  error: '获取数据时发生了错误',
};
