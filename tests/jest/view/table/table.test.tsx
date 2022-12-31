import { h } from 'preact';
import { mount } from 'enzyme';
import { Table } from '../../../../src/view/table/table';
import Header from '../../../../src/header';
import { Config, ConfigContext } from '../../../../src/config';
import StorageUtils from '../../../../src/storage/storageUtils';
import Pipeline from '../../../../src/pipeline/pipeline';
//import StorageExtractor from '../../../../src/pipeline/extractor/storage';
//import ArrayToTabularTransformer from '../../../../src/pipeline/transformer/arrayToTabular';
import { Status, TCell, TColumn } from '../../../../src/types';
import { Translator } from '../../../../src/i18n/language';
//import Tabular from '../../../../src/tabular';
import { html } from '../../../../src/util/html';
import Row from '../../../../src/row';
import { Store } from '../../../../src/state/store';
import Tabular from '../../../../src/tabular';
//import * as TableActions from '../../../../src/view/actions';

describe('Table component', () => {
  let config: Config;

  beforeEach(() => {
    config = new Config();
    config.data = [
      [1, 2, 3],
      ['a', 'b', 'c'],
    ];

    config.store = new Store({
      data: Tabular.fromArray(config.data),
    });
    config.autoWidth = true;
    config.storage = StorageUtils.createFromConfig(config);
    config.translator = new Translator();
    config.pipeline = new Pipeline([]);
  });

  it('should render a table', async () => {
    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with loading', async () => {
    config.className = {
      loading: 'my-loading-class',
    };

    config.store = new Store({
      data: null,
      status: Status.Loading,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.find('.my-loading-class').hostNodes().name()).toBe('td');
    expect(table.find('.my-loading-class').hostNodes().text()).toBe(
      'Loading...',
    );
    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with header', async () => {
    config.store = new Store({
      data: Tabular.fromArray([
        [1, 2, 3],
        ['a', 'b', 'c'],
      ]),
      header: Header.createFromConfig({ columns: ['h1', 'h2', 'h3'] }),
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with width', async () => {
    config.width = '300px';
    config.store = new Store({
      data: Tabular.fromArray([
        [1, 2, 3],
        ['a', 'b', 'c'],
      ]),
      header: Header.createFromConfig({ columns: ['h1', 'h2', 'h3'] }),
      status: Status.Rendered,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with column width', async () => {
    const header = Header.createFromConfig({ columns: ['h1', 'h2', 'h3'] });
    header.columns[0].width = '10%';
    header.columns[2].width = '300px';

    config.store = new Store({
      data: Tabular.fromArray([
        [1, 2, 3],
        ['a', 'b', 'c'],
      ]),
      status: Status.Rendered,
      header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with column sort', async () => {
    const header = Header.createFromConfig({ columns: ['h1', 'h2', 'h3'] });
    header.columns[0].sort = {};
    header.columns[2].sort = {};

    config.store = new Store({
      data: Tabular.fromArray([
        [1, 2, 3],
        ['a', 'b', 'c'],
      ]),
      status: Status.Rendered,
      header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table without autoFix', async () => {
    const header = Header.createFromConfig({
      columns: ['h1', 'h2', 'h3'],
      autoWidth: false,
    });

    config.store = new Store({
      data: Tabular.fromArray([
        [1, 2, 3],
        ['a', 'b', 'c'],
      ]),
      status: Status.Rendered,
      header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table without data', async () => {
    const header = Header.createFromConfig({
      columns: ['h1', 'h2', 'h3'],
    });

    config.className = {
      notfound: 'my-notfound-class',
    };

    config.store = new Store({
      data: Tabular.fromArray([]),
      status: Status.Rendered,
      header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with null', async () => {
    const header = Header.createFromConfig({
      columns: ['h1', 'h2', 'h3'],
    });

    config.store = new Store({
      data: null,
      status: Status.Rendered,
      header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should attach styles', async () => {
    const header = Header.createFromConfig({
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

    config.store = new Store({
      data: null,
      status: Status.Rendered,
      header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render header with complex content', async () => {
    const header = Header.createFromConfig({
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

    config.store = new Store({
      data: null,
      status: Status.Rendered,
      header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render header with TColumn object', async () => {
    const header = Header.createFromConfig({
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

    config.store = new Store({
      data: null,
      status: Status.Rendered,
      header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should attach the fixedHeader classname', async () => {
    const header = Header.createFromConfig({
      columns: ['c', 'd', 'e'],
    });

    config.store = new Store({
      data: Tabular.fromArray([
        [1, 2, 3],
        ['a', 'b', 'c'],
      ]),
      status: Status.Rendered,
      header,
    });

    config.fixedHeader = true;

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    return new Promise<void>((resolve) => {
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

    const header = Header.createFromConfig({
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
    });

    config.store = new Store({
      data: Tabular.fromArray([
        [1, 2, 3, 4, 5, 6],
        ['a', 'b', 'c', 'd', 'e', 'f'],
      ]),
      status: Status.Rendered,
      header,
    });

    config.fixedHeader = true;

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    return new Promise<void>((resolve) => {
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

    const config = Config.fromPartialConfig({
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
    });

    config.store = new Store({
      data: Tabular.fromArray([
        [1, 2, 3, 4, 5, 6],
        ['a', 'b', 'c', 'd', 'e', 'f'],
      ]),
      status: Status.Rendered,
      header: config.header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(
          table
            .find('td')
            .map((x) => x.text())
            .every((x) => x),
        ).toBe(true);

        expect(
          table
            .find('td')
            .map((x) => x.text())
            .every((x) => flattenData.indexOf(x.toString()) > -1),
        ).toBe(true);

        expect(table.html()).toMatchSnapshot();

        resolve();
      }, 0);
    });
  });

  it('should render custom attributes for cells', async () => {
    const config = Config.fromPartialConfig({
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
    });

    config.store = new Store({
      data: Tabular.fromArray([
        [1, 2, 3],
        ['a', 'b', 'c'],
      ]),
      status: Status.Rendered,
      header: config.header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should only render custom attributes for the cell header', async () => {
    const config = Config.fromPartialConfig({
      data: [
        [1, 2, 3],
        ['a', 'b', 'c'],
      ],
      columns: [
        {
          name: 'c',
          attributes: (cell, row, col) => {
            // both cell and row are empty when attributes function is called for a th
            if (!cell && !row) {
              return {
                'data-col-c': col.id,
              };
            }

            return {};
          },
        },
        {
          name: 'd',
        },
        {
          name: 'e',
        },
      ],
    });

    config.store = new Store({
      data: Tabular.fromArray([
        [1, 2, 3],
        ['a', 'b', 'c'],
      ]),
      status: Status.Rendered,
      header: config.header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should hide the columns with hidden: true', async () => {
    const config = Config.fromPartialConfig({
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
    });

    config.store = new Store({
      data: Tabular.fromArray([
        [1, 2, 3],
        ['a', 'b', 'c'],
      ]),
      status: Status.Rendered,
      header: config.header,
    });

    const table = mount(
      <ConfigContext.Provider value={config}>
        <Table />
      </ConfigContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
    expect(table.find('td').length).toBe(2);
    expect(table.find('th').text()).toBe('e');
    expect(table.find('th').length).toBe(1);
  });
});
