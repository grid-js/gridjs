import { Component } from 'preact';
import { Config } from '../config';
import getConfig from '../util/getConfig';
import { useTranslator } from '../i18n/language';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseProps {}

export abstract class BaseComponent<
  P extends BaseProps = {},
  S = {}
> extends Component<P, S> {
  protected config: Config;
  protected _: (message: string, ...args) => string;

  constructor(props: P, context: any) {
    super(props, context);
    this.config = getConfig(context);

    if (this.config) {
      this._ = useTranslator(this.config.translator);
    }
  }
}

export interface BaseComponent<P> {
  new (props: P, context?: any): Component<P>;
}
