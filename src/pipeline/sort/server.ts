import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { ServerStorageOptions } from '../../storage/server';
import { TColumnSort } from '../../types';

interface ServerSortProps extends PipelineProcessorProps {
  columns: TColumnSort[];
  url?: (prevUrl: string, columns: TColumnSort[]) => string;
  body?: (prevBody: BodyInit, columns: TColumnSort[]) => BodyInit;
}

class ServerSort extends PipelineProcessor<
  ServerStorageOptions,
  ServerSortProps
> {
  get type(): ProcessorType {
    return ProcessorType.ServerSort;
  }

  _process(options?: ServerStorageOptions): ServerStorageOptions {
    const updates = {};

    if (this.props.url) {
      updates['url'] = this.props.url(options.url, this.props.columns);
    }

    if (this.props.body) {
      updates['body'] = this.props.body(options.body, this.props.columns);
    }

    return {
      ...options,
      ...updates,
    };
  }
}

export default ServerSort;
