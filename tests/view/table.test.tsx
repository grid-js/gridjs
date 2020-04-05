import renderer from 'react-test-renderer';
import Grid from '../../src/grid';
import Config from "../../src/config";
import React from "react";
import {Table} from "../../src/view/table";


describe('Table component', () => {
  it('should render a table', () => {
    const config = new Config({
      data: [[1, 2, 3], ['a', 'b', 'c']]
    });

    const grid = new Grid(config);

    const table = renderer.create(
      <Table config={grid.config} />
    );
    expect(table).toMatchSnapshot();
  });
});
