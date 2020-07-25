import StorageResponseToArrayTransformer from '../../../src/pipeline/transformer/storageResponseToArray';
import Header from '../../../src/header';

describe('StorageResponseToArray', () => {
  it('should convert array of arrays', async () => {
    const raw = {
      data: [
        [1, 2, 3],
        ['a', 'b', 'c'],
      ],
      total: 2,
    };

    const transformer = new StorageResponseToArrayTransformer();
    const data = await transformer.process(raw);

    expect(data.total).toBe(2);
    expect(data.data).toHaveLength(2);
    expect(data.data).toStrictEqual([
      [1, 2, 3],
      ['a', 'b', 'c'],
    ]);
  });

  it('should convert array of objects', async () => {
    const raw = {
      data: [
        {
          name: 'boo',
          age: 8,
        },
        {
          name: 'foo',
          age: 10,
        },
      ],
      total: 2,
    };

    const transformer = new StorageResponseToArrayTransformer({
      header: Header.fromUserConfig({
        columns: [
          {
            name: 'name',
          },
          {
            name: 'age',
          },
        ],
      }),
    });
    const data = await transformer.process(raw);

    expect(data.total).toBe(2);
    expect(data.data).toHaveLength(2);
    expect(data.data).toStrictEqual([
      ['boo', 8],
      ['foo', 10],
    ]);
  });

  it('should convert array of objects when id is a function', async () => {
    const raw = {
      data: [
        {
          name: {
            first: 'boo',
            last: 'bar',
          },
          _age: 8,
        },
        {
          name: {
            first: 'foo',
            last: 'far',
          },
          _age: 10,
        },
      ],
      total: 2,
    };

    const transformer = new StorageResponseToArrayTransformer({
      header: Header.fromUserConfig({
        columns: [
          {
            id: (row: any) => row.name.first,
            name: 'firstName',
          },
          {
            id: (row: any) => row.name.last,
            name: 'lastname',
          },
          {
            name: 'age',
            id: '_age',
          },
        ],
      }),
    });
    const data = await transformer.process(raw);

    expect(data.data).toStrictEqual([
      ['boo', 'bar', 8],
      ['foo', 'far', 10],
    ]);
  });
});
