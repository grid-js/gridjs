export function getWidth(
  width: string | number,
  containerWidth?: number,
): number {
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

/**
 * Tries to guess the column with based on the content of elements array
 *
 * @param elements
 */
export function calculateWidth(elements: string[]): number {
  // in pixels
  const unit = 10;

  let width = 0;

  for (const element of elements) {
    width = Math.max(
      width,
      (element.length * unit),
    );
  }

  return width;
}
