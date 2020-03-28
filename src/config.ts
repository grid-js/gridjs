import {TCell} from "./types";
import Storage from "./storage/storage";


interface Config {
  data?: TCell[][],
  storage?: Storage,
  limit?: number
}

class Config {}

export default Config;
