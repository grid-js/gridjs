import { PipelineProcessor, ProcessorType } from './processor';
import { ID } from '../util/id';

class Pipeline<T, P = {}> {
  // available steps for this pipeline
  private readonly _steps: Map<
    ProcessorType,
    PipelineProcessor<T, P>[]
  > = new Map<ProcessorType, PipelineProcessor<T, P>[]>();
  // used to cache the results of processors using their id field
  private cache: Map<string, any> = new Map<string, any>();
  // keeps the index of the last updated processor in the registered
  // processors list and will be used to invalidate the cache
  // -1 means all new processors should be processed
  private lastProcessorIndexUpdated = -1;
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

    this.addProcessorByPriority(processor, priority);
    this.afterRegistered(processor);
  }

  /**
   * Registers a new processor
   *
   * @param processor
   * @param priority
   */
  private addProcessorByPriority(
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

  /**
   * Returns a list of ProcessorType according to their priority
   */
  private getSortedProcessorTypes(): ProcessorType[] {
    return Object.keys(ProcessorType)
      .filter(key => !isNaN(Number(key)))
      .map(key => Number(key));
  }

  /**
   * Runs all registered processors based on their correct priority
   * and returns the final output after running all steps
   *
   * @param data
   */
  async process(data?: T): Promise<T> {
    const lastProcessorIndexUpdated = this.lastProcessorIndexUpdated;
    const steps = this.steps;

    let prev = data;
    for (const processor of steps) {
      const processorIndex = this.findProcessorIndexByID(processor.id);

      if (processorIndex >= lastProcessorIndexUpdated) {
        // we should execute process() here since the last
        // updated processor was before "processor".
        // This is to ensure that we always have correct and up to date
        // data from processors and also to skip them when necessary
        prev = await processor.process(prev);
        this.cache.set(processor.id, prev);
      } else {
        // cached results already exist
        prev = this.cache.get(processor.id);
      }
    }

    // means the pipeline is up to date
    this.lastProcessorIndexUpdated = steps.length;

    return prev;
  }

  /**
   * Returns the registered processor's index in _steps array
   *
   * @param processorID
   */
  private findProcessorIndexByID(processorID: ID): number {
    return this.steps.findIndex(p => p.id == processorID);
  }

  /**
   * Sets the last updates processors index locally
   * This is used to invalid or skip a processor in
   * the process() method
   */
  private setLastProcessorIndex(processor: PipelineProcessor<T, P>): void {
    const processorIndex = this.findProcessorIndexByID(processor.id);

    if (this.lastProcessorIndexUpdated > processorIndex) {
      this.lastProcessorIndexUpdated = processorIndex;
    }
  }

  private trigger(fns: Set<(...args) => void>, ...args): void {
    if (fns) {
      fns.forEach(fn => fn(...args));
    }
  }

  private processorPropsUpdated(processor): void {
    this.setLastProcessorIndex(processor);
    this.trigger(this.propsUpdatedCallback);
    this.trigger(this.updatedCallback, processor);
  }

  private afterRegistered(processor): void {
    this.setLastProcessorIndex(processor);
    this.trigger(this.afterRegisterCallback);
    this.trigger(this.updatedCallback, processor);
  }

  /**
   * Triggers the callback when a registered
   * processor's property is updated
   *
   * @param fn
   */
  propsUpdated(fn: (...args) => void): this {
    this.propsUpdatedCallback.add(fn);
    return this;
  }

  /**
   * Triggers the callback function when a new
   * processor is registered successfully
   *
   * @param fn
   */
  afterRegister(fn: (...args) => void): this {
    this.afterRegisterCallback.add(fn);
    return this;
  }

  /**
   * Generic updated event. Triggers the callback function when the pipeline
   * is updated, including when a new processor is registered, a processor's props
   * get updated, etc.
   *
   * @param fn
   */
  updated(fn: (...args) => void): this {
    this.updatedCallback.add(fn);
    return this;
  }
}

export default Pipeline;
