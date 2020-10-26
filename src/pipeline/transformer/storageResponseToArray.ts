import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { StorageResponse } from '../../storage/storage';
import { TCell, TData, TDataArray, TDataObject, TwoDArray } from '../../types';
import Header from '../../header';
import logger from '../../util/log';

export interface ArrayResponse {
  data: TwoDArray<TCell>;
  total: number;
}

interface StorageResponseToArrayTransformerProps
  extends PipelineProcessorProps {
  header: Header;
}

class StorageResponseToArrayTransformer extends PipelineProcessor<
  ArrayResponse,
  StorageResponseToArrayTransformerProps
> {
  get type(): ProcessorType {
    return ProcessorType.Transformer;
  }

  private castData(data: TData): TwoDArray<TCell> {
    if (!data || !data.length) {
      return [];
    }

    if (!this.props.header || !this.props.header.columns) {
      return data as TwoDArray<TCell>;
    }

    const columns = Header.leafColumns(this.props.header.columns);

    // if it's a 2d array already
    if (data[0] instanceof Array) {
      return (data as TDataArray).map((row) => {
        let pad = 0;

        return columns.map((column, i) => {
          // default `data` is provided for this column
          if (column.data !== undefined) {
            pad++;

            if (typeof column.data === 'function') {
              return column.data(row);
            } else {
              return column.data;
            }
          }

          return row[i - pad];
        });
      });
    }

    // if it's an array of objects (but not array of arrays, i.e JSON payload)
    if (typeof data[0] === 'object' && !(data[0] instanceof Array)) {
      return (data as TDataObject).map((row) =>
        columns.map((column, i) => {
          if (column.data !== undefined) {
            if (typeof column.data === 'function') {
              return column.data(row);
            } else {
              return column.data;
            }
          } else if (column.id) {
            return row[column.id];
          } else {
            logger.error(`Could not find the correct cell for column at position ${i}.
                          Make sure either 'id' or 'selector' is defined for all columns.`);
            return null;
          }
        }),
      );
    }

    return [];
  }

  _process(storageResponse: StorageResponse): ArrayResponse {
    return {
      data: this.castData(storageResponse.data),
      total: storageResponse.total,
    };
  }
}

export default StorageResponseToArrayTransformer;
