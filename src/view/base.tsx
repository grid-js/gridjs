import { Component } from 'preact';
import { Config } from '../config';
import getConfig from '../util/getConfig';
import { useTranslator } from '../i18n/language';

export interface BaseProps {
  classNamePrefix?: string;
}

export abstract class BaseComponent<P extends BaseProps, S> extends Component<
  P,
  S
> {
  protected config: Config;
  protected _: (message: string) => string;

  constructor(props: P, context: any) {
    super(props, context);
    this.config = getConfig(context);

    if (this.config) {
      this._ = useTranslator(this.config.translator);
    }
  }
}
