import { RowSelectionStore } from '../../src/rowSelection/store';
import { Dispatcher } from 'gridjs';

describe('Store', () => {
  const dispatcher = new Dispatcher();

  it('should handle check actions', () => {
    const store = new RowSelectionStore(dispatcher);
    store.handle('CHECK', {
      ROW_ID: 1,
    });

    expect(store.state.rowIds).toHaveLength(1);
    expect(store.state.rowIds[0]).toBe(1);
  });

  it('should handle uncheck', () => {
    const store = new RowSelectionStore(dispatcher);

    store.handle('CHECK', {
      ROW_ID: 1,
    });

    store.handle('CHECK', {
      ROW_ID: 2,
    });

    store.handle('UNCHECK', {
      ROW_ID: 1,
    });

    expect(store.state.rowIds).toHaveLength(1);
    expect(store.state.rowIds[0]).toBe(2);
  });

  it('should handle uncheck with empty store', () => {
    const store = new RowSelectionStore(dispatcher);

    store.handle('UNCHECK', {
      ROW_ID: 1,
    });

    expect(store.state.rowIds).toHaveLength(0);
  });

  it('should not uncheck wrong items', () => {
    const store = new RowSelectionStore(dispatcher);

    store.handle('CHECK', {
      ROW_ID: '1',
    });

    store.handle('CHECK', {
      ROW_ID: '2',
    });

    store.handle('UNCHECK', {
      ROW_ID: '3',
    });

    expect(store.state.rowIds).toHaveLength(2);
    expect(store.state.rowIds).toContain('1');
    expect(store.state.rowIds).toContain('2');
  });

  it('should not check the same item twice', () => {
    const store = new RowSelectionStore(dispatcher);

    store.handle('CHECK', {
      ROW_ID: 1,
    });

    store.handle('CHECK', {
      ROW_ID: 1,
    });

    expect(store.state.rowIds).toHaveLength(1);
    expect(store.state.rowIds[0]).toBe(1);
  });
});
