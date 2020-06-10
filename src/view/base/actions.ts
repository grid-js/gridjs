import Dispatcher from '../../util/dispatcher';

export abstract class BaseActions<ACTIONS> {
  private readonly dispatcher: Dispatcher<any>;

  constructor(dispatcher: Dispatcher<any>) {
    this.dispatcher = dispatcher;
  }

  protected dispatch<K extends keyof ACTIONS>(
    type: K,
    payload: ACTIONS[K],
  ): void {
    this.dispatcher.dispatch({
      type: type,
      payload: payload,
    });
  }
}
