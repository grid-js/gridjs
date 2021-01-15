import { mount } from 'enzyme';
import { createContext, h } from 'preact';
import { TD } from '../../../src/view/table/td';
import Cell from '../../../src/cell';
import { Config } from '../../../src/config';
import { EventEmitter } from '../../../src/util/eventEmitter';
import { TableEvents } from '../../../src/view/table/events';

describe('TD component', () => {
  let config: Config;
  const configContext = createContext(null);

  beforeEach(() => {
    config = new Config();
  });

  it('should match the snapshot', () => {
    const td = mount(
      <configContext.Provider value={config}>
        <TD cell={new Cell('boo')} />
      </configContext.Provider>,
    );
    expect(td.html()).toMatchSnapshot();
  });

  it('should emit cellClick', async () => {
    config.eventEmitter = new EventEmitter<TableEvents>();
    const onClick = jest.fn();

    const cells = mount(
      <configContext.Provider value={config}>
        <TD cell={new Cell('boo')} />
      </configContext.Provider>,
    ).find('td');

    config.eventEmitter.on('cellClick', onClick);
    cells.map((td) => td.simulate('click'));

    expect(cells.length).toEqual(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
