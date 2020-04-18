import Storage from '../../storage/storage';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';

interface StorageExtractorProps extends PipelineProcessorProps {
  storage: Storage;
}

class StorageExtractor extends PipelineProcessor<
  Promise<any[][]>,
  StorageExtractorProps
> {
  get type(): ProcessorType {
    return ProcessorType.Extractor;
  }

  async process(): Promise<any[][]> {
    return await this.props.storage.get();
  }
}

export default StorageExtractor;
