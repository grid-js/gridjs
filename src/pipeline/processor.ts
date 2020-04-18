export enum ProcessorType {
  Extractor,
  Transformer,
  Search,
  Sort,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PipelineProcessorProps {}

export abstract class PipelineProcessor<T, P extends PipelineProcessorProps> {
  private readonly _props: P;
  private propsUpdatedCallback: Set<(...args) => void> = new Set();

  abstract get type(): ProcessorType;
  abstract process(...args): T | Promise<T>;

  constructor(props?: P) {
    this._props = {} as P;

    if (props) this.setProps(props);
  }

  private trigger(fns: Set<(...args) => void>, ...args): void {
    if (fns) {
      fns.forEach(fn => fn(...args));
    }
  }

  setProps(props: P): this {
    Object.assign(this._props, props);
    this.trigger(this.propsUpdatedCallback);
    return this;
  }

  get props(): P {
    return this._props;
  }

  propsUpdated(callback: (...args) => void): this {
    this.propsUpdatedCallback.add(callback);
    return this;
  }
}
