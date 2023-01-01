import * as Actions from '../../src/rowSelection/actions';

describe('Actions', () => {
  it('should trigger CHECK', () => {
    const state = Actions.CheckRow('42')({});

    expect(state).toStrictEqual({
      rowSelection: {
        rowIds: ['42'],
      },
    });
  });

  it('should trigger CHECK when rowIds already exists', () => {
    const state = Actions.CheckRow('42')({
      rowSelection: {
        rowIds: ['24'],
      },
    });

    expect(state).toStrictEqual({
      rowSelection: {
        rowIds: ['42', '24'],
      },
    });
  });

  it('should trigger UNCHECK', () => {
    const state = Actions.UncheckRow('42')({
      rowSelection: {
        rowIds: ['42'],
      },
    });

    expect(state).toStrictEqual({
      rowSelection: {
        rowIds: [],
      },
    });
  });

  it('should trigger UNCHECK when rowIds is empty', () => {
    const state = Actions.UncheckRow('42')({
      rowSelection: {
        rowIds: [],
      },
    });

    expect(state).toStrictEqual({
      rowSelection: {
        rowIds: [],
      },
    });
  });

  it('should CHECK and UNCHECK', () => {
    let state = {};
    state = Actions.CheckRow('42')(state);
    state = Actions.CheckRow('24')(state);
    state = Actions.UncheckRow('42')(state);

    expect(state).toStrictEqual({
      rowSelection: {
        rowIds: ['24'],
      },
    });
  });
});
