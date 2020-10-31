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
    return Object.entries(this.props.serverStorageOptions)
      .filter(([_, val]) => typeof val !== 'function')
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k]: v }),
        {},
      ) as ServerStorageOptions;
  }
}

export default ServerInitiator;
