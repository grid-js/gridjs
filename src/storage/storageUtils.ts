import Config from '../config';
import MemoryStorage from './memory';
import Storage from './storage';

class StorageUtils {
  /**
   * Accepts the config dict and tries to guess and return a Storage type
   *
   * @param config
   */
  public static createFromConfig(config: Config): Storage | null {
    // `data` array is provided
    if (config.data) {
      return new MemoryStorage(config);
    }

    return null;
  }
}

export default StorageUtils;
