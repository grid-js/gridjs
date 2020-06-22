import { mount } from 'enzyme';
import {createContext, h} from 'preact';
import { TD } from '../../../src/view/table/td';
import Cell from '../../../src/cell';
import {Config} from "../../../src/config";

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
      </configContext.Provider>
    );
    expect(td.html()).toMatchSnapshot();
  });
});
