import Pipeline from '../../src/pipeline/pipeline';
import { PipelineProcessor, ProcessorType } from '../../src/pipeline/processor';

describe('Pipeline', () => {
  it('should init with value', () => {
    const pipeline = new Pipeline();
    expect(pipeline.steps).toHaveLength(0);
  });

  it('should not register a processor without type', () => {
    class NoopProcessor implements PipelineProcessor<string> {
      type: ProcessorType = null;
      process(data: string): string {
        return data;
      }
    }

    const pipeline = new Pipeline();

    expect(() => {
      pipeline.register(new NoopProcessor());
    }).toThrow(Error);

    expect(pipeline.steps).toHaveLength(0);
  });

  it('should register and process a processor', () => {
    class StringProcessor implements PipelineProcessor<string> {
      type: ProcessorType = ProcessorType.Search;
      process(data: string): string {
        return data;
      }
    }

    const pipeline = new Pipeline();
    pipeline.register(new StringProcessor());

    expect(pipeline.steps).toHaveLength(1);
    expect(pipeline.process('Hello!')).toBe('Hello!');
  });

  it('should register and process processors', () => {
    class StringProcessor implements PipelineProcessor<string> {
      type: ProcessorType = ProcessorType.Search;
      process(data: string): string {
        return data.substr(1);
      }
    }

    const pipeline = new Pipeline();
    pipeline.register(new StringProcessor());
    pipeline.register(new StringProcessor());

    expect(pipeline.steps).toHaveLength(2);
    expect(pipeline.process('Hello World')).toBe('llo World');
  });

  it('should register and process number processors', () => {
    class NumberProcessor implements PipelineProcessor<number> {
      type: ProcessorType = ProcessorType.Search;
      process(data: number): number {
        return data + 2;
      }
    }

    const pipeline = new Pipeline();
    pipeline.register(new NumberProcessor());
    pipeline.register(new NumberProcessor());

    expect(pipeline.steps).toHaveLength(2);
    expect(pipeline.process(4)).toBe(8);
  });
});
