import { mount } from 'enzyme';
import { h } from 'preact';
import { Table } from '../../src/view/table/table';
import Tabular from '../../src/tabular';
import Header from '../../src/header';
import Config from '../../src/config';
import { TCell } from '../../src/types';
import MemoryStorage from "../../src/storage/memory";

describe('Table component', () => {
  beforeAll(() => {
    new Config().setCurrent();
  });

  it('should render a table', () => {
    const table = mount(
      <Table
        data={Tabular.fromArray<TCell>([
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
        data={Tabular.fromArray<TCell>([
          [1, 2, 3],
          ['a', 'b', 'c'],
        ])}
        header={Header.fromArrayOfString(['h1', 'h2', 'h3'])}
      />,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with width', () => {
    const config = new Config();
    config.

    const table = mount(
      <Table
        data={Tabular.fromArray<TCell>([
          [1, 2, 3],
          ['a', 'b', 'c'],
        ])}
        header={Header.fromArrayOfString(['h1', 'h2', 'h3'])}
      />,
    );

    expect(table.html()).toMatchSnapshot();
  });
});
