import React from "react";
import { TD } from '../../src/view/td';
import renderer from 'react-test-renderer';
import Cell from "../../src/cell";


describe('TD component', () => {
  it('should render a tr element', () => {
    const td = renderer.create(
      <TD cell={new Cell('boo')} />
    );
    expect(td).toMatchSnapshot();
  });
});
