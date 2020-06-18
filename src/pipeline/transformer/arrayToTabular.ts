import { PipelineProcessor, ProcessorType } from '../processor';
import Tabular from '../../tabular';
import { StorageResponse } from '../../storage/storage';

class ArrayToTabularTransformer extends PipelineProcessor<Tabular, {}> {
  get type(): ProcessorType {
    return ProcessorType.Transformer;
  }

  _process(storageResponse: StorageResponse): Tabular {
    return Tabular.fromStorageResponse(storageResponse);
  }
}

export default ArrayToTabularTransformer;
