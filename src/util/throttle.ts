/**
 * Throttle a given function
 * @param fn Function to be called
 * @param wait Throttle timeout in milliseconds
 * @returns Throttled function
 */
export const throttle = (fn: (...args) => void, wait = 100) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  let lastTime = Date.now();

  const execute = (...args) => {
    lastTime = Date.now();
    fn(...args);
  };

  return (...args) => {
    const currentTime = Date.now();
    const elapsed = currentTime - lastTime;

    if (elapsed >= wait) {
      // If enough time has passed since the last call, execute the function immediately
      execute(...args);
    } else {
      // If not enough time has passed, schedule the function call after the remaining delay
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        execute(...args);
        timeoutId = null;
      }, wait - elapsed);
    }
  };
};
