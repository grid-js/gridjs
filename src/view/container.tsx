import { h, createContext, Context } from 'preact';

import Tabular from '../tabular';
import { BaseComponent, BaseProps } from './base';
import { classJoin, className } from '../util/className';
import { Status } from '../types';
import { Table } from './table/table';
import { HeaderContainer } from './headerContainer';
import { FooterContainer } from './footerContainer';
import Header from '../header';
import { Config } from '../config';
import log from '../util/log';
import { PipelineProcessor } from '../pipeline/processor';

interface Props extends BaseProps {
  config: Config;
}

interface State {
  config: Config;
  status: Status;
  header?: Header;
  data?: Tabular;
}

export class Container extends BaseComponent<Props, State> {
  private readonly configContext: Context<Config>;
  private processPipelineFn: (processor: PipelineProcessor<any, any>) => void;

  constructor(props, context) {
    super(props, context);

    // global Config context which is passed to all components
    this.configContext = createContext(null);

    this.state = {
      config: props.config,
      status: Status.Loading,
      data: null,
    };
  }

  private async process() {
    this.state.config.eventEmitter.emit('beforeLoad');

    this.setState({
      status: Status.Loading,
    });

    try {
      const data = await this.state.config.pipeline.process();

      this.setState({
        data: data,
        status: Status.Loaded,
      });

      this.state.config.eventEmitter.emit('load', data);
    } catch (e) {
      log.error(e);

      this.setState({
        status: Status.Error,
        data: null,
      });
    }
  }

  private async processAndListen() {
    const config = this.state.config;

    this.processPipelineFn = this.process.bind(this);
    config.pipeline.on('updated', this.processPipelineFn);

    await this.process();

    if (config.header && this.state.data && this.state.data.length) {
      // now that we have the data, let's adjust columns width
      // NOTE: that we only calculate the columns width once
      this.setState({
        header: config.header.adjustWidth(config),
      });
    }
  }

  async componentDidMount() {
    const config = this.state.config;

    config.eventEmitter.on('forceRender', async (cfg) => {
      await this.processAndListen();

      this.setState({
        config: cfg,
      });
    });

    await this.processAndListen();
  }

  componentWillUnmount(): void {
    this.state.config.pipeline.off('updated', this.processPipelineFn);
  }

  componentDidUpdate(_: Readonly<Props>, previousState: Readonly<State>): void {
    // we can't jump to the Status.Rendered if previous status is not Status.Loaded
    if (
      previousState.status != Status.Rendered &&
      this.state.status == Status.Loaded
    ) {
      this.setState({
        status: Status.Rendered,
      });

      this.state.config.eventEmitter.emit('ready');
    }
  }

  render() {
    const configContext = this.configContext;
    const config = this.state.config;
    const status = this.state.status;

    return (
      <configContext.Provider value={config}>
        <div
          role="complementary"
          className={classJoin(
            'gridjs',
            className('container'),
            status === Status.Loading ? className('loading') : null,
            config.className.container,
          )}
          style={{
            ...config.style.container,
            ...{
              width: config.width,
            },
          }}
        >
          {status === Status.Loading && (
            <div className={className('loading-bar')} />
          )}

          <HeaderContainer />

          <div
            className={className('wrapper')}
            style={{ height: config.height }}
          >
            <Table
              ref={config.tableRef}
              data={this.state.data}
              header={config.header}
              width={config.width}
              height={config.height}
              status={this.state.status}
            />
          </div>

          <FooterContainer />

          <div
            ref={config.tempRef}
            id="gridjs-temp"
            className={className('temp')}
          />
        </div>
      </configContext.Provider>
    );
  }
}
