import { JSXInternal } from 'preact/src/jsx';

export function className(...args: string[]): string {
  const prefix = 'gridjs';

  return `${prefix}${args.reduce(
    (prev: string, cur: string) => `${prev}-${cur}`,
    '',
  )}`;
}

export function classJoin(
  ...classNames: (undefined | string | JSXInternal.SignalLike<string>)[]
): string {
  return classNames
    .map((x) => (x ? x.toString() : ''))
    .filter((x) => x)
    .reduce((className, prev) => `${className || ''} ${prev}`, '')
    .trim();
}
