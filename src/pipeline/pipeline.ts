import { PipelineProcessor, ProcessorType } from './processor';

class Pipeline<T, P = {}> {
  // available steps for this pipeline
  private readonly _steps: Map<
    ProcessorType,
    PipelineProcessor<T, P>[]
  > = new Map<ProcessorType, PipelineProcessor<T, P>[]>();
  private propsUpdatedCallback: Set<(...args) => void> = new Set();
  private afterRegisterCallback: Set<(...args) => void> = new Set();
  private updatedCallback: Set<(...args) => void> = new Set();

  constructor(steps?: PipelineProcessor<any, any>[]) {
    if (steps) {
      steps.forEach(step => this.register(step));
    }
  }

  /**
   * Registers a new processor
   *
   * @param processor
   * @param priority
   */
  register(processor: PipelineProcessor<T, P>, priority: number = null): void {
    if (processor.type === null) {
      throw Error('Processor type is not defined');
    }

    // binding the propsUpdated callback to the Pipeline
    processor.propsUpdated(this.processorPropsUpdated.bind(this));

    this.addTaskByPriority(processor, priority);
    this.afterRegistered();
  }

  private addTaskByPriority(
    processor: PipelineProcessor<T, P>,
    priority: number,
  ): void {
    let subSteps = this._steps.get(processor.type);

    if (!subSteps) {
      const newSubStep = [];
      this._steps.set(processor.type, newSubStep);
      subSteps = newSubStep;
    }

    if (priority === null || priority < 0) {
      subSteps.push(processor);
    } else {
      if (!subSteps[priority]) {
        // slot is empty
        subSteps[priority] = processor;
      } else {
        // slot is NOT empty
        const first = subSteps.slice(0, priority - 1);
        const second = subSteps.slice(priority + 1);

        this._steps.set(processor.type, first.concat(processor).concat(second));
      }
    }
  }

  /**
   * Flattens the _steps Map and returns a list of steps with their correct priorities
   */
  get steps(): PipelineProcessor<T, P>[] {
    let steps: PipelineProcessor<T, P>[] = [];

    for (const type of this.getSortedProcessorTypes()) {
      const subSteps = this._steps.get(type);

      if (subSteps && subSteps.length) {
        steps = steps.concat(subSteps);
      }
    }

    // to remove any undefined elements
    return steps.filter(s => s);
  }

  private getSortedProcessorTypes(): ProcessorType[] {
    return Object.keys(ProcessorType)
      .filter(key => !isNaN(Number(key)))
      .map(key => Number(key));
  }

  async process(data?: T): Promise<T> {
    let prev = data;
    for (const step of this.steps) {
      prev = await step.processWrapper(prev);
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

  private afterRegistered(): void {
    this.trigger(this.afterRegisterCallback);
    this.trigger(this.updatedCallback);
  }

  propsUpdated(fn: (...args) => void): this {
    this.propsUpdatedCallback.add(fn);
    return this;
  }

  afterRegister(fn: (...args) => void): this {
    this.afterRegisterCallback.add(fn);
    return this;
  }

  updated(fn: (...args) => void): this {
    this.updatedCallback.add(fn);
    return this;
  }
}

export default Pipeline;
