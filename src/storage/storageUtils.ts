import Config from '../config';
import MemoryStorage from './memory';
import Storage from './storage';
import StorageError from '../error/storage';

class StorageUtils {
  /**
   * Accepts the config dict and tries to guess and return a Storage type
   *
   * @param config
   */
  public static createFromConfig(config: Config): Storage | null {
    let storage = null;
    // `data` array is provided
    if (config.data) {
      storage = new MemoryStorage(config.data);
    }

    if (!storage) {
      throw new StorageError('Could not determine the storage type');
    }

    return storage;
  }
}

export default StorageUtils;
