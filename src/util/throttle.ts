/**
 * Throttle a given function
 * @param fn Function to be called
 * @param wait Throttle timeout in milliseconds
 * @param leading whether or not to call "fn" immediately
 * @returns Throttled function
 */
export const throttle = (fn: (...args) => void, wait = 100, leading = true) => {
  let inThrottle: boolean;
  let lastFn: ReturnType<typeof setTimeout>;
  let lastTime: number;

  return (...args) => {
    if (!inThrottle) {
      if (leading) {
        fn(...args);
      }
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn(...args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};
