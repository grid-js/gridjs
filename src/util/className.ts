import Config from '../config';

export default function(...args: string[]): string {
  const classNamePrefix = Config.current.classNamePrefix;

  return `${classNamePrefix} ${classNamePrefix}${args.reduce(
    (prev: string, cur: string) => `${prev}-${cur}`,
    '',
  )}`;
}
