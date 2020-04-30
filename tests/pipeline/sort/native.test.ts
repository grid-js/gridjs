import Tabular from '../../../src/tabular';
import NativeSort from "../../../src/pipeline/sort/native";

describe('NativeSort', () => {
  let data: Tabular<string>;

  beforeAll(() => {
    data = Tabular.fromArray([
      ['b1', 'b2', 'b3'],
      ['a1', 'a2', 'a3'],
      ['c1', 'c2', 'c3'],
      ['e1', 'e2', 'e3'],
      ['d1', 'd2', 'd3'],
    ]);
  });

  it('should sort an array', async () => {
    const sort = new NativeSort().setProps({
      columnIndex: 0
    });

    const newData = await sort.process(data);

    expect(newData).toBeInstanceOf(Tabular);
    expect(newData).toHaveLength(5);

    expect(newData.rows[0].cells[0].data).toBe('a1');
    expect(newData.rows[0].cells[1].data).toBe('a2');
    expect(newData.rows[0].cells[2].data).toBe('a3');
    expect(newData.rows[1].cells[0].data).toBe('b1');
    expect(newData.rows[1].cells[1].data).toBe('b2');
    expect(newData.rows[1].cells[2].data).toBe('b3');
    expect(newData.rows[4].cells[0].data).toBe('e1');
    expect(newData.rows[4].cells[1].data).toBe('e2');
    expect(newData.rows[4].cells[2].data).toBe('e3');
  });

  it('should sort a numeric array asc', async () => {
    const numericData = Tabular.fromArray([
        [4, 30],
        [1, 10],
        [0, 20],
        [3, 50],
        [2, 40],
      ]);

    const sort = new NativeSort().setProps({
      columnIndex: 0,
      order: 1
    });

    const newData = await sort.process(numericData);

    expect(newData).toHaveLength(5);

    expect(newData.rows[0].cells[0].data).toBe(0);
    expect(newData.rows[0].cells[1].data).toBe(20);
    expect(newData.rows[1].cells[0].data).toBe(1);
    expect(newData.rows[1].cells[1].data).toBe(10);
    expect(newData.rows[4].cells[0].data).toBe(4);
    expect(newData.rows[4].cells[1].data).toBe(30);
  });

  it('should sort a numeric array desc', async () => {
    const numericData = Tabular.fromArray([
      [4, 30],
      [1, 10],
      [0, 20],
      [3, 50],
      [2, 40],
    ]);

    const sort = new NativeSort().setProps({
      columnIndex: 0,
      order: -1
    });

    const newData = await sort.process(numericData);

    expect(newData).toHaveLength(5);

    expect(newData.rows[0].cells[0].data).toBe(4);
    expect(newData.rows[0].cells[1].data).toBe(30);
    expect(newData.rows[1].cells[0].data).toBe(3);
    expect(newData.rows[1].cells[1].data).toBe(50);
    expect(newData.rows[4].cells[0].data).toBe(0);
    expect(newData.rows[4].cells[1].data).toBe(20);
  });

  it('should raise an error if columnIndex is invalid', async () => {
    expect(() => {
      const sort = new NativeSort().setProps({
        columnIndex: NaN
      });

      sort.process(data);
    }).toThrowError();

    expect(() => {
      const sort = new NativeSort().setProps({
        columnIndex: 3
      });

      sort.process(data);
    }).toThrowError();
  });
});
