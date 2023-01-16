import { h } from 'preact';
import { className } from '../../util/className';

/**
 * ShadowTable renders a hidden table and is used to calculate the column's width
 * when autoWidth option is enabled
 */
export function ShadowTable(props: { tableRef: HTMLTableElement }) {
  const shadowTable = props.tableRef.cloneNode(true) as HTMLTableElement;

  shadowTable.style.position = 'absolute';
  shadowTable.style.width = '100%';
  shadowTable.style.zIndex = '-2147483640';
  shadowTable.style.visibility = 'hidden';

  return (
    <div
      ref={(nodeElement) => {
        nodeElement && nodeElement.appendChild(shadowTable);
      }}
    />
  );
}

export function getShadowTableWidths(tempRef: HTMLDivElement): {
  [columnId: string]: { minWidth: number; width: number };
} {
  const tableElement: HTMLTableElement = tempRef.querySelector(
    'table',
  ) as HTMLTableElement;

  if (!tableElement) {
    return {};
  }

  const tableClassName = tableElement.className;
  const tableStyle = tableElement.style.cssText;
  tableElement.className = `${tableClassName} ${className('shadowTable')}`;

  tableElement.style.tableLayout = 'auto';
  tableElement.style.width = 'auto';
  tableElement.style.padding = '0';
  tableElement.style.margin = '0';
  tableElement.style.border = 'none';
  tableElement.style.outline = 'none';

  let obj = Array.from(
    tableElement.parentNode.querySelectorAll<HTMLElement>('thead th'),
  ).reduce((prev, current) => {
    current.style.width = `${current.clientWidth}px`;

    return {
      [current.getAttribute('data-column-id')]: {
        minWidth: current.clientWidth,
      },
      ...prev,
    };
  }, {});

  tableElement.className = tableClassName;
  tableElement.style.cssText = tableStyle;
  tableElement.style.tableLayout = 'auto';

  obj = Array.from(
    tableElement.parentNode.querySelectorAll<HTMLElement>('thead th'),
  ).reduce((prev, current) => {
    prev[current.getAttribute('data-column-id')]['width'] = current.clientWidth;

    return prev;
  }, obj);

  return obj;
}
