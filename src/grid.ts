import Config from "./config";
import React, {ReactElement} from "react";
import ReactDOM from "react-dom";
import {Table} from "./view/table";
import StorageUtils from "./storage/storageUtils";
import StorageError from "./error/storage";


class Grid {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
    this.bootstrap();
  }

  bootstrap(): void {
    this.setStorage();
  }

  private setStorage(): void {
    const storage = StorageUtils.createFromConfig(this.config);

    if (!storage) {
      throw new StorageError("Could not determine the storage type");
    }

    this.config.storage = storage;
  }

  createElement(): ReactElement {
    return React.createElement(Table, {
      config: this.config
    });
  }

  render(container: Element) {
    ReactDOM.render(this.createElement(), container)
  }
}

export default Grid;
