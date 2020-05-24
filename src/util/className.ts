export default function(...args: string[]): string {
  const prefix = 'gridjs';

  return `${prefix} ${prefix}${args.reduce(
    (prev: string, cur: string) => `${prev}-${cur}`,
    '',
  )}`;
}
