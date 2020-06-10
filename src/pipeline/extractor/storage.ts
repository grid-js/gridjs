import Storage, { StorageResponse } from '../../storage/storage';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';

interface StorageExtractorProps extends PipelineProcessorProps {
  storage: Storage<any>;
}

class StorageExtractor extends PipelineProcessor<
  Promise<StorageResponse>,
  StorageExtractorProps
> {
  get type(): ProcessorType {
    return ProcessorType.Extractor;
  }

  async _process(opts: any): Promise<StorageResponse> {
    return await this.props.storage.get(opts);
  }
}

export default StorageExtractor;
