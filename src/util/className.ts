export function className(...args: string[]): string {
  const prefix = 'gridjs';

  return `${prefix}${args.reduce(
    (prev: string, cur: string) => `${prev}-${cur}`,
    '',
  )}`;
}

export function classJoin(...classNames: string[]): string {
  return (
    classNames
      .filter((x) => x)
      .reduce((className, prev) => `${className || ''} ${prev}`, '')
      .trim() || null
  );
}
