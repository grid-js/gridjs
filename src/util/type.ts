export function isOfType<T>(obj: any, prop: keyof T): boolean {
  return (obj as T)[prop] !== undefined;
}

export function isArrayOfType<T>(obj: any[], prop: keyof T): boolean {
  return obj && obj.length && isOfType(obj[0], prop);
}
