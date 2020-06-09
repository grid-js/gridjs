import { EventEmitter } from '../../util/eventEmitter';
import Dispatcher from '../../util/dispatcher';

interface BaseStoreEvents<STATE> {
  updated: (newState: STATE, prevState?: STATE) => void;
}

export default abstract class BaseStore<STATE, ACTIONS> extends EventEmitter<
  BaseStoreEvents<STATE>
> {
  private _state: STATE;
  protected readonly dispatcher: Dispatcher<any>;

  constructor(dispatcher: Dispatcher<any>) {
    super();
    this.dispatcher = dispatcher;
    this._state = this.getInitialState();
    dispatcher.register(this._handle.bind(this));
  }

  abstract handle<K extends keyof ACTIONS>(type: K, payload: ACTIONS[K]): void;
  abstract getInitialState(): STATE;

  private _handle(action): void {
    this.handle(action.type, action.payload);
  }

  setState(newState: STATE): void {
    const prevState = this._state;
    this._state = newState;
    this.emit('updated', newState, prevState);
  }

  get state(): STATE {
    return this._state;
  }
}
