import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { ServerStorageOptions } from '../../storage/server';

interface ServerInitiatorProps extends PipelineProcessorProps {
  serverStorageOptions: ServerStorageOptions;
}

class ServerInitiator extends PipelineProcessor<
  ServerStorageOptions,
  ServerInitiatorProps
> {
  get type(): ProcessorType {
    return ProcessorType.Initiator;
  }

  _process(): ServerStorageOptions {
    return {
      url: this.props.serverStorageOptions.url,
      method: this.props.serverStorageOptions.method,
    };
  }
}

export default ServerInitiator;
