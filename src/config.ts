import { OneDArray, TCell } from './types';
import Storage from './storage/storage';
import ConfigError from "./error/config";

interface Config {
  data?: TCell[][];
  header?: OneDArray;
  storage?: Storage;
  limit?: number;
  classNamePrefix: string;
}

class Config {
  public static _current: Config;

  constructor(config?: object) {
    const updatedConfig = {
      ...Config.defaultConfig(),
      ...config
    };

    Object.assign(this, updatedConfig);
  }

  setCurrent(): void {
    Config._current = this;
  }

  static get current(): Config {
    if (!Config._current) {
      throw new ConfigError('Current config is not set');
    }

    return Config._current;
  }

  static defaultConfig(): Config {
    return {
      classNamePrefix: 'gridjs',
      limit: 15
    } as Config;
  }
}

export default Config;
