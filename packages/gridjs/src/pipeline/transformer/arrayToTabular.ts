import { PipelineProcessor, ProcessorType } from '../processor';
import Tabular from '../../tabular';
import { ArrayResponse } from './storageResponseToArray';

class ArrayToTabularTransformer extends PipelineProcessor<Tabular, {}> {
  get type(): ProcessorType {
    return ProcessorType.Transformer;
  }

  _process(arrayResponse: ArrayResponse): Tabular {
    const tabular = Tabular.fromArray(arrayResponse.data);

    // for server-side storage
    tabular.length = arrayResponse.total;

    return tabular;
  }
}

export default ArrayToTabularTransformer;
