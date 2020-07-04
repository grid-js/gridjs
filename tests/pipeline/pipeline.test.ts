import Pipeline from '../../src/pipeline/pipeline';
import { PipelineProcessor, ProcessorType } from '../../src/pipeline/processor';

class NoopProcessor extends PipelineProcessor<string, {}> {
  get type(): ProcessorType {
    return null;
  }
  _process(data: string): string {
    return data;
  }
}

class StringProcessor extends PipelineProcessor<string, {}> {
  type: ProcessorType = ProcessorType.Transformer;
  _process(data: string): string {
    return data;
  }
}

class SubStrProcessor extends PipelineProcessor<string, {}> {
  type: ProcessorType = ProcessorType.Transformer;
  _process(data: string): string {
    return data.substr(1);
  }
}

class NumberProcessor extends PipelineProcessor<number, { acc: number }> {
  type: ProcessorType = ProcessorType.Transformer;
  _process(data: number): number {
    return data + (this.props.acc || 2);
  }
}

describe('Pipeline', () => {
  it('should init with value', () => {
    const pipeline = new Pipeline();
    expect(pipeline.steps).toHaveLength(0);
  });

  it('should not register a processor without type', () => {
    const pipeline = new Pipeline();

    expect(() => {
      pipeline.register(new NoopProcessor());
    }).toThrow(Error);

    expect(pipeline.steps).toHaveLength(0);
  });

  it('should register and process a processor', async () => {
    const pipeline = new Pipeline();
    pipeline.register(new StringProcessor());

    expect(pipeline.steps).toHaveLength(1);
    expect(await pipeline.process('Hello!')).toBe('Hello!');
  });

  it('should should call afterRegister', async () => {
    const callback = jest.fn();
    const pipeline = new Pipeline();
    pipeline.on('afterRegister', callback);
    pipeline.register(new StringProcessor());
    expect(callback).toBeCalledTimes(1);
  });

  it('should unregister a processor', async () => {
    const pipeline = new Pipeline();
    const proc = new StringProcessor();
    pipeline.register(proc);
    expect(pipeline.steps).toHaveLength(1);
    pipeline.unregister(null);
    expect(pipeline.steps).toHaveLength(1);
    pipeline.unregister(new NoopProcessor());
    expect(pipeline.steps).toHaveLength(1);
    pipeline.unregister(proc);
    expect(pipeline.steps).toHaveLength(0);
  });

  it('should register and process processors', async () => {
    const pipeline = new Pipeline();
    pipeline.register(new SubStrProcessor());
    pipeline.register(new SubStrProcessor());

    expect(pipeline.steps).toHaveLength(2);
    expect(await pipeline.process('Hello World')).toBe('llo World');
  });

  it('should register and process number processors', async () => {
    const pipeline = new Pipeline();
    pipeline.register(new NumberProcessor());
    pipeline.register(new NumberProcessor());

    expect(pipeline.steps).toHaveLength(2);
    expect(await pipeline.process(4)).toBe(8);
  });

  it('should register processors using the constructor', async () => {
    const pipeline = new Pipeline([
      new NumberProcessor(),
      new NumberProcessor(),
    ]);

    expect(pipeline.steps).toHaveLength(2);
    expect(await pipeline.process(4)).toBe(8);
  });

  it('should trigger callbacks when props are updated', async () => {
    const p1 = new NumberProcessor({ acc: 2 });
    const p2 = new NumberProcessor({ acc: 3 });
    const pipeline = new Pipeline([p1, p2]);

    expect(await pipeline.process(4)).toBe(9);

    const updatedCallback = jest.fn();
    const propsUpdatedCallback = jest.fn();

    pipeline.on('updated', updatedCallback);
    pipeline.on('propsUpdated', propsUpdatedCallback);

    p1.setProps({ acc: 5 });

    expect(updatedCallback).toBeCalledTimes(1);
    expect(propsUpdatedCallback).toBeCalledTimes(1);
    expect(await pipeline.process(4)).toBe(12);
  });

  it('should register processor with correct priority', async () => {
    const p1 = new NumberProcessor({ acc: 2 });
    const p2 = new NumberProcessor({ acc: 3 });
    const p3 = new NumberProcessor({ acc: 4 });

    const pipeline = new Pipeline();
    pipeline.register(p1, 2);
    pipeline.register(p2, 1);
    pipeline.register(p3);

    expect(pipeline.steps).toHaveLength(3);
    expect(pipeline.steps[0]).toBe(p2);
    expect(pipeline.steps[1]).toBe(p1);
    expect(pipeline.steps[2]).toBe(p3);
  });

  it('should cache the results', async () => {
    const p1 = new NumberProcessor({ acc: 2 });
    const p2 = new NumberProcessor({ acc: 3 });
    const p3 = new NumberProcessor({ acc: 4 });

    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();

    p1.on('afterProcess', callback1);
    p2.on('afterProcess', callback2);
    p3.on('afterProcess', callback3);

    const pipeline = new Pipeline();
    pipeline.register(p1);
    pipeline.register(p2);
    pipeline.register(p3);

    // first process() should cache the results
    // and should not process them again
    const d1 = await pipeline.process(1);
    const d2 = await pipeline.process(1);
    const d3 = await pipeline.process(1);

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
    expect(callback3).toBeCalledTimes(1);
    expect(d1).toBe(d2);
    expect(d2).toBe(d3);
  });

  it('should clear cache and reprocess', async () => {
    const p1 = new NumberProcessor({ acc: 2 });
    const p2 = new NumberProcessor({ acc: 3 });
    const p3 = new NumberProcessor({ acc: 4 });

    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();

    p1.on('afterProcess', callback1);
    p2.on('afterProcess', callback2);
    p3.on('afterProcess', callback3);

    const pipeline = new Pipeline();
    pipeline.register(p1);
    pipeline.register(p2);
    pipeline.register(p3);

    // first process() should cache the results
    // and should not process them again
    await pipeline.process(1);
    pipeline.clearCache();
    await pipeline.process(1);
    pipeline.clearCache();
    await pipeline.process(1);

    expect(callback1).toBeCalledTimes(3);
    expect(callback2).toBeCalledTimes(3);
    expect(callback3).toBeCalledTimes(3);
  });

  it('should process the newly added processor', async () => {
    const p1 = new NumberProcessor({ acc: 2 });
    const p2 = new NumberProcessor({ acc: 3 });
    const p3 = new NumberProcessor({ acc: 4 });

    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();

    p1.on('afterProcess', callback1);
    p2.on('afterProcess', callback2);
    p3.on('afterProcess', callback3);

    const pipeline = new Pipeline();
    pipeline.register(p1);
    pipeline.register(p2);

    // first process() should cache the results
    // and should not process them again
    const d1 = await pipeline.process(2);
    const d2 = await pipeline.process(2);

    pipeline.register(p3);

    const d3 = await pipeline.process(2);

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
    expect(callback3).toBeCalledTimes(1);
    expect(d1).toBe(7);
    expect(d2).toBe(7);
    expect(d3).toBe(11);
  });
});
