import { mount } from 'enzyme';
import { h } from 'preact';
import { Table } from '../../src/view/table/table';
import Header from '../../src/header';
import { Config } from '../../src/config';
import StorageUtils from '../../src/storage/storageUtils';
import Pipeline from '../../src/pipeline/pipeline';
import StorageExtractor from '../../src/pipeline/extractor/storage';
import ArrayToTabularTransformer from '../../src/pipeline/transformer/arrayToTabular';
import { Status } from '../../src/types';

describe('Table component', () => {
  let config: Config;

  beforeAll(() => {
    config = new Config();
    config.data = [
      [1, 2, 3],
      ['a', 'b', 'c'],
    ];

    config.storage = StorageUtils.createFromUserConfig(config);
    config.pipeline = new Pipeline([
      new StorageExtractor({ storage: config.storage }),
      new ArrayToTabularTransformer(),
    ]);
  });

  it('should render a table', async () => {
    const table = mount(
      <Table
        pipeline={config.pipeline}
        data={await config.pipeline.process()}
        status={Status.Loaded}
      />,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with loading', async () => {
    const table = mount(
      <Table
        pipeline={config.pipeline}
        data={await config.pipeline.process()}
        status={Status.Loading}
      />,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with header', async () => {
    const table = mount(
      <Table
        pipeline={config.pipeline}
        data={await config.pipeline.process()}
        header={Header.fromUserConfig({ columns: ['h1', 'h2', 'h3'] })}
        status={Status.Loaded}
      />,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with width', async () => {
    const table = mount(
      <Table
        pipeline={config.pipeline}
        data={await config.pipeline.process()}
        width="300px"
        header={Header.fromUserConfig({ columns: ['h1', 'h2', 'h3'] })}
        status={Status.Loaded}
      />,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with column width', async () => {
    const header = Header.fromUserConfig({ columns: ['h1', 'h2', 'h3'] });
    header.columns[0].width = '10%';
    header.columns[2].width = '300px';

    const table = mount(
      <Table
        pipeline={config.pipeline}
        data={await config.pipeline.process()}
        header={header}
        status={Status.Loaded}
      />,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with column sort', async () => {
    const header = Header.fromUserConfig({ columns: ['h1', 'h2', 'h3'] });
    header.columns[0].sort = {
      enabled: true,
    };
    header.columns[2].sort = {
      enabled: true,
    };

    const table = mount(
      <Table
        pipeline={config.pipeline}
        data={await config.pipeline.process()}
        header={header}
        status={Status.Loaded}
      />,
    );

    expect(table.html()).toMatchSnapshot();
  });
});
