import { Component } from 'preact';

export interface BaseProps {
  classNamePrefix?: string
}

export abstract class BaseComponent<P extends BaseProps, S> extends Component<P, S> {}
