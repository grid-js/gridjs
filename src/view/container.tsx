import { h } from 'preact';

import Tabular from '../tabular';
import { BaseComponent, BaseProps } from './base';
import className from '../util/className';
import { Status, TCell } from '../types';
import { Table } from './table/table';
import { HeaderContainer } from './headerContainer';
import { FooterContainer } from './footerContainer';
import Pipeline from '../pipeline/pipeline';
import Header from '../header';

interface ContainerProps extends BaseProps {
  pipeline: Pipeline<Tabular<TCell>>;
  header?: Header;
  width?: string;
}

interface ContainerState {
  status: Status;
  data?: Tabular<TCell>;
}

export class Container extends BaseComponent<ContainerProps, ContainerState> {
  constructor(props) {
    super(props);

    this.state = {
      status: Status.Loading,
      data: null,
    };
  }

  private setData(data: Tabular<TCell>): void {
    this.setState({
      data: data,
      status: Status.Loaded,
    });
  }

  async componentDidMount() {
    this.setData(await this.props.pipeline.process());

    this.props.pipeline.updated(async () => {
      this.setState({
        status: Status.Loading,
      });

      this.setData(await this.props.pipeline.process());
    });
  }

  render() {
    return (
      <div
        className={className('container')}
        style={{ width: this.props.width }}
      >
        <HeaderContainer />

        <div
          className={className('wrapper')}
          style={{ width: this.props.width }}
        >
          <Table
            data={this.state.data}
            header={this.props.header}
            width={this.props.width}
          />

          <FooterContainer />
        </div>
      </div>
    );
  }
}
