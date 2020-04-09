import { mount } from 'enzyme';
import { h } from "preact";
import {Table} from "../../src/view/table";
import Tabular from "../../src/tabular";


describe('Table component', () => {
  it('should render a table', () => {
    const table = mount(
      <Table tabular={Tabular.fromArray([[1, 2, 3], ['a', 'b', 'c']])} />
    );

    expect(table.html()).toMatchSnapshot();
  });
});
