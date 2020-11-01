import ServerStorage from '../../src/storage/server';

describe('ServerStorage class', () => {
  beforeEach(() => {
    const mockSuccessResponse = {
      rows: [
        [6, 6, 6],
        [7, 7, 7],
      ],
      numRows: 10,
    };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () => mockJsonPromise,
    });

    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
  });

  afterEach(() => {
    // eslint-disable-next-line
    // @ts-ignore
    global.fetch.mockClear();
  });

  it('should call fetch once get is called', async () => {
    const opts = {
      url: 'https://example.com',
      then: (res) => res,
    };
    await new ServerStorage(opts).get();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://example.com', opts);
  });

  it('should pass options to fetch', async () => {
    const opts = {
      url: 'https://example.com',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Test': 'HelloWorld',
      },
      then: (res) => res,
    };
    await new ServerStorage(opts).get();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://example.com', opts);
  });

  it('should format the response with then callback', async () => {
    const opts = {
      url: 'https://example.com',
      then: (_) => [
        [1, 2, 3],
        [4, 5, 6],
      ],
    };

    const resp = await new ServerStorage(opts).get();
    expect(resp).toStrictEqual({
      data: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      total: undefined,
    });
  });

  it('should set total', async () => {
    const opts = {
      url: 'https://example.com',
      then: (res) => res.rows,
      total: (res) => res.numRows + 2,
    };

    const resp = await new ServerStorage(opts).get();
    expect(resp).toStrictEqual({
      data: [
        [6, 6, 6],
        [7, 7, 7],
      ],
      total: 12,
    });
  });

  it('should call data', async () => {
    const opts = {
      url: 'https://example.com',
      data: async () => {
        return {
          data: [
            [3, 3, 3],
            [9, 9, 9],
          ],
          total: 100,
        };
      },
    };

    const resp = await new ServerStorage(opts).get();
    expect(resp).toStrictEqual({
      data: [
        [3, 3, 3],
        [9, 9, 9],
      ],
      total: 100,
    });

    expect(global.fetch).toHaveBeenCalledTimes(0);
  });
});
