import renderer from 'react-test-renderer';
import React from "react";
import {Table} from "../../src/view/table";
import Tabular from "../../src/tabular";


describe('Table component', () => {
  it('should render a table', () => {
    const table = renderer.create(
      <Table tabular={Tabular.fromArray([[1, 2, 3], ['a', 'b', 'c']])} />
    );

    expect(table).toMatchSnapshot();
  });
});
