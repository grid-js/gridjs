import { h, Fragment } from 'preact';

import Tabular from '../tabular';
import { BaseComponent, BaseProps } from './base';
import { classJoin, className } from '../util/className';
import { Status, TCell } from '../types';
import { Table } from './table/table';
import { HeaderContainer } from './headerContainer';
import { FooterContainer } from './footerContainer';
import Pipeline from '../pipeline/pipeline';
import Header from '../header';
import { Config } from '../config';
import log from '../util/log';

interface ContainerProps extends BaseProps {
  config: Config;
  pipeline: Pipeline<Tabular<TCell>>;
  header?: Header;
  width?: string;
}

interface ContainerState {
  status: Status;
  header?: Header;
  data?: Tabular<TCell>;
}

export class Container extends BaseComponent<ContainerProps, ContainerState> {
  constructor(props) {
    super(props);

    this.state = {
      status: Status.Loading,
      header: props.header,
      data: null,
    };
  }

  private async processPipeline() {
    this.setState({
      status: Status.Loading,
    });

    try {
      this.setState({
        data: await this.props.pipeline.process(),
        status: Status.Loaded,
      });
    } catch (e) {
      log.error(e);

      this.setState({
        status: Status.Error,
      });
    }
  }

  async componentDidMount() {
    const config = this.props.config;

    await this.processPipeline();

    if (config.header) {
      // now that we have the data, let's adjust columns width
      // note that we only calculate the columns width once
      this.setState({
        header: config.header.adjustWidth(
          config.container,
          this.state.data,
          config.autoWidth,
        ),
      });
    }

    this.props.pipeline.updated(async () => {
      await this.processPipeline();
    });
  }

  render() {
    return (
      <Fragment>
        <div
          className={classJoin(
            'gridjs',
            className('container'),
            this.state.status === Status.Loading ? className('loading') : null,
          )}
          style={{ width: this.props.width }}
        >
          {this.state.status === Status.Loading && (
            <div className={className('loading-bar')} />
          )}

          <HeaderContainer config={this.props.config} />

          <div
            className={className('wrapper')}
            style={{ width: this.props.width }}
          >
            <Table
              pipeline={this.props.pipeline}
              data={this.state.data}
              header={this.state.header}
              width={this.props.width}
              status={this.state.status}
            />
          </div>

          <FooterContainer config={this.props.config} />
        </div>

        <div id="gridjs-temp" className={className('temp')} />
      </Fragment>
    );
  }
}
