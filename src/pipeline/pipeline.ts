import { PipelineProcessor, ProcessorType } from './processor';
import { ID } from '../util/id';
import log from '../util/log';
import { EventEmitter } from '../util/eventEmitter';

interface PipelineEvents<T> {
  /**
   * Generic updated event. Triggers the callback function when the pipeline
   * is updated, including when a new processor is registered, a processor's props
   * get updated, etc.
   */
  updated: (processor: PipelineProcessor<any, any>) => void;
  /**
   * Triggers the callback function when a new
   * processor is registered successfully
   */
  afterRegister: () => void;
  /**
   * Triggers the callback when a registered
   * processor's property is updated
   */
  propsUpdated: () => void;
  /**
   * Triggers the callback function when the pipeline
   * is fully processed, before returning the results
   *
   * afterProcess will not be called if there is an
   * error in the pipeline (i.e a step throw an Error)
   */
  afterProcess: (prev: T) => void;
  /**
   * Triggers the callback function when the pipeline
   * fails to process all steps or at least one step
   * throws an Error
   */
  error: (prev: T) => void;
}

class Pipeline<T, P = {}> extends EventEmitter<PipelineEvents<T>> {
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

  constructor(steps?: PipelineProcessor<any, any>[]) {
    super();

    if (steps) {
      steps.forEach((step) => this.register(step));
    }
  }

  /**
   * Clears the `cache` array
   */
  clearCache(): void {
    this.cache = new Map<string, any>();
    this.lastProcessorIndexUpdated = -1;
  }

  /**
   * Registers a new processor
   *
   * @param processor
   * @param priority
   */
  register(
    processor: PipelineProcessor<any, any>,
    priority: number = null,
  ): void {
    if (processor.type === null) {
      throw Error('Processor type is not defined');
    }

    // binding the propsUpdated callback to the Pipeline
    processor.on('propsUpdated', this.processorPropsUpdated.bind(this));

    this.addProcessorByPriority(processor, priority);
    this.afterRegistered(processor);
  }

  /**
   * Removes a processor from the list
   *
   * @param processor
   */
  unregister(processor: PipelineProcessor<any, any>): void {
    if (!processor) return;

    const subSteps = this._steps.get(processor.type);

    if (subSteps && subSteps.length) {
      this._steps.set(
        processor.type,
        subSteps.filter((proc) => proc != processor),
      );
      this.emit('updated', processor);
    }
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
    return steps.filter((s) => s);
  }

  /**
   * Accepts ProcessType and returns an array of the registered processes
   * with the give type
   *
   * @param type
   */
  getStepsByType(type: ProcessorType): PipelineProcessor<T, P>[] {
    return this.steps.filter((process) => process.type === type);
  }

  /**
   * Returns a list of ProcessorType according to their priority
   */
  private getSortedProcessorTypes(): ProcessorType[] {
    return Object.keys(ProcessorType)
      .filter((key) => !isNaN(Number(key)))
      .map((key) => Number(key));
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

    try {
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
    } catch (e) {
      log.error(e);
      // trigger the onError callback
      this.emit('error', prev);

      // rethrow
      throw e;
    }

    // means the pipeline is up to date
    this.lastProcessorIndexUpdated = steps.length;

    // triggers the afterProcess callbacks with the results
    this.emit('afterProcess', prev);

    return prev;
  }

  /**
   * Returns the registered processor's index in _steps array
   *
   * @param processorID
   */
  private findProcessorIndexByID(processorID: ID): number {
    return this.steps.findIndex((p) => p.id == processorID);
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

  private processorPropsUpdated(processor): void {
    this.setLastProcessorIndex(processor);
    this.emit('propsUpdated');
    this.emit('updated', processor);
  }

  private afterRegistered(processor): void {
    this.setLastProcessorIndex(processor);
    this.emit('afterRegister');
    this.emit('updated', processor);
  }
}

export default Pipeline;
