/**
 * Returns true if both objects are equal
 * @param a left object
 * @param b right object
 * @returns
 */
export function deepEqual<A, B>(a: A, b: B) {
  return JSON.stringify(a) === JSON.stringify(b);
}
