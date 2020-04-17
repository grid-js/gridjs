import { PipelineProcessor } from './processor';

class Pipeline<T> {
  private readonly _steps: PipelineProcessor<T>[] = [];

  constructor(steps?: PipelineProcessor<T>[]) {
    if (steps) {
      steps.forEach(step => this.register(step));
    }
  }

  register(processor: PipelineProcessor<T>): void {
    if (processor.type === null) {
      throw Error('Processor type is not defined');
    }

    this._steps.push(processor);
  }

  get steps(): PipelineProcessor<T>[] {
    return this._steps;
  }

  process(data: T): T {
    return this._steps.reduce(
      (previous, current) => current.process(previous),
      data,
    );
  }
}

export default Pipeline;
