import Pipeline from '../../src/pipeline/pipeline';
import { PipelineProcessor, ProcessorType } from '../../src/pipeline/processor';

describe('Pipeline', () => {
  it('should init with value', () => {
    const pipeline = new Pipeline();
    expect(pipeline.steps).toHaveLength(0);
  });

  it('should not register a processor without type', () => {
    class NoopProcessor extends PipelineProcessor<string, {}> {
      get type(): ProcessorType {
        return null;
      }

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
    class StringProcessor extends PipelineProcessor<string, {}> {
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
    class StringProcessor extends PipelineProcessor<string, {}> {
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
    class NumberProcessor extends PipelineProcessor<number, {}> {
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

  it('should register processors using the constructor', () => {
    class NumberProcessor extends PipelineProcessor<number, {}> {
      type: ProcessorType = ProcessorType.Search;
      process(data: number): number {
        return data + 2;
      }
    }

    const pipeline = new Pipeline([
      new NumberProcessor(),
      new NumberProcessor(),
    ]);

    expect(pipeline.steps).toHaveLength(2);
    expect(pipeline.process(4)).toBe(8);
  });

  it('should trigger callbacks when props are updated', () => {
    class NumberProcessor extends PipelineProcessor<number, { acc: number }> {
      type: ProcessorType = ProcessorType.Search;
      process(data: number): number {
        return data + this.props.acc;
      }
    }

    const p1 = new NumberProcessor({ acc: 2 });
    const p2 = new NumberProcessor({ acc: 3 });
    const pipeline = new Pipeline([p1, p2]);

    expect(pipeline.process(4)).toBe(9);

    const updatedCallback = jest.fn();
    const propsUpdatedCallback = jest.fn();

    pipeline.updated(updatedCallback);
    pipeline.propsUpdated(propsUpdatedCallback);

    p1.setProps({ acc: 5 });

    expect(updatedCallback).toBeCalledTimes(1);
    expect(propsUpdatedCallback).toBeCalledTimes(1);
    expect(pipeline.process(4)).toBe(12);
  });
});
