import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { ServerStorageOptions } from '../../storage/server';

interface ServerPaginationLimitProps extends PipelineProcessorProps {
  page: number;
  limit: number;
  url?: (prevUrl: string, page: number, limit: number) => string;
  body?: (prevBody: BodyInit, page: number, limit: number) => BodyInit;
}

class ServerPaginationLimit extends PipelineProcessor<
  ServerStorageOptions,
  ServerPaginationLimitProps
> {
  get type(): ProcessorType {
    return ProcessorType.ServerLimit;
  }

  _process(options?: ServerStorageOptions): ServerStorageOptions {
    const updates = {};

    if (this.props.url) {
      updates['url'] = this.props.url(
        options.url,
        this.props.page,
        this.props.limit,
      );
    }

    if (this.props.body) {
      updates['body'] = this.props.body(
        options.body,
        this.props.page,
        this.props.limit,
      );
    }

    return {
      ...options,
      ...updates,
    };
  }
}

export default ServerPaginationLimit;
