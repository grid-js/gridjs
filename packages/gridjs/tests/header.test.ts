import Header from '../src/header';

describe('Header class', () => {
  it('should return a tabular header cell (single row)', () => {
    const header = Header.fromUserConfig({
      columns: [
        {
          name: 'h1',
        },
        'h2',
        {
          name: 'h3',
        },
      ],
    });

    const tabularColumns = Header.tabularFormat(header.columns);
    expect(tabularColumns).toHaveLength(1);

    expect(tabularColumns[0][0].name).toBe('h1');
    expect(tabularColumns[0][1].name).toBe('h2');
    expect(tabularColumns[0][2].name).toBe('h3');
  });

  it('should return a tabular header cell (two levels)', () => {
    const header = Header.fromUserConfig({
      columns: [
        {
          name: 'h1',
        },
        'h2',
        {
          name: 'h3',
          columns: [
            {
              name: 'h3-h1',
            },
            {
              name: 'h3-h2',
            },
          ],
        },
      ],
    });

    const tabularColumns = Header.tabularFormat(header.columns);
    expect(tabularColumns).toHaveLength(2);

    expect(tabularColumns[0][0].name).toBe('h1');
    expect(tabularColumns[0][1].name).toBe('h2');
    expect(tabularColumns[0][2].name).toBe('h3');

    expect(tabularColumns[1][0].name).toBe('h3-h1');
    expect(tabularColumns[1][1].name).toBe('h3-h2');
  });

  it('should return a tabular header cell (complex definition)', () => {
    const header = Header.fromUserConfig({
      columns: [
        {
          name: 'h1',
          columns: [
            {
              name: 'h1-h1',
              columns: [
                {
                  name: 'h1-h1-h1',
                },
              ],
            },
            {
              name: 'h1-h2',
              columns: [
                {
                  name: 'h1-h2-h1',
                },
              ],
            },
          ],
        },
        'h2',
        {
          name: 'h3',
          columns: [
            {
              name: 'h3-h1',
              columns: [
                {
                  name: 'h3-h1-h1',
                },
                {
                  name: 'h3-h1-h2',
                  columns: [
                    {
                      name: 'h3-h1-h2-h1',
                    },
                  ],
                },
              ],
            },
            {
              name: 'h3-h2',
            },
          ],
        },
      ],
    });

    const tabularColumns = Header.tabularFormat(header.columns);
    expect(tabularColumns).toHaveLength(4);

    expect(tabularColumns[0][0].name).toBe('h1');
    expect(tabularColumns[0][1].name).toBe('h2');
    expect(tabularColumns[0][2].name).toBe('h3');

    expect(tabularColumns[1][0].name).toBe('h1-h1');
    expect(tabularColumns[1][1].name).toBe('h1-h2');
    expect(tabularColumns[1][2].name).toBe('h3-h1');
    expect(tabularColumns[1][3].name).toBe('h3-h2');

    expect(tabularColumns[2][0].name).toBe('h1-h1-h1');
    expect(tabularColumns[2][1].name).toBe('h1-h2-h1');
    expect(tabularColumns[2][2].name).toBe('h3-h1-h1');
    expect(tabularColumns[2][3].name).toBe('h3-h1-h2');

    expect(tabularColumns[3][0].name).toBe('h3-h1-h2-h1');
  });

  it('should return a tabular header cell (three levels)', () => {
    const header = Header.fromUserConfig({
      columns: [
        {
          name: 'h1',
        },
        'h2',
        {
          name: 'h3',
          columns: [
            {
              name: 'h3-h1',
            },
            {
              name: 'h3-h2',
              columns: [
                {
                  name: 'h3-h2-h1',
                },
                {
                  name: 'h3-h2-h2',
                },
              ],
            },
          ],
        },
      ],
    });

    const tabularColumns = Header.tabularFormat(header.columns);
    expect(tabularColumns).toHaveLength(3);

    expect(tabularColumns[0][0].name).toBe('h1');
    expect(tabularColumns[0][1].name).toBe('h2');
    expect(tabularColumns[0][2].name).toBe('h3');

    expect(tabularColumns[1][0].name).toBe('h3-h1');
    expect(tabularColumns[1][1].name).toBe('h3-h2');

    expect(tabularColumns[2][0].name).toBe('h3-h2-h1');
    expect(tabularColumns[2][1].name).toBe('h3-h2-h2');
  });
});
