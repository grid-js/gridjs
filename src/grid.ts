import Config from "./config";
import MemoryStorage from "./storage/memory";

class Grid {
  private config: Config;

  constructor() {
    this.config = new Config();

    this.bootstrap();
  }

  private bootstrap(): void {
    this.setDefaultConfig();
  }

  private setDefaultConfig(): void {
    this.config.set("storage", MemoryStorage);
  }
}

export default Grid;
