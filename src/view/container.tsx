import { createRef, h } from 'preact';
import { classJoin, className } from '../util/className';
import { Status } from '../types';
import { Table } from './table/table';
import { HeaderContainer } from './headerContainer';
import { FooterContainer } from './footerContainer';
import log from '../util/log';
import { useEffect } from 'preact/hooks';
import * as actions from './actions';
import { useStore } from '../hooks/useStore';
import useSelector from '../../src/hooks/useSelector';
import { useConfig } from '../../src/hooks/useConfig';
import { SearchConfig } from '../../src/view/plugin/search/search';

export function Container() {
  const config = useConfig();
  const { dispatch } = useStore();
  const status = useSelector((state) => state.status);
  const data = useSelector((state) => state.data);
  const tableRef = useSelector((state) => state.tableRef);
  const tempRef = createRef();

  useEffect(() => {
    // set the initial header object
    // we update the header width later when "data"
    // is available in the state
    dispatch(actions.SetHeader(config.header));

    if ((config.search as SearchConfig)?.keyword) {
      //skipping initial pipeline as search keyword is present and search plugin will handle the initial data laod
    } else {
      processPipeline();
    }
    config.pipeline.on('updated', processPipeline);

    return () => config.pipeline.off('updated', processPipeline);
  }, []);

  useEffect(() => {
    if (config.header && status === Status.Loaded && data?.length) {
      // now that we have the data, let's adjust columns width
      // NOTE: that we only calculate the columns width once
      dispatch(
        actions.SetHeader(config.header.adjustWidth(config, tableRef, tempRef)),
      );
    }
  }, [data, config, tempRef]);

  const processPipeline = async () => {
    dispatch(actions.SetLoadingData());

    try {
      const data = await config.pipeline.process();
      dispatch(actions.SetData(data));

      // TODO: do we need this setTimemout?
      setTimeout(() => {
        dispatch(actions.SetStatusToRendered());
      }, 0);
    } catch (e) {
      log.error(e);
      dispatch(actions.SetDataErrored());
    }
  };

  return (
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

      <div className={className('wrapper')} style={{ height: config.height }}>
        <Table />
      </div>

      <FooterContainer />

      <div ref={tempRef} id="gridjs-temp" className={className('temp')} />
    </div>
  );
}
