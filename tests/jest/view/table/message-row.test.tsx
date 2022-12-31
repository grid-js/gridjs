import { h } from 'preact';
import { mount } from 'enzyme';
import { Config, ConfigContext } from '../../../../src/config';
import { EventEmitter } from '../../../../src/util/eventEmitter';
import { TableEvents } from '../../../../src/view/table/events';
import { MessageRow } from '../../../../src/view/table/messageRow';

describe('MessageRow component', () => {
  let config: Config;

  beforeEach(() => {
    config = new Config();
  });

  it('should match the snapshot', () => {
    const td = mount(
      <ConfigContext.Provider value={config}>
        <MessageRow message="boo" />
      </ConfigContext.Provider>,
    );
    expect(td.html()).toMatchSnapshot();
  });

  it('should prevent emit rowClick', async () => {
    config.eventEmitter = new EventEmitter<TableEvents>();
    const onClick = jest.fn();

    const rows = mount(
      <ConfigContext.Provider value={config}>
        <MessageRow message="boo" />
      </ConfigContext.Provider>,
    ).find('tr');

    config.eventEmitter.on('rowClick', onClick);
    rows.map((tr) => tr.simulate('click'));

    expect(rows.length).toEqual(1);
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
