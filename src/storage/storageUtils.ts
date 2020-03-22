import Config from "../config";
import MemoryStorage from "./memory";
import Storage from "./storage";

class StorageUtils {
  /**
   * Accepts the config dict and tries to guess and return a Storage type
   *
   * @param config
   */
  public static createFromConfig<T>(config: Config): Storage<T>|null {
    if (config.get('data')) {
      return new MemoryStorage<T>();
    }

    return null;
  }
}

export default StorageUtils;
