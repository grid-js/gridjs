import { throttle } from '../../../src/util/throttle';

const sleep = (wait: number) => new Promise((r) => setTimeout(r, wait));

describe('throttle', () => {
  it('should throttle calls', async () => {
    const wait = 100;
    const fn = jest.fn();
    const throttled = throttle(fn, wait);

    throttled('a');
    sleep(wait - 5)
    throttled('b');
    sleep(wait - 10)
    throttled('c');

    await sleep(wait);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(['c']);
  });

  it('should execute the first call', async () => {
    const wait = 100;
    const fn = jest.fn();
    const throttled = throttle(fn, wait);

    throttled();

    await sleep(wait);

    expect(fn).toBeCalledTimes(1);
  });

  it('should call at trailing edge of the timeout', async () => {
    const wait = 100;
    const fn = jest.fn();
    const throttled = throttle(fn, wait);

    throttled();

    expect(fn).toBeCalledTimes(0);

    await sleep(wait);

    expect(fn).toBeCalledTimes(1);
  });

  it('should call after the timer', async () => {
    const wait = 100;
    const fn = jest.fn();
    const throttled = throttle(fn, wait);

    throttled();
    await sleep(wait);

    expect(fn).toBeCalledTimes(1);

    throttled();
    await sleep(wait);

    expect(fn).toBeCalledTimes(2);

    throttled();
    await sleep(wait);

    expect(fn).toBeCalledTimes(3);
  });
});
