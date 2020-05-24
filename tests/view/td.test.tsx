import { mount } from 'enzyme';
import { h } from 'preact';
import { TD } from '../../src/view/table/td';
import Cell from '../../src/cell';

describe('TD component', () => {
  it('should match the snapshot', () => {
    const td = mount(<TD cell={new Cell('boo')} />);
    expect(td.html()).toMatchSnapshot();
  });
});
