export default {
  search: {
    placeholder: 'Поиск...',
  },
  sort: {
    sortAsc: 'Сортировка по возрастанию',
    sortDesc: 'Сортировка по убыванию',
  },
  pagination: {
    previous: 'Назад',
    next: 'Вперед',
    navigate: (page, pages) => `Страница ${page} из ${pages}`,
    page: (page) => `Страница ${page}`,
    showing: 'Отображение с',
    of: 'из',
    to: 'по',
    results: 'записей',
  },
  loading: 'Загрузка...',
  noRecordsFound: 'Не найдено подходящих записей',
  error: 'Ошибка при загрузке данных',
};
