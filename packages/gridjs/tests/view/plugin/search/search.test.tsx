import { mount } from 'enzyme';
import { createContext, h } from 'preact';
import { Config } from '../../../../src/config';
import Dispatcher from '../../../../src/util/dispatcher';
import { EventEmitter } from '../../../../src/util/eventEmitter';
import { GridEvents } from '../../../../src/events';
import PipelineUtils from '../../../../src/pipeline/pipelineUtils';
import { Translator } from '../../../../src/i18n/language';
import { Search } from '../../../../src/view/plugin/search/search';
import { SearchActions } from '../../../../src/view/plugin/search/actions';
import { Plugin, PluginPosition } from '../../../../src/plugin';

describe('Search plugin', () => {
  let config: Config;
  const configContext = createContext(null);
  const plugin: Plugin<any> = {
    id: 'mysearch',
    position: PluginPosition.Header,
    component: {},
  };

  beforeEach(() => {
    config = new Config();
    config.autoWidth = true;
    config.dispatcher = new Dispatcher();
    config.eventEmitter = new EventEmitter<GridEvents>();
    config.translator = new Translator();
    config.pipeline = PipelineUtils.createFromConfig(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the search box', async () => {
    const mock = jest.spyOn(SearchActions.prototype, 'search');

    const search = mount(
      <configContext.Provider value={config}>
        <Search plugin={plugin} enabled={true} keyword={'boo'} />
      </configContext.Provider>,
    );

    expect(mock).toBeCalledWith('boo');
    expect(search.html()).toMatchSnapshot();
  });

  it('should not call search if keyword is undefined', async () => {
    const mock = jest.spyOn(SearchActions.prototype, 'search');

    mount(
      <configContext.Provider value={config}>
        <Search plugin={plugin} enabled={true} />
      </configContext.Provider>,
    );

    expect(mock).not.toBeCalled();
  });

  it('should call search action after input change', async () => {
    const mock = jest.spyOn(SearchActions.prototype, 'search');

    const wrapper = mount(
      <configContext.Provider value={config}>
        <Search plugin={plugin} enabled={true} />
      </configContext.Provider>,
    );

    // https://github.com/preactjs/enzyme-adapter-preact-pure/issues/45
    const input = wrapper.find('input');
    input.getDOMNode<HTMLInputElement>().value = '123';

    input.simulate('input');

    expect(mock).toBeCalledWith('123');
  });

  it('should add config.className.search', async () => {
    const search = mount(
      <configContext.Provider
        value={{
          ...config,
          className: {
            search: 'test-search-class-name',
          },
        }}
      >
        <Search plugin={plugin} enabled={true} keyword={'boo'} />
      </configContext.Provider>,
    );

    expect(
      search.find('.test-search-class-name').hasClass('gridjs-search'),
    ).toBeTrue();
    expect(search.find('.test-search-class-name').name()).toBe('div');
  });
});
