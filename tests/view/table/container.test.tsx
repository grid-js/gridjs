import { mount } from 'enzyme';
import { h } from 'preact';
import { Config } from '../../../src/config';
import { Container } from '../../../src/view/container';
import Pipeline from '../../../src/pipeline/pipeline';
import StorageExtractor from '../../../src/pipeline/extractor/storage';
import ArrayToTabularTransformer from '../../../src/pipeline/transformer/arrayToTabular';
import StorageUtils from '../../../src/storage/storageUtils';
import Header from '../../../src/header';
import Dispatcher from '../../../src/util/dispatcher';
import { Translator } from '../../../src/i18n/language';
import {
  PipelineProcessor,
  ProcessorType,
} from '../../../src/pipeline/processor';

describe('Container component', () => {
  let config: Config;

  beforeAll(() => {
    config = new Config();
    config.data = [
      [1, 2, 3],
      ['a', 'b', 'c'],
    ];

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
});
