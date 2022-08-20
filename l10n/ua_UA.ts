export default {
  search: {
    placeholder: 'Пошук...',
  },
  sort: {
    sortAsc: 'Сортування за зростанням',
    sortDesc: 'Сортування за зменьшенням',
  },
  pagination: {
    previous: 'Назад',
    next: 'Далі',
    navigate: (page, pages) => `Сторінка ${page} з ${pages}`,
    page: (page) => `Сторінка ${page}`,
    showing: 'Відображення з',
    of: 'з',
    to: 'до',
    results: 'записів',
  },
  loading: 'Завантаження...',
  noRecordsFound: 'Не знайдено відповідних записів',
  error: 'Помилка при завантаженні даних',
};
