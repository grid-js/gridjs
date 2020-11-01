const _prefix = 'ID_';

/**
 * This class is mostly based on Flux's Dispatcher by Facebook
 * https://github.com/facebook/flux/blob/master/src/Dispatcher.js
 */
export default class Dispatcher<TPayload> {
  _callbacks: { [key: string]: (payload: TPayload) => void };
  _isDispatching: boolean;
  _isHandled: { [key: string]: boolean };
  _isPending: { [key: string]: boolean };
  _lastID: number;
  _pendingPayload: TPayload;

  constructor() {
    this._callbacks = {};
    this._isDispatching = false;
    this._isHandled = {};
    this._isPending = {};
    this._lastID = 1;
  }
  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   */
  register(callback: (payload: TPayload) => void): string {
    const id = _prefix + this._lastID++;
    this._callbacks[id] = callback;
    return id;
  }
  /**
   * Removes a callback based on its token.
   */
  unregister(id: string): void {
    if (!this._callbacks[id]) {
      throw Error(
        `Dispatcher.unregister(...): ${id} does not map to a registered callback.`,
      );
    }

    delete this._callbacks[id];
  }
  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   */
  waitFor(ids: Array<string>): void {
    if (!this._isDispatching) {
      throw Error(
        'Dispatcher.waitFor(...): Must be invoked while dispatching.',
      );
    }

    for (let ii = 0; ii < ids.length; ii++) {
      const id = ids[ii];
      if (this._isPending[id]) {
        if (!this._isHandled[id]) {
          throw Error(`Dispatcher.waitFor(...): Circular dependency detected while ' +
            'waiting for ${id}.`);
        }
        continue;
      }
      if (!this._callbacks[id]) {
        throw Error(
          `Dispatcher.waitFor(...): ${id} does not map to a registered callback.`,
        );
      }

      this._invokeCallback(id);
    }
  }
  /**
   * Dispatches a payload to all registered callbacks.
   */
  dispatch(payload: TPayload): void {
    if (this._isDispatching) {
      throw Error(
        'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.',
      );
    }

    this._startDispatching(payload);
    try {
      for (const id in this._callbacks) {
        if (this._isPending[id]) {
          continue;
        }
        this._invokeCallback(id);
      }
    } finally {
      this._stopDispatching();
    }
  }
  /**
   * Is this Dispatcher currently dispatching.
   */
  isDispatching(): boolean {
    return this._isDispatching;
  }
  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @internal
   */
  private _invokeCallback(id: string): void {
    this._isPending[id] = true;
    this._callbacks[id](this._pendingPayload);
    this._isHandled[id] = true;
  }
  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @internal
   */
  private _startDispatching(payload: TPayload): void {
    for (const id in this._callbacks) {
      this._isPending[id] = false;
      this._isHandled[id] = false;
    }
    this._pendingPayload = payload;
    this._isDispatching = true;
  }
  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  private _stopDispatching(): void {
    delete this._pendingPayload;
    this._isDispatching = false;
  }
}
