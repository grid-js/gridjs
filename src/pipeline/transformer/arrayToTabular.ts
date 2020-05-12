import { PipelineProcessor, ProcessorType } from '../processor';
import Tabular from '../../tabular';
import { TCell } from '../../types';

class ArrayToTabularTransformer extends PipelineProcessor<Tabular<TCell>, {}> {
  get type(): ProcessorType {
    return ProcessorType.Transformer;
  }

  _process(data: any[][]): Tabular<TCell> {
    return Tabular.fromArray(data);
  }
}

export default ArrayToTabularTransformer;
