import { CheckboxStore } from '../src/store';
import { Dispatcher } from 'gridjs';

describe('Store', () => {
  const dispatcher = new Dispatcher();

  it('should generate unique IDs', () => {
    const store = new CheckboxStore(dispatcher);
    store.handle('CHECK', {
      ROW_ID: 1,
    });

    expect(store.state.rowIds).toHaveLength(1);
    expect(store.state.rowIds[0]).toBe(1);
  });
});
