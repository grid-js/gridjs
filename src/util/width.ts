export function width(width: string | number, containerWidth?: number): number {
  if (typeof width == 'string') {
    if (width.indexOf('%') > -1) {
      return (containerWidth / 100) * parseInt(width, 10);
    } else {
      return parseInt(width, 10);
    }
  }

  return width;
}

export function px(width: number): string {
  if (!width) return '';
  return `${Math.floor(width)}px`;
}
