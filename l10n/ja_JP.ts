export default {
  search: {
    placeholder: '検索ワードを入力...',
  },
  sort: {
    sortAsc: '昇順でソート',
    sortDesc: '降順でソート',
  },
  pagination: {
    previous: '前へ',
    next: '次へ',
    navigate: (page, pages) => `${page} / ${pages} ページ`,
    page: (page) => `${page} ページ`,
    showing: '現在',
    of: '件目を表示中（全',
    to: '～',
    results: '件）',
  },
  loading: 'ロード中...',
  noRecordsFound: '一致する検索結果がありません',
  error: 'データ取得中にエラーが発生しました',
};
