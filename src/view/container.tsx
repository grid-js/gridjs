import { h } from 'preact';

import Tabular from '../tabular';
import Config from '../config';
import Storage from '../storage/storage';
import { BaseComponent, BaseProps } from './base';
import { Table } from './table';
import { Status, TBodyCell } from '../types';
import Header from '../header';
import className from '../util/className';

import '../theme/mermaid/container.scss';

interface ContainerProps extends BaseProps {
  config: Config;
}

interface ContainerState {
  status: Status;
  data?: Tabular<TBodyCell>;
  header?: Header;
}

export class Container extends BaseComponent<ContainerProps, ContainerState> {
  private readonly config: Config;
  private storage: Storage;

  constructor(props) {
    super(props);

    this.state = {
      status: Status.Init,
      data: null,
      header: this.props.config.header,
    };

    this.config = this.props.config;
    this.storage = this.config.storage;
  }

  componentWillMount(): void {
    this.setState({
      status: Status.Loading,
    });
  }

  async componentDidMount() {
    this.setState({
      data: Tabular.fromArray(await this.storage.get()),
      status: Status.Loaded,
    });
  }

  render() {
    return (
      <div className={className(Config.current.classNamePrefix, 'container')}>
        <Table
          data={this.state.data}
          header={this.state.header}
          classNamePrefix={this.config.classNamePrefix}
        />
      </div>
    );
  }
}
