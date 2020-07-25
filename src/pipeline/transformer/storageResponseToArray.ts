import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { StorageResponse } from '../../storage/storage';
import { TCell, TData, TDataArray, TDataObject, TwoDArray } from '../../types';
import Header from '../../header';

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

    // if it's a 2d array already
    if (data[0] instanceof Array) {
      return data as TDataArray;
    }

    // if it's an array of objects (but not array of arrays)
    if (typeof data[0] === 'object' && !(data[0] instanceof Array)) {
      return (data as TDataObject).map((row) =>
        this.props.header.columns.map((column) => {
          if (typeof column.id === 'function') {
            return column.id(row);
          } else {
            return row[column.id];
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
