import { h } from "preact";
import Tabular from "../tabular";
import Config from "../config";
import Storage from "../storage/storage";
import {BaseComponent} from "./base";
import {Table} from "./table";
import {Status} from "../types";

interface ContainerProps {
  config: Config
}

interface ContainerState {
  status: Status,
  tabular?: Tabular
}

export class Container extends BaseComponent<ContainerProps, ContainerState> {
  private readonly config: Config;
  private storage: Storage;

  constructor(props) {
    super(props);

    this.state = {
      status: Status.Init,
      tabular: null
    };

    this.config = this.props.config;
    this.storage = this.config.storage;
  }

  async componentDidMount() {
    this.setState({
      status: Status.Loading
    });

    this.setState({
      tabular: Tabular.fromArray(await this.storage.get()),
      status: Status.Loaded
    })
  }

  render() {
    return (<div>
      <Table tabular={this.state.tabular} />
    </div>);
  }
}
