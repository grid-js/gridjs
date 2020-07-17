import { PluginManager, PluginPosition, PluginRenderer } from '../src/plugin';
import { BaseComponent, BaseProps } from '../src/view/base';
import { createContext, h } from 'preact';
import { mount } from 'enzyme';
import { Config } from '../src/config';

describe('Plugin', () => {
  interface DummyPluginProps extends BaseProps {
    text?: string;
  }

  class DummyPlugin extends BaseComponent<DummyPluginProps, {}> {
    render() {
      return h('b', {}, this.props.text || 'hello!');
    }
  }

  it('should add and remove plugins', () => {
    const manager = new PluginManager();

    expect(manager.list()).toHaveLength(0);

    manager.add({
      id: 'dummy',
      position: PluginPosition.Header,
      component: h(DummyPlugin, {}),
    });

    manager.add({
      id: 'dummy2',
      position: PluginPosition.Header,
      component: h(DummyPlugin, {}),
    });

    expect(manager.list()).toHaveLength(2);
    manager.remove('dummy');
    expect(manager.list()).toHaveLength(1);
    manager.remove('dummy2');
    expect(manager.list()).toHaveLength(0);
    manager.remove('doesntexist');
    expect(manager.list()).toHaveLength(0);
  });

  it('should return plugins in the correct order', () => {
    const manager = new PluginManager();

    expect(manager.list()).toHaveLength(0);

    manager.add({
      id: 'dummy',
      order: 5,
      position: PluginPosition.Header,
      component: h(DummyPlugin, {}),
    });

    manager.add({
      id: 'dummy2',
      order: 1,
      position: PluginPosition.Header,
      component: h(DummyPlugin, {}),
    });

    manager.add({
      id: 'dummy3',
      order: 10,
      position: PluginPosition.Footer,
      component: h(DummyPlugin, {}),
    });

    expect(manager.list().map((x) => x.id)).toStrictEqual([
      'dummy2',
      'dummy',
      'dummy3',
    ]);
    expect(manager.list(PluginPosition.Header).map((x) => x.id)).toStrictEqual([
      'dummy2',
      'dummy',
    ]);
  });

  it('should return existing plugin by id', () => {
    const manager = new PluginManager();

    const component = h(DummyPlugin, {});
    manager.add({
      id: 'dummy',
      position: PluginPosition.Header,
      component: component,
    });

    const plugin = manager.get('dummy');

    expect(plugin.component).toBe(component);
    expect(plugin.position).toBe(PluginPosition.Header);

    expect(manager.get('doesnexist')).toBeNull();
  });

  it('should render the plugins', async () => {
    const configContext = createContext(null);
    const config = Config.fromUserConfig({
      data: [[1, 2, 3]],
    });

    config.plugin.add({
      id: 'dummyheader',
      position: PluginPosition.Header,
      component: h(DummyPlugin, { text: 'dummyheader' }),
    });

    config.plugin.add({
      id: 'dummyfooter',
      position: PluginPosition.Footer,
      component: h(DummyPlugin, { text: 'dummyfooter' }),
    });

    const renderer = mount(
      <configContext.Provider value={config}>
        <PluginRenderer position={PluginPosition.Header} />
        <PluginRenderer position={PluginPosition.Footer} />
      </configContext.Provider>,
    );

    expect(renderer.html()).toMatchSnapshot();
  });
});
