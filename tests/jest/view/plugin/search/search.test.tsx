import { h } from 'preact';
import { mount } from 'enzyme';
import { Config, ConfigContext } from '../../../../../src/config';
import { EventEmitter } from '../../../../../src/util/eventEmitter';
import { GridEvents } from '../../../../../src/events';
import PipelineUtils from '../../../../../src/pipeline/pipelineUtils';
import { Translator } from '../../../../../src/i18n/language';
import { Search } from '../../../../../src/view/plugin/search/search';
import Header from '../../../../../src/header';
import * as SearchActions from '../../../../../src/view/plugin/search/actions';
import { flushPromises } from '../../../testUtil';

describe('Search plugin', () => {
  let config: Config;

  beforeEach(() => {
    config = new Config();
    config.autoWidth = true;
    config.eventEmitter = new EventEmitter<GridEvents>();
    config.translator = new Translator();
    config.pipeline = PipelineUtils.createFromConfig(config);
    config.header = Header.fromUserConfig({
      columns: ['Name', 'Phone Number'],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the search box', async () => {
    const mock = jest.spyOn(SearchActions, 'SearchKeyword');

    const search = mount(
      <ConfigContext.Provider value={config}>
        <Search keyword={'boo'} />
      </ConfigContext.Provider>,
    );

    expect(mock).toBeCalledWith('boo');
    expect(search.html()).toMatchSnapshot();
  });

  it('should not call search if keyword is undefined', async () => {
    const mock = jest.spyOn(SearchActions, 'SearchKeyword');

    mount(
      <ConfigContext.Provider value={config}>
        <Search />
      </ConfigContext.Provider>,
    );

    expect(mock).not.toBeCalled();
  });

  it('should call search action after input change', async () => {
    const mock = jest.spyOn(SearchActions, 'SearchKeyword');

    const wrapper = mount(
      <ConfigContext.Provider value={config}>
        <Search />
      </ConfigContext.Provider>,
    );

    // https://github.com/preactjs/enzyme-adapter-preact-pure/issues/45
    const input = wrapper.find('input');
    //console.log('INPUT', input.getDOMNode<HTMLInputElement>())
    //input.getDOMNode<HTMLInputElement>().value = '123';
    input.simulate('input', { target: { value: '1234' } });

    return flushPromises().then(() => {
      setTimeout(() => {
        expect(mock).toBeCalledWith('123');
      }, 0);
    });
  });

  it('should add config.className.search', async () => {
    const search = mount(
      <ConfigContext.Provider
        value={{
          ...config,
          className: {
            search: 'test-search-class-name',
          },
        }}
      >
        <Search keyword={'boo'} />
      </ConfigContext.Provider>,
    );

    expect(
      search.find('.test-search-class-name').hasClass('gridjs-search'),
    ).toBeTrue();
    expect(search.find('.test-search-class-name').name()).toBe('div');
  });
});
