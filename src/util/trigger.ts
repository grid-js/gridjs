export function trigger(fns: Set<(...args) => void>, ...args): void {
  if (fns) {
    fns.forEach((fn) => fn(...args));
  }
}
