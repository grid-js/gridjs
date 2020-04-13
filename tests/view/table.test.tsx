import { mount } from 'enzyme';
import { h } from 'preact';
import { Table } from '../../src/view/table';
import Tabular from '../../src/tabular';
import Header from '../../src/header';
import Config from "../../src/config";

describe('Table component', () => {
  beforeAll(() => {
    (new Config()).setCurrent();
  });

  it('should render a table', () => {
    const table = mount(
      <Table
        data={Tabular.fromArray([
          [1, 2, 3],
          ['a', 'b', 'c'],
        ])}
      />,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with header', () => {
    const table = mount(
      <Table
        data={Tabular.fromArray([
          [1, 2, 3],
          ['a', 'b', 'c'],
        ])}
        header={Header.fromArray(['h1', 'h2', 'h3'])}
      />,
    );

    expect(table.html()).toMatchSnapshot();
  });
});
