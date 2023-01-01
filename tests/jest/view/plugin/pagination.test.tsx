import { mount } from 'enzyme';
import { h } from 'preact';
import { Config, ConfigContext } from '../../../../src/config';
import { Pagination } from '../../../../src/view/plugin/pagination';

describe('Pagination plugin', () => {
  let config: Config;

  beforeEach(() => {
    config = new Config().update({
      columns: ['a', 'b', 'c'],
      data: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the pagination with no records', async () => {
    config.update({
      data: [],
      pagination: true,
    });

    const pagination = mount(
      <ConfigContext.Provider value={config}>
        <Pagination />
      </ConfigContext.Provider>,
    );

    await config.pipeline.process();
    expect(pagination.html()).toMatchSnapshot();
  });

  it('should render the pagination with one page', async () => {
    config.update({
      pagination: {
        limit: 3,
      },
    });

    const pagination = mount(
      <ConfigContext.Provider value={config}>
        <Pagination />
      </ConfigContext.Provider>,
    );
    await config.pipeline.process();

    expect(pagination.html()).toMatchSnapshot();
  });

  it('should render the pagination with three page', async () => {
    config.update({
      pagination: {
        limit: 1,
      },
    });

    const pagination = mount(
      <ConfigContext.Provider value={config}>
        <Pagination />
      </ConfigContext.Provider>,
    );

    pagination.update();
    await config.pipeline.process();

    expect(pagination.html()).toMatchSnapshot();
  });

  it('should add config.className.pagination', async () => {
    config.update({
      pagination: {
        limit: 1,
      },
      className: {
        pagination: 'my-pagination-class',
        paginationButton: 'my-button',
        paginationButtonNext: 'my-next-button',
        paginationButtonPrev: 'my-prev-button',
        paginationSummary: 'my-page-summary',
        paginationButtonCurrent: 'my-current-button',
      },
    });

    const pagination = mount(
      <ConfigContext.Provider value={config}>
        <Pagination />
      </ConfigContext.Provider>,
    );

    await config.pipeline.process();
    pagination.update();

    expect(
      pagination.find('.my-pagination-class').hasClass('gridjs-pagination'),
    ).toBe(true);
    expect(pagination.find('.my-pagination-class').name()).toBe('div');

    expect(pagination.find('.my-button')).toHaveLength(5);
    expect(pagination.find('.my-next-button')).toHaveLength(1);
    expect(pagination.find('.my-next-button').prop('disabled')).toBe(false);
    expect(pagination.find('.my-prev-button').prop('disabled')).toBe(true);
    expect(pagination.find('.my-prev-button')).toHaveLength(1);
    expect(pagination.find('.my-current-button')).toHaveLength(1);
    expect(pagination.find('.my-current-button').text()).toBe('1');

    expect(pagination.find('.my-page-summary')).toHaveLength(1);
    expect(pagination.find('.my-page-summary').text()).toBe(
      'Showing 1 to 1 of 3 results',
    );
  });
});
