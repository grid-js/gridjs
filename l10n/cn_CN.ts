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
    showing: '显示第',
    of: '条，共',
    to: '到',
    results: '条结果',
  },
  loading: '加载中...',
  noRecordsFound: '未找到匹配的记录',
  error: '获取数据时发生错误',
};
