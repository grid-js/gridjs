import Storage from '../../storage/storage';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';

interface StorageExtractorProps extends PipelineProcessorProps {
  storage: Storage<any, any[][]>;
}

class StorageExtractor extends PipelineProcessor<
  Promise<any[][]>,
  StorageExtractorProps
> {
  get type(): ProcessorType {
    return ProcessorType.Extractor;
  }

  async _process(opts: any): Promise<any[][]> {
    return await this.props.storage.get(opts);
  }
}

export default StorageExtractor;
