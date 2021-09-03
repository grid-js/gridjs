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
    navigate: (page, pages) => `第${page}页，共${pages}页`,
    page: (page) => `第${page}页`,
    showing: '第',
    of: '到',
    to: '条记录，共',
    results: '条',
  },
  loading: '玩命加载中...',
  noRecordsFound: '没找到匹配的项',
  error: '获取数据时发生了错误',
};
