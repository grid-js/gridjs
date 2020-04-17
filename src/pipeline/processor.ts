export enum ProcessorType {
  Search,
  Sort,
}

export interface PipelineProcessor<T> {
  type: ProcessorType;
  process(data: T, ...args): T;
}
