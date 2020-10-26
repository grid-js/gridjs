import { h, createContext, Context } from 'preact';

import Tabular from '../tabular';
import { BaseComponent, BaseProps } from './base';
import { classJoin, className } from '../util/className';
import { Status } from '../types';
import { Table } from './table/table';
import { HeaderContainer } from './headerContainer';
import { FooterContainer } from './footerContainer';
import Pipeline from '../pipeline/pipeline';
import Header from '../header';
import { Config } from '../config';
import log from '../util/log';
import { PipelineProcessor } from '../pipeline/processor';

interface ContainerProps extends BaseProps {
  config: Config;
  pipeline: Pipeline<Tabular>;
  header?: Header;
  width: string;
  height: string;
}

interface ContainerState {
  status: Status;
  header?: Header;
  data?: Tabular;
}

export class Container extends BaseComponent<ContainerProps, ContainerState> {
  private readonly configContext: Context<Config>;
  private processPipelineFn: (processor: PipelineProcessor<any, any>) => void;

  constructor(props, context) {
    super(props, context);

    // global Config context which is passed to all components
    this.configContext = createContext(null);

    this.state = {
      status: Status.Loading,
      header: props.header,
      data: null,
    };
  }

  private async processPipeline() {
    this.props.config.eventEmitter.emit('beforeLoad');

    this.setState({
      status: Status.Loading,
    });

    try {
      const data = await this.props.pipeline.process();
      this.setState({
        data: data,
        status: Status.Loaded,
      });

      this.props.config.eventEmitter.emit('load', data);
    } catch (e) {
      log.error(e);

      this.setState({
        status: Status.Error,
        data: null,
      });
    }
  }

  async componentDidMount() {
    const config = this.props.config;

    // for the initial load
    await this.processPipeline();

    if (config.header && this.state.data && this.state.data.length) {
      // now that we have the data, let's adjust columns width
      // NOTE: that we only calculate the columns width once
      this.setState({
        header: config.header.adjustWidth(
          config.container,
          config.tableRef,
          config.tempRef,
          config.autoWidth,
        ),
      });
    }

    this.processPipelineFn = this.processPipeline.bind(this);
    this.props.pipeline.on('updated', this.processPipelineFn);
  }

  componentWillUnmount(): void {
    this.props.pipeline.off('updated', this.processPipelineFn);
  }

  componentDidUpdate(
    _: Readonly<ContainerProps>,
    previousState: Readonly<ContainerState>,
  ): void {
    // we can't jump to the Status.Rendered if previous status is not Status.Loaded
    if (
      previousState.status != Status.Rendered &&
      this.state.status == Status.Loaded
    ) {
      this.setState({
        status: Status.Rendered,
      });

      this.props.config.eventEmitter.emit('ready');
    }
  }

  render() {
    const configContext = this.configContext;

    return (
      <configContext.Provider value={this.props.config}>
        <div
          role="complementary"
          className={classJoin(
            'gridjs',
            className('container'),
            this.state.status === Status.Loading ? className('loading') : null,
            this.props.config.className.container,
          )}
          style={{
            ...this.props.config.style.container,
            ...{
              width: this.props.width,
            },
          }}
        >
          {this.state.status === Status.Loading && (
            <div className={className('loading-bar')} />
          )}

          <HeaderContainer />

          <div
            className={className('wrapper')}
            style={{ width: this.props.width, height: this.props.height }}
          >
            <Table
              ref={this.props.config.tableRef}
              data={this.state.data}
              header={this.state.header}
              width={this.props.width}
              height={this.props.height}
              status={this.state.status}
            />
          </div>

          <FooterContainer />
        </div>

        <div
          ref={this.props.config.tempRef}
          id="gridjs-temp"
          className={className('temp')}
        />
      </configContext.Provider>
    );
  }
}
