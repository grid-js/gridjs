import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { StorageResponse } from '../../storage/storage';
import { TCell, TwoDArray } from '../../types';
import Header from '../../header';
import log from '../../util/log';

export type ArrayResponse = {
  data: TwoDArray<TCell>;
  total: number;
};

interface StorageResponseToArrayTransformerProps extends PipelineProcessorProps {
  header: Header;
}

class StorageResponseToArrayTransformer extends PipelineProcessor<
  ArrayResponse,
  StorageResponseToArrayTransformerProps
> {
  get type(): ProcessorType {
    return ProcessorType.Transformer;
  }

  _process(storageResponse: StorageResponse): ArrayResponse {
    if (!storageResponse.data || !storageResponse.total) {
      return { data: [], total: 0 };
    }

    if (Array.isArray(storageResponse.data[0])) {
      return {
        data: storageResponse.data as TwoDArray<TCell>,
        total: storageResponse.total,
      };
    }

    const data: TwoDArray<TCell> = [];

    for (const row of storageResponse.data) {
      const parsed = [];

      for (const column of this.props.header.columns) {
        const cell = row[column.id];

        if (cell === undefined) {
          log.warn(
            `Could not find the cell data for column "${column.name}" (column ID: ${column.id})`,
          );
        }

        parsed.push(cell);
      }

      data.push(parsed);
    }

    return {
      data: data,
      total: storageResponse.total,
    };
  }
}

export default StorageResponseToArrayTransformer;
