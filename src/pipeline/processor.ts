// The order of enum items define the processing order of the processor type
// e.g. Extractor = 0 will be processed before Transformer = 1
import { generateUUID, ID } from '../util/id';
import { EventEmitter } from '../util/eventEmitter';

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

interface PipelineProcessorEvents<T, P> {
  propsUpdated: (processor: PipelineProcessor<T, P>) => void;
  beforeProcess: (...args) => void;
  afterProcess: (...args) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PipelineProcessorProps {}

export abstract class PipelineProcessor<
  T,
  P extends Partial<PipelineProcessorProps>
> extends EventEmitter<PipelineProcessorEvents<T, P>> {
  public readonly id: ID;
  private readonly _props: P;

  abstract get type(): ProcessorType;
  protected abstract _process(...args): T | Promise<T>;
  protected validateProps?(...args): void;

  constructor(props?: Partial<P>) {
    super();

    this._props = {} as P;
    this.id = generateUUID();

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

    this.emit('beforeProcess', ...args);
    const result = this._process(...args);
    this.emit('afterProcess', ...args);
    return result;
  }

  setProps(props: Partial<P>): this {
    Object.assign(this._props, props);
    this.emit('propsUpdated', this);
    return this;
  }

  get props(): P {
    return this._props;
  }
}
