import { Dispatcher } from 'gridjs';
import { CheckboxActions } from '../src/actions';

describe('Actions', () => {
  const dispatcher = new Dispatcher();

  beforeEach(() => {
    dispatcher.dispatch = jest.fn();
  });

  it('should trigger CHECK', () => {
    const actions = new CheckboxActions(dispatcher);
    actions.check('42');

    expect(dispatcher.dispatch).toBeCalledTimes(1);
    expect(dispatcher.dispatch).toBeCalledWith({
      payload: {
        ROW_ID: '42',
      },
      type: 'CHECK'
    })
  });

  it('should trigger CHECK twice', () => {
    const actions = new CheckboxActions(dispatcher);
    actions.check('1');
    actions.check('2');
    expect(dispatcher.dispatch).toBeCalledTimes(2);
  });


  it('should trigger UNCHECK', () => {
    const actions = new CheckboxActions(dispatcher);
    actions.uncheck('24');

    expect(dispatcher.dispatch).toBeCalledTimes(1);
    expect(dispatcher.dispatch).toBeCalledWith({
      payload: {
        ROW_ID: '24',
      },
      type: 'UNCHECK'
    })
  });
});
