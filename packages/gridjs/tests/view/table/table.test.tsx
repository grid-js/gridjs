import { mount } from 'enzyme';
import { createContext, h } from 'preact';
import { Table } from '../../../src/view/table/table';
import Header from '../../../src/header';
import { Config } from '../../../src/config';
import StorageUtils from '../../../src/storage/storageUtils';
import Pipeline from '../../../src/pipeline/pipeline';
import StorageExtractor from '../../../src/pipeline/extractor/storage';
import ArrayToTabularTransformer from '../../../src/pipeline/transformer/arrayToTabular';
import { Status, TCell, TColumn } from '../../../src/types';
import Dispatcher from '../../../src/util/dispatcher';
import { Translator } from '../../../src/i18n/language';
import Tabular from '../../../src/tabular';
import { html } from '../../../src/util/html';
import Row from '../../../src/row';

describe('Table component', () => {
  let config: Config;
  const configContext = createContext(null);

  beforeEach(() => {
    config = new Config();
    config.data = [
      [1, 2, 3],
      ['a', 'b', 'c'],
    ];

    config.autoWidth = true;
    config.storage = StorageUtils.createFromUserConfig(config);
    config.dispatcher = new Dispatcher();
    config.translator = new Translator();
    config.pipeline = new Pipeline([
      new StorageExtractor({ storage: config.storage }),
      new ArrayToTabularTransformer(),
    ]);
  });

  it('should render a table', async () => {
    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with loading', async () => {
    config.className = {
      loading: 'my-loading-class',
    };

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={new Tabular()}
          status={Status.Loading}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.find('.my-loading-class').hostNodes().name()).toBe('td');
    expect(table.find('.my-loading-class').hostNodes().text()).toBe(
      'Loading...',
    );
    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with header', async () => {
    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={Header.fromUserConfig({ columns: ['h1', 'h2', 'h3'] })}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with width', async () => {
    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          width="300px"
          height={config.height}
          header={Header.fromUserConfig({ columns: ['h1', 'h2', 'h3'] })}
          status={Status.Rendered}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with column width', async () => {
    const header = Header.fromUserConfig({ columns: ['h1', 'h2', 'h3'] });
    header.columns[0].width = '10%';
    header.columns[2].width = '300px';

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
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
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table without autoFix', async () => {
    const header = Header.fromUserConfig({
      columns: ['h1', 'h2', 'h3'],
      autoWidth: false,
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table without data', async () => {
    const header = Header.fromUserConfig({
      columns: ['h1', 'h2', 'h3'],
    });

    config.className = {
      notfound: 'my-notfound-class',
    };

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={Tabular.fromArray<TCell>([])}
          header={header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with null', async () => {
    const header = Header.fromUserConfig({
      columns: ['h1', 'h2', 'h3'],
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={null}
          header={header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should attach styles', async () => {
    const header = Header.fromUserConfig({
      columns: ['h1', 'h2', 'h3'],
    });

    config.style = {
      th: {
        border: '1px solid black',
      },
      table: {
        padding: '2px',
        margin: '1px',
      },
    };

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={null}
          header={header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render header with complex content', async () => {
    const header = Header.fromUserConfig({
      columns: [
        {
          id: 'h1',
          name: html('<h1>h1</h1>'),
        },
        'h2',
        {
          id: 'h3',
          name: html('<b>h3</b>'),
        },
      ],
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={null}
          header={header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render header with TColumn object', async () => {
    const header = Header.fromUserConfig({
      columns: [
        {
          name: html('<h1>h1</h1>'),
          id: 'boo',
        },
        'h2',
        {
          name: 'h3',
        },
      ],
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={null}
          header={header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should attach the fixedHeader classname', async () => {
    const config = Config.fromUserConfig({
      data: [
        [1, 2, 3],
        ['a', 'b', 'c'],
      ],
      columns: ['c', 'd', 'e'],
      fixedHeader: true,
      dispatcher: new Dispatcher<any>(),
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={config.header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(table.html()).toMatchSnapshot();
        resolve();
      }, 0);
    });
  });

  it('should only attached fixedHeader to some columns', async () => {
    const config = Config.fromUserConfig({
      data: [
        [1, 2, 3],
        ['a', 'b', 'c'],
      ],
      columns: [
        'c',
        'd',
        {
          name: 'e',
          fixedHeader: false,
        },
      ],
      fixedHeader: true,
      dispatcher: new Dispatcher<any>(),
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={config.header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(table.html()).toMatchSnapshot();
        resolve();
      }, 0);
    });
  });

  it('should set the correct top attribute for nested headers', async () => {
    // to mock the offsetTop
    Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
      configurable: true,
      value: 50,
    });

    const config = Config.fromUserConfig({
      data: [
        [1, 2, 3, 4, 5, 6],
        ['a', 'b', 'c', 'd', 'e', 'f'],
      ],
      columns: [
        {
          name: 'c',
          columns: ['c1', 'c2'],
        },
        'd',
        {
          name: 'e',
          columns: [
            {
              name: 'e1',
              columns: ['e11', 'e12'],
            },
            {
              name: 'e2',
              columns: ['e21'],
            },
          ],
        },
      ],
      fixedHeader: true,
      dispatcher: new Dispatcher<any>(),
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={config.header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(table.html()).toMatchSnapshot();
        resolve();
      }, 0);
    });
  });

  it('should set the correct sort attribute for nested headers', async () => {
    const data = [
      [1, 2, 3, 4, 5, 6],
      ['a', 'b', 'c', 'd', 'e', 'f'],
    ];

    const flattenData = data
      .reduce((prev, x) => [...prev, ...x], [])
      .map((x) => x.toString());

    const config = Config.fromUserConfig({
      data: data,
      columns: [
        {
          name: 'c',
          columns: ['c1', 'c2'],
        },
        'd',
        {
          name: 'e',
          columns: [
            {
              name: 'e1',
              columns: ['e11', 'e12'],
            },
            {
              name: 'e2',
              columns: ['e21'],
            },
          ],
        },
      ],
      sort: true,
      dispatcher: new Dispatcher<any>(),
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={config.header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(
          table
            .find('td')
            .map((x) => x.text())
            .every((x) => x),
        ).toBeTrue();

        expect(
          table
            .find('td')
            .map((x) => x.text())
            .every((x) => flattenData.indexOf(x.toString()) > -1),
        ).toBeTrue();

        expect(table.html()).toMatchSnapshot();

        resolve();
      }, 0);
    });
  });

  it('should render custom attributes for cells', async () => {
    const config = Config.fromUserConfig({
      data: [
        [1, 2, 3],
        ['a', 'b', 'c'],
      ],
      columns: [
        {
          name: 'c',
          attributes: (_: TCell, __: Row, column: TColumn) =>
            column.name === 'c' ? { height: '30px' } : {},
        },
        {
          name: 'd',
          attributes: (cell: TCell) =>
            cell === 'b'
              ? {
                'data-row-c': true,
              }
              : {},
        },
        {
          name: 'e',
          attributes: {
            rowSpan: 3,
            'data-boo': 'xx',
          },
        },
      ],
      dispatcher: new Dispatcher<any>(),
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={config.header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should hide the columns with hidden: true', async () => {
    const config = Config.fromUserConfig({
      data: [
        [1, 2, 3],
        ['a', 'b', 'c'],
      ],
      columns: [
        {
          name: 'c',
          hidden: true,
        },
        {
          name: 'd',
          hidden: true,
          sort: true,
        },
        {
          name: 'e',
        },
      ],
      search: true,
      dispatcher: new Dispatcher<any>(),
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={config.header}
          status={Status.Rendered}
          width={config.width}
          height={config.height}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
    expect(table.find('td').length).toBe(2);
    expect(table.find('th').text()).toBe('e');
    expect(table.find('th').length).toBe(1);
  });

});
