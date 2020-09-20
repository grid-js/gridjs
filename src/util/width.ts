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

/**
 * Accepts a ShadowTable and tries to find the clientWidth
 * that is already rendered on the web browser
 *
 * @param shadowTable
 * @param columnId
 */
export function getWidth(shadowTable: Element, columnId: string): number {
  if (!shadowTable) {
    return null;
  }

  const td = shadowTable.querySelector(
    `thead th[data-column-id="${columnId}"]`,
  );

  if (td) {
    return td.clientWidth;
  }

  return null;
}
