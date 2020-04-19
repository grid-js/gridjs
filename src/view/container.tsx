import { h } from 'preact';

import Tabular from '../tabular';
import Config from '../config';
import { BaseComponent, BaseProps } from './base';
import className from '../util/className';
import { Status, TBodyCell } from '../types';
import Header from '../header';
import { Table } from './table';
import { Head } from './head';

import '../theme/mermaid/container.scss';
import '../theme/mermaid/wrapper.scss';

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

  constructor(props) {
    super(props);

    this.state = {
      status: Status.Init,
      data: null,
      header: this.props.config.header,
    };

    this.config = this.props.config;
  }

  componentWillMount(): void {
    this.setState({
      status: Status.Loading,
    });
  }

  async componentDidMount() {
    this.setState({
      data: await this.config.pipeline.process(),
      status: Status.Loaded,
    });

    this.config.pipeline.updated(async () => {
      this.setState({
        data: await this.config.pipeline.process(),
      });
    });
  }

  render() {
    return (
      <div className={className(Config.current.classNamePrefix, 'container')}>
        <Head />

        <div className={className(Config.current.classNamePrefix, 'wrapper')}>
          <Table
            data={this.state.data}
            header={this.state.header}
            classNamePrefix={this.config.classNamePrefix}
          />
        </div>
      </div>
    );
  }
}
