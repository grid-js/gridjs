import { Component, h, RefObject } from 'preact';
import { BaseComponent, BaseProps } from '../base';
import { className } from '../../util/className';

interface ShadowTableProps extends BaseProps {
  tableRef?: RefObject<Component>;
}

/**
 * ShadowTable renders a hidden table and is used to calculate the column's width
 * when autoWidth option is enabled
 */
export class ShadowTable extends BaseComponent<ShadowTableProps, {}> {
  render() {
    if (this.props.tableRef.current) {
      const tableRef = this.props.tableRef;
      const tableElement = tableRef.current.base.cloneNode(
        true,
      ) as HTMLTableElement;

      tableElement.className += ` ${className('shadowTable')}`;

      tableElement.style.position = 'absolute';
      tableElement.style.zIndex = '-2147483640';
      tableElement.style.visibility = 'hidden';
      tableElement.style.tableLayout = 'auto';
      tableElement.style.width = 'auto';
      tableElement.style.padding = '0';
      tableElement.style.margin = '0';
      tableElement.style.border = 'none';
      tableElement.style.outline = 'none';

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
}
