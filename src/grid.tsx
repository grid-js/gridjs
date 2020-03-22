import Config from "./config";
import React from "react";
import {Table} from "./view/table";
import Storage from "./storage/storage";
import Row from "./row";
import StorageUtils from "./storage/storageUtils";
import StorageError from "./error/storage";


interface GridProps<T> {
  limit?: number,
  data?: T[][]
}

interface GridState<T> {
  rows: Iterable<Row<T>>
}

class Grid<T> extends React.Component<GridProps<T>, GridState<T>> {
  private config: Config;
  private storage: Storage<T>;

  constructor(props) {
    super(props);

    this.bootstrap();
  }

  private async bootstrap(): Promise<boolean> {
    this.setDefaultState();
    this.setDefaultConfig();
    this.setStorage();
    await this.loadStorage();

    return true;
  }

  private setDefaultState(): void {
    this.state = {
      rows: []
    };
  }

  private setDefaultConfig(): void {
    this.config = new Config();
    this.config.set("data", this.props.data);
  }

  private getStorage(): Storage<T> {
    return this.storage;
  }

  private setStorage(): void {
    const storage = StorageUtils.createFromConfig<T>(this.config);

    if (!storage) {
      throw new StorageError("Could not determine the storage type");
    }

    this.config.set("storage", storage);
    this.storage = storage;
  }

  private async loadStorage() {
    await this.storage.load(this.config);
  }

  async componentDidMount() {
    this.setState({
      rows: await this.getStorage().get()
    });
  }

  render() {
    return <Table rows={this.state.rows} />;
  }
}

export default Grid;
