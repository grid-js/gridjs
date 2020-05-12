import { mount } from 'enzyme';
import { h } from 'preact';
import Config from '../../src/config';
import { Container } from '../../src/view/container';
import Pipeline from '../../src/pipeline/pipeline';
import StorageExtractor from '../../src/pipeline/extractor/storage';
import ArrayToTabularTransformer from '../../src/pipeline/transformer/arrayToTabular';
import StorageUtils from '../../src/storage/storageUtils';

describe('Container component', () => {
  let config: Config;

  beforeAll(() => {
    config = new Config();
    config.data = [
      [1, 2, 3],
      ['a', 'b', 'c'],
    ];

    config.setCurrent();

    config.storage = StorageUtils.createFromConfig(config);
    config.pipeline = new Pipeline([
      new StorageExtractor({ storage: config.storage }),
      new ArrayToTabularTransformer(),
    ]);
  });

  it('should render a container with table', async () => {
    const container = mount(<Container pipeline={config.pipeline} />);

    await container.instance().componentDidMount();
    expect(container.html()).toMatchSnapshot();
  });
});
