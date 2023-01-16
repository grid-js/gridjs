export const SearchKeyword = (payload) => (state) => {
  return {
    ...state,
    search: {
      keyword: payload,
    },
  };
};
