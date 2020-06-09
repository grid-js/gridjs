import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { ServerStorageOptions } from '../../storage/server';

interface ServerGlobalSearchFilterProps extends PipelineProcessorProps {
  keyword?: string;
  url?: (keyword: string, prevUrl: string) => string;
  body?: (keyword: string, prevBody: BodyInit) => BodyInit;
}

class ServerGlobalSearchFilter extends PipelineProcessor<
  ServerStorageOptions,
  ServerGlobalSearchFilterProps
> {
  get type(): ProcessorType {
    return ProcessorType.Server;
  }

  _process(options?: ServerStorageOptions): ServerStorageOptions {
    if (!this.props.keyword) return options;

    options = options || {};

    const updates = {};

    if (this.props.url) {
      updates['url'] = this.props.url(this.props.keyword, options.url);
    }

    if (this.props.body) {
      updates['body'] = this.props.body(this.props.keyword, options.body);
    }

    return {
      ...options,
      ...updates,
    };
  }
}

export default ServerGlobalSearchFilter;
