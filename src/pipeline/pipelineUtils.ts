import { Config } from '../config';
import Pipeline from './pipeline';
import Tabular from '../tabular';
import StorageExtractor from './extractor/storage';
import ArrayToTabularTransformer from './transformer/arrayToTabular';
import ServerStorage from '../storage/server';
import ServerInitiator from './initiator/server';
import StorageResponseToArrayTransformer from './transformer/storageResponseToArray';

class PipelineUtils {
  static createFromConfig(config: Config): Pipeline<Tabular> {
    const pipeline = new Pipeline<Tabular>();

    if (config.storage instanceof ServerStorage) {
      pipeline.register(
        new ServerInitiator({
          serverStorageOptions: config.server,
        }),
      );
    }

    pipeline.register(new StorageExtractor({ storage: config.storage }));
    pipeline.register(
      new StorageResponseToArrayTransformer({ header: config.header }),
    );
    pipeline.register(new ArrayToTabularTransformer());

    return pipeline;
  }
}

export default PipelineUtils;
