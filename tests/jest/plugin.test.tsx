import { h } from 'preact';
import {
  PluginManager,
  PluginPosition,
  PluginRenderer,
} from '../../src/plugin';
import { mount } from 'enzyme';
import { Config, ConfigContext } from '../../src/config';
import { useConfig } from '../../src/hooks/useConfig';

interface DummyConfig extends Config {
  dummy: {
    text: string;
  };
}

describe('Plugin', () => {
  function DummyPlugin<T extends DummyConfig>() {
    const config = useConfig() as T;
    return h('b', {}, config.dummy.text || 'hello!');
  }

  it('should add and remove plugins', () => {
    const manager = new PluginManager();

    expect(manager.list()).toHaveLength(0);

    manager.add({
      id: 'dummy',
      position: PluginPosition.Header,
      component: DummyPlugin,
    });

    manager.add({
      id: 'dummy2',
      position: PluginPosition.Header,
      component: DummyPlugin,
    });

    expect(manager.list()).toHaveLength(2);
    manager.remove('dummy');
    expect(manager.list()).toHaveLength(1);
    manager.remove('dummy2');
    expect(manager.list()).toHaveLength(0);
    manager.remove('doesntexist');
    expect(manager.list()).toHaveLength(0);
  });

  it('should return unordered plugins', () => {
    const manager = new PluginManager();

    expect(manager.list()).toHaveLength(0);

    manager.add({
      id: 'dummy',
      position: PluginPosition.Header,
      component: DummyPlugin.prototype,
    });

    manager.add({
      id: 'dummy2',
      order: 1,
      position: PluginPosition.Header,
      component: DummyPlugin.prototype,
    });

    manager.add({
      id: 'dummy3',
      order: 10,
      position: PluginPosition.Footer,
      component: DummyPlugin.prototype,
    });

    expect(manager.list().map((x) => x.id)).toStrictEqual([
      'dummy',
      'dummy2',
      'dummy3',
    ]);
  });

  it('should return plugins in the correct order', () => {
    const manager = new PluginManager();

    expect(manager.list()).toHaveLength(0);

    manager.add({
      id: 'dummy',
      order: 5,
      position: PluginPosition.Header,
      component: DummyPlugin.prototype,
    });

    manager.add({
      id: 'dummy2',
      order: 1,
      position: PluginPosition.Header,
      component: DummyPlugin.prototype,
    });

    manager.add({
      id: 'dummy3',
      order: 10,
      position: PluginPosition.Footer,
      component: DummyPlugin.prototype,
    });

    manager.add({
      id: 'dummy4',
      position: PluginPosition.Footer,
      component: DummyPlugin.prototype,
    });

    expect(manager.list().map((x) => x.id)).toStrictEqual([
      'dummy2',
      'dummy',
      'dummy3',
      'dummy4',
    ]);
    expect(manager.list(PluginPosition.Header).map((x) => x.id)).toStrictEqual([
      'dummy2',
      'dummy',
    ]);
  });

  it('should return existing plugin by id', () => {
    const manager = new PluginManager();

    const component = DummyPlugin.prototype;
    manager.add({
      id: 'dummy',
      position: PluginPosition.Header,
      component: component,
    });

    const plugin = manager.get('dummy');

    expect(plugin.component).toBe(component);
    expect(plugin.position).toBe(PluginPosition.Header);

    expect(manager.get('doesnexist')).toBeUndefined();
  });

  it('should render the plugins', async () => {
    const config = new Config().update({
      data: [[1, 2, 3]],
    }) as DummyConfig;

    config.dummy = {
      text: 'dummyplugin',
    };

    config.plugin.add({
      id: 'dummyheader',
      position: PluginPosition.Header,
      component: DummyPlugin,
    });

    config.plugin.add({
      id: 'dummyfooter',
      position: PluginPosition.Footer,
      component: DummyPlugin,
    });

    const renderer = mount(
      <ConfigContext.Provider value={config}>
        <PluginRenderer position={PluginPosition.Header} />
        <PluginRenderer position={PluginPosition.Footer} />
      </ConfigContext.Provider>,
    );

    expect(renderer.html()).toMatchSnapshot();
  });

  it('should create a userConfig with custom plugin', () => {
    const config = new Config().update({
      data: [[1, 2, 3]],
      plugins: [
        {
          id: 'dummyheader',
          position: PluginPosition.Header,
          component: DummyPlugin,
        },
      ],
    });

    expect(config.plugin.get('dummyheader')).toMatchObject({
      id: 'dummyheader',
      position: PluginPosition.Header,
    });
  });
});
