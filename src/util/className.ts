export default function (classNamePrefix: string, ...args: string[]): string {
  return `${classNamePrefix} ${classNamePrefix}${args.reduce((prev: string, cur:string) => `${prev}-${cur}`, '')}`;
}
