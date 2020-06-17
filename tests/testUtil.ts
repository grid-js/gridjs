export const flushPromises = () => {
  return new Promise((resolve) => setImmediate(resolve));
};
