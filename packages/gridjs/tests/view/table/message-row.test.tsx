import { mount } from 'enzyme';
import { createContext, h } from 'preact';
import { Config } from '../../../src/config';
import { EventEmitter } from '../../../src/util/eventEmitter';
import { TableEvents } from '../../../src/view/table/events';
import { MessageRow } from '../../../src/view/table/messageRow';

describe('MessageRow component', () => {
  let config: Config;
  const configContext = createContext(null);

  beforeEach(() => {
    config = new Config();
  });

  it('should match the snapshot', () => {
    const td = mount(
      <configContext.Provider value={config}>
        <MessageRow message="boo" />
      </configContext.Provider>,
    );
    expect(td.html()).toMatchSnapshot();
  });

  it('should prevent emit rowClick', async () => {
    config.eventEmitter = new EventEmitter<TableEvents>();
    const onClick = jest.fn();

    const rows = mount(
      <configContext.Provider value={config}>
        <MessageRow message="boo" />
      </configContext.Provider>,
    ).find('tr');

    config.eventEmitter.on('rowClick', onClick)
    rows.map(tr => tr.simulate('click'));

    expect(rows.length).toEqual(1);
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});

