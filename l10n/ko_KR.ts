export default {
  search: {
    placeholder: '검색어 입력...',
  },
  sort: {
    sortAsc: '내림차순 정렬',
    sortDesc: '오름차순 정렬',
  },
  pagination: {
    previous: '이전',
    next: '다음',
    navigate: (page, pages) => `${pages} 중 ${page} 페이지`,
    page: (page) => `${page} 페이지`,
    showing: '결과보기:',
    of: '까지 총',
    to: '에서',
    results: '개',
  },
  loading: '로딩중...',
  noRecordsFound: '일치하는 레코드 없음',
  error: '데이터 조회 오류',
};
