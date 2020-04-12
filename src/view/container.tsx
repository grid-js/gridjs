import { h } from "preact";
import Tabular from "../tabular";
import Config from "../config";
import Storage from "../storage/storage";
import {BaseComponent} from "./base";
import {Table} from "./table";
import {Status} from "../types";
import Header from "../header";

interface ContainerProps {
  config: Config
}

interface ContainerState {
  status: Status,
  data?: Tabular,
  header?: Header
}

export class Container extends BaseComponent<ContainerProps, ContainerState> {
  private readonly config: Config;
  private storage: Storage;

  constructor(props) {
    super(props);

    this.state = {
      status: Status.Init,
      data: null,
      header: Header.fromArray(this.props.config.header)
    };

    this.config = this.props.config;
    this.storage = this.config.storage;
  }

  componentWillMount(): void {
    this.setState({
      status: Status.Loading
    });
  }

  async componentDidMount() {
    this.setState({
      data: Tabular.fromArray(await this.storage.get()),
      status: Status.Loaded
    })
  }

  render() {
    return (<div>
      <Table data={this.state.data} header={this.state.header} />
    </div>);
  }
}
