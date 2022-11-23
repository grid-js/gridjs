import { JSXInternal } from 'preact/src/jsx';

export function className(...args: string[]): string {
  const prefix = 'gridjs';

  return `${prefix}${args.reduce(
    (prev: string, cur: string) => `${prev}-${cur}`,
    '',
  )}`;
}

export function classJoin(
  ...classNames: (string | JSXInternal.SignalLike<string>)[]
): string {
  return (
    classNames
      .filter((x) => x)
      .map((x) => x.toString())
      .reduce((className, prev) => `${className || ''} ${prev}`, '')
      .trim() || null
  );
}
