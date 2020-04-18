import { PipelineProcessor } from './processor';

class Pipeline<T, P = {}> {
  // available steps for this pipeline
  private readonly _steps: PipelineProcessor<T, P>[] = [];
  private propsUpdatedCallback: Set<(...args) => void> = new Set();
  private updatedCallback: Set<(...args) => void> = new Set();

  constructor(steps?: PipelineProcessor<any, any>[]) {
    if (steps) {
      steps.forEach(step => this.register(step));
    }
  }

  register(processor: PipelineProcessor<T, P>): void {
    if (processor.type === null) {
      throw Error('Processor type is not defined');
    }

    processor.propsUpdated(this.processorPropsUpdated.bind(this));
    this._steps.push(processor);
    this.trigger(this.updatedCallback, processor);
  }

  get steps(): PipelineProcessor<T, P>[] {
    return this._steps;
  }

  async process(data?: T): Promise<T> {
    let prev = data;
    for (const step of this._steps) {
      prev = await step.process(prev);
    }

    return prev;
  }

  private trigger(fns: Set<(...args) => void>, ...args): void {
    if (fns) {
      fns.forEach(fn => fn(...args));
    }
  }

  private processorPropsUpdated(): void {
    this.trigger(this.propsUpdatedCallback);
    this.trigger(this.updatedCallback);
  }

  propsUpdated(fn: (...args) => void): this {
    this.propsUpdatedCallback.add(fn);
    return this;
  }

  updated(fn: (...args) => void): this {
    this.updatedCallback.add(fn);
    return this;
  }
}

export default Pipeline;
