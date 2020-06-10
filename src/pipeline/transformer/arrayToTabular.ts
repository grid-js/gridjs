import { PipelineProcessor, ProcessorType } from '../processor';
import Tabular from '../../tabular';
import { TCell } from '../../types';
import { StorageResponse } from '../../storage/storage';

class ArrayToTabularTransformer extends PipelineProcessor<Tabular<TCell>, {}> {
  get type(): ProcessorType {
    return ProcessorType.Transformer;
  }

  _process(storageResponse: StorageResponse): Tabular<TCell> {
    return Tabular.fromStorageResponse(storageResponse);
  }
}

export default ArrayToTabularTransformer;
