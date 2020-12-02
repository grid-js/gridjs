import { EventEmitter } from '../../src/util/eventEmitter';

describe('EventEmitter class', () => {
  interface EventGeneric {
    boo: (x: string | number) => void;
  }

  it('should emit events', () => {
    const emitter = new EventEmitter<EventGeneric>();

    emitter.on('boo', (n: number) => {
      expect(n).toBe(42);
    });

    emitter.emit('boo', 42);
  });

  it('emit and on should accept args', () => {
    interface Event {
      boo: (a: number, b: number, c: number, x: string, q: boolean) => void;
    }

    const emitter = new EventEmitter<Event>();
    const input = [1, 2, 5, 'boo', false];

    emitter.on('boo', (...args) => {
      // TODO: fix the datatype issue here
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(args).toStrictEqual(input);
    });

    const result = emitter.emit('boo', 1, 2, 5, 'boo', false);
    expect(result).toBe(true);
  });

  it('emit should return false', () => {
    const emitter = new EventEmitter<EventGeneric>();

    const result = emitter.emit('boo', '??');
    expect(result).toBe(false);
  });

  it('should call all listeners', () => {
    const emitter = new EventEmitter<EventGeneric>();

    const handler1 = jest.fn();
    const handler2 = jest.fn();

    emitter.on('boo', handler1);
    emitter.on('boo', handler2);
    emitter.emit('boo', 'foo');

    expect(handler1).toBeCalled();
    expect(handler2).toBeCalled();
  });

  it('off should remove listener', () => {
    const emitter = new EventEmitter<EventGeneric>();

    const handler1 = jest.fn();
    const handler2 = jest.fn();

    emitter.on('boo', handler1);
    emitter.on('boo', handler2);
    emitter.off('boo', handler2);
    emitter.emit('boo', 'foo');

    expect(handler1).toBeCalled();
    expect(handler2).not.toBeCalled();
  });

  it('off should not remove an incorrect handler', () => {
    const emitter = new EventEmitter<EventGeneric>();

    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const handler3 = jest.fn();

    emitter.on('boo', handler1);
    emitter.on('boo', handler2);
    emitter.off('boo', handler3);
    emitter.emit('boo', 'foo');

    expect(handler1).toBeCalled();
    expect(handler2).toBeCalled();
    expect(handler3).not.toBeCalled();
  });

  it('off should work with null', () => {
    const emitter = new EventEmitter<EventGeneric>();

    const handler1 = jest.fn();
    const handler2 = jest.fn();

    emitter.on('boo', handler1);
    emitter.on('boo', handler2);
    emitter.off('boo', null);
    emitter.emit('boo', 'foo');

    expect(handler1).toBeCalled();
    expect(handler2).toBeCalled();
  });

  it('should call handlers with correct args', () => {
    interface Event {
      boo: (a: number, b: number, x: string, q: boolean) => void;
    }

    const emitter = new EventEmitter<Event>();

    const args = [1, 2, 'boo', false];
    const handler1 = jest.fn();

    emitter.on('boo', handler1);
    emitter.emit('boo', 1, 2, 'boo', false);
    emitter.emit('boo', 1, 2, 'boo', false);
    emitter.emit('boo', 1, 2, 'boo', false);
    emitter.emit('boo', 1, 2, 'boo', false);

    expect(handler1).toBeCalledTimes(4);
    expect(handler1).toBeCalledWith(...args);
  });
});
