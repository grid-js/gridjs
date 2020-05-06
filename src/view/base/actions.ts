import dispatcher from '../../util/dispatcher';

export abstract class BaseActions<ACTIONS> {
  protected dispatch<K extends keyof ACTIONS>(
    type: K,
    payload: ACTIONS[K],
  ): void {
    dispatcher.dispatch({
      type: type,
      payload: payload,
    });
  }
}
