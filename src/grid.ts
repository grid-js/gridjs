import ConfigManager from "./config/configManager";
import MemoryStorage from "./storage/memoryStorage";

class Grid {
  private config: ConfigManager;

  constructor() {
    this.config = new ConfigManager();

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
