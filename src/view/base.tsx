import { Component } from 'preact';
import { Config } from '../config';
import getConfig from '../util/getConfig';
import { useTranslator } from '../i18n/language';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseProps {}

export abstract class BaseComponent<
  P extends BaseProps = unknown,
  S = unknown,
> extends Component<P, S> {
  private lastConfigVersion: number;
  protected config: Config;
  protected _: (message: string, ...args) => string;

  constructor(props: P, context: any) {
    super(props, context);

    const config = getConfig(context);
    this.config = config;

    if (config) {
      this.lastConfigVersion = this.config.version;
      this._ = useTranslator(config.translator);
    }
  }

  componentDidUpdate(_: Readonly<any>, __: Readonly<any>): void {
    if (this.lastConfigVersion != this.config.version) {
      this.lastConfigVersion = this.config.version;

      if (typeof this.configDidUpdate === 'function') {
        this.configDidUpdate();
      }
    }
  }

  componentDidMount(): void {
    if (typeof this.configDidUpdate === 'function') {
      this.configDidUpdate();
    }
  }
}

export interface BaseComponent<P> {
  new (props: P, context?: any): Component<P>;
  configDidUpdate?(): void;
}
