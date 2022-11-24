import { Component, RefObject } from 'preact';
import { className } from '../../util/className';
import { useEffect } from 'preact/hooks';

/**
 * ShadowTable renders a hidden table and is used to calculate the column's width
 * when autoWidth option is enabled
 */
export function ShadowTable(props: { tableRef?: RefObject<HTMLTableElement> }) {
  let tableElement: HTMLTableElement;
  let tableClassName: string;
  let tableStyle: string;

  useEffect(() => {
    const tableRef = props.tableRef;
    tableElement = tableRef.current.cloneNode(true) as HTMLTableElement;

    tableElement.style.position = 'absolute';
    tableElement.style.width = '100%';
    tableElement.style.zIndex = '-2147483640';
    tableElement.style.visibility = 'hidden';

    tableClassName = tableElement.className;
    tableStyle = tableElement.style.cssText;
  }, []);

  const widths = (): {
    [columnId: string]: { minWidth: number; width: number };
  } => {
    tableElement.className = `${tableClassName} ${className('shadowTable')}`;

    tableElement.style.tableLayout = 'auto';
    tableElement.style.width = 'auto';
    tableElement.style.padding = '0';
    tableElement.style.margin = '0';
    tableElement.style.border = 'none';
    tableElement.style.outline = 'none';

    let obj = Array.from(
      // TODO: should this be this.base?
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
      // TODO: should this be this.base?
      tableElement.parentNode.querySelectorAll<HTMLElement>('thead th'),
    ).reduce((prev, current) => {
      prev[current.getAttribute('data-column-id')]['width'] =
        current.clientWidth;

      return prev;
    }, obj);

    return obj;
  };

  if (props.tableRef.current) {
    return (
      <div
        ref={(nodeElement) => {
          nodeElement && nodeElement.appendChild(tableElement);
        }}
      />
    );
  }

  return null;
}
