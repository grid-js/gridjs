import Grid from '../src/grid';
import MemoryStorage from '../src/storage/memory';
import { mount } from 'enzyme';
import { flushPromises } from './testUtil';

describe('Grid class', () => {
  it('should raise an exception with empty config', () => {
    expect(() => {
      new Grid({}).render(document.createElement('div'));
    }).toThrow('Could not determine the storage type');
  });

  it('should init a memory storage', () => {
    const grid = new Grid({
      data: [[1, 2, 3]],
      style: {
        table: {
          border: '1px',
        },
      },
    }).render(document.createElement('div'));

    expect(grid.config.storage).toBeInstanceOf(MemoryStorage);
  });

  it('should set the config correctly', () => {
    const config = {
      data: [[1, 2, 3]],
    };

    const grid = new Grid(config).render(document.createElement('div'));

    expect(grid.config.data).toStrictEqual(config.data);
  });

  it('should update the config correctly', () => {
    const config1 = {
      data: [[1, 2, 3]],
    };

    const config2 = {
      width: '500px',
    };

    const grid = new Grid(config1);

    grid.updateConfig(config2).render(document.createElement('div'));

    expect(grid.config.data).toStrictEqual(config1.data);
    expect(grid.config.width).toStrictEqual(config2.width);
  });

  it('should trigger the load and beforeLoad events', async () => {
    const grid = new Grid({
      data: [[1, 2, 3]],
    });

    const loadMock = jest.fn();
    const beforeLoadMock = jest.fn();
    grid.on('load', loadMock);
    grid.on('beforeLoad', beforeLoadMock);

    const container = mount(grid.createElement());

    await container.instance().componentDidMount();
    expect(loadMock).toBeCalled();
    expect(beforeLoadMock).toBeCalled();
  });

  it('should trigger the events in the correct order', async () => {
    const grid = new Grid({
      columns: ['a', 'b', 'c'],
      data: [[1, 2, 3]],
    });

    const loadMock = jest.fn();
    const beforeLoadMock = jest.fn();
    const readyMock = jest.fn();

    grid.on('load', loadMock);
    grid.on('beforeLoad', beforeLoadMock);
    grid.on('ready', readyMock);

    const container = mount(grid.createElement());

    return flushPromises().then(async () => {
      await container.instance().componentDidMount();

      expect(beforeLoadMock).toHaveBeenCalledBefore(loadMock);
      expect(loadMock).toHaveBeenCalledBefore(readyMock);

      expect(beforeLoadMock).toBeCalledTimes(2);
      expect(loadMock).toBeCalledTimes(2);
      expect(readyMock).toBeCalledTimes(2);
    });
  });
});
