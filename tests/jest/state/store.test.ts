import { Store } from '../../../src/state/store';

describe('Store', () => {
  it('should set the initial state', () => {
    const stubState = {
      a: 45,
    };
    const store = new Store(stubState);
    expect(store.getState()).toEqual(stubState);
  });

  it('should update the state', () => {
    const store = new Store({
      hello: 'world',
    });
    store.dispatch((state) => {
      return {
        ...state,
        newKey: 42,
      };
    });
    expect(store.getState()).toEqual({
      hello: 'world',
      newKey: 42,
    });
  });

  it('should override the state', () => {
    const store = new Store({
      hello: 'world',
    });
    store.dispatch((state) => {
      return {
        ...state,
        hello: 'updated',
      };
    });
    expect(store.getState()).toEqual({
      hello: 'updated',
    });
  });

  it('should call the subscribers', () => {
    const store = new Store({
      hello: 'world',
    });

    const mockSubscriber = jest.fn();

    store.subscribe(mockSubscriber);

    store.dispatch((state) => {
      return {
        ...state,
        hello: 'updated',
        newKey: 42,
      };
    });

    expect(mockSubscriber).toBeCalledTimes(1);
    expect(mockSubscriber).toBeCalledWith(
      {
        hello: 'updated',
        newKey: 42,
      },
      {
        hello: 'world',
      },
    );
  });

  it('should return a list of subscribers', () => {
    const store = new Store({
      hello: 'world',
    });

    const mockSubscriber1 = jest.fn();
    const mockSubscriber2 = jest.fn();

    store.subscribe(mockSubscriber1);
    store.subscribe(mockSubscriber2);

    expect(store.getListeners()).toHaveLength(2);
    expect(store.getListeners()).toEqual(
      expect.arrayContaining([mockSubscriber2, mockSubscriber1]),
    );
  });
});
