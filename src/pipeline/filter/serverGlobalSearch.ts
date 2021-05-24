import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { ServerStorageOptions } from '../../storage/server';

interface ServerGlobalSearchFilterProps extends PipelineProcessorProps {
  keyword?: string;
  url?: (prevUrl: string, keyword: string) => string;
  body?: (prevBody: BodyInit, keyword: string) => BodyInit;
}

class ServerGlobalSearchFilter extends PipelineProcessor<
  ServerStorageOptions,
  ServerGlobalSearchFilterProps
> {
  get type(): ProcessorType {
    return ProcessorType.ServerFilter;
  }

  _process(options?: ServerStorageOptions): ServerStorageOptions {
    if (!this.props.keyword) return options;

    const updates = {};

    if (this.props.url) {
      updates['url'] = this.props.url(options.url, this.props.keyword);
    }

    if (this.props.body) {
      updates['body'] = this.props.body(options.body, this.props.keyword);
    }

    return {
      ...options,
      ...updates,
    };
  }
}

export default ServerGlobalSearchFilter;
