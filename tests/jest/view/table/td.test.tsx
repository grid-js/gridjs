import { h } from 'preact';
import { mount } from 'enzyme';
import { TD } from '../../../../src/view/table/td';
import Cell from '../../../../src/cell';
import { Config, ConfigContext } from '../../../../src/config';
import { EventEmitter } from '../../../../src/util/eventEmitter';
import { TableEvents } from '../../../../src/view/table/events';

describe('TD component', () => {
  let config: Config;

  beforeEach(() => {
    config = new Config();
  });

  it('should match the snapshot', () => {
    const td = mount(
      <ConfigContext.Provider value={config}>
        <TD cell={new Cell('boo')} />
      </ConfigContext.Provider>,
    );
    expect(td.html()).toMatchSnapshot();
  });

  it('should emit cellClick', async () => {
    config.eventEmitter = new EventEmitter<TableEvents>();
    const onClick = jest.fn();

    const cells = mount(
      <ConfigContext.Provider value={config}>
        <TD cell={new Cell('boo')} />
      </ConfigContext.Provider>,
    ).find('td');

    config.eventEmitter.on('cellClick', onClick);
    cells.map((td) => td.simulate('click'));

    expect(cells.length).toEqual(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should attach the custom td className', async () => {
    const td = mount(
      <ConfigContext.Provider
        value={{
          ...config,
          ...{
            className: {
              td: 'custom-td-classname',
            },
          },
        }}
      >
        <TD cell={new Cell('boo')} />
      </ConfigContext.Provider>,
    );

    expect(td.find('td.custom-td-classname')).toHaveLength(1);
  });

  it('should attach the custom td className callback', async () => {
    const cellStyleGenerator = jest.fn();

    const td = mount(
      <ConfigContext.Provider value={{
        ...config,
        ...{
          className: {
            td: () => {
              cellStyleGenerator()
              return 'custom-td-classname-callback'
            }
          },
        },
      }}>
        <TD cell={new Cell('boo')} />
      </ConfigContext.Provider>,
    );

    expect(cellStyleGenerator).toHaveBeenCalledTimes(1);
    expect(td.find('td.custom-td-classname-callback')).toHaveLength(1);
  });
});
