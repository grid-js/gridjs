/**
 * Returns true if both objects are equal
 * @param a left object
 * @param b right object
 * @returns
 */
export function deepEqual<A, B>(obj1: A, obj2: B) {
  // If objects are not the same type, return false
  if (typeof obj1 !== typeof obj2) {
    return false;
  }
  // If objects are both null or undefined, return true
  if (obj1 === null && obj2 === null) {
    return true;
  }
  // If objects are both primitive types, compare them directly
  if (typeof obj1 !== 'object') {
    // eslint-disable-next-line
    // @ts-ignore
    return obj1 === obj2;
  }
  // If objects are arrays, compare their elements recursively
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }
  // If objects are VNodes, compare their props only
  if (
    // eslint-disable-next-line no-prototype-builtins
    obj1.hasOwnProperty('constructor') &&
    // eslint-disable-next-line no-prototype-builtins
    obj2.hasOwnProperty('constructor') &&
    // eslint-disable-next-line no-prototype-builtins
    obj1.hasOwnProperty('props') &&
    // eslint-disable-next-line no-prototype-builtins
    obj2.hasOwnProperty('props') &&
    // eslint-disable-next-line no-prototype-builtins
    obj1.hasOwnProperty('key') &&
    // eslint-disable-next-line no-prototype-builtins
    obj2.hasOwnProperty('key') &&
    // eslint-disable-next-line no-prototype-builtins
    obj1.hasOwnProperty('ref') &&
    // eslint-disable-next-line no-prototype-builtins
    obj2.hasOwnProperty('ref') &&
    // eslint-disable-next-line no-prototype-builtins
    obj1.hasOwnProperty('type') &&
    // eslint-disable-next-line no-prototype-builtins
    obj2.hasOwnProperty('type')
  ) {
    return deepEqual(obj1['props'], obj2['props']);
  }
  // If objects are both objects, compare their properties recursively
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    // eslint-disable-next-line no-prototype-builtins
    if (!obj2.hasOwnProperty(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}
