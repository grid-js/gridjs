import { Component } from 'preact';
import Config from '../config';

export interface BaseProps {
  classNamePrefix?: string;
}

export interface BaseEvents<P, S> {
  SET_STATE: (component: BaseComponent<P, S>, state: S) => void;
}

export abstract class BaseComponent<P extends BaseProps, S> extends Component<
  P,
  S
> {
  setState(state: S, callback?: () => void): void {
    super.setState(state, callback);
    Config.current.events.emit('SET_STATE', this, state);
  }
}
