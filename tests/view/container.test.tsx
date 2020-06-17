import { mount } from 'enzyme';
import { JSDOM } from 'jsdom';
import { h } from 'preact';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Config } from '../../src/config';
import { Container } from '../../src/view/container';
import Pipeline from '../../src/pipeline/pipeline';
import StorageExtractor from '../../src/pipeline/extractor/storage';
import ArrayToTabularTransformer from '../../src/pipeline/transformer/arrayToTabular';
import StorageUtils from '../../src/storage/storageUtils';
import Header from '../../src/header';
import Dispatcher from '../../src/util/dispatcher';
import { Translator } from '../../src/i18n/language';
import { PipelineProcessor, ProcessorType } from '../../src/pipeline/processor';
import * as width from '../../src/util/width';
import { flushPromises } from '../testUtil';

expect.extend(toHaveNoViolations);

describe('Container component', () => {
  let config: Config;

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

  afterAll(() => {
    config = null;
  });

  it('should render a container with table', async () => {
    const container = mount(
      <Container config={config} pipeline={config.pipeline} />,
    );

    await container.instance().componentDidMount();
    expect(container.html()).toMatchSnapshot();
  });

  it('should render a container with searchable table', async () => {
    config.search = {
      enabled: true,
    };

    const container = mount(
      <Container config={config} pipeline={config.pipeline} />,
    );
    await container.instance().componentDidMount();
    expect(container.html()).toMatchSnapshot();
  });

  it('should render a container with sortable and paginated table', async () => {
    config.search = {
      enabled: true,
    };

    config.pagination = {
      enabled: true,
      limit: 5,
    };

    config.header = new Header();
    config.header.columns = [
      {
        name: 'c1',
        sort: {
          enabled: false,
        },
      },
      {
        name: 'c2',
        sort: {
          enabled: true,
        },
      },
      {
        name: 'c3',
        sort: {
          enabled: true,
        },
      },
    ];

    const container = mount(
      <Container
        config={config}
        pipeline={config.pipeline}
        header={config.header}
      />,
    );
    await container.instance().componentDidMount();
    expect(container.html()).toMatchSnapshot();
  });

  it('should render a container with error', async () => {
    console.error = jest.fn();

    class ErrorProcessor extends PipelineProcessor<string, {}> {
      get type(): ProcessorType {
        return ProcessorType.Limit;
      }
      _process(): string {
        throw Error('something happened');
      }
    }

    config.pipeline.register(new ErrorProcessor());

    const container = mount(
      <Container config={config} pipeline={config.pipeline} />,
    );

    await container.instance().componentDidMount();
    expect(container.html()).toMatchSnapshot();
  });

  it('should not violate accessibility test', async () => {
    config.pagination = {
      enabled: true,
      limit: 1,
    };

    config.search = {
      enabled: true,
    };

    config.sort = {};

    const container = mount(
      <Container config={config} pipeline={config.pipeline} />,
    );

    await container.instance().componentDidMount();
    expect(await axe(container.html())).toHaveNoViolations();
  });

  it('should render a table with correct th widths', async () => {
    const wrapper = new JSDOM('<div style="width: 500px"></div>');

    const mock = jest.spyOn(width, 'getWidth');
    mock.mockReturnValue(42);

    config.container = wrapper;
    config.header = new Header();
    config.header.columns = [
      {
        name: 'hello world',
        sort: {
          enabled: false,
        },
      },
      {
        name: 'you are super cool',
        sort: {
          enabled: true,
        },
      },
      {
        name: 'actions',
        width: '200px',
        sort: {
          enabled: true,
        },
      },
    ];

    const container = mount(
      <Container config={config} pipeline={config.pipeline} />,
    );

    return flushPromises().then(async () => {
      await container.instance().componentDidMount();
      expect(container.html()).toMatchSnapshot();
    });
  });
});
