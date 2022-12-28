import { h } from 'preact';
import Tabular from '../tabular';
import { classJoin, className } from '../util/className';
import { Status } from '../types';
import { Table } from './table/table';
import { HeaderContainer } from './headerContainer';
import { FooterContainer } from './footerContainer';
import Pipeline from '../pipeline/pipeline';
import Header from '../header';
import { Config, ConfigContext } from '../config';
import log from '../util/log';
import { PipelineProcessor } from '../pipeline/processor';
import { useEffect, useState } from 'preact/hooks';
import * as actions from './actions';
import { useStore } from '../hooks/useStore';

export function Container(props: {
  config: Config;
  pipeline: Pipeline<Tabular>;
  header?: Header;
  width: string;
  height: string;
}) {
  const config = props.config;
  const {dispatch} = useStore();
  const [status, setStatus] = useState(Status.Loading);
  const [header, setHeader] = useState(props.header);
  const [data, setData] = useState(null);
  let processPipelineFn: (processor: PipelineProcessor<any, any>) => void;

  useEffect(() => {
    (async function () {
      // for the initial load
      await processPipeline();

      if (config.header && data && data.length) {
        // now that we have the data, let's adjust columns width
        // NOTE: that we only calculate the columns width once
        setHeader(config.header.adjustWidth(config));
      }

      processPipelineFn = processPipeline.bind(this);
      props.pipeline.on('updated', processPipelineFn);
    })();

    return () => {
      props.pipeline.off('updated', processPipelineFn);
    };
  }, []);

  useEffect(() => {
    dispatch(actions.SetStatusToRendered());
  }, [status]);

  const processPipeline = async () => {
    props.config.eventEmitter.emit('beforeLoad');

    dispatch(actions.SetStatus(Status.Loading));

    try {
      const data = await props.pipeline.process();
      dispatch(actions.SetData(data));

      props.config.eventEmitter.emit('load', data);
    } catch (e) {
      log.error(e);

      dispatch(actions.SetNoData());
    }
  };

  return (
    <ConfigContext.Provider value={props.config}>
      <div
        role="complementary"
        className={classJoin(
          'gridjs',
          className('container'),
          status === Status.Loading ? className('loading') : null,
          props.config.className.container,
        )}
        style={{
          ...props.config.style.container,
          ...{
            width: props.width,
          },
        }}
      >
        {status === Status.Loading && (
          <div className={className('loading-bar')} />
        )}

        <HeaderContainer />

        <div className={className('wrapper')} style={{ height: props.height }}>
          <Table
            ref={props.config.tableRef}
            data={data}
            header={header}
            width={props.width}
            height={props.height}
            status={status}
          />
        </div>

        <FooterContainer />

        <div
          ref={props.config.tempRef}
          id="gridjs-temp"
          className={className('temp')}
        />
      </div>
    </ConfigContext.Provider>
  );
}
