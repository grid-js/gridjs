import { PipelineProcessor, ProcessorType } from '../processor';
import Tabular from '../../tabular';
import { TBodyCell } from '../../types';

class ArrayToTabularTransformer extends PipelineProcessor<
  Tabular<TBodyCell>,
  {}
> {
  get type(): ProcessorType {
    return ProcessorType.Transformer;
  }

  process(data: any[][]): Tabular<TBodyCell> {
    return Tabular.fromArray(data);
  }
}

export default ArrayToTabularTransformer;
