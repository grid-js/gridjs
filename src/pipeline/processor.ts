// The order of enum items define the processing order of the processor type
// e.g. Extractor = 0 will be processed before Transformer = 1
import { generateID, ID } from '../util/id';

export enum ProcessorType {
  Initiator,
  ServerFilter,
  ServerSort,
  ServerLimit,
  Extractor,
  Transformer,
  Filter,
  Sort,
  Limit,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PipelineProcessorProps {}

export abstract class PipelineProcessor<
  T,
  P extends Partial<PipelineProcessorProps>
> {
  public readonly id: ID;
  private readonly _props: P;
  private propsUpdatedCallback: Set<(...args) => void> = new Set();
  private beforeProcessCallback: Set<(...args) => void> = new Set();
  private afterProcessCallback: Set<(...args) => void> = new Set();

  abstract get type(): ProcessorType;
  protected abstract _process(...args): T | Promise<T>;
  protected validateProps?(...args): void;

  constructor(props?: Partial<P>) {
    this._props = {} as P;
    this.id = generateID();

    if (props) this.setProps(props);
  }

  /**
   * process is used to call beforeProcess and afterProcess callbacks
   * This function is just a wrapper that calls _process()
   *
   * @param args
   */
  process(...args): T | Promise<T> {
    if (this.validateProps instanceof Function) {
      this.validateProps(...args);
    }

    this.trigger(this.beforeProcessCallback, ...args);
    const result = this._process(...args);
    this.trigger(this.afterProcessCallback, ...args);
    return result;
  }

  private trigger(fns: Set<(...args) => void>, ...args): void {
    if (fns) {
      fns.forEach((fn) => fn(...args));
    }
  }

  setProps(props: Partial<P>): this {
    Object.assign(this._props, props);
    this.trigger(this.propsUpdatedCallback, this);
    return this;
  }

  get props(): P {
    return this._props;
  }

  propsUpdated(callback: (...args) => void): this {
    this.propsUpdatedCallback.add(callback);
    return this;
  }

  beforeProcess(callback: (...args) => void): this {
    this.beforeProcessCallback.add(callback);
    return this;
  }

  afterProcess(callback: (...args) => void): this {
    this.afterProcessCallback.add(callback);
    return this;
  }
}
