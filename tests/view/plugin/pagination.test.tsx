import { mount } from 'enzyme';
import { createContext, h } from 'preact';
import { Config } from '../../../src/config';
import { Plugin, PluginPosition } from '../../../src/plugin';
import { Pagination } from '../../../src/view/plugin/pagination';
import Header from '../../../src/header';

describe('Pagination plugin', () => {
  let config: Config;
  const configContext = createContext(null);
  const plugin: Plugin<any> = {
    id: 'mypagination',
    position: PluginPosition.Footer,
    component: {},
  };

  beforeEach(() => {
    config = Config.fromUserConfig({
      header: Header.fromColumns(['a', 'b', 'c']),
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
    config = Config.fromUserConfig({
      header: Header.fromColumns(['a', 'b', 'c']),
      data: [],
    });

    const pagination = mount(
      <configContext.Provider
        value={{
          ...config,
          data: [],
        }}
      >
        <Pagination plugin={plugin} enabled={true} />
      </configContext.Provider>,
    );

    await config.pipeline.process();
    expect(pagination.html()).toMatchSnapshot();
  });

  it('should render the pagination with one page', async () => {
    const pagination = mount(
      <configContext.Provider value={config}>
        <Pagination plugin={plugin} enabled={true} limit={3} />
      </configContext.Provider>,
    );

    await config.pipeline.process();
    expect(pagination.html()).toMatchSnapshot();
  });

  it('should render the pagination with three page', async () => {
    const pagination = mount(
      <configContext.Provider value={config}>
        <Pagination plugin={plugin} enabled={true} limit={1} />
      </configContext.Provider>,
    );

    await config.pipeline.process();
    pagination.update();

    expect(pagination.html()).toMatchSnapshot();
  });

  it('should add config.className.pagination', async () => {
    const pagination = mount(
      <configContext.Provider
        value={{
          ...config,
          className: {
            pagination: 'my-pagination-class',
            paginationButton: 'my-button',
            paginationButtonNext: 'my-next-button',
            paginationButtonPrev: 'my-prev-button',
            paginationSummary: 'my-page-summary',
            paginationButtonCurrent: 'my-current-button',
          },
        }}
      >
        <Pagination plugin={plugin} enabled={true} limit={1} />
      </configContext.Provider>,
    );

    await config.pipeline.process();
    pagination.update();

    expect(
      pagination.find('.my-pagination-class').hasClass('gridjs-pagination'),
    ).toBeTrue();
    expect(pagination.find('.my-pagination-class').name()).toBe('div');

    expect(pagination.find('.my-button')).toHaveLength(5);
    expect(pagination.find('.my-next-button')).toHaveLength(1);
    expect(pagination.find('.my-next-button').prop('disabled')).toBeFalse();
    expect(pagination.find('.my-prev-button').prop('disabled')).toBeTrue();
    expect(pagination.find('.my-prev-button')).toHaveLength(1);
    expect(pagination.find('.my-current-button')).toHaveLength(1);
    expect(pagination.find('.my-current-button').text()).toBe('1');

    expect(pagination.find('.my-page-summary')).toHaveLength(1);
    expect(pagination.find('.my-page-summary').text()).toBe(
      'Showing 1 to 1 of 3 results',
    );
  });
});
