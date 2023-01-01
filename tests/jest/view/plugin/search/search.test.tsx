import { h } from 'preact';
import { act } from 'preact/test-utils';
import { mount } from 'enzyme';
import { Config, ConfigContext } from '../../../../../src/config';
import { Search } from '../../../../../src/view/plugin/search/search';
import * as SearchActions from '../../../../../src/view/plugin/search/actions';
import { flushPromises } from '../../../testUtil';

describe('Search plugin', () => {
  let config: Config;

  beforeEach(() => {
    config = new Config().update({
      data: [['a', 'b', 'c']],
      columns: ['Name', 'Phone Number'],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the search box', async () => {
    const mock = jest.spyOn(SearchActions, 'SearchKeyword');

    config.update({
      search: {
        keyword: 'boo',
      },
    });

    const search = mount(
      <ConfigContext.Provider value={config}>
        <Search />
      </ConfigContext.Provider>,
    );

    expect(mock).toBeCalledWith('boo');
    expect(search.html()).toMatchSnapshot();
  });

  it('should not call search if keyword is undefined', async () => {
    const mock = jest.spyOn(SearchActions, 'SearchKeyword');

    config.update({
      search: true,
    });

    mount(
      <ConfigContext.Provider value={config}>
        <Search />
      </ConfigContext.Provider>,
    );

    expect(mock).not.toBeCalled();
  });

  it('should call search action after input change', async () => {
    const mock = jest.spyOn(SearchActions, 'SearchKeyword');

    config.update({
      search: true,
    });

    const wrapper = mount(
      <ConfigContext.Provider value={config}>
        <Search />
      </ConfigContext.Provider>,
    );

    const input = wrapper.find('input');
    const onInput = input.props().onInput;

    act(() => {
      const htmlInputElement = document.createElement('input');
      htmlInputElement.value = '123';
      onInput({ target: htmlInputElement });
    });

    wrapper.update();

    await flushPromises();
    await flushPromises();
    await flushPromises();

    expect(mock).toBeCalledWith('123');
  });

  it('should add config.className.search', async () => {
    config.update({
      search: true,
      className: {
        search: 'test-search-class-name',
      },
    });

    const search = mount(
      <ConfigContext.Provider value={config}>
        <Search />
      </ConfigContext.Provider>,
    );

    expect(
      search.find('.test-search-class-name').hasClass('gridjs-search'),
    ).toBeTrue();
    expect(search.find('.test-search-class-name').name()).toBe('div');
  });
});
