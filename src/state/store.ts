export class Store<S = Record<string, unknown>> {
  private state: S;
  private listeners: ((current?: S, prev?: S) => void)[] = [];
  private isDispatching = false;

  constructor(initialState: S) {
    this.state = initialState;
  }

  getState = () => this.state;
  getListeners = () => this.listeners;

  dispatch = (reducer: (state: S) => S) => {
    if (typeof reducer !== 'function')
      throw new Error('Reducer is not a function');
    if (this.isDispatching)
      throw new Error('Reducers may not dispatch actions');

    this.isDispatching = true;

    const prevState = this.state;
    try {
      this.state = reducer(this.state);
    } finally {
      this.isDispatching = false;
    }

    for (const listener of this.listeners) {
      listener(this.state, prevState);
    }

    return this.state;
  };

  subscribe = (listener: (current?: S, prev?: S) => void): (() => void) => {
    if (typeof listener !== 'function')
      throw new Error('Listener is not a function');

    this.listeners = [...this.listeners, listener];
    return () =>
      (this.listeners = this.listeners.filter((lis) => lis !== listener));
  };
}
