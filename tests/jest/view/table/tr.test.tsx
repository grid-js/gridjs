import { h } from 'preact';
import { mount } from 'enzyme';
import { Config, ConfigContext } from '../../../../src/config';
import { EventEmitter } from '../../../../src/util/eventEmitter';
import { TableEvents } from '../../../../src/view/table/events';
import { TD } from '../../../../src/view/table/td';
import { TR } from '../../../../src/view/table/tr';
import Cell from '../../../../src/cell';

describe('TR component', () => {
  let config: Config;

  beforeEach(() => {
    config = new Config();
  });

  it('should match the snapshot', () => {
    const tr = mount(
      <ConfigContext.Provider value={config}>
        <TR>
          <TD cell={new Cell('boo')} />
        </TR>
      </ConfigContext.Provider>,
    );
    expect(tr.html()).toMatchSnapshot();
  });

  it('should emit rowClick', async () => {
    config.eventEmitter = new EventEmitter<TableEvents>();
    const onClick = jest.fn();

    const rows = mount(
      <ConfigContext.Provider value={config}>
        <TR>
          <TD cell={new Cell('boo')} />
        </TR>
      </ConfigContext.Provider>,
    ).find('tr');

    config.eventEmitter.on('rowClick', onClick);
    rows.map((tr) => tr.simulate('click'));

    expect(rows.length).toEqual(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should attach the custom tr className', async () => {
    const tr = mount(
      <ConfigContext.Provider
        value={{
          ...config,
          ...{
            className: {
              tr: 'custom-tr-classname',
            },
          },
        }}
      >
        <TR>
          <TD cell={new Cell('boo')} />
        </TR>
      </ConfigContext.Provider>,
    );

    expect(tr.find('tr.custom-tr-classname')).toHaveLength(1);
  });

  it('should attach the custom tr className callback', async () => {
    const rowStyleGenerator = jest.fn();
    const tr = mount(
      <ConfigContext.Provider
        value={{
          ...config,
          ...{
            className: {
              tr: () => {
                rowStyleGenerator()
                return 'custom-tr-classname-callback'
              }
            },
          },
        }}
      >
        <TR>
          <TD cell={new Cell('boo')} />
        </TR>
      </ConfigContext.Provider>,
    );

    expect(rowStyleGenerator).toHaveBeenCalledTimes(1);
    expect(tr.find('tr.custom-tr-classname-callback')).toHaveLength(1);
  });
});
