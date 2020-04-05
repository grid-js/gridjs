import { TCell } from './types';
import Storage from './storage/storage';

interface Config {
  data?: TCell[][];
  storage?: Storage;
  limit?: number;
}

class Config {
  constructor(config?: Config) {
    Object.assign(this, config);
  }
}

export default Config;
