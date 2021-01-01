
import { mount } from 'enzyme';
import { createContext, h } from 'preact';
import { Config } from '../../../src/config';
import { EventEmitter } from '../../../src/util/eventEmitter';
import { TableEvents } from '../../../src/view/table/events';
import { TD } from '../../../src/view/table/td';
import { TR } from '../../../src/view/table/tr';
import Cell from '../../../src/cell';

describe('TR component', () => {
  let config: Config;
  const configContext = createContext(null);

  beforeEach(() => {
    config = new Config();
  });

  it('should match the snapshot', () => {
    const tr = mount(
      <configContext.Provider value={config}>
        <TR >
          <TD cell={new Cell('boo')} />
        </TR>
      </configContext.Provider>,
    );
    expect(tr.html()).toMatchSnapshot();
  });

  it('should emit rowClick', async () => {
    config.eventEmitter = new EventEmitter<TableEvents>();
    const onClick = jest.fn();

    const rows = mount(
      <configContext.Provider value={config}>
        <TR >
          <TD cell={new Cell('boo')} />
        </TR>
      </configContext.Provider>,
    ).find('tr');

    config.eventEmitter.on('rowClick', onClick)
    rows.map(tr => tr.simulate('click'));

    expect(rows.length).toEqual(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
